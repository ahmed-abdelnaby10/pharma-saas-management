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
  tenant?: { id: string; nameEn?: string; nameAr?: string };
  planId: string;
  plan?: {
    id: string;
    code?: string;
    name: string;
    billingInterval?: SubscriptionBillingCycle;
    price?: string | number;
    currency?: string;
    trialDays?: number;
  };
  status: SubscriptionStatus;
  startsAt?: string;
  endsAt?: string | null;
  trialEndsAt: string | null;
  canceledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSubscriptionsListParams {
  status?: SubscriptionStatus;
}

export type AdminSubscriptionsListResponse = SubscriptionRecord[];
