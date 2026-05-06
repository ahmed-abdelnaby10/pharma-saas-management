import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { get, post, patch, remove } from "@/shared/api/request";
import { PLATFORM_API, QUERY_KEYS } from "@/shared/utils/constants";
import type {
  Tenant,
  TenantListParams,
  CreateTenantPayload,
  UpdateTenantPayload,
  Plan,
  CreatePlanPayload,
  UpdatePlanPayload,
  Invoice,
  InvoiceListParams,
  CreateInvoicePayload,
  PlatformMetricsOverview,
  AuditLogEntry,
  AuditLogParams,
  TenantUsage,
  PlatformDashboard,
  FeatureOverride,
  UpdateFeatureOverridePayload,
  SupportTicket,
  SupportTicketListParams,
  UpdateSupportTicketStatusPayload,
  AssignSupportTicketPayload,
  TenantSubscription,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
} from "./platform.types";

// ─── Tenants ──────────────────────────────────────────────────────────────────

export function useTenantsQuery(
  params?: TenantListParams,
  options?: Partial<UseQueryOptions<Tenant[]>>,
) {
  return useQuery<Tenant[]>({
    queryKey: QUERY_KEYS.platform.tenants.list(params),
    queryFn: () => get<Tenant[]>(PLATFORM_API.tenants.list, { params }),
    ...options,
  });
}

export function useTenantQuery(
  id: string,
  options?: Partial<UseQueryOptions<Tenant>>,
) {
  return useQuery<Tenant>({
    queryKey: QUERY_KEYS.platform.tenants.detail(id),
    queryFn: () => get<Tenant>(PLATFORM_API.tenants.get(id)),
    enabled: !!id,
    ...options,
  });
}

export function useCreateTenantMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTenantPayload) =>
      post<Tenant>(PLATFORM_API.tenants.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.all });
    },
  });
}

export function useUpdateTenantMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateTenantPayload & { id: string }) =>
      patch<Tenant>(PLATFORM_API.tenants.update(id), payload),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.detail(vars.id) });
    },
  });
}

export function useSuspendTenantMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => post<Tenant>(PLATFORM_API.tenants.suspend(id)),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.detail(id) });
    },
  });
}

export function useActivateTenantMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => post<Tenant>(PLATFORM_API.tenants.activate(id)),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.detail(id) });
    },
  });
}

// ─── Plans ────────────────────────────────────────────────────────────────────

export function usePlansQuery(
  params?: object,
  options?: Partial<UseQueryOptions<Plan[]>>,
) {
  return useQuery<Plan[]>({
    queryKey: QUERY_KEYS.platform.plans.list(params),
    queryFn: () => get<Plan[]>(PLATFORM_API.plans.list, { params }),
    ...options,
  });
}

export function usePlanQuery(
  id: string,
  options?: Partial<UseQueryOptions<Plan>>,
) {
  return useQuery<Plan>({
    queryKey: QUERY_KEYS.platform.plans.detail(id),
    queryFn: () => get<Plan>(PLATFORM_API.plans.get(id)),
    enabled: !!id,
    ...options,
  });
}

export function useCreatePlanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePlanPayload) =>
      post<Plan>(PLATFORM_API.plans.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.plans.all });
    },
  });
}

export function useUpdatePlanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdatePlanPayload & { id: string }) =>
      patch<Plan>(PLATFORM_API.plans.update(id), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.plans.all });
    },
  });
}

export function useDeletePlanMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remove(PLATFORM_API.plans.delete(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.plans.all });
    },
  });
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export function useInvoicesQuery(
  params?: InvoiceListParams,
  options?: Partial<UseQueryOptions<Invoice[]>>,
) {
  return useQuery<Invoice[]>({
    queryKey: QUERY_KEYS.platform.invoices.list(params),
    queryFn: () => get<Invoice[]>(PLATFORM_API.invoices.list, { params }),
    ...options,
  });
}

export function useInvoiceQuery(
  id: string,
  options?: Partial<UseQueryOptions<Invoice>>,
) {
  return useQuery<Invoice>({
    queryKey: QUERY_KEYS.platform.invoices.detail(id),
    queryFn: () => get<Invoice>(PLATFORM_API.invoices.get(id)),
    enabled: !!id,
    ...options,
  });
}

export function useCreateInvoiceMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInvoicePayload) =>
      post<Invoice, CreateInvoicePayload>(PLATFORM_API.invoices.create, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.invoices.all });
    },
  });
}

export function useIssueInvoiceMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      post<Invoice, Record<string, never>>(PLATFORM_API.invoices.issue(id), {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.invoices.all });
    },
  });
}

export function useMarkInvoicePaidMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      post<Invoice, Record<string, never>>(PLATFORM_API.invoices.markPaid(id), {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.invoices.all });
    },
  });
}

export function useVoidInvoiceMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      post<Invoice, Record<string, never>>(PLATFORM_API.invoices.void(id), {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.invoices.all });
    },
  });
}

// ─── Platform Metrics ─────────────────────────────────────────────────────────

