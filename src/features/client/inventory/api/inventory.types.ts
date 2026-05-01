export type ProductCategory = "medicine" | "cosmetic" | "supplement" | "equipment" | "other";
export type StockMovementType = "purchase" | "sale" | "adjustment" | "return" | "expired" | "transfer";

export interface InventoryItem {
  id: string;
  name: string;
  genericName?: string;
  barcode?: string;
  sku?: string;
  category: ProductCategory;
  description?: string;
  manufacturer?: string;
  supplierId?: string;
  supplier?: { id: string; name: string };
  unitPrice: number;
  sellingPrice: number;
  quantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  unit: string;
  requiresPrescription: boolean;
  isActive: boolean;
  branchId: string;
  tenantId: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryBatch {
  id: string;
  inventoryItemId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  costPrice: number;
  supplierId?: string;
  receivedAt: string;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  item?: { id: string; name: string };
  type: StockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  referenceId?: string;
  branchId: string;
  userId: string;
  createdAt: string;
}

export interface CreateBatchPayload {
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  costPrice: number;
  supplierId?: string;
  receivedAt?: string;
}

export type UpdateBatchPayload = Partial<CreateBatchPayload>;

export interface StockAdjustmentPayload {
  quantity: number;
  type: "add" | "remove" | "set";
  reason?: string;
}

export interface CreateInventoryItemPayload {
  name: string;
  genericName?: string;
  barcode?: string;
  sku?: string;
  category: ProductCategory;
  description?: string;
  manufacturer?: string;
  supplierId?: string;
  unitPrice: number;
  sellingPrice: number;
  quantity: number;
  minStockLevel: number;
  maxStockLevel?: number;
  unit: string;
  requiresPrescription?: boolean;
  branchId?: string;
}

export type UpdateInventoryItemPayload = Partial<CreateInventoryItemPayload> & { isActive?: boolean };

export interface InventoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory;
  branchId?: string;
  supplierId?: string;
  lowStock?: boolean;
  expiringSoon?: boolean;
  isActive?: boolean;
}

// ─── Supplier ─────────────────────────────────────────────────────────────────

export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierPayload {
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload> & { isActive?: boolean };
