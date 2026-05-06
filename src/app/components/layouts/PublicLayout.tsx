import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { Pill, Menu, X, Globe, Download } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function PublicLayout() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: t("home"), path: "/home" },
    { name: t("features"), path: "/features" },
    { name: t("pricing"), path: "/pricing" },
    { name: t("pub.nav.instructions"), path: "/instructions" },
    { name: t("contact"), path: "/contact" },
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
              <img
                src="/images/yomdix-icon-variation.webp"
                alt="logo"
                className="w-36 h-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-[#0F5C47]"
                      : "text-gray-600 hover:text-[#0F5C47]"
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
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#0F5C47] transition-colors"
              >
                <Globe className="w-4 h-4" />
                {language === "en" ? "AR" : "EN"}
              </button>

              {/* Download Button */}
              <Link
                to="/download"
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#0F5C47] transition-colors"
              >
                <Download className="w-4 h-4" />
                {t("pub.nav.download")}
              </Link>

              {/* Login Button */}
              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#0F5C47] transition-colors"
              >
                {t("login")}
              </button>

              {/* Start Trial Button */}
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-[#0F5C47] text-white rounded-lg text-sm font-medium hover:bg-[#0d4a39] transition-colors"
              >
                {t("pub.startTrial")}
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
                      isActive(item.path) ? "text-[#0F5C47]" : "text-gray-600"
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
                  {t("pub.nav.download")}
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
                <span className="text-xl font-bold text-gray-900">Yomdix</span>
              </div>
              <p className="text-sm text-gray-600">{t("pub.footer.tagline")}</p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {t("pub.footer.product")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-sm text-gray-600 hover:text-[#0F5C47]"
                  >
                    {t("features")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-sm text-gray-600 hover:text-[#0F5C47]"
                  >
                    {t("pricing")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/download"
                    className="text-sm text-gray-600 hover:text-[#0F5C47]"
                  >
                    {t("pub.nav.download")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/instructions"
                    className="text-sm text-gray-600 hover:text-[#0F5C47]"
                  >
                    {t("pub.nav.instructions")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {t("pub.footer.company")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/contact"
                    className="text-sm text-gray-600 hover:text-[#0F5C47]"
                  >
                    {t("pub.footer.contactUs")}
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-[#0F5C47]"
                  >
                    {t("pub.footer.about")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-[#0F5C47]"
                  >
                    {t("pub.footer.blog")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                {t("pub.footer.legal")}
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-[#0F5C47]"
                  >
                    {t("pub.footer.privacy")}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-[#0F5C47]"
                  >
                    {t("pub.footer.terms")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center" dir="ltr">
              {t("footer.copyright")}
            </p>
          </div>
          <Link
            to="/admin"
            className="text-gray-400 hover:text-[#0F5C47] transition-colors ml-2"
          >
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
