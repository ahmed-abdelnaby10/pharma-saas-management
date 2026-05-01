import {
  useQuery,
  useMutation,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  LowStockAlert,
  ExpiryAlert,
  AlertListParams,
  DispatchAlertsPayload,
  DispatchAlertsResponse,
} from "./alerts.types";

// ─── Low-stock alerts ─────────────────────────────────────────────────────────

export function useLowStockAlertsQuery(
  params?: AlertListParams,
  options?: Partial<UseQueryOptions<LowStockAlert[]>>,
) {
  return useQuery<LowStockAlert[]>({
    queryKey: QUERY_KEYS.alerts.lowStock(params),
    queryFn: () => get<LowStockAlert[]>(TENANT_API.alerts.lowStock, { params }),
    staleTime: 2 * 60_000,
    ...options,
  });
}

// ─── Expiring-soon alerts ─────────────────────────────────────────────────────

export function useExpiringAlertsQuery(
  params?: AlertListParams,
  options?: Partial<UseQueryOptions<ExpiryAlert[]>>,
) {
  return useQuery<ExpiryAlert[]>({
    queryKey: QUERY_KEYS.alerts.expiring(params),
    queryFn: () => get<ExpiryAlert[]>(TENANT_API.alerts.expiring, { params }),
    staleTime: 2 * 60_000,
    ...options,
  });
}

// ─── Dispatch alerts (POST once per session on app load) ─────────────────────

export function useDispatchAlertsMutation() {
  return useMutation<DispatchAlertsResponse, Error, DispatchAlertsPayload>({
    mutationFn: (payload) =>
      post<DispatchAlertsResponse, DispatchAlertsPayload>(
        TENANT_API.alerts.notify,
        payload,
      ),
  });
}
