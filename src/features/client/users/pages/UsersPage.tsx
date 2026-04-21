import React, { useState } from "react";
import { Plus, Shield, Mail, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { UserFormModal } from "@/app/components/modals/UserFormModal";
import { DeleteConfirmModal } from "@/app/components/modals/DeleteConfirmModal";

const mockUsers = [
  {
    id: "1",
    name: "Ahmed Al-Rashid",
    email: "ahmed@pharmacy.com",
    phone: "+966 50 123 4567",
    role: "Admin",
    branchId: "all",
    branch: "All Branches",
    status: "Active" as const,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@pharmacy.com",
    phone: "+966 50 234 5678",
    role: "Pharmacist",
    branchId: "1",
    branch: "Main Branch",
    status: "Active" as const,
  },
  {
    id: "3",
    name: "Mohammed Ali",
    email: "mohammed@pharmacy.com",
    phone: "+966 50 345 6789",
    role: "Pharmacist",
    branchId: "2",
    branch: "North Branch",
    status: "Active" as const,
  },
];

export function UsersPage() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = (userData: any) => {
    console.log("Saving user:", userData);
    // Add your save logic here
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting user:", selectedUser);
    // Add your delete logic here
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("users")}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage team members and permissions
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39]"
        >
          <Plus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("email")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                  {t("branch")}
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
              {mockUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#0F5C47] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 whitespace-nowrap">
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                    {user.branch}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1 text-gray-600 hover:text-[#0F5C47]"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-1 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        itemName={selectedUser?.name}
      />
    </div>
  );
}
