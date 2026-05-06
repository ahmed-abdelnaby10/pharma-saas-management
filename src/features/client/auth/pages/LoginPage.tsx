import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { Pill, Globe, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { platformLogin, tenantLogin, storeTokens } from "@/shared/services/auth";

interface LoginFormValues {
  tenantId: string;
  email: string;
  password: string;
}

type LoginMode = "admin" | "client";

export function LoginPage() {
  const { t, language, setLanguage, direction } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const requestedMode = searchParams.get("mode");
  const loginMode: LoginMode = requestedMode === "admin" ? "admin" : "client";
  const isRtl = direction === "rtl";
  const textAlignClass = isRtl ? "text-right" : "text-left";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      tenantId: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsLoading(true);

    try {
      const authResponse =
        loginMode === "admin"
          ? await platformLogin({
              email: values.email,
              password: values.password,
            })
          : await tenantLogin({
              email: values.email,
              password: values.password,
              tenantId:
                values.tenantId.trim() ||
                (values.email.split("@")[1]?.split(".")[0] ?? ""),
            });

      await storeTokens({
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
        user: authResponse.user,
      });

      navigate(loginMode === "admin" ? "/admin" : "/app");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        t("errors.invalidCredentials");
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === "en" ? t("arabic") : t("english")}
            </span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div
            className={`flex items-center justify-center gap-3 mb-8 ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <div className="w-12 h-12 bg-[#0F5C47] rounded-lg flex items-center justify-center">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <div className={textAlignClass}>
              <h1 className="text-2xl font-semibold text-gray-900">Yomdix</h1>
              <p className="text-sm text-gray-500">{t("platformName")}</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {t(
                loginMode === "admin"
                  ? "auth:adminLogin.welcomeBack"
                  : "auth:welcomeBack",
              )}
            </h2>
            <p className="text-sm text-gray-600">
              {t(
                loginMode === "admin"
                  ? "auth:adminLogin.subtitle"
                  : "auth:loginSubtitle",
              )}
            </p>
          </div>

          <div
            className={`mb-6 rounded-lg border border-gray-200 bg-[#F8F9FA] p-1 grid grid-cols-2 gap-1`}
          >
            <button
              type="button"
              onClick={() => {
                setServerError(null);
                setSearchParams({ mode: "client" });
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                loginMode === "client"
                  ? "bg-white text-[#0F5C47] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {t("auth:loginModes.client")}
            </button>
            <button
              type="button"
              onClick={() => {
                setServerError(null);
                setSearchParams({ mode: "admin" });
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                loginMode === "admin"
                  ? "bg-white text-[#0F5C47] shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {t("auth:loginModes.admin")}
            </button>
          </div>

          {serverError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {loginMode === "client" && (
              <div className={textAlignClass}>
                <label
                  htmlFor="tenantId"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  {t("auth:tenantId")}
                </label>
                <input
                  id="tenantId"
                  type="text"
                  {...register("tenantId")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none transition-all"
                  placeholder={t("auth:tenantIdPlaceholder")}
                />
              </div>
            )}

            <div className={textAlignClass}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t("auth:email")}
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: t("auth:errors.emailRequired"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("auth:errors.invalidEmail"),
                  },
                })}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.email ? "border-red-400" : "border-gray-300"
                } focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none transition-all`}
                placeholder={t("auth:emailPlaceholder")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className={textAlignClass}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                {t("auth:password")}
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: t("auth:errors.passwordRequired"),
                })}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.password ? "border-red-400" : "border-gray-300"
                } focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none transition-all`}
                placeholder={t("auth:passwordPlaceholder")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div
              className={`flex items-center justify-between ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <label
                className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#0F5C47] focus:ring-[#0F5C47]"
                />
                <span className="text-sm text-gray-600">
                  {t("auth:rememberMe")}
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-[#0F5C47] hover:text-[#0d4a39]"
              >
                {t("auth:forgotPassword")}
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0F5C47] text-white py-2.5 rounded-lg hover:bg-[#0d4a39] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t(
                loginMode === "admin"
                  ? "auth:adminLogin.actions.submit"
                  : "auth:login",
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {t("common:footer.copyright")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
