import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post, patch, remove } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  Patient,
  PatientListParams,
  CreatePatientPayload,
  UpdatePatientPayload,
} from "./patients.types";

// ─── List ─────────────────────────────────────────────────────────────────────

export function usePatientsQuery(
  params?: PatientListParams,
  options?: Partial<UseQueryOptions<Patient[]>>,
) {
  return useQuery<Patient[]>({
    queryKey: QUERY_KEYS.patients.list(params),
    queryFn: () => get<Patient[]>(TENANT_API.patients.list, { params }),
    ...options,
  });
}

// ─── Detail ───────────────────────────────────────────────────────────────────

export function usePatientQuery(
  id: string,
  options?: Partial<UseQueryOptions<Patient>>,
) {
  return useQuery<Patient>({
    queryKey: QUERY_KEYS.patients.detail(id),
    queryFn: () => get<Patient>(TENANT_API.patients.get(id)),
    enabled: !!id,
    ...options,
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

export function useCreatePatientMutation() {
  const qc = useQueryClient();
  return useMutation<Patient, Error, CreatePatientPayload>({
    mutationFn: (payload) =>
      post<Patient, CreatePatientPayload>(TENANT_API.patients.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.patients.all });
    },
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function useUpdatePatientMutation() {
  const qc = useQueryClient();
  return useMutation<Patient, Error, { id: string; payload: UpdatePatientPayload }>({
    mutationFn: ({ id, payload }) =>
      patch<Patient, UpdatePatientPayload>(TENANT_API.patients.update(id), payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.patients.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.patients.detail(id) });
    },
  });
}

// ─── Delete (soft) ────────────────────────────────────────────────────────────

export function useDeletePatientMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => remove<void>(TENANT_API.patients.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.patients.all });
    },
  });
}
