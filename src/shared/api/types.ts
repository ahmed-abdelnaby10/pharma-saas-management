import type { AxiosRequestConfig, AxiosResponse } from "axios";

export type RequestVisibility = "public" | "private";

export interface AppRequestMeta {
  visibility?: RequestVisibility;
}

export interface AppRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  meta?: AppRequestMeta;
}

export interface RetryableAppRequestConfig<D = unknown>
  extends AppRequestConfig<D> {
  _retry?: boolean;
}

// Backend response envelope
// { success: boolean, message: string, data: T, meta?: ApiMeta, requestId?: string }
export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
  requestId?: string;
}

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data: T;
  meta?: ApiMeta;
  requestId?: string;
};

export function unwrapResponseData<T>(
  response: AxiosResponse<T | ApiEnvelope<T>>,
): T {
  const payload = response.data;

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
}

/**
 * Unwrap a paginated response — returns both the data array and the meta object.
 * Use this when you need the pagination meta (total, page, totalPages, limit).
 */
export function unwrapPaginatedResponse<T>(
  response: AxiosResponse<ApiEnvelope<T[]>>,
): { data: T[]; meta: ApiMeta | undefined } {
  const payload = response.data;

  if (payload && typeof payload === "object" && "data" in payload) {
    return {
      data: (payload as ApiEnvelope<T[]>).data ?? [],
      meta: (payload as ApiEnvelope<T[]>).meta,
    };
  }

  return { data: payload as unknown as T[], meta: undefined };
}
