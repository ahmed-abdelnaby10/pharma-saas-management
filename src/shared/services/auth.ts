// src/services/auth.ts
import { NavigateFunction } from "react-router";
import {
  TENANT_ACCESS_TOKEN_KEY,
  TENANT_REFRESH_TOKEN_KEY,
  TENANT_ACCESS_TOKEN_EXPIRES_AT_KEY,
  PLATFORM_ACCESS_TOKEN_KEY,
  PLATFORM_REFRESH_TOKEN_KEY,
  PLATFORM_ACCESS_TOKEN_EXPIRES_AT_KEY,
  AUTH_SCOPE_KEY,
  USER_KEY,
  TOKEN_TTL_MS,
  TENANT_API,
  PLATFORM_API,
  BASE_URL,
} from "../utils/constants";
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "./cookies";
import useSubscription from "@/shared/store/useSubscription";

type RequestLanguage = "en" | "ar";
export type AuthScope = "tenant" | "platform";

function resolveRequestLanguage(): RequestLanguage {
  if (typeof document !== "undefined") {
    const docLang = document.documentElement.lang?.toLowerCase();
    if (docLang === "ar") return "ar";
    if (docLang === "en") return "en";
  }

  try {
    const stored = localStorage.getItem("i18nextLng")?.toLowerCase();
    if (stored?.startsWith("ar")) return "ar";
    if (stored?.startsWith("en")) return "en";
  } catch {
    // Ignore storage read errors.
  }

  return "en";
}

// ---- Small event bus to notify app when tokens refresh (for React Query invalidation)
type Listener = () => void;
const tokenRefreshListeners = new Set<Listener>();
export function onTokensRefreshed(fn: Listener): () => void {
  tokenRefreshListeners.add(fn);
  return () => tokenRefreshListeners.delete(fn);
}
function notifyTokensRefreshed() {
  tokenRefreshListeners.forEach((fn) => {
    try {
      fn();
    } catch (e: any) {
      console.error(e);
    }
  });
}

// ---- Utilities
function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    // JWT exp is in seconds
    return typeof json?.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

export interface SubscriptionClaimsFromToken {
  id: string;
  status: string;
  trialEndsAt?: string | null;
  offlineValidUntil?: string | null;
}

/** Decode a JWT and extract the `subscription` claim if present. */
export function decodeAccessToken(token: string): {
  exp: number | null;
  subscription: SubscriptionClaimsFromToken | null;
  scope: string | null;
} {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    const exp =
      typeof json?.exp === "number" ? json.exp * 1000 : null;
    const sub = json?.subscription ?? null;
    const scope = typeof json?.scope === "string" ? json.scope : null;
    const subscription: SubscriptionClaimsFromToken | null =
      sub && typeof sub === "object" && typeof sub.id === "string"
        ? {
            id: sub.id,
            status: sub.status ?? "ACTIVE",
            trialEndsAt: sub.trialEndsAt ?? null,
            offlineValidUntil: sub.offlineValidUntil ?? null,
          }
        : null;
    return { exp, subscription, scope };
  } catch {
    return { exp: null, subscription: null, scope: null };
  }
}

export function getAccessTokenScope(token: string): string | null {
  return decodeAccessToken(token).scope;
}

function normalizeScope(scope: string | null | undefined): AuthScope | null {
  if (scope === "tenant" || scope === "platform") return scope;
  return null;
}

export function getActiveAuthScope(): AuthScope | null {
  const stored = localStorage.getItem(AUTH_SCOPE_KEY);
  const normalizedStored = normalizeScope(stored);
  if (normalizedStored) return normalizedStored;

  const platformToken = getCookie(PLATFORM_ACCESS_TOKEN_KEY);
  if (platformToken) return "platform";
  const tenantToken = getCookie(TENANT_ACCESS_TOKEN_KEY);
  if (tenantToken) return "tenant";
  // Fallback for sessions where access token expired but refresh token still exists.
  const platformRefresh = getCookie(PLATFORM_REFRESH_TOKEN_KEY);
  if (platformRefresh) return "platform";
  const tenantRefresh = getCookie(TENANT_REFRESH_TOKEN_KEY);
  if (tenantRefresh) return "tenant";
  return null;
}

