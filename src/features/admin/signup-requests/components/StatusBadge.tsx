import { useLanguage } from "@/app/contexts/useLanguage";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { SignupRequestStatus } from "../api";

export default function StatusBadge({
  status,
}: {
  status: SignupRequestStatus;
}) {
  const { t } = useLanguage();

  const styleMap: Record<
    SignupRequestStatus,
    { className: string; icon: React.ElementType }
  > = {
    PENDING: { className: "bg-yellow-100 text-yellow-800", icon: Clock },
    APPROVED: { className: "bg-green-100 text-green-800", icon: CheckCircle },
    REJECTED: { className: "bg-red-100 text-red-800", icon: XCircle },
  };

  const { className, icon: Icon } = styleMap[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {t(`adminSignupRequests:status.${status.toLowerCase()}`)}
    </span>
  );
}
