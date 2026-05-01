import { useState } from "react";
import { Loader2, X, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useCreateSaleReturnMutation } from "@/features/client/pos/api/pos-returns.hooks";
import type { Sale, SaleItem } from "@/features/client/pos/api/pos-history.types";
import type { SaleReturnItem } from "@/features/client/pos/api/pos-returns.types";

interface ReturnModalProps {
  sale: Sale;
  onClose: () => void;
}

export function ReturnModal({ sale, onClose }: ReturnModalProps) {
  const createReturn = useCreateSaleReturnMutation();

  const [returnItems, setReturnItems] = useState<
    Record<string, { qty: number; reason: string }>
  >(() =>
    Object.fromEntries(
      sale.items.map((item) => [item.id, { qty: 0, reason: "" }]),
    ),
  );

  function setQty(itemId: string, qty: number, max: number) {
    setReturnItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], qty: Math.min(Math.max(0, qty), max) },
    }));
  }

  function setReason(itemId: string, reason: string) {
    setReturnItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], reason },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const items: SaleReturnItem[] = Object.entries(returnItems)
      .filter(([, v]) => v.qty > 0)
      .map(([saleItemId, v]) => ({
        saleItemId,
        quantityReturned: v.qty,
        reason: v.reason || undefined,
      }));

    if (items.length === 0) {
      toast.error("Select at least one item to return");
      return;
    }

    try {
      await createReturn.mutateAsync({ saleId: sale.id, payload: { items } });
      toast.success("Return processed successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to process return");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Return Items</h3>
            <p className="text-xs text-gray-500 mt-0.5">Sale {sale.id.slice(0, 12)}…</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          {sale.items.map((item: SaleItem) => {
            const state = returnItems[item.id];
            return (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.catalogItem?.nameEn ?? item.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty purchased: {item.quantity} · ${item.unitPrice.toFixed(2)} ea
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <label className="text-xs text-gray-600 w-20">Return qty</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setQty(item.id, state.qty - 1, item.quantity)}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{state.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.id, state.qty + 1, item.quantity)}
                      className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {state.qty > 0 && (
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-gray-600 w-20">Reason</label>
                    <input
                      type="text"
                      value={state.reason}
                      onChange={(e) => setReason(item.id, e.target.value)}
                      placeholder="Optional"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0F5C47] outline-none"
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createReturn.isPending}
              className="flex items-center gap-2 px-5 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] disabled:opacity-50 text-sm font-medium"
            >
              {createReturn.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Process return
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
