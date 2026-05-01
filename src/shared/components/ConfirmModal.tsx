import React from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { Modal } from "@/app/components/modals/Modal";
import { useLanguage } from "@/app/contexts/useLanguage";

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** When true the confirm button renders in red (destructive action). */
  danger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  danger = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useLanguage();

  return (
    <Modal isOpen={open} onClose={onCancel} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              danger ? "bg-red-100" : "bg-yellow-100"
            }`}
          >
            {danger ? (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            ) : (
              <HelpCircle className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel ?? t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#0F5C47] hover:bg-[#0d4a39]"
            }`}
          >
            {confirmLabel ?? t("confirm")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
