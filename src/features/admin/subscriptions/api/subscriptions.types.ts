export type SubscriptionBillingCycle = "monthly" | "yearly";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

export interface SubscriptionRecord {
  id: string;
  tenantId: string;
  tenant?: { id: string; name: string };
  planId: string;
  plan?: { id: string; name: string };
  billingCycle: SubscriptionBillingCycle;
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  currentPeriodEnd: string;
  amount: number;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSubscriptionsListParams {
  search?: string;
  status?: SubscriptionStatus;
  page?: number;
  limit?: number;
}

export type AdminSubscriptionsListResponse = SubscriptionRecord[];
