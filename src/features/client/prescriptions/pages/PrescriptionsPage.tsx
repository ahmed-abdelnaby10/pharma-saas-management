import React, { useEffect, useState } from "react";
import { Search, Plus, CheckCircle, XCircle, Loader2, X, Filter, FileText } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { toast } from "sonner";
import { useLocation } from "react-router";
import {
  usePrescriptionsQuery,
  useCreatePrescriptionMutation,
  useCancelPrescriptionMutation,
  useDispensePrescriptionMutation,
} from "@/features/client/prescriptions/api";
import type {
  Prescription,
  PrescriptionStatus,
  CreatePrescriptionPayload,
} from "@/features/client/prescriptions/api";

// ─── OCR pre-fill data shape ──────────────────────────────────────────────────

interface OcrPrefillData {
  ocrDocumentId: string;
  doctorName?: string;
  doctorLicense?: string;
  issuedDate?: string;
  expiryDate?: string;
  notes?: string;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<PrescriptionStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  DISPENSED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
};

function StatusBadge({ status }: { status: PrescriptionStatus }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_STYLES[status]}`}>
      {status.toLowerCase()}
    </span>
  );
}

// ─── Create prescription form ─────────────────────────────────────────────────

interface CreatePrescriptionFormProps {
  onClose: () => void;
  prefill?: OcrPrefillData;
  onCreated?: (id: string) => void;
}

function CreatePrescriptionForm({ onClose, prefill, onCreated }: CreatePrescriptionFormProps) {
  const create = useCreatePrescriptionMutation();
  const [ocrDocumentId] = useState<string | undefined>(prefill?.ocrDocumentId);
  const [form, setForm] = useState<CreatePrescriptionPayload>({
    doctorName:    prefill?.doctorName    ?? "",
    doctorLicense: prefill?.doctorLicense ?? "",
    issuedDate:    prefill?.issuedDate    ?? "",
    expiryDate:    prefill?.expiryDate    ?? "",
    notes:         prefill?.notes         ?? "",
    items: [{ medicineId: "", quantity: 1, dosage: "", instructions: "" }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hasErrors = Object.keys(errors).length > 0;

  function updateItem(
    index: number,
    key: keyof CreatePrescriptionPayload["items"][0],
    value: string | number,
  ) {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, items };
    });
    // clear per-item error
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`item_${index}_${key}`];
      delete next.items;
      return next;
    });
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { medicineId: "", quantity: 1 }],
    }));
    setErrors((prev) => { const next = { ...prev }; delete next.items; return next; });
  }

  function removeItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    // clear errors for removed item
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`item_${index}_medicineId`];
      delete next[`item_${index}_quantity`];
      return next;
    });
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (form.items.length === 0) {
      e.items = "At least one medication item is required";
    }
    form.items.forEach((item, idx) => {
      if (!item.medicineId.trim()) e[`item_${idx}_medicineId`] = "Medicine ID is required";
      if (item.quantity <= 0) e[`item_${idx}_quantity`] = "Quantity must be greater than 0";
    });
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      const payload: any = { ...form };
      if (ocrDocumentId) payload.ocrDocumentId = ocrDocumentId;
      const result = await create.mutateAsync(payload);
      toast.success("Prescription created");
      onCreated?.(result?.id ?? "");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to create prescription");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">New Prescription</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
              <input
                type="text"
                value={form.doctorName}
                onChange={(e) => setForm((p) => ({ ...p, doctorName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor License</label>
              <input
                type="text"
                value={form.doctorLicense}
                onChange={(e) => setForm((p) => ({ ...p, doctorLicense: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issued Date</label>
              <input
                type="date"
                value={form.issuedDate}
                onChange={(e) => setForm((p) => ({ ...p, issuedDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm resize-none"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Medications <span className="text-red-500">*</span></p>
              <button
                type="button"
                onClick={addItem}
                className="text-xs text-[#0F5C47] hover:underline"
              >
                + Add item
              </button>
            </div>
            {errors.items && <p className="mb-2 text-xs text-red-600">{errors.items}</p>}
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-start bg-gray-50 rounded-lg p-3">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <input
                        placeholder="Medicine ID"
                        value={item.medicineId}
                        onChange={(e) => updateItem(idx, "medicineId", e.target.value)}
                        className={`w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-[#0F5C47] outline-none ${errors[`item_${idx}_medicineId`] ? "border-red-400" : "border-gray-300"}`}
                      />
                      {errors[`item_${idx}_medicineId`] && (
                        <p className="mt-0.5 text-xs text-red-600">{errors[`item_${idx}_medicineId`]}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                        className={`w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-[#0F5C47] outline-none ${errors[`item_${idx}_quantity`] ? "border-red-400" : "border-gray-300"}`}
                      />
                      {errors[`item_${idx}_quantity`] && (
                        <p className="mt-0.5 text-xs text-red-600">{errors[`item_${idx}_quantity`]}</p>
                      )}
                    </div>
                    <input
                      placeholder="Dosage"
                      value={item.dosage ?? ""}
                      onChange={(e) => updateItem(idx, "dosage", e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0F5C47] outline-none"
                    />
                    <input
                      placeholder="Instructions"
                      value={item.instructions ?? ""}
                      onChange={(e) => updateItem(idx, "instructions", e.target.value)}
                      className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0F5C47] outline-none"
                    />
                  </div>
                  {form.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={create.isPending || hasErrors}
              className="flex items-center gap-2 px-5 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] disabled:opacity-50 text-sm font-medium"
            >
              {create.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create prescription
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

// ─── Dispense modal ───────────────────────────────────────────────────────────

function DispenseModal({
  prescription,
  onClose,
}: {
  prescription: Prescription;
  onClose: () => void;
}) {
  const [saleId, setSaleId] = useState("");
  const dispense = useDispensePrescriptionMutation();

  async function handleDispense(e: React.FormEvent) {
    e.preventDefault();
    try {
      await dispense.mutateAsync({ id: prescription.id, payload: { saleId } });
      toast.success("Prescription dispensed");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to dispense");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispense Prescription</h3>
        <form onSubmit={handleDispense} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Linked Sale ID <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={saleId}
              onChange={(e) => setSaleId(e.target.value)}
              placeholder="Enter sale ID from POS"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={dispense.isPending}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
            >
              {dispense.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Dispense
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PrescriptionsPage() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PrescriptionStatus | "ALL">("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [dispenseTarget, setDispenseTarget] = useState<Prescription | null>(null);
  const [ocrPrefill, setOcrPrefill] = useState<OcrPrefillData | undefined>(undefined);
  const [ocrCreatedId, setOcrCreatedId] = useState<string | null>(null);

  // Auto-open create form if navigated from OCR page with pre-fill data
  useEffect(() => {
    const state = location.state as { ocrData?: OcrPrefillData } | null;
    if (state?.ocrData) {
      setOcrPrefill(state.ocrData);
      setShowCreate(true);
      // Clear navigation state to prevent re-triggering on refresh
      window.history.replaceState({}, "", location.pathname);
    }
  }, []);

  const { data: prescriptions = [], isLoading } = usePrescriptionsQuery({
    search,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const cancel = useCancelPrescriptionMutation();

  async function handleCancel(id: string) {
    try {
      await cancel.mutateAsync(id);
      toast.success("Prescription cancelled");
    } catch {
      toast.error("Failed to cancel");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Prescriptions</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and dispense prescriptions</p>
        </div>
        <div className="flex items-center gap-3">
          {ocrCreatedId && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Prescription created from OCR
            </span>
          )}
          <button
            onClick={() => { setOcrPrefill(undefined); setShowCreate(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Prescription
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search prescriptions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="DISPENSED">Dispensed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading…
          </div>
        ) : prescriptions.length === 0 ? (
          <EmptyState
            icon={FileText}
            heading="No prescriptions"
            subline="Create a prescription manually or generate one from an OCR document"
            action={{ label: "New Prescription", onClick: () => setShowCreate(true) }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prescriptions.map((rx) => (
                  <tr key={rx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">{rx.id.slice(0, 8)}…</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{rx.patientName ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{rx.doctorName ?? "—"}</td>
                    <td className="px-6 py-4"><StatusBadge status={rx.status} /></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{rx.items.length}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {rx.issuedDate ? new Date(rx.issuedDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {rx.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => setDispenseTarget(rx)}
                            className="text-xs text-green-600 hover:text-green-800 font-medium mr-3"
                          >
                            Dispense
                          </button>
                          <button
                            onClick={() => handleCancel(rx.id)}
                            disabled={cancel.isPending}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreatePrescriptionForm
          onClose={() => { setShowCreate(false); setOcrPrefill(undefined); }}
          prefill={ocrPrefill}
          onCreated={(id) => { setOcrCreatedId(id); }}
        />
      )}
      {dispenseTarget && (
        <DispenseModal
          prescription={dispenseTarget}
          onClose={() => setDispenseTarget(null)}
        />
      )}
    </div>
  );
}
