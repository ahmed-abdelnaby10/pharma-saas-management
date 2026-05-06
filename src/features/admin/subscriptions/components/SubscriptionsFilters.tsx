import { Search } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface PlanFilterOption {
  id: string;
  label: string;
}

interface SubscriptionsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  planFilter: string;
  onPlanFilterChange: (value: string) => void;
  plans: PlanFilterOption[];
}

export default function SubscriptionsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  planFilter,
  onPlanFilterChange,
  plans,
}: SubscriptionsFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={t("adminSubscriptions:filters.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {t("adminSubscriptions:filters.statusLabel")}
        </span>
        <div className="w-[140px]">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("adminSubscriptions:filters.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("adminSubscriptions:filters.allStatuses")}
              </SelectItem>
              <SelectItem value="active">{t("adminSubscriptions:status.active")}</SelectItem>
              <SelectItem value="trialing">
                {t("adminSubscriptions:status.trialing")}
              </SelectItem>
              <SelectItem value="past_due">
                {t("adminSubscriptions:status.past_due")}
              </SelectItem>
              <SelectItem value="paused">{t("adminSubscriptions:status.paused")}</SelectItem>
              <SelectItem value="canceled">
                {t("adminSubscriptions:status.canceled")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[160px]">
          <Select value={planFilter} onValueChange={onPlanFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("adminSubscriptions:filters.allPlans")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("adminSubscriptions:filters.allPlans")}</SelectItem>
              {plans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
