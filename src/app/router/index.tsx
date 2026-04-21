import { createBrowserRouter, Navigate, redirect } from "react-router";
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

// Admin Pages
import { PlatformDashboardPage } from "@/features/admin/dashboard/pages/PlatformDashboardPage";
import { TenantsPage } from "@/features/admin/tenants/pages/TenantsPage";
import { TenantDetailsPage } from "@/features/admin/tenants/pages/TenantDetailsPage";
import { SubscriptionsPage } from "@/features/admin/subscriptions/pages/SubscriptionsPage";
import { PlansPage } from "@/features/admin/plans/pages/PlansPage";
import { InvoicesPage } from "@/features/admin/invoices/pages/InvoicesPage";
import { FeatureOverridesPage } from "@/features/admin/features-overrides/pages/FeatureOverridesPage";
import { UsageLimitsPage } from "@/features/admin/usage-limits/pages/UsageLimitsPage";
import { SupportPage } from "@/features/admin/supprort/pages/SupportPage";
import { AuditLogsPage } from "@/features/admin/logs/pages/AuditLogsPage";
import { SystemMetricsPage } from "@/features/admin/system-metrics/pages/SystemMetricsPage";
import { AdminSettingsPage } from "@/features/admin/settings/pages/AdminSettingsPage";

// Public Pages
import { HomePage } from "@/features/public/home/pages/HomePage";
import { FeaturesPage } from "@/features/public/features/pages/FeaturesPage";
import { PricingPage } from "@/features/public/pricing/pages/PricingPage";
import { DownloadPage } from "@/features/public/download/pages/DownloadPage";
import { SignupPage } from "@/features/public/auth/pages/SignupPage";
import { ContactPage } from "@/features/public/contact/pages/ContactPage";

export const router = createBrowserRouter([
  // Public Website Routes
  {
    path: "/",
    Component: PublicLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "home",
        Component: HomePage,
      },
      {
        path: "features",
        Component: FeaturesPage,
      },
      {
        path: "pricing",
        Component: PricingPage,
      },
      {
        path: "download",
        Component: DownloadPage,
      },
      {
        path: "contact",
        Component: ContactPage,
      },
    ],
  },
  // Auth Routes (no layout)
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  // Legacy Route Redirects (for old URLs without /app prefix)
  {
    path: "/reports/sales",
    loader: () => redirect("/app/reports/sales"),
  },
  {
    path: "/reports/profit",
    loader: () => redirect("/app/reports/profit"),
  },
  {
    path: "/reports/low-stock",
    loader: () => redirect("/app/reports/low-stock"),
  },
  {
    path: "/reports/expiry",
    loader: () => redirect("/app/reports/expiry"),
  },
  {
    path: "/reports",
    loader: () => redirect("/app/reports"),
  },
  {
    path: "/medicines",
    loader: () => redirect("/app/medicines"),
  },
  {
    path: "/cosmetics",
    loader: () => redirect("/app/cosmetics"),
  },
  {
    path: "/inventory",
    loader: () => redirect("/app/inventory"),
  },
  {
    path: "/purchasing",
    loader: () => redirect("/app/purchasing"),
  },
  {
    path: "/pos",
    loader: () => redirect("/app/pos"),
  },
  {
    path: "/shifts",
    loader: () => redirect("/app/shifts"),
  },
  {
    path: "/branches",
    loader: () => redirect("/app/branches"),
  },
  {
    path: "/users",
    loader: () => redirect("/app/users"),
  },
  {
    path: "/subscription",
    loader: () => redirect("/app/subscription"),
  },
  {
    path: "/settings",
    loader: () => redirect("/app/settings"),
  },
  {
    path: "/profile",
    loader: () => redirect("/app/profile"),
  },
  // Authenticated App Routes
  {
    path: "/app",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: "pos",
        Component: POSPage,
      },
      {
        path: "medicines",
        Component: MedicinesPage,
      },
      {
        path: "medicines/add",
        Component: AddMedicinePage,
      },
      {
        path: "medicines/edit/:id",
        Component: AddMedicinePage,
      },
      {
        path: "cosmetics",
        Component: CosmeticsPage,
      },
      {
        path: "cosmetics/add",
        Component: AddCosmeticPage,
      },
      {
        path: "cosmetics/edit/:id",
        Component: AddCosmeticPage,
      },
      {
        path: "inventory",
        Component: InventoryPage,
      },
      {
        path: "purchasing",
        Component: PurchasingPage,
      },
      {
        path: "shifts",
        Component: ShiftsPage,
      },
      {
        path: "reports",
        Component: ReportsPage,
      },
      {
        path: "reports/low-stock",
        Component: LowStockReportPage,
      },
      {
        path: "reports/expiry",
        Component: ExpiryReportPage,
      },
      {
        path: "reports/sales",
        Component: SalesReportPage,
      },
      {
        path: "reports/profit",
        Component: ProfitReportPage,
      },
      {
        path: "branches",
        Component: BranchesPage,
      },
      {
        path: "users",
        Component: UsersPage,
      },
      {
        path: "subscription",
        Component: SubscriptionPage,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
      {
        path: "profile",
        Component: ProfilePage,
      },
    ],
  },
  // Admin Routes
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: PlatformDashboardPage,
      },
      {
        path: "tenants",
        Component: TenantsPage,
      },
      {
        path: "tenants/:id",
        Component: TenantDetailsPage,
      },
      {
        path: "subscriptions",
        Component: SubscriptionsPage,
      },
      {
        path: "plans",
        Component: PlansPage,
      },
      {
        path: "invoices",
        Component: InvoicesPage,
      },
      {
        path: "feature-overrides",
        Component: FeatureOverridesPage,
      },
      {
        path: "usage-limits",
        Component: UsageLimitsPage,
      },
      {
        path: "support",
        Component: SupportPage,
      },
      {
        path: "audit-logs",
        Component: AuditLogsPage,
      },
      {
        path: "system-metrics",
        Component: SystemMetricsPage,
      },
      {
        path: "settings",
        Component: AdminSettingsPage,
      },
    ],
  },
]);
