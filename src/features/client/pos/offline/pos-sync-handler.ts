import { registerSyncHandler } from '@/desktop/offline/sync';
import { post } from '@/shared/api/request';
import { TENANT_API } from '@/shared/utils/constants';

/**
 * Register all POS-related sync handlers with the sync orchestrator.
 *
 * Call this once on desktop at POS feature initialisation (e.g. from the
 * POSPage useEffect, or a future feature bootstrap module).
 *
 * The handler receives a SyncQueueItem whose `payload` is the full sale
 * object recorded at offline finalization time.  It POSTs to the backend
 * POS endpoint and returns the server-assigned ID so the queue row can
 * be updated with `serverId`.
 *
 * The backend SHOULD be idempotent on `localId` to guard against duplicate
 * submissions if the handler runs more than once for the same item.
 */
export function registerPOSSyncHandlers(): void {
  registerSyncHandler('sale', async (item) => {
    // POST the full offline-captured payload to the server.
    // `localId` is included so the backend can deduplicate retried requests.
    const response = await post<{ id: string }>(TENANT_API.pos.finalize, {
      ...item.payload,
      localId: item.localId,
    });

    // Return the server ID so the orchestrator can stamp it on the queue row
    const serverId = (response as Record<string, unknown>)?.id as string | undefined;
    return { serverId };
  });
}
