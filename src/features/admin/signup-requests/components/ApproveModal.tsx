import { useLanguage } from "@/app/contexts/useLanguage";
import { SignupRequest, useApproveSignupRequestMutation } from "../api";
import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/app/components/modals";
import { Trans } from "react-i18next";

interface ApproveModalProps {
  request: SignupRequest;
  onClose: () => void;
}

export default function ApproveModal({ request, onClose }: ApproveModalProps) {
  const requestName = request.pharmacyNameEn ?? request.pharmacyNameAr ?? "-";
  const requestEmail = request.email ?? "-";

  const { t } = useLanguage();
  const [adminEmail, setAdminEmail] = useState("");
  const approveMutation = useApproveSignupRequestMutation();

  const handleApprove = () => {
    approveMutation.mutate(
      { id: request.id, payload: { adminEmail: adminEmail || undefined } },
      {
        onSuccess: () => {
          toast.success(t("adminSignupRequests:actions.approve"));
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t("adminSignupRequests:approveModal.title")}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          <Trans
            i18nKey="adminSignupRequests:approveModal.approveMessage"
            values={{ name: requestName, email: requestEmail }}
            components={{
              strong: <strong className="font-semibold text-gray-800" />,
            }}
          />
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
            placeholder={requestEmail}
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
