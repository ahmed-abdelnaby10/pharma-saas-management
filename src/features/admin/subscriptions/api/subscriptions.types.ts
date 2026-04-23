export type SubscriptionBillingCycle = 'Monthly' | 'Yearly';

export type SubscriptionStatus =
  | 'Trialing'
  | 'Active'
  | 'Past Due'
  | 'Canceled'
  | 'Expired';

export interface SubscriptionRecord {
  id: string;
  tenant: string;
  plan: string;
  cycle: SubscriptionBillingCycle;
  status: SubscriptionStatus;
  trialEnd: string | null;
  renewal: string;
  amount: number;
  cancelAtPeriodEnd: boolean;
}

export interface AdminSubscriptionsListParams {
  search?: string;
  status?: SubscriptionStatus;
}

export type AdminSubscriptionsListResponse = PaginatedResponse<SubscriptionRecord>;
