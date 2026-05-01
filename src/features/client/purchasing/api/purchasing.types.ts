export type PurchaseOrderStatus =
  | "draft"
  | "pending"
  | "approved"
  | "ordered"
  | "received"
  | "cancelled";

export interface PurchaseOrderItem {
  id?: string;
  inventoryItemId: string;
  itemName?: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity?: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplier?: { id: string; name: string };
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax?: number;
  total: number;
  notes?: string;
  expectedDeliveryDate?: string;
  receivedAt?: string;
  branchId: string;
  userId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderPayload {
  supplierId: string;
  items: Omit<PurchaseOrderItem, "id" | "itemName" | "receivedQuantity">[];
  notes?: string;
  expectedDeliveryDate?: string;
  branchId?: string;
}

export interface UpdatePurchaseOrderPayload {
  supplierId?: string;
  items?: Omit<PurchaseOrderItem, "id" | "itemName" | "receivedQuantity">[];
  notes?: string;
  expectedDeliveryDate?: string;
}

export interface ReceivePurchaseOrderPayload {
  items: { inventoryItemId: string; receivedQuantity: number; batchNumber?: string; expiryDate?: string }[];
  notes?: string;
}

// ─── Line-item mutations ───────────────────────────────────────────────────────

export interface AddPOItemPayload {
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
}

export interface UpdatePOItemPayload {
  quantity?: number;
  unitCost?: number;
}

export interface UpdatePOStatusPayload {
  status: PurchaseOrderStatus;
}

export interface PurchaseOrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PurchaseOrderStatus;
  supplierId?: string;
  branchId?: string;
  from?: string;
  to?: string;
}
