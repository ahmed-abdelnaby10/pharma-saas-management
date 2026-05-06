import React from "react";
import { Activity, Server, Database, Zap, AlertTriangle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";

export function SystemMetricsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          {t("adminSystem:metrics.header.title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("adminSystem:metrics.header.subtitle")}
        </p>
      </div>

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <HealthCard
          title={t("adminSystem:metrics.health.api")}
          status={t("adminSystem:metrics.health.operational")}
          icon={Server}
          color="green"
          metric={t("adminSystem:metrics.health.apiMetric")}
        />
        <HealthCard
          title={t("adminSystem:metrics.health.database")}
          status={t("adminSystem:metrics.health.operational")}
          icon={Database}
          color="green"
          metric={t("adminSystem:metrics.health.dbMetric")}
        />
        <HealthCard
          title={t("adminSystem:metrics.health.jobs")}
          status={t("adminSystem:metrics.health.processing")}
          icon={Zap}
          color="blue"
          metric={t("adminSystem:metrics.health.jobMetric")}
        />
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("adminSystem:metrics.stats.activeSessions")} value="1,247" />
        <StatCard label={t("adminSystem:metrics.stats.requestsPerMin")} value="3,842" />
        <StatCard label={t("adminSystem:metrics.stats.ocrJobsToday")} value="8,512" />
        <StatCard label={t("adminSystem:metrics.stats.failedJobs")} value="3" />
      </div>

      {/* Placeholder for Charts */}
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">
          {t("adminSystem:metrics.chart.title")}
        </h3>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          {t("adminSystem:metrics.chart.description")}
        </p>
      </div>
    </div>
  );
}

function HealthCard({
  title,
  status,
  icon: Icon,
  color,
  metric,
}: {
  title: string;
  status: string;
  icon: React.ElementType;
  color: string;
  metric: string;
}) {
  const colorStyles: Record<string, string> = {
    green: "bg-green-50 text-green-600 border-green-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorStyles[color] ?? colorStyles.green}`}>
          <Icon className="w-5 h-5" />
        </div>
        {color === "green" ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-orange-500" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{status}</p>
        <p className="mt-1 text-xs text-gray-500">{metric}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
