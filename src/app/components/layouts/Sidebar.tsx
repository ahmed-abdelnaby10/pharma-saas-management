import React, { useState } from 'react';
import { NavLink } from 'react-router';
import {
  LayoutDashboard,
  ShoppingCart,
  Pill,
  Sparkles,
  Package,
  ShoppingBag,
  Clock,
  BarChart3,
  Building2,
  Users,
  CreditCard,
  Settings,
  X,
  Menu,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn } from '../../../lib/utils';

const navigationItems = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/app' },
  { key: 'pos', icon: ShoppingCart, path: '/app/pos' },
  { key: 'medicines', icon: Pill, path: '/app/medicines' },
  { key: 'cosmetics', icon: Sparkles, path: '/app/cosmetics' },
  { key: 'inventory', icon: Package, path: '/app/inventory' },
  { key: 'purchasing', icon: ShoppingBag, path: '/app/purchasing' },
  { key: 'shifts', icon: Clock, path: '/app/shifts' },
  { key: 'reports', icon: BarChart3, path: '/app/reports' },
  { key: 'branches', icon: Building2, path: '/app/branches' },
  { key: 'users', icon: Users, path: '/app/users' },
  { key: 'subscription', icon: CreditCard, path: '/app/subscription' },
  { key: 'settings', icon: Settings, path: '/app/settings' },
];

export function Sidebar() {
  const { t, direction } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-[#0d4a39]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
          <div className={direction === 'rtl' ? 'text-right' : 'text-left'}>
            <h1 className="text-xl font-semibold">PharmaSaaS</h1>
            <p className="text-xs text-white/70">Pharmacy Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  'hover:bg-white/10',
                  isActive ? 'bg-white/15 text-white' : 'text-white/80',
                  direction === 'rtl' ? 'flex-row-reverse' : ''
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'opacity-100' : 'opacity-70')} />
                  <span className={cn('flex-1', direction === 'rtl' ? 'text-right' : 'text-left')}>
                    {t(item.key)}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#0d4a39]">
        <div className="text-xs text-white/50 text-center">
          © 2026 PharmaSaaS
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`lg:hidden fixed top-4 z-50 p-2 bg-[#0F5C47] text-white rounded-lg shadow-lg ${
          direction === 'rtl' ? 'right-4' : 'left-4'
        }`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex w-64 bg-[#0F5C47] text-white flex-col h-screen fixed top-0 z-40",
        direction === 'rtl' ? 'right-0' : 'left-0'
      )}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className={cn(
            "lg:hidden fixed top-0 bottom-0 w-64 bg-[#0F5C47] text-white flex flex-col z-50 transition-transform",
            direction === 'rtl' ? 'right-0' : 'left-0'
          )}>
            <button
              onClick={() => setIsMobileOpen(false)}
              className={`absolute top-4 p-2 text-white/80 hover:text-white ${
                direction === 'rtl' ? 'left-4' : 'right-4'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}