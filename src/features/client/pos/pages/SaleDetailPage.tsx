import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Loader2,
  RotateCcw,
  Receipt,
  User,
  CreditCard,
  DollarSign,
  Package,
} from "lucide-react";
import { useSaleQuery } from "@/features/client/pos/api/pos-history.hooks";
import type { Sale } from "@/features/client/pos/api/pos-history.types";

// Re-use ReturnModal from SaleHistoryPage via a shared import approach —
// we define a lightweight inline version here to keep the file self-contained.
import { ReturnModal } from "./SaleHistoryReturnModal";

// ─── Payment method badge ──────────────────────────────────────────────────────

function PaymentBadge({ method }: { method: string }) {
  const isCard = method.toLowerCase() === "card";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        isCard ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
      }`}
    >
      {isCard ? <CreditCard className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
      {method}
    </span>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const styles: Record<string, string> = {
    completed:  "bg-green-50 text-green-700",
    returned:   "bg-amber-50 text-amber-700",
    voided:     "bg-red-50 text-red-700",
    pending:    "bg-gray-100 text-gray-600",
  };
  const cls = styles[status.toLowerCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  );
}

// ─── Detail content ────────────────────────────────────────────────────────────

function SaleDetail({ sale }: { sale: Sale }) {
  const [showReturn, setShowReturn] = useState(false);

  const net    = sale.netAmount  ?? sale.total - (sale.tax ?? 0);
  const change = sale.changeAmount ?? 0;
  const paid   = sale.paymentAmount ?? sale.total;

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                {sale.receiptNumber ? `Receipt #${sale.receiptNumber}` : `Sale ${sale.id.slice(0, 10)}…`}
              </h2>
              <StatusBadge status={sale.status} />
            </div>
            <p className="text-sm text-gray-500">{new Date(sale.createdAt).toLocaleString()}</p>
          </div>

          <div className="flex items-center gap-2">
            <PaymentBadge method={sale.paymentMethod} />
            <button
              onClick={() => setShowReturn(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50"
            >
              <RotateCcw className="w-4 h-4" />
              Return items
            </button>
          </div>
        </div>

        {/* Patient */}
        {(sale.patientName ?? sale.customerName) && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Patient / Customer:</span>
            <span>{sale.patientName ?? sale.customerName}</span>
            {sale.prescriptionId && (
              <span className="ml-2 text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                Rx #{sale.prescriptionId.slice(-8).toUpperCase()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Line items */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Package className="w-4 h-4 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-900">
            Line Items ({sale.items.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sale.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {item.catalogItem?.nameEn ?? item.productName}
                    </p>
                    {item.catalogItem?.nameAr && (
                      <p className="text-xs text-gray-500 mt-0.5">{item.catalogItem.nameAr}</p>
                    )}
                    {item.batchId && (
                      <p className="text-xs text-gray-400 mt-0.5">Batch: {item.batchId.slice(-8)}</p>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right text-sm text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-3 text-right text-sm text-gray-700">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    ${(item.subtotal ?? item.totalPrice ?? item.unitPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
        <div className="space-y-2 max-w-xs ml-auto">
          <Row label="Subtotal"         value={`$${sale.subtotal.toFixed(2)}`} />
          {sale.discountAmount > 0 && (
            <Row label={`Discount${sale.discount ? ` (${sale.discount}%)` : ""}`}
                 value={`-$${sale.discountAmount.toFixed(2)}`}
                 valueClass="text-red-600" />
          )}
          <Row label="VAT / Tax"        value={`$${(sale.vatAmount ?? sale.tax).toFixed(2)}`} />
          <div className="border-t border-gray-200 pt-2">
            <Row label="Total"          value={`$${sale.total.toFixed(2)}`}    bold />
          </div>
          {paid > 0 && <Row label="Amount Paid"    value={`$${paid.toFixed(2)}`} />}
          {change > 0 && <Row label="Change"         value={`$${change.toFixed(2)}`} />}
        </div>
      </div>

      {showReturn && (
        <ReturnModal sale={sale} onClose={() => setShowReturn(false)} />
      )}
    </div>
  );
}

function Row({
  label, value, bold = false, valueClass = "",
}: { label: string; value: string; bold?: boolean; valueClass?: string }) {
  return (
    <div className={`flex justify-between text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>
      <span>{label}</span>
      <span className={valueClass || (bold ? "text-gray-900" : "")}>{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SaleDetailPage() {
  const { saleId } = useParams<{ saleId: string }>();
  const navigate   = useNavigate();
  const { data: sale, isLoading, isError } = useSaleQuery(saleId ?? "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/app/sales/history")}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sale Detail</h1>
          <p className="text-sm text-gray-500 mt-0.5">Full receipt and payment breakdown</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading sale…
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
          Could not load sale. It may have been deleted or you do not have access.
        </div>
      )}

      {sale && <SaleDetail sale={sale} />}
    </div>
  );
}
