import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post, patch, remove } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  Branch,
  BranchListParams,
  CreateBranchPayload,
  UpdateBranchPayload,
} from "./branches.types";

// ─── List ────────────────────────────────────────────────────────────────────

export function useBranchesQuery(
  params?: BranchListParams,
  options?: Partial<UseQueryOptions<Branch[]>>,
) {
  return useQuery<Branch[]>({
    queryKey: QUERY_KEYS.branches.list(params),
    queryFn: () =>
      get<Branch[]>(TENANT_API.branches.list, { params }),
    ...options,
  });
}

// ─── Detail ──────────────────────────────────────────────────────────────────

export function useBranchQuery(
  id: string,
  options?: Partial<UseQueryOptions<Branch>>,
) {
  return useQuery<Branch>({
    queryKey: QUERY_KEYS.branches.detail(id),
    queryFn: () => get<Branch>(TENANT_API.branches.get(id)),
    enabled: !!id,
    ...options,
  });
}

// ─── Create ──────────────────────────────────────────────────────────────────

export function useCreateBranchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBranchPayload) =>
      post<Branch>(TENANT_API.branches.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.branches.all });
    },
  });
}

// ─── Update ──────────────────────────────────────────────────────────────────

export function useUpdateBranchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateBranchPayload & { id: string }) =>
      patch<Branch>(TENANT_API.branches.update(id), payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.branches.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.branches.detail(vars.id) });
    },
  });
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export function useDeleteBranchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remove(TENANT_API.branches.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.branches.all });
    },
  });
}
