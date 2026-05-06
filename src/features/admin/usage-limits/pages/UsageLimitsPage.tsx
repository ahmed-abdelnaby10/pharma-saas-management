import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function UsageLimitsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          {t("adminUsageLimits:header.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("adminUsageLimits:header.subtitle")}
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">
          {t("adminUsageLimits:chart.title")}
        </h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          {t("adminUsageLimits:chart.description")}
        </p>
      </div>
    </div>
  );
}
