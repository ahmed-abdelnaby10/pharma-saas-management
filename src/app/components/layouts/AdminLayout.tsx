import React, { useState } from "react";
import { Outlet, NavLink } from "react-router";
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
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

const navigationItems = [
  {
    key: "dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  { key: "tenants", icon: Users, path: "/admin/tenants" },
  {
    key: "signup-requests",
    icon: UserPlus,
    path: "/admin/signup-requests",
  },
  {
    key: "subscriptions",
    icon: CreditCard,
    path: "/admin/subscriptions",
  },
  { key: "plans", icon: Package, path: "/admin/plans" },
  {
    key: "catalog",
    icon: BookOpen,
    path: "/admin/catalog",
  },
  {
    key: "invoices",
    icon: FileText,
    path: "/admin/invoices",
  },
  {
    key: "features",
    icon: Shield,
    path: "/admin/feature-overrides",
  },
  {
    key: "usage",
    icon: TrendingUp,
    path: "/admin/usage-limits",
  },
  { key: "support", icon: LifeBuoy, path: "/admin/support" },
  {
    key: "audit",
    icon: FileSearch,
    path: "/admin/audit-logs",
  },
  {
    key: "metrics",
    icon: Activity,
    path: "/admin/system-metrics",
  },
  {
    key: "settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive ? "bg-teal-50 text-teal-700" : "text-gray-700 hover:bg-gray-100"
  }`;

/** Shared nav list used in both desktop and mobile sidebars. */
function SidebarNav({
  onNavigate,
  isRtl,
}: {
  onNavigate?: () => void;
  isRtl: boolean;
}) {
  const { t } = useLanguage();

  return (
    <>
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === "/admin"}
              onClick={onNavigate}
              className={navLinkClass}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{t(`adminLayout:navigation.${item.key}`)}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg ${isRtl ? "flex-row-reverse justify-end" : ""}`}
        >
          <LogOut className="w-5 h-5" />
          <span>{t("adminLayout:actions.signOut")}</span>
        </button>
      </div>
    </>
  );
}

export function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";

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
                <span className="text-white font-bold text-sm">
                  {t("adminLayout:branding.logoInitials")}
                </span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {t("adminLayout:branding.productName")}
                </h1>
                <p className="text-xs text-gray-500">
                  {t("adminLayout:branding.platformAdmin")}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search
                className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRtl ? "right-3" : "left-3"}`}
              />
              <input
                type="text"
                placeholder={t("adminLayout:search.placeholder")}
                className={`w-full py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"}`}
              />
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span
                className={`absolute top-1 w-2 h-2 bg-red-500 rounded-full ${isRtl ? "left-1" : "right-1"}`}
              />
            </button>

            <div
              className={`hidden sm:flex items-center gap-3 ${isRtl ? "pr-3 border-r" : "pl-3 border-l"} border-gray-200`}
            >
              <div className={isRtl ? "text-left" : "text-right"}>
                <p className="text-sm font-medium text-gray-900">
                  {t("adminLayout:profile.name")}
                </p>
                <p className="text-xs text-gray-500">
                  {t("adminLayout:profile.role")}
                </p>
              </div>
              <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-teal-700">
                  {t("adminLayout:profile.initials")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed top-16 bottom-0 w-64 bg-white flex-col z-20 ${isRtl ? "right-0 border-l border-gray-200" : "left-0 border-r border-gray-200"}`}
      >
        <SidebarNav isRtl={isRtl} />
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside
            className={`lg:hidden fixed top-0 bottom-0 w-64 bg-white flex flex-col z-50 ${isRtl ? "right-0" : "left-0"}`}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {t("adminLayout:branding.logoInitials")}
                  </span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {t("adminLayout:branding.productName")}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {t("adminLayout:branding.platformAdmin")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <SidebarNav
              onNavigate={() => setIsMobileOpen(false)}
              isRtl={isRtl}
            />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className={`pt-16 ${isRtl ? "lg:pr-64" : "lg:pl-64"}`}>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
