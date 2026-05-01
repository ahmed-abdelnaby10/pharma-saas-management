export interface SalesReportParams {
  from?: string;
  to?: string;
  branchId?: string;
  groupBy?: "day" | "week" | "month";
  paymentMethod?: string;
}

export interface SalesReportRow {
  date: string;
  totalSales: number;
  totalRevenue: number;
  totalDiscount: number;
  netRevenue: number;
}

export interface InventoryReportParams {
  branchId?: string;
  category?: string;
  lowStock?: boolean;
  expiringSoon?: boolean;
}

export interface InventoryReportRow {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  sellingPrice: number;
  totalValue: number;
  expiryDate?: string;
  status: "ok" | "low" | "critical" | "expired";
}

export interface FinancialReportParams {
  from?: string;
  to?: string;
  branchId?: string;
}

export interface FinancialReportRow {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}
