import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { get } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type { Sale, SaleHistoryParams } from "./pos-history.types";

export function useSaleHistoryQuery(
  params?: SaleHistoryParams,
  options?: Partial<UseQueryOptions<Sale[]>>,
) {
  return useQuery<Sale[]>({
    queryKey: QUERY_KEYS.pos.history(params),
    queryFn: () => get<Sale[]>(TENANT_API.pos.history, { params }),
    ...options,
  });
}

export function useSaleQuery(
  id: string,
  options?: Partial<UseQueryOptions<Sale>>,
) {
  return useQuery<Sale>({
    queryKey: QUERY_KEYS.pos.detail(id),
    queryFn: () => get<Sale>(TENANT_API.pos.get(id)),
    enabled: !!id,
    ...options,
  });
}
