import { Modal } from "@/app/components/modals";
import { useLanguage } from "@/app/contexts/useLanguage";

interface CancelSubscriptionModalProps {
  tenantName: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelSubscriptionModal({
  tenantName,
  isPending,
  onClose,
  onConfirm,
}: CancelSubscriptionModalProps) {
  const { t } = useLanguage();

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={t("adminSubscriptions:cancelModal.title")}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {t("adminSubscriptions:cancelModal.message", { tenantName })}
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-60"
          >
            {t("adminSubscriptions:cancelModal.actions.keep")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
          >
            {isPending
              ? t("adminSubscriptions:cancelModal.actions.canceling")
              : t("adminSubscriptions:cancelModal.actions.confirm")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
