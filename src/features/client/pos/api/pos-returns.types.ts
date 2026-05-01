export interface SaleReturnItem {
  saleItemId: string;
  quantityReturned: number;
  reason?: string;
}

export interface CreateSaleReturnPayload {
  items: SaleReturnItem[];
}

export interface SaleReturn {
  id: string;
  saleId: string;
  branchId: string;
  items: SaleReturnItem[];
  totalRefund: number;
  createdAt: string;
}
