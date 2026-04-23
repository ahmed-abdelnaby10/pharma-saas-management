import type { AdminSubscriptionsListParams } from '@/features/admin/subscriptions/api/subscriptions.types';

const ADMIN_SUBSCRIPTIONS_BASE_PATH = '/admin/subscriptions';

export const adminSubscriptionsApi = {
  endpoints: {
    list: () => ADMIN_SUBSCRIPTIONS_BASE_PATH,
    detail: (subscriptionId: string) =>
      `${ADMIN_SUBSCRIPTIONS_BASE_PATH}/${subscriptionId}`,
  },
  queryKeys: {
    all: ['admin', 'subscriptions'] as const,
    list: (params?: AdminSubscriptionsListParams) =>
      [...adminSubscriptionsApi.queryKeys.all, 'list', params ?? {}] as const,
    detail: (subscriptionId: string) =>
      [...adminSubscriptionsApi.queryKeys.all, 'detail', subscriptionId] as const,
  },
};
