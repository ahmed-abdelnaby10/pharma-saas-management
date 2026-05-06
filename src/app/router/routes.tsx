/**
 * Route definitions grouped by platform scope.
 *
 * web-router.ts  — uses all groups
 * desktop-router.ts — uses loginRoute + clientRoute only
 *
 * Never import platform detection here; this file is pure route data.
 */

import { redirect } from "react-router";
import type { RouteObject } from "react-router";
import { isAuthenticated } from "@/shared/services/auth";

import { DashboardLayout } from "@/app/components/layouts/DashboardLayout";
import { PublicLayout } from "@/app/components/layouts/PublicLayout";
import { AdminLayout } from "@/app/components/layouts/AdminLayout";

import { LoginPage } from "@/features/client/auth/pages/LoginPage";
import { DashboardPage } from "@/features/client/dashboard/pages/DashboardPage";
import { POSPage } from "@/features/client/pos/pages/POSPage";
import { MedicinesPage } from "@/features/client/medicines/pages/MedicinesPage";
import { AddMedicinePage } from "@/features/client/medicines/pages/AddMedicinePage";
import { CosmeticsPage } from "@/features/client/cosmetics/pages/CosmeticsPage";
import { AddCosmeticPage } from "@/features/client/cosmetics/pages/AddCosmeticPage";
import { InventoryPage } from "@/features/client/inventory/pages/InventoryPage";
import { PurchasingPage } from "@/features/client/purchasing/pages/PurchasingPage";
import { ShiftsPage } from "@/features/client/shifts/pages/ShiftsPage";
import { ReportsPage } from "@/features/client/reports/pages/ReportsPage";
import { BranchesPage } from "@/features/client/branches/pages/BranchesPage";
import { UsersPage } from "@/features/client/users/pages/UsersPage";
import { SubscriptionPage } from "@/features/client/subscription/pages/SubscriptionPage";
import { SettingsPage } from "@/features/client/settings/pages/SettingsPage";
import { ProfilePage } from "@/features/client/auth/pages/ProfilePage";
import { LowStockReportPage } from "@/features/client/reports/pages/LowStockReportPage";
import { ExpiryReportPage } from "@/features/client/reports/pages/ExpiryReportPage";
import { SalesReportPage } from "@/features/client/reports/pages/SalesReportPage";
import { ProfitReportPage } from "@/features/client/reports/pages/ProfitReportPage";
import { PatientsPage } from "@/features/client/patients/pages/PatientsPage";
import { PrescriptionsPage } from "@/features/client/prescriptions/pages/PrescriptionsPage";
import { OcrPage } from "@/features/client/ocr/pages/OcrPage";
import { SupportPage } from "@/features/client/support/pages/SupportPage";
import { SaleHistoryPage } from "@/features/client/pos/pages/SaleHistoryPage";
import { SaleDetailPage } from "@/features/client/pos/pages/SaleDetailPage";

import { PlatformDashboardPage } from "@/features/admin/dashboard/pages/PlatformDashboardPage";
import { TenantsPage } from "@/features/admin/tenants/pages/TenantsPage";
import { TenantDetailsPage } from "@/features/admin/tenants/pages/TenantDetailsPage";
import { SubscriptionsPage } from "@/features/admin/subscriptions/pages/SubscriptionsPage";
import { PlansPage } from "@/features/admin/plans/pages/PlansPage";
import { InvoicesPage } from "@/features/admin/invoices/pages/InvoicesPage";
import { FeatureOverridesPage } from "@/features/admin/features-overrides/pages/FeatureOverridesPage";
import { UsageLimitsPage } from "@/features/admin/usage-limits/pages/UsageLimitsPage";
import { SupportPage as AdminSupportPage } from "@/features/admin/supprort/pages/SupportPage";
import { CatalogPage } from "@/features/admin/catalog/pages/CatalogPage";
import { AuditLogsPage } from "@/features/admin/logs/pages/AuditLogsPage";
import { SystemMetricsPage } from "@/features/admin/system-metrics/pages/SystemMetricsPage";
import { AdminSettingsPage } from "@/features/admin/settings/pages/AdminSettingsPage";

import { HomePage } from "@/features/public/home/pages/HomePage";
import { FeaturesPage } from "@/features/public/features/pages/FeaturesPage";
import { PricingPage } from "@/features/public/pricing/pages/PricingPage";
import { DownloadPage } from "@/features/public/download/pages/DownloadPage";
import { SignupPage } from "@/features/public/auth/pages/SignupPage";
import { SignupSuccessPage } from "@/features/public/auth/pages/SignupSuccessPage";
import { SignupRequestsPage } from "@/features/admin/signup-requests/pages/SignupRequestsPage";
import { ContactPage } from "@/features/public/contact/pages/ContactPage";

// ---------------------------------------------------------------------------
// Web-only: public marketing website
// ---------------------------------------------------------------------------
export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "home", Component: HomePage },
      { path: "features", Component: FeaturesPage },
      { path: "pricing", Component: PricingPage },
      { path: "download", Component: DownloadPage },
      { path: "contact", Component: ContactPage },
    ],
  },
];

