export interface SaleItemCatalog {
  nameEn: string;
  nameAr?: string;
}

export interface SaleItem {
  id: string;
  inventoryItemId?: string;
  catalogItem?: SaleItemCatalog;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  totalPrice: number;
  batchId?: string;
}

export interface Sale {
  id: string;
  tenantId?: string;
  branchId: string;
  shiftId?: string;
  userId?: string;
  patientId?: string;
  patientName?: string;
  prescriptionId?: string;
  receiptNumber?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discount?: number;
  discountAmount: number;
  netAmount?: number;
  tax: number;
  vatAmount?: number;
  total: number;
  paymentMethod: string;
  paymentAmount?: number;
  changeAmount?: number;
  status?: string;
  createdAt: string;
}

export interface SaleHistoryParams {
  branchId?: string;
  shiftId?: string;
  page?: number;
  limit?: number;
  from?: string;
  to?: string;
}
