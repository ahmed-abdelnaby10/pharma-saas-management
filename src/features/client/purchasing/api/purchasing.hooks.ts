import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post, patch, remove } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderListParams,
  CreatePurchaseOrderPayload,
  UpdatePurchaseOrderPayload,
  ReceivePurchaseOrderPayload,
  AddPOItemPayload,
  UpdatePOItemPayload,
  UpdatePOStatusPayload,
} from "./purchasing.types";

// ─── List ─────────────────────────────────────────────────────────────────────

export function usePurchaseOrdersQuery(
  params?: PurchaseOrderListParams,
  options?: Partial<UseQueryOptions<PurchaseOrder[]>>,
) {
  return useQuery<PurchaseOrder[]>({
    queryKey: QUERY_KEYS.purchasing.list(params),
    queryFn: () => get<PurchaseOrder[]>(TENANT_API.purchasing.list, { params }),
    ...options,
  });
}

// ─── Detail ───────────────────────────────────────────────────────────────────

export function usePurchaseOrderQuery(
  id: string,
  options?: Partial<UseQueryOptions<PurchaseOrder>>,
) {
  return useQuery<PurchaseOrder>({
    queryKey: QUERY_KEYS.purchasing.detail(id),
    queryFn: () => get<PurchaseOrder>(TENANT_API.purchasing.get(id)),
    enabled: !!id,
    ...options,
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export function useCreatePurchaseOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePurchaseOrderPayload) =>
      post<PurchaseOrder>(TENANT_API.purchasing.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.all });
    },
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function useUpdatePurchaseOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdatePurchaseOrderPayload & { id: string }) =>
      patch<PurchaseOrder>(TENANT_API.purchasing.update(id), payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.detail(vars.id) });
    },
  });
}

// ─── Approve ──────────────────────────────────────────────────────────────────

export function useApprovePurchaseOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      post<PurchaseOrder>(TENANT_API.purchasing.approve(id)),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.detail(id) });
    },
  });
}

// ─── Receive ──────────────────────────────────────────────────────────────────

export function useReceivePurchaseOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: ReceivePurchaseOrderPayload & { id: string }) =>
      post<PurchaseOrder>(TENANT_API.purchasing.receive(id), payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.detail(vars.id) });
      // Receiving stock affects inventory
      qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all });
    },
  });
}

// ─── Cancel ───────────────────────────────────────────────────────────────────

export function useCancelPurchaseOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      post<PurchaseOrder>(TENANT_API.purchasing.cancel(id)),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.detail(id) });
    },
  });
}

// ─── Status transition ────────────────────────────────────────────────────────

export function useUpdatePOStatusMutation() {
  const qc = useQueryClient();
  return useMutation<PurchaseOrder, Error, { id: string; payload: UpdatePOStatusPayload }>({
    mutationFn: ({ id, payload }) =>
      patch<PurchaseOrder>(TENANT_API.purchasing.status(id), payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.detail(id) });
    },
  });
}

// ─── Line-item: Add ───────────────────────────────────────────────────────────

export function useAddPOItemMutation() {
  const qc = useQueryClient();
  return useMutation<PurchaseOrderItem, Error, { orderId: string; payload: AddPOItemPayload }>({
    mutationFn: ({ orderId, payload }) =>
      post<PurchaseOrderItem>(TENANT_API.purchasing.addItem(orderId), payload),
    onSuccess: (_data, { orderId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.detail(orderId) });
    },
  });
}

// ─── Line-item: Update ────────────────────────────────────────────────────────

export function useUpdatePOItemMutation() {
  const qc = useQueryClient();
  return useMutation<
    PurchaseOrderItem,
    Error,
    { orderId: string; itemId: string; payload: UpdatePOItemPayload }
  >({
    mutationFn: ({ orderId, itemId, payload }) =>
      patch<PurchaseOrderItem>(TENANT_API.purchasing.updateItem(orderId, itemId), payload),
    onSuccess: (_data, { orderId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.detail(orderId) });
    },
  });
}

// ─── Line-item: Delete ────────────────────────────────────────────────────────

export function useDeletePOItemMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, { orderId: string; itemId: string }>({
    mutationFn: ({ orderId, itemId }) =>
      remove(TENANT_API.purchasing.deleteItem(orderId, itemId)),
    onSuccess: (_data, { orderId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.purchasing.detail(orderId) });
    },
  });
}
