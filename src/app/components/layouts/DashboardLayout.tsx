import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useLanguage } from '../../../contexts/LanguageContext';

export function DashboardLayout() {
  const { direction } = useLanguage();

  return (
    <div className={`min-h-screen bg-[#F8F9FA] ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
      <Sidebar />
      <div className={direction === 'rtl' ? 'lg:mr-64' : 'lg:ml-64'}>
        <Header />
        <main className="p-4 md:p-6 pt-20 lg:pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}