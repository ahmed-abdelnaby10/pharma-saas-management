import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post, patch, remove } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  Prescription,
  PrescriptionListParams,
  CreatePrescriptionPayload,
  UpdatePrescriptionPayload,
  DispensePrescriptionPayload,
} from "./prescriptions.types";

// ─── List ─────────────────────────────────────────────────────────────────────

export function usePrescriptionsQuery(
  params?: PrescriptionListParams,
  options?: Partial<UseQueryOptions<Prescription[]>>,
) {
  return useQuery<Prescription[]>({
    queryKey: QUERY_KEYS.prescriptions.list(params),
    queryFn: () =>
      get<Prescription[]>(TENANT_API.prescriptions.list, { params }),
    ...options,
  });
}

// ─── Detail ───────────────────────────────────────────────────────────────────

export function usePrescriptionQuery(
  id: string,
  options?: Partial<UseQueryOptions<Prescription>>,
) {
  return useQuery<Prescription>({
    queryKey: QUERY_KEYS.prescriptions.detail(id),
    queryFn: () => get<Prescription>(TENANT_API.prescriptions.get(id)),
    enabled: !!id,
    ...options,
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export function useCreatePrescriptionMutation() {
  const qc = useQueryClient();
  return useMutation<Prescription, Error, CreatePrescriptionPayload>({
    mutationFn: (payload) =>
      post<Prescription, CreatePrescriptionPayload>(
        TENANT_API.prescriptions.create,
        payload,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.prescriptions.all });
    },
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function useUpdatePrescriptionMutation() {
  const qc = useQueryClient();
  return useMutation<
    Prescription,
    Error,
    { id: string; payload: UpdatePrescriptionPayload }
  >({
    mutationFn: ({ id, payload }) =>
      patch<Prescription, UpdatePrescriptionPayload>(
        TENANT_API.prescriptions.update(id),
        payload,
      ),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.prescriptions.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.prescriptions.detail(id) });
    },
  });
}

// ─── Dispense (PENDING → DISPENSED) ──────────────────────────────────────────

export function useDispensePrescriptionMutation() {
  const qc = useQueryClient();
  return useMutation<
    Prescription,
    Error,
    { id: string; payload: DispensePrescriptionPayload }
  >({
    mutationFn: ({ id, payload }) =>
      post<Prescription, DispensePrescriptionPayload>(
        TENANT_API.prescriptions.dispense(id),
        payload,
      ),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.prescriptions.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.prescriptions.detail(id) });
    },
  });
}

// ─── Cancel ───────────────────────────────────────────────────────────────────

export function useCancelPrescriptionMutation() {
  const qc = useQueryClient();
  return useMutation<Prescription, Error, string>({
    mutationFn: (id) =>
      patch<Prescription>(TENANT_API.prescriptions.update(id), {
        status: "CANCELLED",
      } as any),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.prescriptions.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.prescriptions.detail(id) });
    },
  });
}
