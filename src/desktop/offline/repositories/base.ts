import type Database from '@tauri-apps/plugin-sql';
import { getDb } from '../db';

/**
 * Thin base class that hands subclasses a ready Database instance.
 * All repository methods are async — SQLite access is always async via
 * the Tauri IPC bridge.
 */
export abstract class BaseRepository {
  protected async db(): Promise<Database> {
    return getDb();
  }
}
