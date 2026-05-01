import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post } from "@/shared/api/request";
import { apiClient } from "@/shared/api/client";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  OcrDocument,
  OcrDocumentListParams,
  UploadOcrDocumentPayload,
  ReviewOcrDocumentPayload,
} from "./ocr.types";

// ─── Document list ────────────────────────────────────────────────────────────

export function useOcrDocumentsQuery(
  params?: OcrDocumentListParams,
  options?: Partial<UseQueryOptions<OcrDocument[]>>,
) {
  return useQuery<OcrDocument[]>({
    queryKey: QUERY_KEYS.ocr.list(params),
    queryFn: () => get<OcrDocument[]>(TENANT_API.ocr.documents, { params }),
    ...options,
  });
}

// ─── Document detail (with auto-poll while PROCESSING) ───────────────────────

export function useOcrDocumentQuery(
  id: string,
  options?: Partial<UseQueryOptions<OcrDocument>>,
) {
  return useQuery<OcrDocument>({
    queryKey: QUERY_KEYS.ocr.detail(id),
    queryFn: () => get<OcrDocument>(TENANT_API.ocr.get(id)),
    enabled: !!id,
    refetchInterval: (query) => {
      const doc = query.state.data;
      return doc?.status === "PROCESSING" ? 5_000 : false;
    },
    ...options,
  });
}

// ─── Upload document ──────────────────────────────────────────────────────────

export function useUploadOcrDocumentMutation() {
  const qc = useQueryClient();
  return useMutation<OcrDocument, Error, UploadOcrDocumentPayload>({
    mutationFn: async ({ file, documentType, branchId }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);
      formData.append("branchId", branchId);

      const response = await apiClient.post<{ data: OcrDocument }>(
        TENANT_API.ocr.documents,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return (response.data as any)?.data ?? response.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ocr.all });
    },
  });
}

// ─── Trigger processing ───────────────────────────────────────────────────────

export function useTriggerOcrMutation() {
  const qc = useQueryClient();
  return useMutation<OcrDocument, Error, string>({
    mutationFn: (id) => post<OcrDocument>(TENANT_API.ocr.process(id)),
    onSuccess: (doc) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ocr.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ocr.detail(doc.id) });
    },
  });
}

// ─── Review (submit corrected data) ──────────────────────────────────────────

export function useReviewOcrDocumentMutation() {
  const qc = useQueryClient();
  return useMutation<
    OcrDocument,
    Error,
    { id: string; payload: ReviewOcrDocumentPayload }
  >({
    mutationFn: ({ id, payload }) =>
      post<OcrDocument, ReviewOcrDocumentPayload>(TENANT_API.ocr.review(id), payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ocr.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ocr.detail(id) });
    },
  });
}
