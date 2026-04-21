import { createBrowserRouter, Navigate, redirect } from 'react-router';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { PublicLayout } from './components/layouts/PublicLayout';
import { AdminLayout } from './components/layouts/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { POSPage } from './pages/POSPage';
import { MedicinesPage } from './pages/MedicinesPage';
import { AddMedicinePage } from './pages/AddMedicinePage';
import { CosmeticsPage } from './pages/CosmeticsPage';
import { AddCosmeticPage } from './pages/AddCosmeticPage';
import { InventoryPage } from './pages/InventoryPage';
import { PurchasingPage } from './pages/PurchasingPage';
import { ShiftsPage } from './pages/ShiftsPage';
import { ReportsPage } from './pages/ReportsPage';
import { BranchesPage } from './pages/BranchesPage';
import { UsersPage } from './pages/UsersPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LowStockReportPage } from './pages/LowStockReportPage';
import { ExpiryReportPage } from './pages/ExpiryReportPage';
import { SalesReportPage } from './pages/SalesReportPage';
import { ProfitReportPage } from './pages/ProfitReportPage';

// Admin Pages
import { PlatformDashboardPage } from './pages/admin/PlatformDashboardPage';
import { TenantsPage } from './pages/admin/TenantsPage';
import { TenantDetailsPage } from './pages/admin/TenantDetailsPage';
import { SubscriptionsPage } from './pages/admin/SubscriptionsPage';
import { PlansPage } from './pages/admin/PlansPage';
import { InvoicesPage } from './pages/admin/InvoicesPage';
import { FeatureOverridesPage } from './pages/admin/FeatureOverridesPage';
import { UsageLimitsPage } from './pages/admin/UsageLimitsPage';
import { SupportPage } from './pages/admin/SupportPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { SystemMetricsPage } from './pages/admin/SystemMetricsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { PricingPage } from './pages/public/PricingPage';
import { DownloadPage } from './pages/public/DownloadPage';
import { SignupPage } from './pages/public/SignupPage';
import { ContactPage } from './pages/public/ContactPage';

export const router = createBrowserRouter([
  // Public Website Routes
  {
    path: '/',
    Component: PublicLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'home',
        Component: HomePage,
      },
      {
        path: 'features',
        Component: FeaturesPage,
      },
      {
        path: 'pricing',
        Component: PricingPage,
      },
      {
        path: 'download',
        Component: DownloadPage,
      },
      {
        path: 'contact',
        Component: ContactPage,
      },
    ],
  },
  // Auth Routes (no layout)
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
  },
  // Legacy Route Redirects (for old URLs without /app prefix)
  {
    path: '/reports/sales',
    loader: () => redirect('/app/reports/sales'),
  },
  {
    path: '/reports/profit',
    loader: () => redirect('/app/reports/profit'),
  },
  {
    path: '/reports/low-stock',
    loader: () => redirect('/app/reports/low-stock'),
  },
  {
    path: '/reports/expiry',
    loader: () => redirect('/app/reports/expiry'),
  },
  {
    path: '/reports',
    loader: () => redirect('/app/reports'),
  },
  {
    path: '/medicines',
    loader: () => redirect('/app/medicines'),
  },
  {
    path: '/cosmetics',
    loader: () => redirect('/app/cosmetics'),
  },
  {
    path: '/inventory',
    loader: () => redirect('/app/inventory'),
  },
  {
    path: '/purchasing',
    loader: () => redirect('/app/purchasing'),
  },
  {
    path: '/pos',
    loader: () => redirect('/app/pos'),
  },
  {
    path: '/shifts',
    loader: () => redirect('/app/shifts'),
  },
  {
    path: '/branches',
    loader: () => redirect('/app/branches'),
  },
  {
    path: '/users',
    loader: () => redirect('/app/users'),
  },
  {
    path: '/subscription',
    loader: () => redirect('/app/subscription'),
  },
  {
    path: '/settings',
    loader: () => redirect('/app/settings'),
  },
  {
    path: '/profile',
    loader: () => redirect('/app/profile'),
  },
  // Authenticated App Routes
  {
    path: '/app',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: 'pos',
        Component: POSPage,
      },
      {
        path: 'medicines',
        Component: MedicinesPage,
      },
      {
        path: 'medicines/add',
        Component: AddMedicinePage,
      },
      {
        path: 'medicines/edit/:id',
        Component: AddMedicinePage,
      },
      {
        path: 'cosmetics',
        Component: CosmeticsPage,
      },
      {
        path: 'cosmetics/add',
        Component: AddCosmeticPage,
      },
      {
        path: 'cosmetics/edit/:id',
        Component: AddCosmeticPage,
      },
      {
        path: 'inventory',
        Component: InventoryPage,
      },
      {
        path: 'purchasing',
        Component: PurchasingPage,
      },
      {
        path: 'shifts',
        Component: ShiftsPage,
      },
      {
        path: 'reports',
        Component: ReportsPage,
      },
      {
        path: 'reports/low-stock',
        Component: LowStockReportPage,
      },
      {
        path: 'reports/expiry',
        Component: ExpiryReportPage,
      },
      {
        path: 'reports/sales',
        Component: SalesReportPage,
      },
      {
        path: 'reports/profit',
        Component: ProfitReportPage,
      },
      {
        path: 'branches',
        Component: BranchesPage,
      },
      {
        path: 'users',
        Component: UsersPage,
      },
      {
        path: 'subscription',
        Component: SubscriptionPage,
      },
      {
        path: 'settings',
        Component: SettingsPage,
      },
      {
        path: 'profile',
        Component: ProfilePage,
      },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: PlatformDashboardPage,
      },
      {
        path: 'tenants',
        Component: TenantsPage,
      },
      {
        path: 'tenants/:id',
        Component: TenantDetailsPage,
      },
      {
        path: 'subscriptions',
        Component: SubscriptionsPage,
      },
      {
        path: 'plans',
        Component: PlansPage,
      },
      {
        path: 'invoices',
        Component: InvoicesPage,
      },
      {
        path: 'feature-overrides',
        Component: FeatureOverridesPage,
      },
      {
        path: 'usage-limits',
        Component: UsageLimitsPage,
      },
      {
        path: 'support',
        Component: SupportPage,
      },
      {
        path: 'audit-logs',
        Component: AuditLogsPage,
      },
      {
        path: 'system-metrics',
        Component: SystemMetricsPage,
      },
      {
        path: 'settings',
        Component: AdminSettingsPage,
      },
    ],
  },
]);