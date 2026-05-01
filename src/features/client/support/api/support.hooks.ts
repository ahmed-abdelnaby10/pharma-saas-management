import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  TenantSupportTicket,
  TenantTicketListParams,
  CreateTenantTicketPayload,
} from "./support.types";

export function useMyTicketsQuery(
  params?: TenantTicketListParams,
  options?: Partial<UseQueryOptions<TenantSupportTicket[]>>,
) {
  return useQuery<TenantSupportTicket[]>({
    queryKey: QUERY_KEYS.support.list(params),
    queryFn: () =>
      get<TenantSupportTicket[]>(TENANT_API.support.tickets, { params }),
    ...options,
  });
}

export function useMyTicketQuery(
  id: string,
  options?: Partial<UseQueryOptions<TenantSupportTicket>>,
) {
  return useQuery<TenantSupportTicket>({
    queryKey: QUERY_KEYS.support.detail(id),
    queryFn: () => get<TenantSupportTicket>(TENANT_API.support.get(id)),
    enabled: !!id,
    ...options,
  });
}

export function useCreateTicketMutation() {
  const qc = useQueryClient();
  return useMutation<TenantSupportTicket, Error, CreateTenantTicketPayload>({
    mutationFn: (payload) =>
      post<TenantSupportTicket>(TENANT_API.support.tickets, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.support.all });
    },
  });
}
