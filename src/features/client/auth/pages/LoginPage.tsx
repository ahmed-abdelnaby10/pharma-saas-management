import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Pill, Globe, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { tenantLogin, storeTokens } from "@/shared/services/auth";

export function LoginPage() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { accessToken, refreshToken, user } = await tenantLogin({
        email,
        password,
        tenantId: tenantId.trim() || (email.split("@")[1]?.split(".")[0] ?? ""),
      });

      await storeTokens({
        accessToken,
        refreshToken,
        user,
      });

      navigate("/app");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === "en" ? "العربية" : "English"}
            </span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#0F5C47] rounded-lg flex items-center justify-center">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                PharmaSaaS
              </h1>
              <p className="text-sm text-gray-500">Pharmacy Platform</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {t("welcomeBack")}
            </h2>
            <p className="text-sm text-gray-600">{t("loginSubtitle")}</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="tenantId"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Tenant ID
              </label>
              <input
                id="tenantId"
                type="text"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none transition-all"
                placeholder="your-pharmacy-id"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none transition-all"
                placeholder="user@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t("password")}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#0F5C47] focus:ring-[#0F5C47]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-[#0F5C47] hover:text-[#0d4a39]"
              >
                {t("forgotPassword")}
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0F5C47] text-white py-2.5 rounded-lg hover:bg-[#0d4a39] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("login")}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2026 PharmaSaaS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
