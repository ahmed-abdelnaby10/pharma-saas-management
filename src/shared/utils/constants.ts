export const ACCESS_TOKEN_KEY = "pharmacy-access-token";
export const REFRESH_TOKEN_KEY = "pharmacy-refresh-token";
export const ACCESS_TOKEN_EXPIRES_AT_KEY = "pharmacy-access-token-exp";
export const REFRESH_TOKEN_EXPIRES_AT_KEY = "pharmacy-refresh-token-exp";
export const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const USER_KEY = "pharmacy-user";
/** Persisted admin-only branch filter for API query `branchId` (org-wide admin; not used for branch-locked roles). */
export const PAGE_SIZE = 12;

export const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "/api";
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export const API_ENDPOINTS = {
  refresh: "/auth/refresh",
};

export const QUERY_KEYS = {
  //Query keys will be written here
};

export function queryKeyHasLocaleScope(queryKey: unknown): boolean {
  if (!Array.isArray(queryKey)) return false;
  return queryKey.some(
    (part) =>
      part !== null &&
      typeof part === "object" &&
      "locale" in (part as Record<string, unknown>),
  );
}
