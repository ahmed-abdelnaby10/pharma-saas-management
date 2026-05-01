import { createBrowserRouter } from "react-router";
import {
  publicRoutes,
  loginRoute,
  signupRoute,
  legacyRedirects,
  clientRoute,
  adminRoute,
} from "./routes";

/**
 * Web router — all routes, standard browser history.
 * Behaviour is identical to the original single router.
 */
export const webRouter = createBrowserRouter([
  ...publicRoutes,
  loginRoute,
  signupRoute,
  ...legacyRedirects,
  clientRoute,
  adminRoute,
]);
