import { useLanguage } from "@/app/contexts/useLanguage";
import CardSkeleton from "@/shared/components/CardSkeleton";

interface SubscriptionsSummaryCardsProps {
  isLoading: boolean;
  total: number;
  active: number;
  trialing: number;
  pastDue: number;
  canceled: number;
}

function SummaryCard({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function SubscriptionsSummaryCards({
  isLoading,
  total,
  active,
  trialing,
  pastDue,
  canceled,
}: SubscriptionsSummaryCardsProps) {
  const { t } = useLanguage();

  return isLoading ? (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <SummaryCard
        label={t("adminSubscriptions:summary.total")}
        value={total}
        className="border-gray-200 bg-white"
      />
      <SummaryCard
        label={t("adminSubscriptions:summary.active")}
        value={active}
        className="border-green-100 bg-green-50"
      />
      <SummaryCard
        label={t("adminSubscriptions:summary.trialing")}
        value={trialing}
        className="border-blue-100 bg-blue-50"
      />
      <SummaryCard
        label={t("adminSubscriptions:summary.pastDue")}
        value={pastDue}
        className="border-orange-100 bg-orange-50"
      />
      <SummaryCard
        label={t("adminSubscriptions:summary.canceled")}
        value={canceled}
        className="border-red-100 bg-red-50"
      />
    </div>
  );
}
