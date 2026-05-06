import React, { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/shared/components/EmptyState";
import { Modal } from "@/app/components/modals/Modal";
import { useLanguage } from "@/app/contexts/useLanguage";
import {
  useSignupRequestsQuery,
  useApproveSignupRequestMutation,
  useRejectSignupRequestMutation,
} from "@/features/admin/signup-requests/api";
import type {
  SignupRequest,
  SignupRequestStatus,
} from "@/features/admin/signup-requests/api";
import { formatDateTime } from "@/shared/utils/format";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SignupRequestStatus }) {
  const { t } = useLanguage();

  const styleMap: Record<SignupRequestStatus, { className: string; icon: React.ElementType }> = {
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

// ─── Approve modal ────────────────────────────────────────────────────────────

interface ApproveModalProps {
  request: SignupRequest;
  onClose: () => void;
}

function ApproveModal({ request, onClose }: ApproveModalProps) {
  const { t } = useLanguage();
  const [adminEmail, setAdminEmail] = useState("");
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const approveMutation = useApproveSignupRequestMutation();

  const handleApprove = () => {
    approveMutation.mutate(
      { id: request.id, payload: { adminEmail: adminEmail || undefined } },
      {
        onSuccess: (data) => {
          setTempPassword(data.tempPassword);
        },
      },
    );
  };

  const handleCopy = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (tempPassword) {
    return (
      <Modal isOpen onClose={onClose} title={t("adminSignupRequests:approveModal.successTitle")} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t("adminSignupRequests:approveModal.successMessage", { name: request.tenantName })}
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {t("adminSignupRequests:approveModal.tempPasswordLabel")}
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono break-all">
                {tempPassword}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                title={t("adminSignupRequests:approveModal.copyTitle")}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-[#0F5C47] text-white rounded-lg text-sm font-medium hover:bg-[#0d4a39] transition-colors"
            >
              {t("adminSignupRequests:actions.done")}
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen onClose={onClose} title={t("adminSignupRequests:approveModal.title")} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {t("adminSignupRequests:approveModal.approveMessage", {
            name: request.tenantName,
            email: request.contactEmail,
          })}
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("adminSignupRequests:approveModal.adminEmailLabel")}{" "}
            <span className="text-gray-400 font-normal">
              {t("adminSignupRequests:approveModal.adminEmailNote")}
            </span>
          </label>
          <input
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder={request.contactEmail}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={approveMutation.isPending}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {t("adminSignupRequests:actions.cancel")}
          </button>
          <button
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="flex-1 px-4 py-2 bg-[#0F5C47] text-white rounded-lg text-sm font-medium hover:bg-[#0d4a39] disabled:opacity-50 transition-colors"
          >
            {approveMutation.isPending
              ? t("adminSignupRequests:approveModal.approving")
              : t("adminSignupRequests:actions.approve")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Reject state type ────────────────────────────────────────────────────────

interface RejectState {
  id: string;
  name: string;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function SignupRequestsPage() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SignupRequestStatus | "ALL">("ALL");
  const [approvingRequest, setApprovingRequest] = useState<SignupRequest | null>(null);
  const [rejectState, setRejectState] = useState<RejectState | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const params = useMemo(
    () => ({
      search: search || undefined,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
    }),
    [search, statusFilter],
  );

  const { data: requests = [], isLoading } = useSignupRequestsQuery(params);
  const rejectMutation = useRejectSignupRequestMutation();

  const handleRejectConfirm = () => {
    if (!rejectState || !rejectReason.trim()) {
      toast.error(t("adminSignupRequests:rejectModal.reasonRequired"));
      return;
    }
    rejectMutation.mutate(
      { id: rejectState.id, payload: { reason: rejectReason } },
      {
        onSuccess: () => {
          toast.success(
            t("adminSignupRequests:rejectModal.rejected", { name: rejectState.name }),
          );
          setRejectState(null);
          setRejectReason("");
        },
      },
    );
  };

  const statusTabs: { value: SignupRequestStatus | "ALL"; labelKey: string }[] = [
    { value: "ALL", labelKey: "adminSignupRequests:filters.tabs.all" },
    { value: "PENDING", labelKey: "adminSignupRequests:filters.tabs.pending" },
    { value: "APPROVED", labelKey: "adminSignupRequests:filters.tabs.approved" },
    { value: "REJECTED", labelKey: "adminSignupRequests:filters.tabs.rejected" },
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
        <div className="flex justify-center py-16 text-gray-400 text-sm">
          {t("adminSignupRequests:table.loading")}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          heading={t("adminSignupRequests:empty.heading")}
          subline={t("adminSignupRequests:empty.subline")}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("adminSignupRequests:table.business")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("adminSignupRequests:table.contact")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  {t("adminSignupRequests:table.plan")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  {t("adminSignupRequests:table.submitted")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("adminSignupRequests:table.status")}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{req.tenantName}</p>
                    {req.country && (
                      <p className="text-xs text-gray-500">{req.country}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{req.contactName}</p>
                    <p className="text-xs text-gray-500">{req.contactEmail}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">
                    {req.requestedPlanName ?? req.requestedPlanId ?? t("adminSignupRequests:table.emptyValue")}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                    {formatDateTime(req.createdAt, language)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "PENDING" && (
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setApprovingRequest(req)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-[#0F5C47] rounded-lg hover:bg-[#0d4a39] transition-colors"
                        >
                          {t("adminSignupRequests:actions.approve")}
                        </button>
                        <button
                          onClick={() => setRejectState({ id: req.id, name: req.tenantName })}
                          className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          {t("adminSignupRequests:actions.reject")}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {approvingRequest && (
        <ApproveModal
          request={approvingRequest}
          onClose={() => setApprovingRequest(null)}
        />
      )}

      {rejectState && (
        <Modal
          isOpen
          onClose={() => {
            setRejectState(null);
            setRejectReason("");
          }}
          title={t("adminSignupRequests:rejectModal.title")}
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {t("adminSignupRequests:rejectModal.message", { name: rejectState.name })}
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("adminSignupRequests:rejectModal.reasonLabel")}
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t("adminSignupRequests:rejectModal.reasonPlaceholder")}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => {
                  setRejectState(null);
                  setRejectReason("");
                }}
                disabled={rejectMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {t("adminSignupRequests:actions.cancel")}
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={rejectMutation.isPending || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {rejectMutation.isPending
                  ? t("adminSignupRequests:rejectModal.rejecting")
                  : t("adminSignupRequests:actions.reject")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
