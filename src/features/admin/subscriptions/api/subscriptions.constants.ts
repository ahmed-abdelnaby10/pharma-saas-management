import { PLATFORM_API, QUERY_KEYS } from '@/shared/utils/constants';
import type { AdminSubscriptionsListParams } from '@/features/admin/subscriptions/api/subscriptions.types';

/**
 * Admin subscriptions are scoped per-tenant under the platform API.
 * Pass `tenantId` to get the correct resource path.
 */
export const adminSubscriptionsApi = {
  endpoints: {
    list: (tenantId: string) => PLATFORM_API.subscriptions.list(tenantId),
    detail: (tenantId: string) => PLATFORM_API.subscriptions.current(tenantId),
    create: (tenantId: string) => PLATFORM_API.subscriptions.create(tenantId),
    changePlan: (tenantId: string) => PLATFORM_API.subscriptions.changePlan(tenantId),
    cancel: (tenantId: string) => PLATFORM_API.subscriptions.cancelCurrent(tenantId),
  },
  queryKeys: {
    list: (tenantId: string, _params?: AdminSubscriptionsListParams) =>
      QUERY_KEYS.platform.subscriptions.list(tenantId),
    detail: (tenantId: string) =>
      QUERY_KEYS.platform.subscriptions.detail(tenantId, "current"),
  },
};
