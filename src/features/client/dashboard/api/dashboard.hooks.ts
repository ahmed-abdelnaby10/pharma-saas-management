import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { get } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  DashboardSummary,
  TopProduct,
  RecentSale,
  AnalyticsParams,
  AnalyticsDataPoint,
  SalesTrendPoint,
  TopProductAnalytics,
  PaymentBreakdown,
  AnalyticsDateParams,
} from "./dashboard.types";

export function useDashboardSummaryQuery(
  options?: Partial<UseQueryOptions<DashboardSummary>>,
) {
  return useQuery<DashboardSummary>({
    queryKey: QUERY_KEYS.dashboard.summary,
    queryFn: () => get<DashboardSummary>(TENANT_API.dashboard.summary),
    staleTime: 60_000, // 1 min
    ...options,
  });
}

export function useTopProductsQuery(
  options?: Partial<UseQueryOptions<TopProduct[]>>,
) {
  return useQuery<TopProduct[]>({
    queryKey: QUERY_KEYS.dashboard.topProducts,
    queryFn: () => get<TopProduct[]>(TENANT_API.dashboard.topProducts),
    staleTime: 5 * 60_000,
    ...options,
  });
}

export function useRecentSalesQuery(
  options?: Partial<UseQueryOptions<RecentSale[]>>,
) {
  return useQuery<RecentSale[]>({
    queryKey: QUERY_KEYS.dashboard.recentSales,
    queryFn: () => get<RecentSale[]>(TENANT_API.dashboard.recentSales),
    staleTime: 60_000,
    ...options,
  });
}

// ─── Extended analytics ───────────────────────────────────────────────────────

export function useSalesTrendQuery(
  params?: AnalyticsDateParams,
  options?: Partial<UseQueryOptions<SalesTrendPoint[]>>,
) {
  return useQuery<SalesTrendPoint[]>({
    queryKey: QUERY_KEYS.analytics.salesTrend(params),
    queryFn: () => get<SalesTrendPoint[]>(TENANT_API.analytics.salesTrend, { params }),
    staleTime: 5 * 60_000,
    ...options,
  });
}

export function useTopProductsAnalyticsQuery(
  params?: AnalyticsDateParams,
  options?: Partial<UseQueryOptions<TopProductAnalytics[]>>,
) {
  return useQuery<TopProductAnalytics[]>({
    queryKey: QUERY_KEYS.analytics.topProducts(params),
    queryFn: () => get<TopProductAnalytics[]>(TENANT_API.analytics.topProducts, { params }),
    staleTime: 5 * 60_000,
    ...options,
  });
}

export function usePaymentBreakdownQuery(
  params?: AnalyticsDateParams,
  options?: Partial<UseQueryOptions<PaymentBreakdown>>,
) {
  return useQuery<PaymentBreakdown>({
    queryKey: QUERY_KEYS.analytics.paymentBreakdown(params),
    queryFn: () => get<PaymentBreakdown>(TENANT_API.analytics.paymentBreakdown, { params }),
    staleTime: 5 * 60_000,
    ...options,
  });
}

export function useAnalyticsQuery(
  params?: AnalyticsParams,
  options?: Partial<UseQueryOptions<AnalyticsDataPoint[]>>,
) {
  return useQuery<AnalyticsDataPoint[]>({
    queryKey: QUERY_KEYS.dashboard.analytics(params),
    queryFn: () =>
      get<AnalyticsDataPoint[]>(TENANT_API.dashboard.analytics, { params }),
    staleTime: 5 * 60_000,
    ...options,
  });
}
