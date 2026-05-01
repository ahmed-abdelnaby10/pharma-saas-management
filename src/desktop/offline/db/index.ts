import Database from '@tauri-apps/plugin-sql';
import { initSchema } from './schema';

const DB_PATH = 'sqlite:pharma.db';

let _db: Database | null = null;
let _initPromise: Promise<Database> | null = null;

/**
 * Returns the lazily-initialised SQLite database instance.
 * Concurrent callers share the same in-flight promise so the schema
 * is only initialised once.
 *
 * Only call this from desktop code paths (guarded by isDesktop()).
 */
export async function getDb(): Promise<Database> {
  if (_db) return _db;

  if (!_initPromise) {
    _initPromise = Database.load(DB_PATH)
      .then(async (db) => {
        await initSchema(db);
        _db = db;
        return db;
      })
      .catch((err) => {
        // Allow retry on next call
        _initPromise = null;
        throw err;
      });
  }

  return _initPromise;
}

/** Close and reset the connection — used in tests or on logout if needed. */
export async function closeDb(): Promise<void> {
  if (_db) {
    await _db.close();
    _db = null;
    _initPromise = null;
  }
}
