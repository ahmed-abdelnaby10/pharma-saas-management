import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post, patch, remove } from "@/shared/api/request";
import { PLATFORM_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  CatalogItem,
  CatalogListParams,
  CreateCatalogItemPayload,
  UpdateCatalogItemPayload,
} from "./catalog.types";

export function useCatalogQuery(
  params?: CatalogListParams,
  options?: Partial<UseQueryOptions<CatalogItem[]>>,
) {
  return useQuery<CatalogItem[]>({
    queryKey: QUERY_KEYS.platform.catalog.list(params),
    queryFn: () => get<CatalogItem[]>(PLATFORM_API.catalog.list, { params }),
    ...options,
  });
}

export function useCatalogItemQuery(
  id: string,
  options?: Partial<UseQueryOptions<CatalogItem>>,
) {
  return useQuery<CatalogItem>({
    queryKey: QUERY_KEYS.platform.catalog.detail(id),
    queryFn: () => get<CatalogItem>(PLATFORM_API.catalog.get(id)),
    enabled: !!id,
    ...options,
  });
}

export function useCreateCatalogItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCatalogItemPayload) =>
      post<CatalogItem>(PLATFORM_API.catalog.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.catalog.all });
    },
  });
}

export function useUpdateCatalogItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateCatalogItemPayload & { id: string }) =>
      patch<CatalogItem>(PLATFORM_API.catalog.update(id), payload),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.catalog.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.catalog.detail(vars.id) });
    },
  });
}

export function useDeleteCatalogItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remove(PLATFORM_API.catalog.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.catalog.all });
    },
  });
}
