export type TenantTicketStatus   = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TenantTicketPriority = "low" | "medium" | "high" | "critical";
export type TenantTicketCategory = "billing" | "technical" | "feature_request" | "other";

export interface TenantSupportTicket {
  id: string;
  tenantId: string;
  submittedById: string;
  subject: string;
  description: string;
  category?: TenantTicketCategory;
  priority?: TenantTicketPriority;
  status: TenantTicketStatus;
  assignedToId?: string | null;
  resolutionNote?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantTicketListParams {
  status?: TenantTicketStatus;
  page?: number;
  limit?: number;
}

export interface CreateTenantTicketPayload {
  subject: string;
  description: string;
  category?: TenantTicketCategory;
  priority?: TenantTicketPriority;
}
