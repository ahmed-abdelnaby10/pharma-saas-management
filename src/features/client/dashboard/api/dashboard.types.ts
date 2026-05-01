export interface DashboardSummary {
  todaySales: number;
  todayTransactions: number;
  todayRevenue: number;
  totalInventoryItems: number;
  lowStockCount: number;
  expiringCount: number;
  activeShifts: number;
  pendingPurchaseOrders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  category: string;
}

export interface RecentSale {
  id: string;
  customerName?: string;
  total: number;
  paymentMethod: string;
  itemCount: number;
  createdAt: string;
  cashierName?: string;
}

export interface AnalyticsParams {
  from?: string;
  to?: string;
  branchId?: string;
  groupBy?: "day" | "week" | "month";
}

export interface AnalyticsDataPoint {
  date: string;
  revenue: number;
  transactions: number;
}

// ─── Extended analytics ───────────────────────────────────────────────────────

export interface SalesTrendPoint {
  period: string;
  revenue: number;
  transactions: number;
  avgOrderValue: number;
}

export interface TopProductAnalytics {
  productId: string;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
  category?: string;
}

export interface PaymentMethodStats {
  count: number;
  total: number;
}

export interface PaymentBreakdown {
  CASH: PaymentMethodStats;
  CARD: PaymentMethodStats;
  INSURANCE: PaymentMethodStats;
  OTHER: PaymentMethodStats;
}

export interface AnalyticsDateParams {
  from?: string;
  to?: string;
  branchId?: string;
}
