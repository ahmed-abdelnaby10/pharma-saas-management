import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post, patch, remove } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  InventoryItem,
  InventoryBatch,
  StockMovement,
  StockAdjustmentPayload,
  CreateInventoryItemPayload,
  UpdateInventoryItemPayload,
  InventoryListParams,
  CreateBatchPayload,
  UpdateBatchPayload,
  Supplier,
  CreateSupplierPayload,
  UpdateSupplierPayload,
} from "./inventory.types";

// ─── Inventory list ───────────────────────────────────────────────────────────

export function useInventoryQuery(
  params?: InventoryListParams,
  options?: Partial<UseQueryOptions<InventoryItem[]>>,
) {
  return useQuery<InventoryItem[]>({
    queryKey: QUERY_KEYS.inventory.list(params),
    queryFn: () => get<InventoryItem[]>(TENANT_API.inventory.list, { params }),
    ...options,
  });
}

export function useLowStockQuery(options?: Partial<UseQueryOptions<InventoryItem[]>>) {
  return useQuery<InventoryItem[]>({
    queryKey: QUERY_KEYS.inventory.lowStock,
    queryFn: () => get<InventoryItem[]>(TENANT_API.inventory.lowStock),
    ...options,
  });
}

export function useExpiringSoonQuery(options?: Partial<UseQueryOptions<InventoryItem[]>>) {
  return useQuery<InventoryItem[]>({
    queryKey: QUERY_KEYS.inventory.expiringSoon,
    queryFn: () => get<InventoryItem[]>(TENANT_API.inventory.expiringSoon),
    ...options,
  });
}

// ─── Inventory detail ─────────────────────────────────────────────────────────

export function useInventoryItemQuery(
  id: string,
  options?: Partial<UseQueryOptions<InventoryItem>>,
) {
  return useQuery<InventoryItem>({
    queryKey: QUERY_KEYS.inventory.detail(id),
    queryFn: () => get<InventoryItem>(TENANT_API.inventory.get(id)),
    enabled: !!id,
    ...options,
  });
}

// ─── Batches ──────────────────────────────────────────────────────────────────

export function useInventoryBatchesQuery(
  itemId: string,
  options?: Partial<UseQueryOptions<InventoryBatch[]>>,
) {
  return useQuery<InventoryBatch[]>({
    queryKey: QUERY_KEYS.inventory.batches(itemId),
    queryFn: () => get<InventoryBatch[]>(TENANT_API.inventory.batches(itemId)),
    enabled: !!itemId,
    ...options,
  });
}

// ─── Batch mutations ──────────────────────────────────────────────────────────

export function useCreateBatchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, ...payload }: CreateBatchPayload & { itemId: string }) =>
      post<InventoryBatch>(TENANT_API.inventory.createBatch(itemId), payload),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.batches(vars.itemId) });
    },
  });
}

export function useUpdateBatchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      batchId,
      ...payload
    }: UpdateBatchPayload & { itemId: string; batchId: string }) =>
      patch<InventoryBatch>(TENANT_API.inventory.updateBatch(itemId, batchId), payload),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.batches(vars.itemId) });
    },
  });
}

export function useDeleteBatchMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, batchId }: { itemId: string; batchId: string }) =>
      remove(TENANT_API.inventory.deleteBatch(itemId, batchId)),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.batches(vars.itemId) });
    },
  });
}

// ─── Stock movements ──────────────────────────────────────────────────────────

export function useStockMovementsQuery(
  params?: object,
  options?: Partial<UseQueryOptions<StockMovement[]>>,
) {
  return useQuery<StockMovement[]>({
    queryKey: QUERY_KEYS.inventory.movements(params),
    queryFn: () => get<StockMovement[]>(TENANT_API.inventory.movements, { params }),
    ...options,
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export function useCreateInventoryItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInventoryItemPayload) =>
      post<InventoryItem>(TENANT_API.inventory.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
    },
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function useUpdateInventoryItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateInventoryItemPayload & { id: string }) =>
      patch<InventoryItem>(TENANT_API.inventory.update(id), payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.detail(vars.id) });
    },
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function useDeleteInventoryItemMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remove(TENANT_API.inventory.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
    },
  });
}

// ─── Stock adjustment ─────────────────────────────────────────────────────────

export function useAdjustStockMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: StockAdjustmentPayload & { id: string }) =>
      post<InventoryItem>(TENANT_API.inventory.adjustStock(id), payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.detail(vars.id) });
    },
  });
}

// ─── Suppliers ────────────────────────────────────────────────────────────────

export function useSuppliersQuery(
  params?: object,
  options?: Partial<UseQueryOptions<Supplier[]>>,
) {
  return useQuery<Supplier[]>({
    queryKey: QUERY_KEYS.suppliers.list(params),
    queryFn: () => get<Supplier[]>(TENANT_API.suppliers.list, { params }),
    ...options,
  });
}

export function useCreateSupplierMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSupplierPayload) =>
      post<Supplier>(TENANT_API.suppliers.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.suppliers.all });
    },
  });
}

export function useUpdateSupplierMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateSupplierPayload & { id: string }) =>
      patch<Supplier>(TENANT_API.suppliers.update(id), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.suppliers.all });
    },
  });
}

export function useDeleteSupplierMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remove(TENANT_API.suppliers.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.suppliers.all });
    },
  });
}
