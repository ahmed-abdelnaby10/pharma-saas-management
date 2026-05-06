import { useLanguage } from "@/app/contexts/useLanguage";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  trialing: "bg-blue-50 text-blue-700 border-blue-200",
  past_due: "bg-orange-50 text-orange-700 border-orange-200",
  canceled: "bg-red-50 text-red-700 border-red-200",
  paused: "bg-gray-50 text-gray-600 border-gray-200",
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage();
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status] ?? STATUS_STYLES.canceled}`}
    >
      {t(`adminSubscriptions:status.${status}`)}
    </span>
  );
}