// ---- Getters (from cookies)
export function getAccessToken(scope?: AuthScope): string | null {
  const resolvedScope = scope ?? getActiveAuthScope();
  if (resolvedScope === "platform") {
    return getCookie(PLATFORM_ACCESS_TOKEN_KEY);
  }
  if (resolvedScope === "tenant") {
    return getCookie(TENANT_ACCESS_TOKEN_KEY);
  }
  return null;
}
export function getRefreshToken(scope?: AuthScope): string | null {
  const resolvedScope = scope ?? getActiveAuthScope();
  if (resolvedScope === "platform") {
    return getCookie(PLATFORM_REFRESH_TOKEN_KEY);
  }
  if (resolvedScope === "tenant") {
    return getCookie(TENANT_REFRESH_TOKEN_KEY);
  }
  return null;
}
export function getAccessExp(scope?: AuthScope): number | null {
  const resolvedScope = scope ?? getActiveAuthScope();
  const key =
    resolvedScope === "platform"
      ? PLATFORM_ACCESS_TOKEN_EXPIRES_AT_KEY
      : resolvedScope === "tenant"
        ? TENANT_ACCESS_TOKEN_EXPIRES_AT_KEY
        : null;
  if (!key) return null;
  const raw = localStorage.getItem(key);
  return raw ? Number(raw) : null;
}
export function isAccessExpired(leewayMs = 30_000, scope?: AuthScope): boolean {
  const exp = getAccessExp(scope);
  if (!exp) return true;
  return Date.now() + leewayMs >= exp;
}

// ---- Setters
export async function storeTokens(params: {
  accessToken: string;
  refreshToken: string;
  user?: any;
  navigate?: () => void;
  setIsAuthenticated?: (v: boolean) => void;
}): Promise<void> {
  const { accessToken, refreshToken, user, navigate, setIsAuthenticated } = params;

  const { exp, subscription, scope } = decodeAccessToken(accessToken);
  const authScope = normalizeScope(scope);
  if (!authScope) {
    throw new Error("Unknown access token scope");
  }
  const resolvedExp =
    exp ?? Date.now() + (typeof TOKEN_TTL_MS === "number" ? TOKEN_TTL_MS : 0);

  const accessTokenKey =
    authScope === "platform" ? PLATFORM_ACCESS_TOKEN_KEY : TENANT_ACCESS_TOKEN_KEY;
  const refreshTokenKey =
    authScope === "platform" ? PLATFORM_REFRESH_TOKEN_KEY : TENANT_REFRESH_TOKEN_KEY;
  const expKey =
    authScope === "platform"
      ? PLATFORM_ACCESS_TOKEN_EXPIRES_AT_KEY
      : TENANT_ACCESS_TOKEN_EXPIRES_AT_KEY;

  // 1-day cookie for both tokens
  setCookie(accessTokenKey, accessToken, { days: 1 });
  setCookie(refreshTokenKey, refreshToken, { days: 1 });
  localStorage.setItem(expKey, String(resolvedExp));
  localStorage.setItem(AUTH_SCOPE_KEY, authScope);

  // user stays in localStorage
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));

  if (subscription) {
    useSubscription.getState().setClaims({
      id: subscription.id,
      status: subscription.status as any,
      trialEndsAt: subscription.trialEndsAt,
      offlineValidUntil: subscription.offlineValidUntil,
    });
  }

  if (setIsAuthenticated) setIsAuthenticated(true);
  if (navigate) navigate();
}

