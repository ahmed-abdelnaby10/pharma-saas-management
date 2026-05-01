import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post, patch, remove } from "@/shared/api/request";
import { TENANT_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  User,
  UserListParams,
  CreateUserPayload,
  UpdateUserPayload,
  Role,
  Permission,
  CreateRolePayload,
  UpdateRolePayload,
  AssignUserRolePayload,
} from "./users.types";

// ─── List ────────────────────────────────────────────────────────────────────

export function useUsersQuery(
  params?: UserListParams,
  options?: Partial<UseQueryOptions<User[]>>,
) {
  return useQuery<User[]>({
    queryKey: QUERY_KEYS.users.list(params),
    queryFn: () => get<User[]>(TENANT_API.users.list, { params }),
    ...options,
  });
}

// ─── Detail ──────────────────────────────────────────────────────────────────

export function useUserQuery(
  id: string,
  options?: Partial<UseQueryOptions<User>>,
) {
  return useQuery<User>({
    queryKey: QUERY_KEYS.users.detail(id),
    queryFn: () => get<User>(TENANT_API.users.get(id)),
    enabled: !!id,
    ...options,
  });
}

// ─── Create ──────────────────────────────────────────────────────────────────

export function useCreateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      post<User>(TENANT_API.users.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
  });
}

// ─── Update ──────────────────────────────────────────────────────────────────

export function useUpdateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateUserPayload & { id: string }) =>
      patch<User>(TENANT_API.users.update(id), payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.detail(vars.id) });
    },
  });
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export function useDeleteUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remove(TENANT_API.users.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
  });
}

// ─── Per-user role assignment ─────────────────────────────────────────────────

export function useAssignUserRoleMutation() {
  const qc = useQueryClient();
  return useMutation<Role, Error, { userId: string; payload: AssignUserRolePayload }>({
    mutationFn: ({ userId, payload }) =>
      post<Role>(TENANT_API.users.assignRole(userId), payload),
    onSuccess: (_d, { userId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.detail(userId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
  });
}

export function useRemoveUserRoleMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, { userId: string; roleId: string }>({
    mutationFn: ({ userId, roleId }) =>
      remove(TENANT_API.users.removeRole(userId, roleId)),
    onSuccess: (_d, { userId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.detail(userId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    },
  });
}

// ─── Roles CRUD ───────────────────────────────────────────────────────────────

export function useRolesQuery(options?: Partial<UseQueryOptions<Role[]>>) {
  return useQuery<Role[]>({
    queryKey: QUERY_KEYS.roles.all,
    queryFn: () => get<Role[]>(TENANT_API.roles.list),
    ...options,
  });
}

export function useRoleQuery(id: string, options?: Partial<UseQueryOptions<Role>>) {
  return useQuery<Role>({
    queryKey: QUERY_KEYS.roles.detail(id),
    queryFn: () => get<Role>(TENANT_API.roles.get(id)),
    enabled: !!id,
    ...options,
  });
}

export function useCreateRoleMutation() {
  const qc = useQueryClient();
  return useMutation<Role, Error, CreateRolePayload>({
    mutationFn: (payload) => post<Role>(TENANT_API.roles.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.roles.all });
    },
  });
}

export function useUpdateRoleMutation() {
  const qc = useQueryClient();
  return useMutation<Role, Error, UpdateRolePayload & { id: string }>({
    mutationFn: ({ id, ...payload }) =>
      patch<Role>(TENANT_API.roles.update(id), payload),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.roles.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.roles.detail(vars.id) });
    },
  });
}

export function useDeleteRoleMutation() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => remove(TENANT_API.roles.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.roles.all });
    },
  });
}

// ─── Permissions list ─────────────────────────────────────────────────────────

export function usePermissionsQuery(options?: Partial<UseQueryOptions<Permission[]>>) {
  return useQuery<Permission[]>({
    queryKey: QUERY_KEYS.permissions.all,
    queryFn: () => get<Permission[]>(TENANT_API.permissions.list),
    staleTime: 10 * 60_000, // permissions list rarely changes
    ...options,
  });
}
