// ---------------------------------------------------------------------------
// Sync queue / outbox
// ---------------------------------------------------------------------------

export type SyncOperationType = 'CREATE' | 'UPDATE' | 'DELETE';

export type SyncEntityType =
  | 'sale'
  | 'sale_item'
  | 'inventory_adjustment'
  | 'cash_transaction';

export type SyncStatus =
  | 'pending'       // waiting to be sent
  | 'syncing'       // being processed right now
  | 'synced'        // successfully sent; row kept for audit
  | 'failed_retry'  // failed but will retry (retryCount < maxRetries)
  | 'failed_permanent'; // retries exhausted; needs manual intervention

export interface SyncQueueItem {
  id: string;
  entityType: SyncEntityType;
  operationType: SyncOperationType;
  localId: string;
  serverId: string | null;
  payload: Record<string, unknown>;
  status: SyncStatus;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  processedAt: string | null;
  errorMessage: string | null;
}

// ---------------------------------------------------------------------------
// Local entity snapshots — product catalog cached for offline POS
// ---------------------------------------------------------------------------

export interface MedicineSnapshot {
  id: string;
  serverId: string | null;
  name: string;
  barcode: string | null;
  price: number;
  stockQuantity: number;
  category: string | null;
  type: 'medicine' | 'cosmetic';
  isAvailable: boolean;
  updatedAt: string;
  syncedAt: string | null;
}

// ---------------------------------------------------------------------------
// Offline POS sales — created locally when offline
// ---------------------------------------------------------------------------

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type PendingSaleStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface PendingSale {
  id: string;
  /** Stable client-generated UUID sent to the server for idempotency checks */
  externalId: string;
  branchId: string;
  shiftId: string | null;
  userId: string | null;
  patientId?: string | null;
  prescriptionId?: string | null;
  totalAmount: number;
  discountAmount: number;
  paymentMethod: string;
  items: SaleItem[];
  customerName: string | null;
  status: PendingSaleStatus;
  createdAt: string;
  /** Device-local ISO timestamp at the moment the sale was created offline */
  clientCreatedAt: string;
}

// ---------------------------------------------------------------------------
// Connectivity
// ---------------------------------------------------------------------------

export interface ConnectivityState {
  isOnline: boolean;
  lastOnlineAt: string | null;
  lastOfflineAt: string | null;
}

// ---------------------------------------------------------------------------
// Sync results
// ---------------------------------------------------------------------------

export interface SyncResult {
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ id: string; error: string }>;
}

export type OrchestratorSyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface OrchestratorState {
  status: OrchestratorSyncStatus;
  pendingCount: number;
  lastSyncAt: string | null;
  lastError: string | null;
}
