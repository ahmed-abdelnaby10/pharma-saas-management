// ─── Tenants ──────────────────────────────────────────────────────────────────

export type TenantStatus = "active" | "suspended" | "inactive";

export interface Tenant {
  id: string;
  name?: string;
  nameEn?: string;
  nameAr?: string;
  preferredLanguage?: "en" | "ar";
  slug?: string;
  email?: string | null;
  phone?: string;
  address?: string;
  status: TenantStatus;
  planId?: string;
  plan?: { id: string; name: string };
  isTrialActive?: boolean;
  trialEndsAt?: string | null;
  settings?: {
    organizationName?: string | null;
    taxId?: string | null;
    phone?: string | null;
    email?: string | null;
    vatPercentage?: string;
    defaultLanguage?: "en" | "ar";
    lowStockAlerts?: boolean;
    expiryAlerts?: boolean;
    purchaseOrderUpdates?: boolean;
  };
  subscription?: {
    id: string;
    status: "trialing" | "active" | "past_due" | "canceled" | "paused";
    startsAt?: string;
    endsAt?: string | null;
    trialEndsAt?: string | null;
    plan?: {
      id: string;
      code: string;
      name: string;
      billingInterval?: "monthly" | "yearly";
      price?: string | number;
      currency?: string;
      trialDays?: number;
    };
  };
  branchCount?: number;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantPayload {
  nameEn: string;
  nameAr: string;
  preferredLanguage: "en" | "ar";
  planId: string;
}

export interface UpdateTenantPayload {
  nameEn?: string;
  nameAr?: string;
  preferredLanguage?: "en" | "ar";
  status?: TenantStatus;
}

export interface TenantListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TenantStatus;
  planId?: string;
}

// ─── Plans ────────────────────────────────────────────────────────────────────

export interface Plan {
  id: string;
  code?: string;
  name: string;
  description?: string;
  billingInterval?: "monthly" | "yearly";
  price?: number;
  currency?: string;
  trialDays?: number;
  features?: PlanFeature[];
  // Legacy fields kept for compatibility with old responses.
  monthlyPrice?: number;
  yearlyPrice?: number;
  maxBranches?: number;
  maxUsers?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFeature {
  id?: string;
  featureKey: string;
  enabled: boolean;
  limitValue: number | null;
  type: "boolean" | "limit";
  module: string;
  requiresKeys: string[];
  isActive: boolean;
  label: string;
  description: string;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export interface FeatureDefinition {
  key: string;
  type: "boolean" | "limit";
  label: string;
  description: string;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  module: string;
  requiresKeys: string[];
  isActive: boolean;
}

export interface PlanFeatureFormRow {
  featureKey: string;
  enabled: boolean;
  limitValue?: number | null;
}

export interface CreatePlanPayload {
  code: string;
  name: string;
  description?: string;
  billingInterval: "monthly" | "yearly";
  price: number;
  currency: string;
  trialDays: number;
  isActive: boolean;
  features: PlanFeatureFormRow[];
}

export type UpdatePlanPayload = Partial<CreatePlanPayload> & { isActive?: boolean };

// ─── Invoices ─────────────────────────────────────────────────────────────────

export type InvoiceStatus = "draft" | "open" | "paid" | "void" | "uncollectible";

export interface Invoice {
  id: string;
  tenantId: string;
  tenant?: { id: string; name: string };
  subscriptionId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface InvoiceListParams {
  page?: number;
  limit?: number;
  tenantId?: string;
  status?: InvoiceStatus;
  from?: string;
  to?: string;
}

export interface CreateInvoicePayload {
  tenantId: string;
  subscriptionId: string;
  amount: number;
  currency?: string;
  dueDate?: string;
}

// ─── Tenant Subscriptions ─────────────────────────────────────────────────────

export type TenantSubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "paused";

export interface TenantSubscription {
  id: string;
  tenantId: string;
  planId: string;
  plan?: {
    id: string;
    code?: string;
    name: string;
    billingInterval?: "monthly" | "yearly";
    price?: string | number;
    currency?: string;
    trialDays?: number;
    monthlyPrice?: number;
  };
  status: TenantSubscriptionStatus;
  startsAt?: string;
  endsAt?: string | null;
  trialEndsAt?: string | null;
  canceledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPayload {
  planId: string;
}

export interface UpdateSubscriptionPayload {
  planId: string;
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

export interface PlatformMetricsOverview {
  totalTenants: number;
  activeTenants: number;
  trialingTenants: number;
  churnedTenants: number;
  mrr: number;
  arr: number;
  growthRate: number;
}

// ─── Audit log ────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId?: string;
  tenantId?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogParams {
  page?: number;
  limit?: number;
  tenantId?: string;
  userId?: string;
  action?: string;
  from?: string;
  to?: string;
}

// ─── Usage ────────────────────────────────────────────────────────────────────

export interface TenantUsage {
  tenantId: string;
  branchCount: number;
  userCount: number;
  inventoryItemCount: number;
  salesThisMonth: number;
  storageUsedMb: number;
}

// ─── Platform Dashboard ───────────────────────────────────────────────────────

export interface PlatformDashboardKpis {
  totalTenants: number;
  activeTenants: number;
  trialingTenants: number;
  mrr: number;
  arr: number;
  churnRate: number;
  pastDueInvoices: number;
}

export interface SubscriptionHealth {
  active: number;
  trialing: number;
  pastDue: number;
  suspended: number;
}

export interface RevenueTrendPoint {
  period: string;
  mrr: number;
  newMrr: number;
  churnedMrr: number;
}

export interface TenantGrowthPoint {
  period: string;
  newTenants: number;
  churnedTenants: number;
  netGrowth: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  tenantId?: string;
  tenantName?: string;
  occurredAt: string;
}

export interface PlatformDashboard {
  kpis: PlatformDashboardKpis;
  subscriptionHealth: SubscriptionHealth;
  revenueTrend: RevenueTrendPoint[];
  tenantGrowthTrend: TenantGrowthPoint[];
  recentActivity: RecentActivity[];
}

// ─── Feature overrides ────────────────────────────────────────────────────────

export interface FeatureOverride {
  key: string;
  enabled: boolean;
  value?: string | number | boolean;
  description?: string;
  updatedAt?: string;
}

export interface UpdateFeatureOverridePayload {
  enabled: boolean;
  value?: string | number | boolean;
}

// ─── Platform support tickets ─────────────────────────────────────────────────

export type SupportTicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type SupportTicketPriority = "low" | "medium" | "high" | "critical";

export interface SupportTicket {
  id: string;
  tenantId?: string;
  tenantName?: string;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketListParams {
  status?: SupportTicketStatus;
  tenantId?: string;
  assignedTo?: string;
  page?: number;
  limit?: number;
}

export interface UpdateSupportTicketStatusPayload {
  status: SupportTicketStatus;
}

export interface AssignSupportTicketPayload {
  assignedTo: string;
}
