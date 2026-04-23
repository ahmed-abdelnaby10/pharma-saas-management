import axios, {
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  isAccessExpired,
  refreshAccessToken,
} from "@/shared/services/auth";
import { BASE_URL } from "@/shared/utils/constants";
import { getStoredLanguage } from "@/shared/utils/appSettings";
import type {
  AppRequestConfig,
  RetryableAppRequestConfig,
} from "@/shared/api/types";

const REQUEST_TIMEOUT_MS = 30_000;

function isPublicRequest(config?: AppRequestConfig) {
  return config?.meta?.visibility === "public";
}

function setHeader(
  config: InternalAxiosRequestConfig | RetryableAppRequestConfig,
  key: string,
  value: string,
) {
  if (config.headers instanceof AxiosHeaders) {
    config.headers.set(key, value);
    return;
  }

  config.headers = {
    ...(config.headers ?? {}),
    [key]: value,
  };
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const requestConfig = config as InternalAxiosRequestConfig & AppRequestConfig;
    const method = requestConfig.method?.toUpperCase();

    if (method === "GET") {
      setHeader(requestConfig, "Accept-Language", getStoredLanguage());
    }

    if (isPublicRequest(requestConfig)) {
      return requestConfig;
    }

    let accessToken = getAccessToken();

    if (accessToken && isAccessExpired()) {
      accessToken = await refreshAccessToken();
    }

    if (accessToken) {
      setHeader(requestConfig, "Authorization", `Bearer ${accessToken}`);
    }

    return requestConfig;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableAppRequestConfig | undefined;

    if (
      !originalRequest ||
      originalRequest._retry ||
      isPublicRequest(originalRequest) ||
      error.response?.status !== 401
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const nextAccessToken = await refreshAccessToken();

    if (!nextAccessToken) {
      return Promise.reject(error);
    }

    setHeader(originalRequest, "Authorization", `Bearer ${nextAccessToken}`);

    return apiClient(originalRequest);
  },
);
