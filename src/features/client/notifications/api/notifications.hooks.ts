import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type UseQueryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
import { get, post } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  Notification,
  NotificationListParams,
  NotificationListResponse,
  UnreadCountResponse,
} from "./notifications.types";

// ─── Infinite (cursor-based) notification list ───────────────────────────────

export function useNotificationsInfiniteQuery(params?: Pick<NotificationListParams, "limit">) {
  return useInfiniteQuery<NotificationListResponse, Error>({
    queryKey: QUERY_KEYS.notifications.list(params),
    queryFn: ({ pageParam }) =>
      get<NotificationListResponse>(TENANT_API.notifications.list, {
        params: {
          limit: params?.limit ?? 20,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

// ─── Unread count (polled every 60 s) ────────────────────────────────────────

export function useUnreadCountQuery(
  options?: Partial<UseQueryOptions<UnreadCountResponse>>,
) {
  return useQuery<UnreadCountResponse>({
    queryKey: QUERY_KEYS.notifications.unreadCount,
    queryFn: () => get<UnreadCountResponse>(TENANT_API.notifications.unreadCount),
    refetchInterval: 60_000,
    staleTime: 30_000,
    ...options,
  });
}

// ─── Mark single notification read ───────────────────────────────────────────

export function useMarkReadMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => post<void>(TENANT_API.notifications.markRead(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
}

// ─── Mark all notifications read ─────────────────────────────────────────────

export function useMarkAllReadMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => post<void>(TENANT_API.notifications.markAllRead),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unreadCount });
    },
  });
}
