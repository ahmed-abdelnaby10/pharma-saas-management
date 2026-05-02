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
  const map: Record<
    SignupRequestStatus,
    { label: string; className: string; icon: React.ElementType }
  > = {
    PENDING: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800",
      icon: Clock,
    },
    APPROVED: {
      label: "Approved",
      className: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    REJECTED: {
      label: "Rejected",
      className: "bg-red-100 text-red-800",
      icon: XCircle,
    },
  };
  const { label, className, icon: Icon } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

// ─── Approve modal ────────────────────────────────────────────────────────────

interface ApproveModalProps {
  request: SignupRequest;
  onClose: () => void;
}

function ApproveModal({ request, onClose }: ApproveModalProps) {
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

  // ── One-time password reveal ──────────────────────────────────────────────
  if (tempPassword) {
    return (
      <Modal isOpen onClose={onClose} title="Tenant Created" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            The tenant <strong>{request.tenantName}</strong> has been created.
            Share the temporary password below — it will only be shown once.
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Temporary Password
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono break-all">
                {tempPassword}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                title="Copy password"
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
              Done
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  // ── Approval form ─────────────────────────────────────────────────────────
  return (
    <Modal isOpen onClose={onClose} title="Approve Request" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Approving <strong>{request.tenantName}</strong> will create a new
          tenant and email credentials to{" "}
          <strong>{request.contactEmail}</strong>.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin Email{" "}
            <span className="text-gray-400 font-normal">(optional override)</span>
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
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="flex-1 px-4 py-2 bg-[#0F5C47] text-white rounded-lg text-sm font-medium hover:bg-[#0d4a39] disabled:opacity-50 transition-colors"
          >
            {approveMutation.isPending ? "Approving…" : "Approve"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Reject confirm ───────────────────────────────────────────────────────────

interface RejectState {
  id: string;
  name: string;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function SignupRequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SignupRequestStatus | "ALL">(
    "ALL",
  );
  const [approvingRequest, setApprovingRequest] =
    useState<SignupRequest | null>(null);
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
      toast.error("Please enter a rejection reason.");
      return;
    }
    rejectMutation.mutate(
      { id: rejectState.id, payload: { reason: rejectReason } },
      {
        onSuccess: () => {
          toast.success(`Request from ${rejectState.name} has been rejected.`);
          setRejectState(null);
          setRejectReason("");
        },
      },
    );
  };

  const statusTabs: { value: SignupRequestStatus | "ALL"; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Signup Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and manage incoming trial requests from the public signup form.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email…"
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
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">
          Loading…
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          heading="No signup requests"
          subline="New requests from the public signup form will appear here."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Plan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
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
                    {req.requestedPlanName ?? req.requestedPlanId ?? "—"}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                    {formatDateTime(req.createdAt, "en")}
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
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            setRejectState({
                              id: req.id,
                              name: req.tenantName,
                            })
                          }
                          className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Reject
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

      {/* Approve modal */}
      {approvingRequest && (
        <ApproveModal
          request={approvingRequest}
          onClose={() => setApprovingRequest(null)}
        />
      )}

      {/* Reject confirm — custom reason input embedded in ConfirmModal description */}
      {rejectState && (
        <Modal
          isOpen
          onClose={() => {
            setRejectState(null);
            setRejectReason("");
          }}
          title="Reject Request"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Rejecting{" "}
              <strong>{rejectState.name}</strong> will permanently close this
              request. Please provide a reason.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason *
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Why is this request being rejected?"
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
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={rejectMutation.isPending || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {rejectMutation.isPending ? "Rejecting…" : "Reject"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
