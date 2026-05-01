import { isDesktop } from "@/desktop";
import { webRouter } from "./web-router";
import { desktopRouter } from "./desktop-router";

/**
 * Active router, chosen once at startup based on platform.
 *
 * web     → createBrowserRouter — public + auth + client + admin
 * desktop → createMemoryRouter  — auth + client only, entry at /login or /app
 */
export const router = isDesktop() ? desktopRouter : webRouter;
