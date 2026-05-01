import { BaseRepository } from './base';
import type { MedicineSnapshot } from '../types';

interface MedicineSnapshotRow {
  id: string;
  server_id: string | null;
  name: string;
  barcode: string | null;
  price: number;
  stock_quantity: number;
  category: string | null;
  type: string;
  is_available: number; // SQLite stores booleans as 0/1
  updated_at: string;
  synced_at: string | null;
}

function rowToSnapshot(row: MedicineSnapshotRow): MedicineSnapshot {
  return {
    id: row.id,
    serverId: row.server_id,
    name: row.name,
    barcode: row.barcode,
    price: row.price,
    stockQuantity: row.stock_quantity,
    category: row.category,
    type: row.type as 'medicine' | 'cosmetic',
    isAvailable: row.is_available === 1,
    updatedAt: row.updated_at,
    syncedAt: row.synced_at,
  };
}

export class MedicineSnapshotRepository extends BaseRepository {
  async upsert(snapshot: MedicineSnapshot): Promise<void> {
    const db = await this.db();
    await db.execute(
      `INSERT INTO medicine_snapshots
         (id, server_id, name, barcode, price, stock_quantity, category,
          type, is_available, updated_at, synced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         server_id      = excluded.server_id,
         name           = excluded.name,
         barcode        = excluded.barcode,
         price          = excluded.price,
         stock_quantity = excluded.stock_quantity,
         category       = excluded.category,
         type           = excluded.type,
         is_available   = excluded.is_available,
         updated_at     = excluded.updated_at,
         synced_at      = excluded.synced_at`,
      [
        snapshot.id,
        snapshot.serverId,
        snapshot.name,
        snapshot.barcode,
        snapshot.price,
        snapshot.stockQuantity,
        snapshot.category,
        snapshot.type,
        snapshot.isAvailable ? 1 : 0,
        snapshot.updatedAt,
        snapshot.syncedAt,
      ],
    );
  }

  /** Bulk replace the entire catalog — called after a successful online fetch. */
  async replaceAll(snapshots: MedicineSnapshot[]): Promise<void> {
    const db = await this.db();
    await db.execute('DELETE FROM medicine_snapshots');
    for (const s of snapshots) {
      await this.upsert(s);
    }
  }

  async findAll(onlyAvailable = false): Promise<MedicineSnapshot[]> {
    const db = await this.db();
    const sql = onlyAvailable
      ? `SELECT * FROM medicine_snapshots WHERE is_available = 1 ORDER BY name`
      : `SELECT * FROM medicine_snapshots ORDER BY name`;
    const rows = await db.select<MedicineSnapshotRow[]>(sql);
    return rows.map(rowToSnapshot);
  }

  async findByBarcode(barcode: string): Promise<MedicineSnapshot | null> {
    const db = await this.db();
    const rows = await db.select<MedicineSnapshotRow[]>(
      `SELECT * FROM medicine_snapshots WHERE barcode = ? LIMIT 1`,
      [barcode],
    );
    return rows[0] ? rowToSnapshot(rows[0]) : null;
  }

  async findById(id: string): Promise<MedicineSnapshot | null> {
    const db = await this.db();
    const rows = await db.select<MedicineSnapshotRow[]>(
      `SELECT * FROM medicine_snapshots WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] ? rowToSnapshot(rows[0]) : null;
  }

  async adjustStock(id: string, delta: number): Promise<void> {
    const db = await this.db();
    await db.execute(
      `UPDATE medicine_snapshots
          SET stock_quantity = MAX(0, stock_quantity + ?)
        WHERE id = ?`,
      [delta, id],
    );
  }

  async count(): Promise<number> {
    const db = await this.db();
    const rows = await db.select<Array<{ count: number }>>(
      `SELECT COUNT(*) AS count FROM medicine_snapshots`,
    );
    return rows[0]?.count ?? 0;
  }
}