// ---------------------------------------------------------------------------
// Shared: login (both web and desktop)
// ---------------------------------------------------------------------------
export const loginRoute: RouteObject = {
  path: "/login",
  Component: LoginPage,
};

// ---------------------------------------------------------------------------
// Web-only: signup (registration happens on the web, not inside the desktop app)
// ---------------------------------------------------------------------------
export const signupRoute: RouteObject = {
  path: "/signup",
  children: [
    { index: true, Component: SignupPage },
    { path: "success", Component: SignupSuccessPage },
  ],
};

// ---------------------------------------------------------------------------
// Web-only: legacy redirects keeping old bookmarked URLs alive
// ---------------------------------------------------------------------------
export const legacyRedirects: RouteObject[] = [
  { path: "/reports/sales",     loader: () => redirect("/app/reports/sales") },
  { path: "/reports/profit",    loader: () => redirect("/app/reports/profit") },
  { path: "/reports/low-stock", loader: () => redirect("/app/reports/low-stock") },
  { path: "/reports/expiry",    loader: () => redirect("/app/reports/expiry") },
  { path: "/reports",           loader: () => redirect("/app/reports") },
  { path: "/medicines",         loader: () => redirect("/app/medicines") },
  { path: "/cosmetics",         loader: () => redirect("/app/cosmetics") },
  { path: "/inventory",         loader: () => redirect("/app/inventory") },
  { path: "/purchasing",        loader: () => redirect("/app/purchasing") },
  { path: "/pos",               loader: () => redirect("/app/pos") },
  { path: "/shifts",            loader: () => redirect("/app/shifts") },
  { path: "/branches",          loader: () => redirect("/app/branches") },
  { path: "/users",             loader: () => redirect("/app/users") },
  { path: "/subscription",      loader: () => redirect("/app/subscription") },
  { path: "/settings",          loader: () => redirect("/app/settings") },
  { path: "/profile",           loader: () => redirect("/app/profile") },
];

// ---------------------------------------------------------------------------
// Shared: authenticated client/tenant application — /app/*
// ---------------------------------------------------------------------------
export const clientRoute: RouteObject = {
  path: "/app",
  Component: DashboardLayout,
  children: [
    { index: true,                    Component: DashboardPage },
    { path: "pos",                    Component: POSPage },
    { path: "medicines",              Component: MedicinesPage },
    { path: "medicines/add",          Component: AddMedicinePage },
    { path: "medicines/edit/:id",     Component: AddMedicinePage },
    { path: "cosmetics",              Component: CosmeticsPage },
    { path: "cosmetics/add",          Component: AddCosmeticPage },
    { path: "cosmetics/edit/:id",     Component: AddCosmeticPage },
    { path: "inventory",              Component: InventoryPage },
    { path: "purchasing",             Component: PurchasingPage },
    { path: "shifts",                 Component: ShiftsPage },
    { path: "reports",                Component: ReportsPage },
    { path: "reports/low-stock",      Component: LowStockReportPage },
    { path: "reports/expiry",         Component: ExpiryReportPage },
    { path: "reports/sales",          Component: SalesReportPage },
    { path: "reports/profit",         Component: ProfitReportPage },
    { path: "branches",               Component: BranchesPage },
    { path: "users",                  Component: UsersPage },
    { path: "subscription",           Component: SubscriptionPage },
    { path: "settings",               Component: SettingsPage },
    { path: "profile",                Component: ProfilePage },
    { path: "patients",               Component: PatientsPage },
    { path: "prescriptions",          Component: PrescriptionsPage },
    { path: "ocr",                    Component: OcrPage },
    { path: "sales/history",           Component: SaleHistoryPage },
    { path: "sales/history/:saleId",   Component: SaleDetailPage },
    { path: "support",                 Component: SupportPage },
  ],
};

// ---------------------------------------------------------------------------
// Web-only: SaaS platform backoffice — not for pharmacy operators on desktop
// ---------------------------------------------------------------------------
export const adminRoute: RouteObject = {
  path: "/admin",
  loader: () => {
    if (!isAuthenticated()) {
      return redirect("/login?mode=admin");
    }
    return null;
  },
  Component: AdminLayout,
  children: [
    { index: true,                Component: PlatformDashboardPage },
    { path: "tenants",            Component: TenantsPage },
    { path: "tenants/:id",        Component: TenantDetailsPage },
    { path: "subscriptions",      Component: SubscriptionsPage },
    { path: "plans",              Component: PlansPage },
    { path: "invoices",           Component: InvoicesPage },
    { path: "feature-overrides",  Component: FeatureOverridesPage },
    { path: "usage-limits",       Component: UsageLimitsPage },
    { path: "support",            Component: AdminSupportPage },
    { path: "audit-logs",         Component: AuditLogsPage },
    { path: "catalog",            Component: CatalogPage },
    { path: "system-metrics",     Component: SystemMetricsPage },
    { path: "settings",           Component: AdminSettingsPage },
    { path: "signup-requests",    Component: SignupRequestsPage },
  ],
};
