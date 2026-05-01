import { createMemoryRouter } from "react-router";
import { isAuthenticated } from "@/shared/services/auth";
import { loginRoute, clientRoute } from "./routes";

/**
 * Desktop router — auth + client routes only.
 *
 * Uses createMemoryRouter so the initial location is controlled explicitly
 * rather than inherited from the Tauri webview URL.
 *
 * Excluded intentionally:
 *   - publicRoutes  — marketing website, not relevant in the desktop app
 *   - signupRoute   — tenant registration happens on the web
 *   - legacyRedirects — no bookmarked URLs in a native window
 *   - adminRoute    — SaaS platform backoffice, not for pharmacy operators
 */
const initialEntry = isAuthenticated() ? "/app" : "/login";

export const desktopRouter = createMemoryRouter(
  [loginRoute, clientRoute],
  { initialEntries: [initialEntry] },
);
