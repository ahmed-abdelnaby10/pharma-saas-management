import type Database from '@tauri-apps/plugin-sql';

// ---------------------------------------------------------------------------
// DDL — one statement per table so errors are localised
// ---------------------------------------------------------------------------

const DDL = [
  // Schema version tracker — single row, bumped on each migration
  `CREATE TABLE IF NOT EXISTS schema_version (
    version    INTEGER NOT NULL,
    applied_at TEXT    NOT NULL
  )`,

  // Sync outbox — every offline write lands here first.
  // Rows are marked 'synced' after a successful API call, NOT deleted.
  // Only the active 'pending' / 'syncing' set shrinks after sync.
  `CREATE TABLE IF NOT EXISTS sync_queue (
    id              TEXT    PRIMARY KEY,
    entity_type     TEXT    NOT NULL,
    operation_type  TEXT    NOT NULL,
    local_id        TEXT    NOT NULL,
    server_id       TEXT,
    payload         TEXT    NOT NULL,
    status          TEXT    NOT NULL DEFAULT 'pending',
    retry_count     INTEGER NOT NULL DEFAULT 0,
    max_retries     INTEGER NOT NULL DEFAULT 3,
    created_at      TEXT    NOT NULL,
    processed_at    TEXT,
    error_message   TEXT
  )`,

  // Useful lookup index for the sync worker
  `CREATE INDEX IF NOT EXISTS idx_sync_queue_status
    ON sync_queue (status, created_at)`,

  // Medicine / cosmetic catalog snapshot — kept permanently for offline POS lookups.
  // Refreshed from the server on each successful online session.
  `CREATE TABLE IF NOT EXISTS medicine_snapshots (
    id             TEXT    PRIMARY KEY,
    server_id      TEXT,
    name           TEXT    NOT NULL,
    barcode        TEXT,
    price          REAL    NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category       TEXT,
    type           TEXT    NOT NULL,
    is_available   INTEGER NOT NULL DEFAULT 1,
    updated_at     TEXT    NOT NULL,
    synced_at      TEXT
  )`,

  `CREATE INDEX IF NOT EXISTS idx_medicine_snapshots_barcode
    ON medicine_snapshots (barcode)`,

  // Sales created while offline — individual rows, NOT deleted after sync.
  // status transitions: pending → syncing → synced | failed
  `CREATE TABLE IF NOT EXISTS pending_sales (
    id                 TEXT  PRIMARY KEY,
    external_id        TEXT  NOT NULL,
    branch_id          TEXT  NOT NULL,
    shift_id           TEXT,
    user_id            TEXT,
    total_amount       REAL  NOT NULL,
    discount_amount    REAL  NOT NULL DEFAULT 0,
    payment_method     TEXT  NOT NULL,
    items              TEXT  NOT NULL,
    customer_name      TEXT,
    patient_id         TEXT,
    prescription_id    TEXT,
    status             TEXT  NOT NULL DEFAULT 'pending',
    created_at         TEXT  NOT NULL,
    client_created_at  TEXT  NOT NULL
  )`,

  // Migration: add new columns to existing pending_sales tables (silently ignored if column exists)
  `ALTER TABLE pending_sales ADD COLUMN external_id       TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE pending_sales ADD COLUMN client_created_at TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE pending_sales ADD COLUMN patient_id        TEXT`,
  `ALTER TABLE pending_sales ADD COLUMN prescription_id   TEXT`,
] as const;

const CURRENT_SCHEMA_VERSION = 2;

export async function initSchema(db: Database): Promise<void> {
  // Run all DDL idempotently.
  // ALTER TABLE statements may fail if the column already exists — that's fine.
  for (const sql of DDL) {
    try {
      await db.execute(sql);
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      const isDuplicateCol =
        msg.includes("duplicate column") ||
        msg.includes("already exists");
      if (!isDuplicateCol) throw err;
    }
  }

  // Stamp schema version if not yet written
  const rows = await db.select<Array<{ version: number }>>(
    'SELECT version FROM schema_version LIMIT 1',
  );
  if (rows.length === 0) {
    await db.execute(
      'INSERT INTO schema_version (version, applied_at) VALUES (?, ?)',
      [CURRENT_SCHEMA_VERSION, new Date().toISOString()],
    );
  }
}
