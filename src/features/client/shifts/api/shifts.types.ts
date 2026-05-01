export type ShiftStatus = "open" | "closed";

export interface Shift {
  id: string;
  branchId: string;
  branch?: { id: string; name: string };
  userId: string;
  user?: { id: string; name: string };
  status: ShiftStatus;
  openedAt: string;
  closedAt?: string;
  openingCash: number;
  closingCash?: number;
  totalSales?: number;
  totalTransactions?: number;
  notes?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpenShiftPayload {
  branchId: string;
  openingCash: number;
  notes?: string;
  /** Client-generated UUID for idempotent shift creation (used when opening offline) */
  externalId?: string;
  /** Device-local ISO timestamp — lets server record when the shift was truly opened */
  clientCreatedAt?: string;
}

export interface CloseShiftPayload {
  closingCash: number;
  notes?: string;
}

export interface ShiftListParams {
  page?: number;
  limit?: number;
  branchId?: string;
  userId?: string;
  status?: ShiftStatus;
  from?: string;
  to?: string;
}
