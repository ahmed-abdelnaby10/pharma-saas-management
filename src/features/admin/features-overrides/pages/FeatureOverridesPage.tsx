import { Plus, Shield } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function FeatureOverridesPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {t("adminFeatureOverrides:header.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("adminFeatureOverrides:header.subtitle")}
          </p>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("adminFeatureOverrides:header.addOverride")}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">
          {t("adminFeatureOverrides:emptyState.title")}
        </h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          {t("adminFeatureOverrides:emptyState.description")}
        </p>
      </div>
    </div>
  );
}
