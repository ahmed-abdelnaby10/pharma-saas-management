import React, { useState } from "react";
import { Plus, Building2, MapPin, Users, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/app/contexts/useLanguage";
import { BranchFormModal } from "@/app/components/modals/BranchFormModal";
import { DeleteConfirmModal } from "@/app/components/modals/DeleteConfirmModal";
import {
  useBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  type Branch,
} from "../api";
import { toast } from "sonner";

export function BranchesPage() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { data: branches = [], isLoading, isError } = useBranchesQuery();
  const createMutation = useCreateBranchMutation();
  const updateMutation = useUpdateBranchMutation();
  const deleteMutation = useDeleteBranchMutation();

  const handleAddBranch = () => {
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsModalOpen(true);
  };

  const handleDeleteBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBranch = async (branchData: any) => {
    try {
      if (selectedBranch) {
        await updateMutation.mutateAsync({ id: selectedBranch.id, ...branchData });
        toast.success("Branch updated successfully");
      } else {
        await createMutation.mutateAsync(branchData);
        toast.success("Branch created successfully");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save branch");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBranch) return;
    try {
      await deleteMutation.mutateAsync(selectedBranch.id);
      toast.success("Branch deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete branch");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {t("branches")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your pharmacy locations
          </p>
        </div>
        <button
          onClick={handleAddBranch}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]"
        >
          <Plus className="w-4 h-4" />
          {t("addBranch")}
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading branches…
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Failed to load branches. Please try again.
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <Building2 className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">No branches yet. Add your first location.</p>
            </div>
          )}

          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#0F5C47] rounded-lg flex items-center justify-center text-white text-xl font-semibold">
                  {branch.name.charAt(0)}
                </div>
                <span
                  className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    branch.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {branch.isActive ? t("active") : t("inactive")}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {branch.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="line-clamp-1">{branch.address}</span>
                </div>
                {branch.manager && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>{branch.manager}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => handleEditBranch(branch)}
                  className="flex items-center gap-1 text-sm text-[#0F5C47] hover:text-[#0d4a39] font-medium"
                >
                  <Edit className="w-3 h-3" />
                  {t("edit")}
                </button>
                <button
                  onClick={() => handleDeleteBranch(branch)}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Branch Form Modal */}
      <BranchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBranch}
        branch={selectedBranch}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Branch"
        message="Are you sure you want to delete this branch? This action cannot be undone and will affect all associated users and data."
        itemName={selectedBranch?.name}
      />
    </div>
  );
}
