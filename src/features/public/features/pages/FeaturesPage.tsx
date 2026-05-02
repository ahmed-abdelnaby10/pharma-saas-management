import { useNavigate } from "react-router";
import {
  ShoppingCart,
  Pill,
  Package,
  FileText,
  Calendar,
  BarChart3,
  Building2,
  Users,
  Scan,
  Upload,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Shield,
  Smartphone,
  Monitor,
  Printer,
  Database,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function FeaturesPage() {
  const navigate = useNavigate();
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";
  const textAlignClass = isRtl ? "text-right" : "text-left";

  const featureCategories = [
    {
      key: "pos",
      icon: ShoppingCart,
      color: "blue",
      features: [
        { key: "scanner", icon: Scan },
        { key: "payments", icon: DollarSign },
        { key: "receipts", icon: Printer },
        { key: "quickSale", icon: Clock },
      ],
    },
    {
      key: "inventory",
      icon: Package,
      color: "green",
      features: [
        { key: "tracking", icon: Package },
        { key: "alerts", icon: AlertTriangle },
        { key: "expiry", icon: Calendar },
        { key: "movements", icon: TrendingUp },
      ],
    },
    {
      key: "medicine",
      icon: Pill,
      color: "purple",
      features: [
        { key: "scientificNames", icon: Pill },
        { key: "prescriptions", icon: Shield },
        { key: "batches", icon: FileText },
        { key: "expiryManagement", icon: Calendar },
      ],
    },
    {
      key: "ocr",
      icon: Upload,
      color: "orange",
      features: [
        { key: "upload", icon: Upload },
        { key: "extraction", icon: Scan },
        { key: "matching", icon: FileText },
        { key: "review", icon: Shield },
      ],
    },
    {
      key: "purchasing",
      icon: FileText,
      color: "red",
      features: [
        { key: "suppliers", icon: Building2 },
        { key: "orders", icon: FileText },
        { key: "receiving", icon: Package },
        { key: "costs", icon: DollarSign },
      ],
    },
    {
      key: "shifts",
      icon: Calendar,
      color: "indigo",
      features: [
        { key: "opening", icon: Clock },
        { key: "cashFlow", icon: DollarSign },
        { key: "reports", icon: BarChart3 },
        { key: "shortage", icon: Shield },
      ],
    },
    {
      key: "reports",
      icon: BarChart3,
      color: "pink",
      features: [
        { key: "sales", icon: TrendingUp },
        { key: "profit", icon: DollarSign },
        { key: "stock", icon: Package },
        { key: "branches", icon: Building2 },
      ],
    },
    {
      key: "multiBranch",
      icon: Building2,
      color: "teal",
      features: [
        { key: "unlimited", icon: Building2 },
        { key: "centralized", icon: Database },
        { key: "transfers", icon: Package },
        { key: "permissions", icon: Users },
      ],
    },
  ] as const;

  const platforms = [
    {
      key: "web",
      icon: Monitor,
      features: ["devices", "install", "updates", "cloud"] as const,
    },
    {
      key: "desktop",
      icon: Smartphone,
      features: ["hardware", "scanner", "printer", "account"] as const,
    },
  ] as const;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      purple: "bg-purple-50 text-purple-600",
      orange: "bg-orange-50 text-orange-600",
      red: "bg-red-50 text-red-600",
      indigo: "bg-indigo-50 text-indigo-600",
      pink: "bg-pink-50 text-pink-600",
      teal: "bg-teal-50 text-teal-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {t("featuresPage:hero.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("featuresPage:hero.subtitle")}
          </p>
        </div>

        <div className="space-y-24">
          {featureCategories.map((category, index) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.key}
                className={
                  index % 2 === 0
                    ? ""
                    : "bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-2xl"
                }
              >
                <div className={`mb-12 ${textAlignClass}`}>
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${getColorClasses(category.color)} mb-4`}
                  >
                    <CategoryIcon className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {t(`featuresPage:categories.${category.key}.title`)}
                  </h2>
                  <p className="text-xl text-gray-600">
                    {t(`featuresPage:categories.${category.key}.description`)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {category.features.map((feature) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div
                        key={feature.key}
                        className={`flex gap-4 ${isRtl ? "flex-row-reverse text-right" : ""}`}
                      >
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-lg ${getColorClasses(category.color)} flex items-center justify-center`}
                        >
                          <FeatureIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {t(
                              `featuresPage:categories.${category.key}.items.${feature.key}.title`,
                            )}
                          </h3>
                          <p className="text-gray-600">
                            {t(
                              `featuresPage:categories.${category.key}.items.${feature.key}.description`,
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 pt-24 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("featuresPage:platforms.title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("featuresPage:platforms.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platforms.map((platform) => {
              const PlatformIcon = platform.icon;
              return (
                <div
                  key={platform.key}
                  className={`bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-[#0F5C47] transition-all ${textAlignClass}`}
                >
                  <PlatformIcon className="w-12 h-12 text-[#0F5C47] mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t(`featuresPage:platforms.${platform.key}.title`)}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t(`featuresPage:platforms.${platform.key}.description`)}
                  </p>
                  <ul className="space-y-2">
                    {platform.features.map((featureKey) => (
                      <li
                        key={featureKey}
                        className={`flex items-center gap-2 text-gray-700 ${isRtl ? "flex-row-reverse" : ""}`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0F5C47]" />
                        {t(`featuresPage:platforms.${platform.key}.items.${featureKey}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-24 text-center bg-gradient-to-br from-[#0F5C47] to-[#0d4a39] rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t("featuresPage:cta.title")}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t("featuresPage:cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/signup")}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F5C47] rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all ${isRtl ? "flex-row-reverse" : ""}`}
            >
              {t("featuresPage:cta.startTrial")}
              <ArrowRight className={`w-5 h-5 ${isRtl ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              {t("featuresPage:cta.viewPricing")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
