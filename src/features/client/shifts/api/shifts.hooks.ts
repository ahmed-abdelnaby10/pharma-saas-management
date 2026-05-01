import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  Shift,
  ShiftListParams,
  OpenShiftPayload,
  CloseShiftPayload,
} from "./shifts.types";

// ─── Current open shift ───────────────────────────────────────────────────────

export function useCurrentShiftQuery(options?: Partial<UseQueryOptions<Shift | null>>) {
  return useQuery<Shift | null>({
    queryKey: QUERY_KEYS.shifts.current,
    queryFn: () => get<Shift | null>(TENANT_API.shifts.current),
    ...options,
  });
}

// ─── List ─────────────────────────────────────────────────────────────────────

export function useShiftsQuery(
  params?: ShiftListParams,
  options?: Partial<UseQueryOptions<Shift[]>>,
) {
  return useQuery<Shift[]>({
    queryKey: QUERY_KEYS.shifts.list(params),
    queryFn: () => get<Shift[]>(TENANT_API.shifts.list, { params }),
    ...options,
  });
}

// ─── Detail ───────────────────────────────────────────────────────────────────

export function useShiftQuery(
  id: string,
  options?: Partial<UseQueryOptions<Shift>>,
) {
  return useQuery<Shift>({
    queryKey: QUERY_KEYS.shifts.detail(id),
    queryFn: () => get<Shift>(TENANT_API.shifts.get(id)),
    enabled: !!id,
    ...options,
  });
}

// ─── Open shift ───────────────────────────────────────────────────────────────

export function useOpenShiftMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OpenShiftPayload) => {
      // Inject idempotency fields if the caller hasn't provided them
      const enriched: OpenShiftPayload = {
        externalId:      payload.externalId      ?? crypto.randomUUID(),
        clientCreatedAt: payload.clientCreatedAt ?? new Date().toISOString(),
        ...payload,
      };
      return post<Shift>(TENANT_API.shifts.open, enriched);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.shifts.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.shifts.current });
    },
  });
}

// ─── Close shift ──────────────────────────────────────────────────────────────

export function useCloseShiftMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: CloseShiftPayload & { id: string }) =>
      post<Shift>(TENANT_API.shifts.close(id), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.shifts.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.shifts.current });
    },
  });
}
