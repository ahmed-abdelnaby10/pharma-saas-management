import { useState } from "react";
import { Loader2, Eye, RotateCcw, Search, X, Receipt } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { useNavigate } from "react-router";
import { useSaleHistoryQuery } from "@/features/client/pos/api/pos-history.hooks";
import { useShiftsQuery } from "@/features/client/shifts/api/shifts.hooks";
import type { Sale } from "@/features/client/pos/api/pos-history.types";
import { ReturnModal } from "./SaleHistoryReturnModal";

export function SaleHistoryPage() {
  const navigate = useNavigate();
  const [returnSale, setReturnSale] = useState<Sale | null>(null);

  // ─── Filter state ─────────────────────────────────────────────────────────
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [search, setSearch] = useState("");

  // Build query params (only pass non-empty values)
  const params = {
    limit: 100,
    ...(dateFrom && { from: dateFrom }),
    ...(dateTo   && { to:   dateTo }),
    ...(shiftId  && { shiftId }),
  };

  const { data: sales = [], isLoading } = useSaleHistoryQuery(params);
  const { data: shifts = [] } = useShiftsQuery({ limit: 50, status: "closed" });

  // Client-side search filter (receipt #, customer name)
  const filtered = search.trim()
    ? sales.filter(
        (s) =>
          (s.receiptNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (s.customerName ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (s.patientName ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : sales;

  function clearFilters() {
    setDateFrom("");
    setDateTo("");
    setShiftId("");
    setSearch("");
  }

  const hasFilters = dateFrom || dateTo || shiftId || search;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Sale History</h1>
        <p className="text-sm text-gray-600 mt-1">View past sales and process returns</p>
      </div>

      {/* Filters bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Receipt #, customer…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Date From */}
          <div className="min-w-[150px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Date To */}
          <div className="min-w-[150px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Shift */}
          <div className="min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Shift</label>
            <select
              value={shiftId}
              onChange={(e) => setShiftId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All shifts</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {new Date(shift.openedAt).toLocaleDateString()} —{" "}
                  {shift.user?.name ?? shift.userId}
                </option>
              ))}
            </select>
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading sales…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            heading="No sales found"
            subline={hasFilters ? "Try adjusting the date range or search filter" : "Sales will appear here after your first transaction"}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/app/sales/history/${sale.id}`)}
                  >
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {sale.receiptNumber ?? sale.id.slice(0, 12) + "…"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {sale.patientName ?? sale.customerName ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sale.items.length}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {sale.paymentMethod}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/app/sales/history/${sale.id}`)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => setReturnSale(sale)}
                          className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 font-medium"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Return
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-3 border-t border-gray-200 text-xs text-gray-500">
          {filtered.length} sale{filtered.length !== 1 ? "s" : ""}
          {hasFilters && ` (filtered from ${sales.length})`}
        </div>
      </div>

      {returnSale && (
        <ReturnModal sale={returnSale} onClose={() => setReturnSale(null)} />
      )}
    </div>
  );
}
