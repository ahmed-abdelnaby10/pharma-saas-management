import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { Pill, Menu, X, Globe, Download } from 'lucide-react';
import { useLanguage } from '@/app/contexts/LanguageContext';

export function PublicLayout() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: t('home'), path: '/home' },
    { name: t('features'), path: '/features' },
    { name: t('pricing'), path: '/pricing' },
    { name: 'Instructions', path: '/instructions' },
    { name: t('contact'), path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PharmaSaaS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-[#0F5C47]'
                      : 'text-gray-600 hover:text-[#0F5C47]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#0F5C47] transition-colors"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'AR' : 'EN'}
              </button>

              {/* Download Button */}
              <Link
                to="/download"
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#0F5C47] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </Link>

              {/* Login Button */}
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#0F5C47] transition-colors"
              >
                {t('login')}
              </button>

              {/* Start Trial Button */}
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-[#0F5C47] text-white rounded-lg text-sm font-medium hover:bg-[#0d4a39] transition-colors"
              >
                Start Free Trial
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-medium ${
                      isActive(item.path)
                        ? 'text-[#0F5C47]'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/download"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#0F5C47] rounded-lg flex items-center justify-center">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PharmaSaaS</span>
              </div>
              <p className="text-sm text-gray-600">
                Complete pharmacy management platform for modern pharmacies
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-sm text-gray-600 hover:text-[#0F5C47]">Features</Link></li>
                <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-[#0F5C47]">Pricing</Link></li>
                <li><Link to="/download" className="text-sm text-gray-600 hover:text-[#0F5C47]">Download</Link></li>
                <li><Link to="/instructions" className="text-sm text-gray-600 hover:text-[#0F5C47]">Instructions</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/contact" className="text-sm text-gray-600 hover:text-[#0F5C47]">Contact Us</Link></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#0F5C47]">About</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#0F5C47]">Blog</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#0F5C47]">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#0F5C47]">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Â© {new Date().getFullYear()} PharmaSaaS. All rights reserved.
              {' '}
              <Link to="/admin" className="text-gray-400 hover:text-[#0F5C47] transition-colors ml-2">
                Admin
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}