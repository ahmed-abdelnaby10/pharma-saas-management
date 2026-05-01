import { BaseRepository } from './base';
import type { PendingSale, PendingSaleStatus, SaleItem } from '../types';

interface PendingSaleRow {
  id: string;
  external_id: string;
  branch_id: string;
  shift_id: string | null;
  user_id: string | null;
  patient_id: string | null;
  prescription_id: string | null;
  total_amount: number;
  discount_amount: number;
  payment_method: string;
  items: string; // JSON
  customer_name: string | null;
  status: string;
  created_at: string;
  client_created_at: string;
}

function rowToSale(row: PendingSaleRow): PendingSale {
  return {
    id:              row.id,
    externalId:      row.external_id,
    branchId:        row.branch_id,
    shiftId:         row.shift_id,
    userId:          row.user_id,
    patientId:       row.patient_id,
    prescriptionId:  row.prescription_id,
    totalAmount:     row.total_amount,
    discountAmount:  row.discount_amount,
    paymentMethod:   row.payment_method,
    items:           JSON.parse(row.items) as SaleItem[],
    customerName:    row.customer_name,
    status:          row.status as PendingSaleStatus,
    createdAt:       row.created_at,
    clientCreatedAt: row.client_created_at,
  };
}

export class PendingSaleRepository extends BaseRepository {
  async save(
    sale: Omit<PendingSale, 'id' | 'status' | 'createdAt'>,
  ): Promise<PendingSale> {
    const db  = await this.db();
    const id  = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.execute(
      `INSERT INTO pending_sales
         (id, external_id, branch_id, shift_id, user_id,
          patient_id, prescription_id,
          total_amount, discount_amount,
          payment_method, items, customer_name, status,
          created_at, client_created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [
        id,
        sale.externalId,
        sale.branchId,
        sale.shiftId,
        sale.userId,
        sale.patientId ?? null,
        sale.prescriptionId ?? null,
        sale.totalAmount,
        sale.discountAmount,
        sale.paymentMethod,
        JSON.stringify(sale.items),
        sale.customerName,
        now,
        sale.clientCreatedAt,
      ],
    );

    return { ...sale, id, status: 'pending', createdAt: now };
  }

  async findPending(): Promise<PendingSale[]> {
    const db = await this.db();
    const rows = await db.select<PendingSaleRow[]>(
      `SELECT * FROM pending_sales
        WHERE status IN ('pending', 'failed')
        ORDER BY created_at ASC`,
    );
    return rows.map(rowToSale);
  }

  async findAll(): Promise<PendingSale[]> {
    const db = await this.db();
    const rows = await db.select<PendingSaleRow[]>(
      `SELECT * FROM pending_sales ORDER BY created_at DESC`,
    );
    return rows.map(rowToSale);
  }

  async findById(id: string): Promise<PendingSale | null> {
    const db = await this.db();
    const rows = await db.select<PendingSaleRow[]>(
      `SELECT * FROM pending_sales WHERE id = ?`,
      [id],
    );
    return rows[0] ? rowToSale(rows[0]) : null;
  }

  async updateStatus(id: string, status: PendingSaleStatus): Promise<void> {
    const db = await this.db();
    await db.execute(
      `UPDATE pending_sales SET status = ? WHERE id = ?`,
      [status, id],
    );
  }

  async pendingCount(): Promise<number> {
    const db = await this.db();
    const rows = await db.select<Array<{ count: number }>>(
      `SELECT COUNT(*) AS count FROM pending_sales WHERE status = 'pending'`,
    );
    return rows[0]?.count ?? 0;
  }
}
