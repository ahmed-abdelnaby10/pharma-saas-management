import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  FileText,
  Shield,
  TrendingUp,
  LifeBuoy,
  FileSearch,
  Activity,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  BookOpen,
  UserPlus,
} from 'lucide-react';

const navigationItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { key: 'tenants', label: 'Tenants', icon: Users, path: '/admin/tenants' },
  { key: 'signup-requests', label: 'Signup Requests', icon: UserPlus, path: '/admin/signup-requests' },
  { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
  { key: 'plans', label: 'Plans', icon: Package, path: '/admin/plans' },
  { key: 'catalog', label: 'Product Catalog', icon: BookOpen, path: '/admin/catalog' },
  { key: 'invoices', label: 'Invoices', icon: FileText, path: '/admin/invoices' },
  { key: 'features', label: 'Feature Overrides', icon: Shield, path: '/admin/feature-overrides' },
  { key: 'usage', label: 'Usage & Limits', icon: TrendingUp, path: '/admin/usage-limits' },
  { key: 'support', label: 'Support', icon: LifeBuoy, path: '/admin/support' },
  { key: 'audit', label: 'Audit Logs', icon: FileSearch, path: '/admin/audit-logs' },
  { key: 'metrics', label: 'System Metrics', icon: Activity, path: '/admin/system-metrics' },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PS</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">PharmaSaaS</h1>
                <p className="text-xs text-gray-500">Platform Admin</p>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants, invoices..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-teal-700">AU</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col z-20">
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-white flex flex-col z-50">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PS</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">PharmaSaaS</h1>
                  <p className="text-xs text-gray-500">Platform Admin</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    end={item.path === '/admin'}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-64">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}