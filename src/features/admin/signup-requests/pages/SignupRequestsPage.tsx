import { useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { useDebouncedValue } from "@/shared/hooks/useDebounce";
import { useLanguage } from "@/app/contexts/useLanguage";
import { useSignupRequestsQuery } from "@/features/admin/signup-requests/api";
import type {
  SignupRequest,
  SignupRequestStatus,
  RejectState,
} from "@/features/admin/signup-requests/api";
import ApproveModal from "../components/ApproveModal";
import RejectModal from "../components/RejectModal";
import RequestsTable from "../components/RequestsTable";
import TableSkeleton from "@/shared/components/TableSkeleton";

export function SignupRequestsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SignupRequestStatus | "ALL">(
    "ALL",
  );
  const [approvingRequest, setApprovingRequest] =
    useState<SignupRequest | null>(null);
  const [rejectState, setRejectState] = useState<RejectState | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const params = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
    }),
    [debouncedSearch, statusFilter],
  );

  const { data: requests = [], isLoading } = useSignupRequestsQuery(params);

  const statusTabs: { value: SignupRequestStatus | "ALL"; labelKey: string }[] =
    [
      { value: "ALL", labelKey: "adminSignupRequests:filters.tabs.all" },
      {
        value: "PENDING",
        labelKey: "adminSignupRequests:filters.tabs.pending",
      },
      {
        value: "APPROVED",
        labelKey: "adminSignupRequests:filters.tabs.approved",
      },
      {
        value: "REJECTED",
        labelKey: "adminSignupRequests:filters.tabs.rejected",
      },
    ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("adminSignupRequests:header.title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("adminSignupRequests:header.subtitle")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("adminSignupRequests:filters.searchPlaceholder")}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
          />
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                statusFilter === tab.value
                  ? "bg-white text-gray-900 shadow-sm font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          heading={t("adminSignupRequests:empty.heading")}
          subline={t("adminSignupRequests:empty.subline")}
        />
      ) : (
        <RequestsTable
          requests={requests}
          setApprovingRequest={setApprovingRequest}
          setRejectState={setRejectState}
        />
      )}

      {approvingRequest && (
        <ApproveModal
          request={approvingRequest}
          onClose={() => setApprovingRequest(null)}
        />
      )}

      {rejectState && (
        <RejectModal
          setRejectState={setRejectState}
          setRejectReason={setRejectReason}
          rejectState={rejectState}
          rejectReason={rejectReason}
        />
      )}
    </div>
  );
}
