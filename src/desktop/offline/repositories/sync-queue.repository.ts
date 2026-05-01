import { BaseRepository } from './base';
import type { SyncQueueItem, SyncOperationType, SyncEntityType, SyncStatus } from '../types';

// SQLite row shape (snake_case columns)
interface SyncQueueRow {
  id: string;
  entity_type: string;
  operation_type: string;
  local_id: string;
  server_id: string | null;
  payload: string; // JSON
  status: string;
  retry_count: number;
  max_retries: number;
  created_at: string;
  processed_at: string | null;
  error_message: string | null;
}

function rowToItem(row: SyncQueueRow): SyncQueueItem {
  return {
    id: row.id,
    entityType: row.entity_type as SyncEntityType,
    operationType: row.operation_type as SyncOperationType,
    localId: row.local_id,
    serverId: row.server_id,
    payload: JSON.parse(row.payload) as Record<string, unknown>,
    status: row.status as SyncStatus,
    retryCount: row.retry_count,
    maxRetries: row.max_retries,
    createdAt: row.created_at,
    processedAt: row.processed_at,
    errorMessage: row.error_message,
  };
}

export class SyncQueueRepository extends BaseRepository {
  /** Add a new operation to the outbox. */
  async enqueue(params: {
    entityType: SyncEntityType;
    operationType: SyncOperationType;
    localId: string;
    payload: Record<string, unknown>;
    maxRetries?: number;
  }): Promise<SyncQueueItem> {
    const db = await this.db();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const maxRetries = params.maxRetries ?? 3;

    await db.execute(
      `INSERT INTO sync_queue
        (id, entity_type, operation_type, local_id, payload, status,
         retry_count, max_retries, created_at)
       VALUES (?, ?, ?, ?, ?, 'pending', 0, ?, ?)`,
      [id, params.entityType, params.operationType, params.localId,
       JSON.stringify(params.payload), maxRetries, now],
    );

    return {
      id,
      entityType: params.entityType,
      operationType: params.operationType,
      localId: params.localId,
      serverId: null,
      payload: params.payload,
      status: 'pending',
      retryCount: 0,
      maxRetries,
      createdAt: now,
      processedAt: null,
      errorMessage: null,
    };
  }

  /** All items waiting to be sent, oldest first. */
  async getPending(): Promise<SyncQueueItem[]> {
    const db = await this.db();
    const rows = await db.select<SyncQueueRow[]>(
      `SELECT * FROM sync_queue
        WHERE status IN ('pending', 'failed_retry')
        ORDER BY created_at ASC`,
    );
    return rows.map(rowToItem);
  }

  /** Total count of items not yet successfully synced. */
  async pendingCount(): Promise<number> {
    const db = await this.db();
    const rows = await db.select<Array<{ count: number }>>(
      `SELECT COUNT(*) AS count FROM sync_queue
        WHERE status IN ('pending', 'failed_retry', 'syncing')`,
    );
    return rows[0]?.count ?? 0;
  }

  async markSyncing(id: string): Promise<void> {
    const db = await this.db();
    await db.execute(
      `UPDATE sync_queue SET status = 'syncing' WHERE id = ?`,
      [id],
    );
  }

  async markSynced(id: string, serverId?: string): Promise<void> {
    const db = await this.db();
    await db.execute(
      `UPDATE sync_queue
          SET status = 'synced', server_id = ?, processed_at = ?, error_message = NULL
        WHERE id = ?`,
      [serverId ?? null, new Date().toISOString(), id],
    );
  }

  async markFailed(id: string, errorMessage: string): Promise<void> {
    const db = await this.db();
    // Increment retry count and decide whether this becomes permanent failure
    const rows = await db.select<Array<{ retry_count: number; max_retries: number }>>(
      `SELECT retry_count, max_retries FROM sync_queue WHERE id = ?`,
      [id],
    );
    if (rows.length === 0) return;

    const { retry_count, max_retries } = rows[0];
    const nextRetry = retry_count + 1;
    const nextStatus = nextRetry >= max_retries ? 'failed_permanent' : 'failed_retry';

    await db.execute(
      `UPDATE sync_queue
          SET status = ?, retry_count = ?, error_message = ?, processed_at = ?
        WHERE id = ?`,
      [nextStatus, nextRetry, errorMessage, new Date().toISOString(), id],
    );
  }

  /** Remove synced items older than the given date — optional housekeeping. */
  async archiveSynced(olderThanIso: string): Promise<number> {
    const db = await this.db();
    const result = await db.execute(
      `DELETE FROM sync_queue
        WHERE status = 'synced' AND processed_at < ?`,
      [olderThanIso],
    );
    return result.rowsAffected;
  }

  async findById(id: string): Promise<SyncQueueItem | null> {
    const db = await this.db();
    const rows = await db.select<SyncQueueRow[]>(
      `SELECT * FROM sync_queue WHERE id = ?`,
      [id],
    );
    return rows[0] ? rowToItem(rows[0]) : null;
  }
}
