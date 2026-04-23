import { useCustomQuery } from '@/shared/hooks/useQuery';
import { adminSubscriptionsApi } from '@/features/admin/subscriptions/api/subscriptions.constants';
import type {
  AdminSubscriptionsListParams,
  AdminSubscriptionsListResponse,
} from '@/features/admin/subscriptions/api/subscriptions.types';

export function useAdminSubscriptionsListQuery(
  params?: AdminSubscriptionsListParams,
  enabled = false,
) {
  return useCustomQuery<AdminSubscriptionsListResponse>({
    endpoint: adminSubscriptionsApi.endpoints.list(),
    queryKey: adminSubscriptionsApi.queryKeys.list(params),
    requestConfig: {
      params,
    },
    options: {
      enabled,
    },
  });
}
