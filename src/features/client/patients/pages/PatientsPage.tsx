import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, Loader2, X, Users } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { toast } from "sonner";
import {
  usePatientsQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} from "@/features/client/patients/api";
import type { Patient, CreatePatientPayload } from "@/features/client/patients/api";

// ─── Patient form modal ───────────────────────────────────────────────────────

interface PatientFormProps {
  initial?: Patient;
  onClose: () => void;
}

function PatientForm({ initial, onClose }: PatientFormProps) {
  const isEdit = !!initial;
  const create = useCreatePatientMutation();
  const update = useUpdatePatientMutation();

  const [form, setForm] = useState<CreatePatientPayload>({
    name: initial?.name ?? "",
    nationalId: initial?.nationalId ?? "",
    dateOfBirth: initial?.dateOfBirth ?? "",
    gender: initial?.gender,
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    address: initial?.address ?? "",
    notes: initial?.notes ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const busy = create.isPending || update.isPending;
  const hasErrors = Object.keys(errors).length > 0;

  function set<K extends keyof CreatePatientPayload>(
    key: K,
    value: CreatePatientPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[key as string]; return next; });
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    const name = form.name.trim();
    if (!name) e.name = "Name is required";
    else if (name.length < 2) e.name = "Name must be at least 2 characters";
    else if (name.length > 200) e.name = "Name must be 200 characters or less";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (form.phone && form.phone.length > 30)
      e.phone = "Phone must be 30 characters or less";
    if (form.nationalId && (form.nationalId as string).length > 50)
      e.nationalId = "National ID must be 50 characters or less";
    if (form.dateOfBirth && new Date(form.dateOfBirth as string) > new Date())
      e.dateOfBirth = "Date of birth cannot be in the future";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      if (isEdit && initial) {
        await update.mutateAsync({ id: initial.id, payload: form });
        toast.success("Patient updated");
      } else {
        await create.mutateAsync(form);
        toast.success("Patient created");
      }
      onClose();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        toast.error("A patient with this National ID already exists");
      } else {
        toast.error(err?.response?.data?.message ?? "Failed to save patient");
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Patient" : "New Patient"}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm ${errors.name ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
              <input
                type="text"
                value={form.nationalId}
                onChange={(e) => set("nationalId", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm ${errors.nationalId ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.nationalId && <p className="mt-1 text-xs text-red-600">{errors.nationalId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm ${errors.dateOfBirth ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.dateOfBirth && <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={form.gender ?? ""}
                onChange={(e) =>
                  set("gender", (e.target.value as any) || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
              >
                <option value="">Not specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm ${errors.phone ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="text"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm ${errors.email ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={busy || hasErrors}
              className="flex items-center gap-2 px-5 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] disabled:opacity-50 text-sm font-medium"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create patient"}
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

export function PatientsPage() {
  const [search, setSearch] = useState("");
  const [formPatient, setFormPatient] = useState<Patient | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Patient | null>(null);

  const { data: patients = [], isLoading } = usePatientsQuery({ search });
  const deletePatient = useDeletePatientMutation();

  async function handleDelete(patient: Patient) {
    try {
      await deletePatient.mutateAsync(patient.id);
      toast.success("Patient removed");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to remove patient");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-600 mt-1">Manage patient records</p>
        </div>
        <button
          onClick={() => setFormPatient("new")}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, ID or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F5C47] outline-none text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading patients…
          </div>
        ) : patients.length === 0 ? (
          <EmptyState
            icon={Users}
            heading="No patients yet"
            subline="Register your first patient to link them to sales and prescriptions"
            action={{ label: "Add Patient", onClick: () => setFormPatient("new") }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">National ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.nationalId ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{patient.phone ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{patient.gender ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {patient.dateOfBirth
                        ? new Date(patient.dateOfBirth).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setFormPatient(patient)}
                        className="p-1.5 text-gray-400 hover:text-[#0F5C47] rounded mr-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(patient)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient form modal */}
      {formPatient !== null && (
        <PatientForm
          initial={formPatient === "new" ? undefined : formPatient}
          onClose={() => setFormPatient(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove patient?</h3>
            <p className="text-sm text-gray-600 mb-6">
              <strong>{deleteTarget.name}</strong> will be soft-deleted and can be restored by an admin.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteTarget)}
                disabled={deletePatient.isPending}
                className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
              >
                {deletePatient.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Remove
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
