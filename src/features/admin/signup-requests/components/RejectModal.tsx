import { Modal } from "@/app/components/modals";
import { Dispatch, SetStateAction } from "react";
import { Trans } from "react-i18next";
import { RejectState, useRejectSignupRequestMutation } from "../api";
import { toast } from "sonner";
import { useLanguage } from "@/app/contexts/useLanguage";

interface Props {
  setRejectState: Dispatch<SetStateAction<RejectState | null>>;
  setRejectReason: Dispatch<SetStateAction<string>>;
  rejectState: RejectState;
  rejectReason: string;
}

export default function RejectModal({
  setRejectState,
  setRejectReason,
  rejectState,
  rejectReason,
}: Props) {
  const { t } = useLanguage();

  const rejectMutation = useRejectSignupRequestMutation();

  const handleRejectConfirm = () => {
    if (!rejectState || rejectReason.trim().length < 5) {
      toast.error(t("adminSignupRequests:rejectModal.reasonRequired"));
      return;
    }
    rejectMutation.mutate(
      { id: rejectState.id, payload: { rejectionReason: rejectReason } },
      {
        onSuccess: () => {
          toast.success(
            t("adminSignupRequests:rejectModal.rejected", {
              name: rejectState.name,
            }),
          );
          setRejectState(null);
          setRejectReason("");
        },
      },
    );
  };
  return (
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
          <Trans
            i18nKey="adminSignupRequests:rejectModal.message"
            values={{ name: rejectState.name }}
            components={{
              strong: <strong className="font-semibold text-gray-800" />,
            }}
          />
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
  );
}
