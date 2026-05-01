export type AlertSeverity = "low" | "medium" | "high" | "critical";

export interface LowStockAlert {
  id: string;
  medicineId: string;
  medicineName: string;
  sku?: string;
  branchId: string;
  branchName?: string;
  quantityOnHand: number;
  reorderLevel: number;
  unit?: string;
}

export interface ExpiryAlert {
  id: string;
  batchId: string;
  batchNumber: string;
  medicineId: string;
  medicineName: string;
  branchId: string;
  branchName?: string;
  expiryDate: string; // ISO date
  daysUntilExpiry: number;
  quantityOnHand: number;
}

export interface AlertListParams {
  branchId?: string;
  page?: number;
  limit?: number;
}

export interface DispatchAlertsPayload {
  branchId: string;
}

export interface DispatchAlertsResponse {
  dispatched: number;
}
