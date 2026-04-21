import React from "react";
import { Clock, DollarSign, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useApp } from "@/app/contexts/AppContext";
import { CashTransactionModal } from "@/app/components/modals";

const mockShifts = [
  {
    id: "1",
    user: "Ahmed Al-Rashid",
    branch: "Main Branch",
    start: "2026-03-09 09:00",
    end: "2026-03-09 17:00",
    sales: 6842,
    status: "Closed",
  },
  {
    id: "2",
    user: "Sarah Johnson",
    branch: "North Branch",
    start: "2026-03-08 09:00",
    end: "2026-03-08 17:00",
    sales: 5234,
    status: "Closed",
  },
];

export function ShiftsPage() {
  const { t } = useLanguage();
  const { currentShift, setCurrentShift } = useApp();
  const [cashTransactionType, setCashTransactionType] = React.useState<
    "in" | "out" | null
  >(null);

  const startShift = () => {
    setCurrentShift({
      id: "shift-new",
      branchId: "branch-1",
      userId: "user-1",
      startTime: new Date(),
      startingCash: 500,
      isOpen: true,
    });
  };

  const endShift = () => {
    setCurrentShift(null);
  };

  const handleCashTransaction = (transaction: {
    amount: number;
    reason: string;
    type: "in" | "out";
  }) => {
    console.log("Cash transaction:", transaction);
    alert(
      `Cash ${transaction.type === "in" ? "In" : "Out"}: $${transaction.amount}\nReason: ${transaction.reason}`,
    );
    setCashTransactionType(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("shifts")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage cash shifts and handovers
          </p>
        </div>
        {!currentShift?.isOpen && (
          <button
            onClick={startShift}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]"
          >
            <Clock className="w-4 h-4" />
            {t("startShift")}
          </button>
        )}
      </div>

      {currentShift?.isOpen && (
        <div className="bg-gradient-to-r from-[#0F5C47] to-[#1a8c6b] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">
                {t("currentShift")}
              </h3>
              <p className="text-sm text-white/80">
                Started at {currentShift.startTime.toLocaleTimeString()}
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
              <p className="text-2xl font-semibold">
                ${currentShift.startingCash}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80 mb-1">{t("shiftSales")}</p>
              <p className="text-2xl font-semibold">$2,340</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80 mb-1">{t("expectedCash")}</p>
              <p className="text-2xl font-semibold">$2,840</p>
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
              onClick={endShift}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0F5C47] hover:bg-white/90 rounded-lg transition-colors font-medium ml-auto"
            >
              {t("endShift")}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shift History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("branch")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Start
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  End
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Sales
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("status")}
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {mockShifts.map((shift) => (
                <tr
                  key={shift.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {shift.user}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {shift.branch}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {shift.start}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {shift.end}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">
                    ${shift.sales}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 whitespace-nowrap">
                      {shift.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-[#0F5C47] hover:text-[#0d4a39] font-medium">
                      {t("view")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {cashTransactionType && (
        <CashTransactionModal
          isOpen={!!cashTransactionType}
          type={cashTransactionType}
          onClose={() => setCashTransactionType(null)}
          onSave={handleCashTransaction}
        />
      )}
    </div>
  );
}