export async function removeTokens(
  navigate?: NavigateFunction,
  setIsAuthenticated?: (v: boolean) => void,
): Promise<void> {
  deleteCookie(TENANT_ACCESS_TOKEN_KEY);
  deleteCookie(TENANT_REFRESH_TOKEN_KEY);
  deleteCookie(PLATFORM_ACCESS_TOKEN_KEY);
  deleteCookie(PLATFORM_REFRESH_TOKEN_KEY);
  localStorage.removeItem(TENANT_ACCESS_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(PLATFORM_ACCESS_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(AUTH_SCOPE_KEY);
  localStorage.removeItem(USER_KEY);

  if (setIsAuthenticated) setIsAuthenticated(false);
  if (navigate) navigate("/login", { replace: true });
}

// ---- Tenant login
export async function tenantLogin(credentials: {
  email: string;
  password: string;
  tenantId: string;
}): Promise<{ accessToken: string; refreshToken: string; user: any }> {
  const res = await axios.post(
    BASE_URL + TENANT_API.auth.login,
    credentials,
    { headers: { "Accept-Language": resolveRequestLanguage() } },
  );

  const root = res.data?.data ?? res.data ?? {};
  const accessToken: string = root.accessToken;
  const refreshToken: string = root.refreshToken;
  const user = root.user ?? null;

  if (!accessToken) throw new Error("No access token in login response");

  return { accessToken, refreshToken, user };
}

// ---- Platform (super-admin) login
export async function platformLogin(credentials: {
  email: string;
  password: string;
}): Promise<{ accessToken: string; refreshToken: string; user: any }> {
  const res = await axios.post(
    BASE_URL + PLATFORM_API.auth.login,
    credentials,
    { headers: { "Accept-Language": resolveRequestLanguage() } },
  );

  const root = res.data?.data ?? res.data ?? {};
  const accessToken: string = root.accessToken;
  const refreshToken: string = root.refreshToken;
  const user = root.user ?? null;

  if (!accessToken) throw new Error("No access token in platform login response");

  return { accessToken, refreshToken, user };
}

// ---- Refresh (de-dup concurrent calls)
let refreshingPromise: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  const scope = getActiveAuthScope();
  if (!scope) return null;
  const refreshToken = getRefreshToken(scope);
  if (!refreshToken) return null;

  if (!refreshingPromise) {
    const refreshRequest =
      scope === "platform"
        ? axios.post(
            BASE_URL + PLATFORM_API.auth.refresh,
            { refreshToken },
            { headers: { "Accept-Language": resolveRequestLanguage() } },
          )
        : axios.post(
            BASE_URL + TENANT_API.auth.deviceRefresh,
            { deviceToken: refreshToken },
            { headers: { "Accept-Language": resolveRequestLanguage() } },
          );

    refreshingPromise = refreshRequest
      .then((res) => {
        const root = res.data?.data ?? res.data ?? {};
        const newAccess: string = root.accessToken;
        const newRefresh: string | undefined = root.refreshToken;

        if (!newAccess) throw new Error("No access token in refresh response");

        const exp = decodeJwtExp(newAccess) ?? Date.now() + 5 * 60_000;

        const accessTokenKey =
          scope === "platform" ? PLATFORM_ACCESS_TOKEN_KEY : TENANT_ACCESS_TOKEN_KEY;
        const refreshTokenKey =
          scope === "platform" ? PLATFORM_REFRESH_TOKEN_KEY : TENANT_REFRESH_TOKEN_KEY;
        const expKey =
          scope === "platform"
            ? PLATFORM_ACCESS_TOKEN_EXPIRES_AT_KEY
            : TENANT_ACCESS_TOKEN_EXPIRES_AT_KEY;

        setCookie(accessTokenKey, newAccess, { days: 1 });
        if (newRefresh) setCookie(refreshTokenKey, newRefresh, { days: 1 });
        localStorage.setItem(expKey, String(exp));
        localStorage.setItem(AUTH_SCOPE_KEY, scope);

        notifyTokensRefreshed();

        return newAccess;
      })
      .catch((err) => {
        // Force logout only when refresh token is truly invalid/forbidden.
        // For transient failures (network, timeout), keep current session state.
        const status = axios.isAxiosError(err) ? err.response?.status : undefined;
        if (status === 401 || status === 403) {
          removeTokens();
        }
        return null;
      })
      .finally(() => {
        refreshingPromise = null;
      });
  }
  return refreshingPromise;
}

export function isAuthenticated(): boolean {
  const scope = getActiveAuthScope();
  if (!scope) return false;
  const access = getAccessToken(scope);
  if (access && !isAccessExpired(0, scope)) return true;
  // Allow app to proceed and let interceptor perform silent refresh.
  return !!getRefreshToken(scope);
}

export function readUserFromStorage(): any | null {
  const raw = localStorage.getItem(USER_KEY);
  try {
    const u = JSON.parse(raw as string);
    return u && typeof u === "object" ? (u as any) : null;
  } catch {
    return null;
  }
}
