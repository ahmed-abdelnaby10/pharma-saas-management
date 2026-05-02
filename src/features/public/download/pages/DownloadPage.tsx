import { useNavigate } from "react-router";
import {
  Download,
  Monitor,
  Check,
  Scan,
  Zap,
  Shield,
  HardDrive,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function DownloadPage() {
  const navigate = useNavigate();
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const textAlignClass = isRtl ? "text-right" : "text-left";

  const benefits = [
    {
      icon: Scan,
      title: t("download:benefits.items.hardware.title"),
      description: t("download:benefits.items.hardware.description"),
    },
    {
      icon: Zap,
      title: t("download:benefits.items.performance.title"),
      description: t("download:benefits.items.performance.description"),
    },
    {
      icon: Shield,
      title: t("download:benefits.items.offline.title"),
      description: t("download:benefits.items.offline.description"),
    },
    {
      icon: HardDrive,
      title: t("download:benefits.items.sync.title"),
      description: t("download:benefits.items.sync.description"),
    },
  ];

  const requirementKeys = [
    "os",
    "processor",
    "ram",
    "storage",
    "display",
    "internet",
  ] as const;

  const featureKeys = [
    "pos",
    "printer",
    "catalog",
    "inventory",
    "purchasing",
    "ocr",
    "shifts",
    "reports",
    "branches",
    "cloudSync",
    "login",
    "updates",
  ] as const;

  const stepKeys = ["download", "install", "login", "start"] as const;
  const faqKeys = ["account", "free", "both", "scanner"] as const;

  return (
    <div className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0F5C47] rounded-2xl mb-6">
            <Monitor className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("download:hero.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("download:hero.subtitle")}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] rounded-2xl p-12 text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("download:cta.title")}
            </h2>
            <p className="text-xl text-white/90 mb-8">{t("download:cta.meta")}</p>
            <button
              onClick={() => {
                // Placeholder until real asset download is wired.
              }}
              className={`inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <Download className="w-6 h-6" />
              {t("download:cta.button")}
            </button>
            <p className="text-sm text-white/70 mt-4">{t("download:cta.note")}</p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("download:benefits.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className={`bg-white rounded-xl p-8 border border-gray-200 ${textAlignClass}`}
                >
                  <div className="w-12 h-12 bg-[#0F5C47]/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#0F5C47]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 border border-gray-200 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("download:features.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 max-w-5xl mx-auto">
            {featureKeys.map((featureKey) => (
              <div
                key={featureKey}
                className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse text-right" : ""}`}
              >
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">
                  {t(`download:features.items.${featureKey}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 border border-gray-200 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("download:requirements.title")}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {requirementKeys.map((reqKey) => (
              <div
                key={reqKey}
                className={`flex items-start gap-4 py-4 border-b border-gray-100 last:border-0 ${isRtl ? "flex-row-reverse text-right" : ""}`}
              >
                <div className="w-1/3 font-semibold text-gray-900">
                  {t(`download:requirements.items.${reqKey}.label`)}
                </div>
                <div className="w-2/3 text-gray-600">
                  {t(`download:requirements.items.${reqKey}.value`)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("download:steps.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stepKeys.map((stepKey, index) => (
              <div key={stepKey} className="text-center">
                <div className="w-16 h-16 bg-[#0F5C47] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t(`download:steps.items.${stepKey}.title`)}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(`download:steps.items.${stepKey}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t("download:faq.title")}
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqKeys.map((faqKey) => (
              <div key={faqKey} className={textAlignClass}>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t(`download:faq.items.${faqKey}.question`)}
                </h3>
                <p className="text-gray-600">
                  {t(`download:faq.items.${faqKey}.answer`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">{t("download:bottomCta.prompt")}</p>
          <button
            onClick={() => navigate("/signup")}
            className={`inline-flex items-center gap-2 px-8 py-4 bg-[#0F5C47] text-white rounded-lg text-lg font-semibold hover:bg-[#0d4a39] transition-all ${isRtl ? "flex-row-reverse" : ""}`}
          >
            {t("download:bottomCta.button")}
            <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
