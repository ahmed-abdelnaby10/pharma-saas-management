import { useState } from "react";
import { useRtl } from "@/shared/hooks/useRtl";
import {
  Plus,
  FileText,
  Package,
  Loader2,
  Eye,
  Trash2,
  Check,
  X,
  Pencil,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/app/contexts/useLanguage";
import { PurchaseOrderModal } from "@/app/components/modals/PurchaseOrderModal";
import { PurchaseOrderDetailsModal } from "@/app/components/modals/PurchaseOrderDetailsModal";
import {
  usePurchaseOrdersQuery,
  usePurchaseOrderQuery,
  useCreatePurchaseOrderMutation,
  useAddPOItemMutation,
  useUpdatePOItemMutation,
  useDeletePOItemMutation,
  useUpdatePOStatusMutation,
} from "../api";
import type { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus } from "../api";

// ─── Status badge ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<PurchaseOrderStatus, string> = {
  draft:     "bg-gray-100 text-gray-600",
  pending:   "bg-orange-100 text-orange-700",
  approved:  "bg-blue-100 text-blue-700",
  ordered:   "bg-purple-100 text-purple-700",
  received:  "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// ─── Draft line-item row ───────────────────────────────────────────────────────

interface ItemRowProps {
  item: PurchaseOrderItem;
  orderId: string;
  readOnly?: boolean;
}

function ItemRow({ item, orderId, readOnly }: ItemRowProps) {
  const updateItem = useUpdatePOItemMutation();
  const deleteItem = useDeletePOItemMutation();

  const [editing, setEditing] = useState(false);
  const [qty,     setQty]     = useState(item.quantity);
  const [cost,    setCost]    = useState(item.unitCost);

  async function handleSave() {
    if (!item.id) return;
    try {
      await updateItem.mutateAsync({
        orderId,
        itemId: item.id,
        payload: { quantity: qty, unitCost: cost },
      });
      setEditing(false);
    } catch {
      toast.error("Failed to update item");
    }
  }

  async function handleDelete() {
    if (!item.id) return;
    try {
      await deleteItem.mutateAsync({ orderId, itemId: item.id });
    } catch {
      toast.error("Failed to delete item");
    }
  }

  if (editing) {
    return (
      <tr className="bg-teal-50">
        <td className="px-4 py-2 text-sm text-gray-900">{item.itemName ?? item.inventoryItemId}</td>
        <td className="px-4 py-2">
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-teal-500 outline-none"
          />
        </td>
        <td className="px-4 py-2">
          <input
            type="number"
            min={0}
            step={0.01}
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-teal-500 outline-none"
          />
        </td>
        <td className="px-4 py-2 text-sm text-gray-700 text-right">${(qty * cost).toFixed(2)}</td>
        <td className="px-4 py-2 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={handleSave}
              disabled={updateItem.isPending}
              className="p-1 rounded text-teal-600 hover:bg-teal-100"
            >
              {updateItem.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button onClick={() => setEditing(false)} className="p-1 rounded text-gray-500 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 text-sm text-gray-900">{item.itemName ?? item.inventoryItemId}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{item.quantity}</td>
      <td className="px-4 py-2 text-sm text-gray-700">${item.unitCost.toFixed(2)}</td>
      <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
        ${(item.quantity * item.unitCost).toFixed(2)}
      </td>
      <td className="px-4 py-2 text-right">
        {!readOnly && (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => setEditing(true)} className="p-1 rounded text-gray-400 hover:text-teal-600 hover:bg-teal-50">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteItem.isPending}
              className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
            >
              {deleteItem.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

// ─── Add-item row ──────────────────────────────────────────────────────────────

function AddItemRow({ orderId }: { orderId: string }) {
  const addItem = useAddPOItemMutation();
  const [open,  setOpen]  = useState(false);
  const [invId, setInvId] = useState("");
  const [qty,   setQty]   = useState(1);
  const [cost,  setCost]  = useState(0);

  async function handleAdd() {
    if (!invId.trim()) { toast.error("Inventory Item ID is required"); return; }
    try {
      await addItem.mutateAsync({ orderId, payload: { inventoryItemId: invId.trim(), quantity: qty, unitCost: cost } });
      setInvId(""); setQty(1); setCost(0); setOpen(false);
    } catch {
      toast.error("Failed to add item");
    }
  }

  if (!open) {
    return (
      <tr>
        <td colSpan={5} className="px-4 py-2">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add item
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="bg-blue-50">
      <td className="px-4 py-2">
        <input
          placeholder="Inventory item ID"
          value={invId}
          onChange={(e) => setInvId(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-teal-500"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-teal-500"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          min={0}
          step={0.01}
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-teal-500"
        />
      </td>
      <td className="px-4 py-2 text-sm text-right">${(qty * cost).toFixed(2)}</td>
      <td className="px-4 py-2 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleAdd}
            disabled={addItem.isPending}
            className="p-1 rounded text-teal-600 hover:bg-teal-100"
          >
            {addItem.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(false)} className="p-1 rounded text-gray-500 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── DRAFT detail panel ────────────────────────────────────────────────────────

function DraftDetailPanel({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { data: order, isLoading } = usePurchaseOrderQuery(orderId);
  const updateStatus = useUpdatePOStatusMutation();
  const { dirFlip } = useRtl();

  const isDraft = order?.status === "draft";

  async function handleSubmit() {
    try {
      await updateStatus.mutateAsync({ id: orderId, payload: { status: "ordered" } });
      toast.success("Order submitted — status changed to Ordered");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to submit order");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white shadow-xl flex flex-col h-full overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {isLoading ? "…" : `PO #${order?.orderNumber}`}
            </h3>
            {order && (
              <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize mt-0.5 ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…
          </div>
        ) : order ? (
          <div className="p-6 space-y-6">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Supplier</p>
                <p className="font-medium text-gray-900 mt-0.5">{order.supplier?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Created</p>
                <p className="font-medium text-gray-900 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              {order.expectedDeliveryDate && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Expected Delivery</p>
                  <p className="font-medium text-gray-900 mt-0.5">{new Date(order.expectedDeliveryDate).toLocaleDateString()}</p>
                </div>
              )}
              {order.notes && (
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">Notes</p>
                  <p className="text-gray-700 mt-0.5">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Line items */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Line Items {isDraft && <span className="text-xs font-normal text-gray-400">(editable while DRAFT)</span>}
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item: PurchaseOrderItem) => (
                      <ItemRow key={item.id ?? item.inventoryItemId} item={item} orderId={order.id} readOnly={!isDraft} />
                    ))}
                    {isDraft && <AddItemRow orderId={order.id} />}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="space-y-1 text-sm min-w-[220px]">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.tax != null && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-1">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Submit action — only for DRAFT */}
            {isDraft && (
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={updateStatus.isPending || order.items.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 text-sm font-medium"
                >
                  {updateStatus.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className={`w-4 h-4 ${dirFlip}`} />
                  )}
                  Submit Order → Ordered
                </button>
                {order.items.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">Add at least one item before submitting</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="p-6 text-sm text-gray-400">Order not found.</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PurchasingPage() {
  const { t } = useLanguage();
  const [isModalOpen,        setIsModalOpen]        = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder,      setSelectedOrder]      = useState<PurchaseOrder | null>(null);
  const [draftPanelId,       setDraftPanelId]       = useState<string | null>(null);

  const { data: orders = [], isLoading } = usePurchaseOrdersQuery();
  const createMutation = useCreatePurchaseOrderMutation();

  const totalValue   = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending" || o.status === "approved").length;
  const draftCount   = orders.filter((o) => o.status === "draft").length;

  const handleSaveOrder = async (orderData: any) => {
    try {
      await createMutation.mutateAsync(orderData);
      toast.success("Purchase order created");
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to create purchase order");
    }
  };

  const handleViewOrder = (order: PurchaseOrder) => {
    if (order.status === "draft") {
      setDraftPanelId(order.id);
    } else {
      setSelectedOrder(order);
      setIsDetailsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("purchasing")}</h1>
          <p className="text-sm text-gray-600 mt-1">Manage purchase orders and suppliers</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] text-sm font-medium"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          {t("createPO")}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {isLoading ? "—" : orders.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending / Approved</p>
              <p className="text-2xl font-semibold text-orange-600 mt-1">
                {isLoading ? "—" : pendingCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {isLoading ? "—" : `$${totalValue.toLocaleString()}`}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {draftCount > 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          {draftCount} draft order{draftCount !== 1 ? "s" : ""} — click to edit items and submit.
        </p>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchase Orders</h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading orders…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">Order #</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("supplier")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("date")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("items")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("amount")}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("status")}</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-gray-500">
                      No purchase orders yet.
                    </td>
                  </tr>
                )}
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => handleViewOrder(order)}>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 font-mono whitespace-nowrap">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {order.supplier?.name ?? "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">
                      {order.items.length}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right whitespace-nowrap">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize whitespace-nowrap ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="inline-flex items-center gap-1 text-sm text-[#0F5C47] hover:text-[#0d4a39] font-medium"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {order.status === "draft" ? "Edit" : t("view")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PurchaseOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
      />
      <PurchaseOrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />
      {draftPanelId && (
        <DraftDetailPanel
          orderId={draftPanelId}
          onClose={() => setDraftPanelId(null)}
        />
      )}
    </div>
  );
}
