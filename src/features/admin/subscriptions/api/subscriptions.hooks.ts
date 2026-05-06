import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/shared/api/request";
import { adminSubscriptionsApi } from "@/features/admin/subscriptions/api/subscriptions.constants";
import type {
  AdminSubscriptionsListParams,
  AdminSubscriptionsListResponse,
  SubscriptionRecord,
} from "@/features/admin/subscriptions/api/subscriptions.types";

export function useAdminSubscriptionsListQuery(
  tenantId: string,
  params?: AdminSubscriptionsListParams,
  enabled = false,
) {
  return useQuery<AdminSubscriptionsListResponse>({
    queryKey: adminSubscriptionsApi.queryKeys.list(tenantId, params),
    queryFn: () =>
      get<AdminSubscriptionsListResponse>(
        adminSubscriptionsApi.endpoints.list(tenantId),
        { params },
      ),
    enabled: enabled && !!tenantId,
  });
}

export function useAdminSubscriptionDetailQuery(
  tenantId: string,
  enabled = false,
) {
  return useQuery<SubscriptionRecord>({
    queryKey: adminSubscriptionsApi.queryKeys.detail(tenantId),
    queryFn: () =>
      get<SubscriptionRecord>(
        adminSubscriptionsApi.endpoints.detail(tenantId),
      ),
    enabled: enabled && !!tenantId,
  });
}

export function useCancelSubscriptionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
    }: {
      tenantId: string;
    }) =>
      post<SubscriptionRecord>(
        adminSubscriptionsApi.endpoints.cancel(tenantId),
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform", "tenants"] });
    },
  });
}
