import React, { useState } from 'react';
import { Plus, Building2, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';
import { BranchFormModal } from '../components/modals/BranchFormModal';
import { DeleteConfirmModal } from '../components/modals/DeleteConfirmModal';

export function BranchesPage() {
  const { t } = useLanguage();
  const { tenant } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);

  const handleAddBranch = () => {
    setSelectedBranch(null);
    setIsModalOpen(true);
  };

  const handleEditBranch = (branch: any) => {
    setSelectedBranch({
      ...branch,
      phone: '+966 50 123 4567',
      email: 'branch@example.com',
      manager: 'Ahmed Al-Rashid',
      status: branch.isActive ? 'Active' : 'Inactive',
    });
    setIsModalOpen(true);
  };

  const handleDeleteBranch = (branch: any) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBranch = (branchData: any) => {
    console.log('Saving branch:', branchData);
    // Add your save logic here
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log('Deleting branch:', selectedBranch);
    // Add your delete logic here
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t('branches')}</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your pharmacy locations</p>
        </div>
        <button 
          onClick={handleAddBranch}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]"
        >
          <Plus className="w-4 h-4" />
          {t('addBranch')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenant?.branches.map((branch) => (
          <div key={branch.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#0F5C47] rounded-lg flex items-center justify-center text-white text-xl font-semibold">
                {branch.name.charAt(0)}
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                  branch.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {branch.isActive ? t('active') : t('inactive')}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{branch.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{branch.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>8 Staff Members</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <button 
                onClick={() => handleEditBranch(branch)}
                className="flex items-center gap-1 text-sm text-[#0F5C47] hover:text-[#0d4a39] font-medium"
              >
                <Edit className="w-3 h-3" />
                {t('edit')}
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