import { syncQueueRepo } from '../repositories';
import { updateSyncState } from './status';
import type { SyncQueueItem, SyncEntityType, SyncResult } from '../types';

/**
 * A sync handler is registered per entity type by the feature that owns it.
 * It receives a SyncQueueItem and must call the appropriate backend API.
 * Return { serverId } if the server assigned an ID to the created entity.
 */
export type SyncHandler = (
  item: SyncQueueItem,
) => Promise<{ serverId?: string }>;

const _handlers = new Map<SyncEntityType, SyncHandler>();

/**
 * Register a handler for an entity type.
 * Call this at feature initialisation time — before the first sync runs.
 *
 * Example (in features/client/pos/offline/pos-sync.ts):
 *   registerSyncHandler('sale', async (item) => {
 *     const res = await post('/sales', item.payload);
 *     return { serverId: res.data.id };
 *   });
 */
export function registerSyncHandler(
  entityType: SyncEntityType,
  handler: SyncHandler,
): void {
  _handlers.set(entityType, handler);
}

let _running = false;

/**
 * Process all pending outbox items in order.
 * Safe to call multiple times — a concurrent run is a no-op.
 * Called automatically on reconnect; can also be called manually.
 */
export async function runSync(): Promise<SyncResult> {
  if (_running) return { processed: 0, succeeded: 0, failed: 0, errors: [] };
  _running = true;

  const result: SyncResult = { processed: 0, succeeded: 0, failed: 0, errors: [] };

  try {
    updateSyncState({ status: 'syncing' });

    const pending = await syncQueueRepo.getPending();
    result.processed = pending.length;

    for (const item of pending) {
      const handler = _handlers.get(item.entityType);

      if (!handler) {
        // No handler registered yet — skip but do NOT mark as failed.
        // The item will be retried when the handler is registered.
        continue;
      }

      try {
        await syncQueueRepo.markSyncing(item.id);
        const { serverId } = await handler(item);
        await syncQueueRepo.markSynced(item.id, serverId);
        result.succeeded++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await syncQueueRepo.markFailed(item.id, message);
        result.failed++;
        result.errors.push({ id: item.id, error: message });
      }
    }

    const pendingCount = await syncQueueRepo.pendingCount();
    updateSyncState({
      status: result.failed > 0 ? 'error' : 'success',
      lastSyncAt: new Date().toISOString(),
      pendingCount,
      lastError: result.errors[0]?.error ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    updateSyncState({ status: 'error', lastError: message });
  } finally {
    _running = false;
  }

  return result;
}
