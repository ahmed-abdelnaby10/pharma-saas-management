export type UserRole =
  | "owner"
  | "admin"
  | "pharmacist"
  | "cashier"
  | "inventory_manager";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  branchId: string | null;
  branch?: { id: string; name: string } | null;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  branchId?: string | null;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  role?: UserRole;
  branchId?: string | null;
  isActive?: boolean;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  branchId?: string;
  isActive?: boolean;
}

// ─── Roles & Permissions ──────────────────────────────────────────────────────

export interface Permission {
  id: string;
  key: string;
  name: string;
  description?: string;
  module?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permissionKeys?: string[];
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissionKeys?: string[];
}

export interface AssignUserRolePayload {
  roleId: string;
}
