import { apiClient } from "@/shared/api/client";
import {
  type AppRequestConfig,
  unwrapResponseData,
} from "@/shared/api/types";

export async function get<T = unknown>(
  endpoint: string,
  config?: AppRequestConfig,
) {
  const response = await apiClient.get<T>(endpoint, config);
  return unwrapResponseData(response);
}

export async function post<T = unknown, TVariables = unknown>(
  endpoint: string,
  body?: TVariables,
  config?: AppRequestConfig<TVariables>,
) {
  const response = await apiClient.post<T>(endpoint, body, config);
  return unwrapResponseData(response);
}

export async function put<T = unknown, TVariables = unknown>(
  endpoint: string,
  body?: TVariables,
  config?: AppRequestConfig<TVariables>,
) {
  const response = await apiClient.put<T>(endpoint, body, config);
  return unwrapResponseData(response);
}

export async function patch<T = unknown, TVariables = unknown>(
  endpoint: string,
  body?: TVariables,
  config?: AppRequestConfig<TVariables>,
) {
  const response = await apiClient.patch<T>(endpoint, body, config);
  return unwrapResponseData(response);
}

export async function remove<T = unknown>(
  endpoint: string,
  config?: AppRequestConfig,
) {
  const response = await apiClient.delete<T>(endpoint, config);
  return unwrapResponseData(response);
}

export const edit = put;
