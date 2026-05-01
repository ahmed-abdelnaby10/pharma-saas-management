import React, { useState } from "react";
import { Clock, Plus, Minus, Loader2, X } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { useApp } from "@/app/contexts/useApp";
import { CashTransactionModal } from "@/app/components/modals";
import {
  useCurrentShiftQuery,
  useShiftsQuery,
  useOpenShiftMutation,
  useCloseShiftMutation,
  type Shift,
} from "../api";
import { toast } from "sonner";

// ─── Open Shift Modal ─────────────────────────────────────────────────────────

interface OpenShiftModalProps {
  branchId: string | undefined;
  branchName: string | undefined;
  onClose: () => void;
  onConfirm: (openingBalance: number) => void;
  isPending: boolean;
}

function OpenShiftModal({ branchId, branchName, onClose, onConfirm, isPending }: OpenShiftModalProps) {
  const [openingBalance, setOpeningBalance] = useState<string>("0");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasErrors = Object.keys(errors).length > 0;

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!branchId) e.branch = "No branch selected — please select a branch from the header.";
    const val = parseFloat(openingBalance);
    if (isNaN(val)) e.openingBalance = "Opening balance must be a number";
    else if (val < 0) e.openingBalance = "Opening balance cannot be negative";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onConfirm(parseFloat(openingBalance));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Open Shift</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
            <p className={`text-sm px-3 py-2 rounded-lg border ${errors.branch ? "border-red-400 bg-red-50 text-red-700" : "border-gray-200 bg-gray-50 text-gray-800"}`}>
              {branchName ?? "No branch selected"}
            </p>
            {errors.branch && <p className="mt-1 text-xs text-red-600">{errors.branch}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening Balance ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={openingBalance}
              onChange={(e) => {
                setOpeningBalance(e.target.value);
                setErrors((prev) => { const next = { ...prev }; delete next.openingBalance; return next; });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm ${errors.openingBalance ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.openingBalance && <p className="mt-1 text-xs text-red-600">{errors.openingBalance}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending || hasErrors}
              className="flex items-center gap-2 px-5 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] disabled:opacity-50 text-sm font-medium"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Open Shift
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ShiftsPage() {
  const { t } = useLanguage();
  const { currentBranch } = useApp();
  const [cashTransactionType, setCashTransactionType] = React.useState<"in" | "out" | null>(null);
  const [showOpenModal, setShowOpenModal] = useState(false);

  const { data: activeShift, isLoading: loadingCurrent } = useCurrentShiftQuery();
  const { data: shifts = [], isLoading: loadingHistory } = useShiftsQuery({ limit: 20 });
  const openShiftMutation = useOpenShiftMutation();
  const closeShiftMutation = useCloseShiftMutation();

  const handleStartShift = async (openingBalance: number) => {
    try {
      await openShiftMutation.mutateAsync({
        branchId: currentBranch?.id ?? "",
        openingCash: openingBalance,
      });
      toast.success("Shift opened successfully");
      setShowOpenModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to open shift");
    }
  };

  const handleEndShift = async () => {
    if (!activeShift) return;
    try {
      await closeShiftMutation.mutateAsync({ id: activeShift.id, closingCash: 0 });
      toast.success("Shift closed successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to close shift");
    }
  };

  const handleCashTransaction = (transaction: { amount: number; reason: string; type: "in" | "out" }) => {
    console.log("Cash transaction:", transaction);
    toast.success(`Cash ${transaction.type === "in" ? "In" : "Out"}: $${transaction.amount}`);
    setCashTransactionType(null);
  };

  const isShiftOpen = activeShift?.status === "open";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("shifts")}</h1>
          <p className="text-sm text-gray-600 mt-1">Manage cash shifts and handovers</p>
        </div>
        {!loadingCurrent && !isShiftOpen && (
          <button
            onClick={() => setShowOpenModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]"
          >
            <Clock className="w-4 h-4" />
            {t("startShift")}
          </button>
        )}
      </div>

      {/* Active shift card */}
      {isShiftOpen && activeShift && (
        <div className="bg-gradient-to-r from-[#0F5C47] to-[#1a8c6b] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">{t("currentShift")}</h3>
              <p className="text-sm text-white/80">
                Started at {new Date(activeShift.openedAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80 mb-1">{t("startingCash")}</p>
              <p className="text-2xl font-semibold">${activeShift.openingCash.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80 mb-1">{t("shiftSales")}</p>
              <p className="text-2xl font-semibold">${(activeShift.totalSales ?? 0).toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80 mb-1">Transactions</p>
              <p className="text-2xl font-semibold">{activeShift.totalTransactions ?? 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCashTransactionType("in")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t("cashIn")}
            </button>
            <button
              onClick={() => setCashTransactionType("out")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
              {t("cashOut")}
            </button>
            <button
              onClick={handleEndShift}
              disabled={closeShiftMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0F5C47] hover:bg-white/90 rounded-lg transition-colors font-medium ml-auto disabled:opacity-60"
            >
              {closeShiftMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("endShift")}
            </button>
          </div>
        </div>
      )}

      {/* Shift history */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift History</h3>
        </div>

        {loadingHistory ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading shifts…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("branch")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">Start</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">End</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">Sales</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {shifts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-gray-500">
                      No shift history yet.
                    </td>
                  </tr>
                )}
                {shifts.map((shift: Shift) => (
                  <tr key={shift.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {shift.user?.name ?? "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {shift.branch?.name ?? "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(shift.openedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {shift.closedAt ? new Date(shift.closedAt).toLocaleString() : "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">
                      {shift.totalSales != null ? `$${shift.totalSales.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize whitespace-nowrap ${
                        shift.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {shift.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {cashTransactionType && (
        <CashTransactionModal
          isOpen={!!cashTransactionType}
          type={cashTransactionType}
          onClose={() => setCashTransactionType(null)}
          onSave={handleCashTransaction}
        />
      )}
      {showOpenModal && (
        <OpenShiftModal
          branchId={currentBranch?.id}
          branchName={currentBranch?.name}
          onClose={() => setShowOpenModal(false)}
          onConfirm={handleStartShift}
          isPending={openShiftMutation.isPending}
        />
      )}
    </div>
  );
}