export function usePlatformMetricsQuery(
  options?: Partial<UseQueryOptions<PlatformMetricsOverview>>,
) {
  return useQuery<PlatformMetricsOverview>({
    queryKey: QUERY_KEYS.platform.metrics.overview,
    queryFn: () => get<PlatformMetricsOverview>(PLATFORM_API.metrics.overview),
    staleTime: 60_000,
    ...options,
  });
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export function useAuditLogQuery(
  params?: AuditLogParams,
  options?: Partial<UseQueryOptions<AuditLogEntry[]>>,
) {
  return useQuery<AuditLogEntry[]>({
    queryKey: QUERY_KEYS.platform.audit(params),
    queryFn: () => get<AuditLogEntry[]>(PLATFORM_API.audit.list, { params }),
    ...options,
  });
}

// ─── Tenant Usage ─────────────────────────────────────────────────────────────

export function useTenantUsageQuery(
  tenantId: string,
  options?: Partial<UseQueryOptions<TenantUsage>>,
) {
  return useQuery<TenantUsage>({
    queryKey: QUERY_KEYS.platform.usage(tenantId),
    queryFn: () => get<TenantUsage>(PLATFORM_API.usage.get(tenantId)),
    enabled: !!tenantId,
    ...options,
  });
}

// ─── Platform Dashboard ───────────────────────────────────────────────────────

export function usePlatformDashboardQuery(
  options?: Partial<UseQueryOptions<PlatformDashboard>>,
) {
  return useQuery<PlatformDashboard>({
    queryKey: QUERY_KEYS.platform.dashboard,
    queryFn: () => get<PlatformDashboard>(PLATFORM_API.dashboard),
    staleTime: 60_000,
    ...options,
  });
}

// ─── Feature overrides ────────────────────────────────────────────────────────

export function useFeatureOverridesQuery(
  tenantId: string,
  options?: Partial<UseQueryOptions<FeatureOverride[]>>,
) {
  return useQuery<FeatureOverride[]>({
    queryKey: QUERY_KEYS.platform.features(tenantId),
    queryFn: () => get<FeatureOverride[]>(PLATFORM_API.features.list(tenantId)),
    enabled: !!tenantId,
    ...options,
  });
}

export function useUpdateFeatureOverrideMutation() {
  const qc = useQueryClient();
  return useMutation<
    FeatureOverride,
    Error,
    { tenantId: string; key: string; payload: UpdateFeatureOverridePayload }
  >({
    mutationFn: ({ tenantId, key, payload }) =>
      patch<FeatureOverride, UpdateFeatureOverridePayload>(
        `${PLATFORM_API.features.list(tenantId)}/${key}`,
        payload,
      ),
    onSuccess: (_d, { tenantId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.features(tenantId) });
    },
  });
}

// ─── Platform support tickets ─────────────────────────────────────────────────

export function usePlatformSupportTicketsQuery(
  params?: SupportTicketListParams,
  options?: Partial<UseQueryOptions<SupportTicket[]>>,
) {
  return useQuery<SupportTicket[]>({
    queryKey: QUERY_KEYS.platform.support.list(params),
    queryFn: () => get<SupportTicket[]>(PLATFORM_API.support.tickets, { params }),
    ...options,
  });
}

export function usePlatformSupportTicketQuery(
  id: string,
  options?: Partial<UseQueryOptions<SupportTicket>>,
) {
  return useQuery<SupportTicket>({
    queryKey: QUERY_KEYS.platform.support.detail(id),
    queryFn: () => get<SupportTicket>(PLATFORM_API.support.get(id)),
    enabled: !!id,
    ...options,
  });
}

export function useUpdateSupportTicketStatusMutation() {
  const qc = useQueryClient();
  return useMutation<
    SupportTicket,
    Error,
    { id: string; payload: UpdateSupportTicketStatusPayload }
  >({
    mutationFn: ({ id, payload }) =>
      patch<SupportTicket, UpdateSupportTicketStatusPayload>(
        PLATFORM_API.support.updateStatus(id),
        payload,
      ),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.support.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.support.detail(id) });
    },
  });
}

// ─── Tenant Subscriptions ─────────────────────────────────────────────────────

export function useSubscriptionsQuery(
  tenantId: string,
  options?: Partial<UseQueryOptions<TenantSubscription[]>>,
) {
  return useQuery<TenantSubscription[]>({
    queryKey: QUERY_KEYS.platform.subscriptions.list(tenantId),
    queryFn: () => get<TenantSubscription[]>(PLATFORM_API.subscriptions.list(tenantId)),
    enabled: !!tenantId,
    ...options,
  });
}

export function useCreateSubscriptionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, ...payload }: CreateSubscriptionPayload & { tenantId: string }) =>
      post<TenantSubscription>(PLATFORM_API.subscriptions.create(tenantId), payload),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.subscriptions.list(vars.tenantId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.all });
    },
  });
}

export function useUpdateSubscriptionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      tenantId,
      subscriptionId,
      ...payload
    }: UpdateSubscriptionPayload & { tenantId: string; subscriptionId: string }) =>
      patch<TenantSubscription>(
        PLATFORM_API.subscriptions.update(tenantId, subscriptionId),
        payload,
      ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.subscriptions.list(vars.tenantId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.all });
    },
  });
}

export function useCancelSubscriptionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tenantId, subscriptionId }: { tenantId: string; subscriptionId: string }) =>
      post<TenantSubscription>(PLATFORM_API.subscriptions.cancel(tenantId, subscriptionId)),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.subscriptions.list(vars.tenantId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.tenants.all });
    },
  });
}

export function useAssignSupportTicketMutation() {
  const qc = useQueryClient();
  return useMutation<
    SupportTicket,
    Error,
    { id: string; payload: AssignSupportTicketPayload }
  >({
    mutationFn: ({ id, payload }) =>
      patch<SupportTicket, AssignSupportTicketPayload>(
        PLATFORM_API.support.assign(id),
        payload,
      ),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.support.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.platform.support.detail(id) });
    },
  });
}
