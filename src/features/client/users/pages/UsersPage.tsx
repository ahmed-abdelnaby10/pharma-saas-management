import { useState } from "react";
import { EmptyState } from "@/shared/components/EmptyState";
import {
  Plus,
  Shield,
  Mail,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Key,
  X,
  ChevronDown,
  Check,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/app/contexts/useLanguage";
import { UserFormModal } from "@/app/components/modals/UserFormModal";
import { DeleteConfirmModal } from "@/app/components/modals/DeleteConfirmModal";
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  usePermissionsQuery,
  useAssignUserRoleMutation,
  useRemoveUserRoleMutation,
  type User,
  type Role,
} from "../api";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  true:  "bg-green-100 text-green-700",
  false: "bg-gray-100 text-gray-500",
};

// ─── Role assignment dropdown per user ────────────────────────────────────────

function RoleAssignCell({ user }: { user: User }) {
  const { data: roles = [] }    = useRolesQuery();
  const assignRole              = useAssignUserRoleMutation();
  const [open, setOpen]         = useState(false);

  // `user.role` is the legacy string field; roles CRUD gives full Role objects.
  // We display the existing role and let the user pick a new one from the roles list.

  async function handleAssign(roleId: string) {
    try {
      await assignRole.mutateAsync({ userId: user.id, payload: { roleId } });
      toast.success("Role updated");
      setOpen(false);
    } catch {
      toast.error("Failed to assign role");
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-teal-700 group"
      >
        <Shield className="w-3.5 h-3.5 text-gray-400 group-hover:text-teal-500" />
        <span className="capitalize whitespace-nowrap">{user.role.replace("_", " ")}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            {roles.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-400">No custom roles yet</p>
            )}
            {roles.map((r) => (
              <button
                key={r.id}
                disabled={assignRole.isPending}
                onClick={() => handleAssign(r.id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
              >
                {r.name}
                {assignRole.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Role form modal ──────────────────────────────────────────────────────────

interface RoleFormModalProps {
  role?: Role | null;
  onClose: () => void;
}

function RoleFormModal({ role, onClose }: RoleFormModalProps) {
  const { data: permissions = [], isLoading: permsLoading } = usePermissionsQuery();
  const createRole = useCreateRoleMutation();
  const updateRole = useUpdateRoleMutation();

  const [name, setName]         = useState(role?.name ?? "");
  const [desc, setDesc]         = useState(role?.description ?? "");
  const [selected, setSelected] = useState<Set<string>>(
    new Set(role?.permissions.map((p) => p.key) ?? []),
  );
  const [nameError, setNameError] = useState<string>("");

  function togglePerm(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setNameError("Role name is required"); return; }
    if (trimmed.length < 2) { setNameError("Role name must be at least 2 characters"); return; }
    if (trimmed.length > 100) { setNameError("Role name must be 100 characters or less"); return; }
    try {
      const payload = { name: trimmed, description: desc.trim() || undefined, permissionKeys: [...selected] };
      if (role) {
        await updateRole.mutateAsync({ id: role.id, ...payload });
        toast.success("Role updated");
      } else {
        await createRole.mutateAsync(payload);
        toast.success("Role created");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save role");
    }
  }

  const isPending = createRole.isPending || updateRole.isPending;

  // Group permissions by module
  const grouped = permissions.reduce<Record<string, typeof permissions>>((acc, p) => {
    const mod = p.module ?? "General";
    (acc[mod] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {role ? "Edit Role" : "Create Role"}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              placeholder="e.g. Senior Pharmacist"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm ${nameError ? "border-red-400" : "border-gray-300"}`}
            />
            {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Optional description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            {permsLoading ? (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading permissions…
              </div>
            ) : Object.keys(grouped).length === 0 ? (
              <p className="text-xs text-gray-400">No permissions defined on server yet</p>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {Object.entries(grouped).map(([mod, perms]) => (
                  <div key={mod}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{mod}</p>
                    <div className="space-y-1">
                      {perms.map((p) => (
                        <label key={p.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                          <div
                            onClick={() => togglePerm(p.key)}
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                              selected.has(p.key)
                                ? "bg-teal-600 border-teal-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selected.has(p.key) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-sm text-gray-700">{p.name}</span>
                          {p.description && (
                            <span className="text-xs text-gray-400 truncate">{p.description}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending || !!nameError}
              className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 text-sm font-medium"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {role ? "Save Changes" : "Create Role"}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Roles tab ────────────────────────────────────────────────────────────────

function RolesTab() {
  const { data: roles = [], isLoading } = useRolesQuery();
  const deleteRole = useDeleteRoleMutation();
  const [editRole,   setEditRole]   = useState<Role | null | undefined>(undefined); // undefined = closed
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteRole.mutateAsync(deleteTarget.id);
      toast.success("Role deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete role");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setEditRole(null)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Role
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading roles…
        </div>
      ) : roles.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl">
          <EmptyState
            icon={Shield}
            heading="No roles defined"
            subline="Create a role and assign permissions to control what users can do"
            action={{ label: "Create Role", onClick: () => setEditRole(null) }}
          />
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-teal-500" />
                      <span className="text-sm font-medium text-gray-900">{role.name}</span>
                      {role.isSystem && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">system</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{role.description ?? "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 4).map((p) => (
                        <span key={p.key} className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">
                          {p.name}
                        </span>
                      ))}
                      {role.permissions.length > 4 && (
                        <span className="text-xs text-gray-400">+{role.permissions.length - 4} more</span>
                      )}
                      {role.permissions.length === 0 && (
                        <span className="text-xs text-gray-400">No permissions</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!role.isSystem && (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditRole(role)} className="p-1 text-gray-400 hover:text-teal-600">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(role)} className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editRole !== undefined && (
        <RoleFormModal role={editRole} onClose={() => setEditRole(undefined)} />
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Role"
        message="Are you sure you want to delete this role? Users assigned this role will lose it."
        itemName={deleteTarget?.name}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabKey = "users" | "roles";

export function UsersPage() {
  const { t } = useLanguage();
  const [tab, setTab]                   = useState<TabKey>("users");
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading, isError } = useUsersQuery();
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  const handleSaveUser = async (userData: any) => {
    try {
      if (selectedUser) {
        await updateMutation.mutateAsync({ id: selectedUser.id, ...userData });
        toast.success("User updated successfully");
      } else {
        await createMutation.mutateAsync(userData);
        toast.success("User invited successfully");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to save user");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      toast.success("User removed successfully");
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to remove user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("users")}</h1>
          <p className="text-sm text-gray-600 mt-1">Manage team members and roles</p>
        </div>
        {tab === "users" && (
          <button
            onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F5C47] text-white rounded-lg hover:bg-[#0d4a39] text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Invite User
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {(["users", "roles"] as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === key
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {key === "users" ? "Users" : "Roles & Permissions"}
          </button>
        ))}
      </div>

      {/* ── Users tab ── */}
      {tab === "users" && (
        <>
          {isLoading && (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading users…
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Failed to load users. Please try again.
            </div>
          )}

          {!isLoading && !isError && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("email")}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("branch")}</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("status")}</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 whitespace-nowrap">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-sm text-gray-500">
                          No users found. Invite your first team member.
                        </td>
                      </tr>
                    )}
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#0F5C47] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <RoleAssignCell user={user} />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                          {user.branch?.name ?? "All Branches"}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${STATUS_COLORS[String(user.isActive)]}`}>
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                              className="p-1 text-gray-600 hover:text-[#0F5C47]"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
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
          )}
        </>
      )}

      {/* ── Roles tab ── */}
      {tab === "roles" && <RolesTab />}

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />

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
