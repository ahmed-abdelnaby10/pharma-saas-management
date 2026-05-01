import { PLATFORM_API, QUERY_KEYS } from '@/shared/utils/constants';
import type { AdminSubscriptionsListParams } from '@/features/admin/subscriptions/api/subscriptions.types';

/**
 * Admin subscriptions are scoped per-tenant under the platform API.
 * Pass `tenantId` to get the correct resource path.
 */
export const adminSubscriptionsApi = {
  endpoints: {
    list: (tenantId: string) => PLATFORM_API.subscriptions.list(tenantId),
    detail: (tenantId: string, subscriptionId: string) =>
      PLATFORM_API.subscriptions.get(tenantId, subscriptionId),
    create: (tenantId: string) => PLATFORM_API.subscriptions.create(tenantId),
    cancel: (tenantId: string, subscriptionId: string) =>
      PLATFORM_API.subscriptions.cancel(tenantId, subscriptionId),
  },
  queryKeys: {
    list: (tenantId: string, _params?: AdminSubscriptionsListParams) =>
      QUERY_KEYS.platform.subscriptions.list(tenantId),
    detail: (tenantId: string, subscriptionId: string) =>
      QUERY_KEYS.platform.subscriptions.detail(tenantId, subscriptionId),
  },
};
