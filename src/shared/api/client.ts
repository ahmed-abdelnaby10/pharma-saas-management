import axios, {
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
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
import useSubscription from "@/shared/store/useSubscription";

/** Generate a random UUID v4 (works in both browser and Node/Tauri). */
function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: manual v4 UUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const MUTATING_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

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

    // Always force API locale to the app language ("en" | "ar"),
    // overriding browser-provided language negotiation lists.
    setHeader(requestConfig, "Accept-Language", getStoredLanguage());

    if (method && MUTATING_METHODS.has(method)) {
      setHeader(requestConfig, "Idempotency-Key", generateIdempotencyKey());
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
    const status: number | undefined = error.response?.status;

    // ── 401: try token refresh once, then reject ─────────────────────────────
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicRequest(originalRequest)
    ) {
      originalRequest._retry = true;
      const nextAccessToken = await refreshAccessToken();
      if (!nextAccessToken) return Promise.reject(error);
      setHeader(originalRequest, "Authorization", `Bearer ${nextAccessToken}`);
      return apiClient(originalRequest);
    }

    // ── 402: subscription expired / trial ended → set global blocked flag ────
    if (status === 402) {
      const reason: string | undefined =
        error.response?.data?.code ?? error.response?.data?.reason;
      useSubscription.getState().setSubscriptionBlocked(reason);
      return Promise.reject(error);
    }

    // ── 4xx (except 401 / 402): surface backend message via toast ────────────
    if (status && status >= 400 && status < 500 && status !== 401) {
      const message: string | undefined =
        error.response?.data?.message ?? error.response?.data?.error;
      if (message) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  },
);
