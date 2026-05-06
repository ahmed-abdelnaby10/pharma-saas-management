import React from "react";
import { Users, Bell, Shield, Globe } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function AdminSettingsPage() {
  const { t, direction } = useLanguage();
  const isRtl = direction === "rtl";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          {t("adminSettings:header.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("adminSettings:header.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SettingCard
          icon={Users}
          title={t("adminSettings:cards.adminUsers.title")}
          description={t("adminSettings:cards.adminUsers.description")}
          isRtl={isRtl}
        />
        <SettingCard
          icon={Bell}
          title={t("adminSettings:cards.notifications.title")}
          description={t("adminSettings:cards.notifications.description")}
          isRtl={isRtl}
        />
        <SettingCard
          icon={Shield}
          title={t("adminSettings:cards.security.title")}
          description={t("adminSettings:cards.security.description")}
          isRtl={isRtl}
        />
        <SettingCard
          icon={Globe}
          title={t("adminSettings:cards.platformConfig.title")}
          description={t("adminSettings:cards.platformConfig.description")}
          isRtl={isRtl}
        />
      </div>
    </div>
  );
}

function SettingCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  isRtl: boolean;
}) {
  return (
    <button
      className={`bg-white border border-gray-200 rounded-xl p-6 hover:border-teal-300 hover:shadow-md transition-all group`}
    >
      <div className={`flex items-start gap-4`}>
        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-teal-50 transition-colors">
          <Icon className="w-6 h-6 text-gray-600 group-hover:text-teal-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
}
