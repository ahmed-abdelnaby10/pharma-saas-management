// src/services/auth.ts
import { NavigateFunction } from "react-router";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ACCESS_TOKEN_EXPIRES_AT_KEY,
  USER_KEY,
  TOKEN_TTL_MS,
  TENANT_API,
  PLATFORM_API,
  BASE_URL,
} from "../utils/constants";
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "./cookies";

type RequestLanguage = "en" | "ar";

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
} {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    const exp =
      typeof json?.exp === "number" ? json.exp * 1000 : null;
    const sub = json?.subscription ?? null;
    const subscription: SubscriptionClaimsFromToken | null =
      sub && typeof sub === "object" && typeof sub.id === "string"
        ? {
            id: sub.id,
            status: sub.status ?? "ACTIVE",
            trialEndsAt: sub.trialEndsAt ?? null,
            offlineValidUntil: sub.offlineValidUntil ?? null,
          }
        : null;
    return { exp, subscription };
  } catch {
    return { exp: null, subscription: null };
  }
}

// ---- Getters (from cookies)
export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY);
}
export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY);
}
export function getAccessExp(): number | null {
  const raw = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  return raw ? Number(raw) : null;
}
export function isAccessExpired(leewayMs = 30_000): boolean {
  const exp = getAccessExp();
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

  const { exp, subscription } = decodeAccessToken(accessToken);
  const resolvedExp =
    exp ?? Date.now() + (typeof TOKEN_TTL_MS === "number" ? TOKEN_TTL_MS : 0);

  // 1-day cookie for both tokens
  setCookie(ACCESS_TOKEN_KEY, accessToken, { days: 1 });
  setCookie(REFRESH_TOKEN_KEY, refreshToken, { days: 1 });
  localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(resolvedExp));

  // user stays in localStorage
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Persist subscription claims to global store
  if (subscription) {
    // Lazy import avoids circular dep during initialisation
    import("@/shared/store/useSubscription").then(({ default: useSubscription }) => {
      useSubscription.getState().setClaims({
        id: subscription.id,
        status: subscription.status as any,
        trialEndsAt: subscription.trialEndsAt,
        offlineValidUntil: subscription.offlineValidUntil,
      });
    });
  }

  if (setIsAuthenticated) setIsAuthenticated(true);
  if (navigate) navigate();
}

export async function removeTokens(
  navigate?: NavigateFunction,
  setIsAuthenticated?: (v: boolean) => void,
): Promise<void> {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
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
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshingPromise) {
    refreshingPromise = axios
      .post(
        BASE_URL + TENANT_API.auth.refresh,
        { refreshToken },
        { headers: { "Accept-Language": resolveRequestLanguage() } },
      )
      .then((res) => {
        const root = res.data?.data ?? res.data ?? {};
        const newAccess: string = root.accessToken;
        const newRefresh: string | undefined = root.refreshToken;

        if (!newAccess) throw new Error("No access token in refresh response");

        const exp = decodeJwtExp(newAccess) ?? Date.now() + 5 * 60_000;

        setCookie(ACCESS_TOKEN_KEY, newAccess, { days: 1 });
        if (newRefresh) setCookie(REFRESH_TOKEN_KEY, newRefresh, { days: 1 });
        localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(exp));

        notifyTokensRefreshed();

        return newAccess;
      })
      .catch(() => {
        // Refresh failed → force logout
        removeTokens();
        return null;
      })
      .finally(() => {
        refreshingPromise = null;
      });
  }
  return refreshingPromise;
}

export function isAuthenticated(): boolean {
  const access = getAccessToken();
  if (!access) return false;
  return !isAccessExpired(0);
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
