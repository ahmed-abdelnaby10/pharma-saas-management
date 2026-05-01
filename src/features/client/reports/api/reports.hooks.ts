import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { get } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  SalesReportParams,
  SalesReportRow,
  InventoryReportParams,
  InventoryReportRow,
  FinancialReportParams,
  FinancialReportRow,
} from "./reports.types";

export function useSalesReportQuery(
  params?: SalesReportParams,
  options?: Partial<UseQueryOptions<SalesReportRow[]>>,
) {
  return useQuery<SalesReportRow[]>({
    queryKey: QUERY_KEYS.reports.sales(params),
    queryFn: () => get<SalesReportRow[]>(TENANT_API.reports.sales, { params }),
    staleTime: 5 * 60_000,
    ...options,
  });
}

export function useInventoryReportQuery(
  params?: InventoryReportParams,
  options?: Partial<UseQueryOptions<InventoryReportRow[]>>,
) {
  return useQuery<InventoryReportRow[]>({
    queryKey: QUERY_KEYS.reports.inventory(params),
    queryFn: () =>
      get<InventoryReportRow[]>(TENANT_API.reports.inventory, { params }),
    staleTime: 5 * 60_000,
    ...options,
  });
}

export function useFinancialReportQuery(
  params?: FinancialReportParams,
  options?: Partial<UseQueryOptions<FinancialReportRow[]>>,
) {
  return useQuery<FinancialReportRow[]>({
    queryKey: QUERY_KEYS.reports.financial(params),
    queryFn: () =>
      get<FinancialReportRow[]>(TENANT_API.reports.financial, { params }),
    staleTime: 5 * 60_000,
    ...options,
  });
}
