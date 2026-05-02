import { useNavigate } from "react-router";
import {
  Pill,
  ShoppingCart,
  Package,
  BarChart3,
  Calendar,
  FileText,
  Scan,
  Building2,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
  Download,
  Monitor,
  Play,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function HomePage() {
  const navigate = useNavigate();
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const textAlignClass = isRtl ? "text-right" : "text-left";

  const featureColorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  const features = [
    { key: "pos", icon: ShoppingCart, color: "blue" },
    { key: "medicine", icon: Pill, color: "green" },
    { key: "inventory", icon: Package, color: "orange" },
    { key: "ocr", icon: FileText, color: "purple" },
    { key: "shifts", icon: Calendar, color: "red" },
    { key: "reports", icon: BarChart3, color: "indigo" },
  ] as const;

  const benefits = [
    { key: "branches", icon: Building2 },
    { key: "barcode", icon: Scan },
    { key: "speed", icon: Zap },
    { key: "security", icon: Shield },
  ] as const;

  const stats = [
    { value: "10K+", key: "activeUsers" },
    { value: "50K+", key: "dailyTransactions" },
    { value: "99.9%", key: "uptime" },
    { value: "24/7", key: "support" },
  ] as const;

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC00djItMnptMC00djItMnptMC00djItMnptLTQgMTJ2LTJ6bTAtNHYtMnptMC00di0yem0wLTR2LTJ6bS00IDEydi0yem0wLTR2LTJ6bTAtNHYtMnptMC00di0yem0tNCAxMnYtMnptMC00di0yem0wLTR2LTJ6bTAtNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={textAlignClass}>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 `}
              >
                <Clock className="w-4 h-4" />
                {t("homePage:hero.trialBadge")}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t("homePage:hero.title")}
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                {t("homePage:hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl `}
                >
                  {t("homePage:hero.startTrial")}
                  <ArrowRight
                    className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`}
                  />
                </button>

                <button
                  onClick={() => navigate("/demo")}
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20`}
                >
                  {t("homePage:hero.watchDemo")}
                  <Play className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>

              <div
                className={`mt-8 flex items-center gap-6 text-sm text-white/80 ${isRtl ? "flex-row-reverse justify-end" : ""}`}
              >
                <div className={`flex items-center gap-2 `}>
                  <CheckCircle2 className="w-5 h-5" />
                  {t("homePage:hero.bullets.webDesktop")}
                </div>
                <div className={`flex items-center gap-2 `}>
                  <CheckCircle2 className="w-5 h-5" />
                  {t("homePage:hero.bullets.barcodeReady")}
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                  <Monitor className="w-24 h-24 text-white/20" />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-white/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-white/60">
                      {t("homePage:hero.preview.pos")}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-white/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-white/60">
                      {t("homePage:hero.preview.inventory")}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <div className="w-8 h-8 bg-white/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="text-xs text-white/60">
                      {t("homePage:hero.preview.reports")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.key} className="text-center">
                <div className="text-4xl font-bold text-[#0F5C47] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {t(`homePage:stats.${stat.key}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("homePage:features.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("homePage:features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              const colorClasses =
                featureColorClasses[
                  feature.color as keyof typeof featureColorClasses
                ];

              return (
                <div
                  key={feature.key}
                  className={`bg-white rounded-xl p-8 border border-gray-200 hover:border-[#0F5C47] hover:shadow-lg transition-all ${textAlignClass}`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t(`homePage:features.items.${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`homePage:features.items.${feature.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/features")}
              className={`inline-flex items-center gap-2 px-6 py-3 text-[#0F5C47] font-semibold hover:gap-3 transition-all `}
            >
              {t("homePage:features.viewAll")}
              <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("homePage:benefits.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.key}
                  className={`text-center ${textAlignClass}`}
                >
                  <div className="w-16 h-16 bg-[#0F5C47]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#0F5C47]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t(`homePage:benefits.items.${benefit.key}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`homePage:benefits.items.${benefit.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("homePage:platforms.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("homePage:platforms.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className={`bg-white rounded-xl p-8 border border-gray-200 ${textAlignClass}`}
            >
              <Monitor className="w-12 h-12 text-[#0F5C47] mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {t("homePage:platforms.web.title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("homePage:platforms.web.description")}
              </p>
              <button
                onClick={() => navigate("/login")}
                className={`text-[#0F5C47] font-semibold hover:gap-2 inline-flex items-center gap-1 transition-all `}
              >
                {t("homePage:platforms.web.button")}
                <ArrowRight
                  className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <div
              className={`bg-white rounded-xl p-8 border border-gray-200 ${textAlignClass}`}
            >
              <Download className="w-12 h-12 text-[#0F5C47] mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {t("homePage:platforms.desktop.title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("homePage:platforms.desktop.description")}
              </p>
              <button
                onClick={() => navigate("/download")}
                className={`text-[#0F5C47] font-semibold hover:gap-2 inline-flex items-center gap-1 transition-all`}
              >
                <span>{t("homePage:platforms.desktop.button")}</span>
                <ArrowRight
                  className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("homePage:cta.title")}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t("homePage:cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg `}
            >
              {t("homePage:cta.startTrial")}
              <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              {t("homePage:cta.contactSales")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
