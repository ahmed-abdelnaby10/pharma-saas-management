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

type ApiEnvelope<T> = {
  data: T;
};

export function unwrapResponseData<T>(
  response: AxiosResponse<T | ApiEnvelope<T>>,
): T {
  const payload = response.data;

  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}
