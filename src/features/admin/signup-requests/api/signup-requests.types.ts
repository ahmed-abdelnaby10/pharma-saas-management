export type SignupRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SignupRequest {
  id: string;
  tenantName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  country?: string;
  requestedPlanId?: string;
  requestedPlanName?: string;
  notes?: string;
  status: SignupRequestStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignupRequestListParams {
  status?: SignupRequestStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApproveSignupRequestPayload {
  adminEmail?: string;
}

export interface ApproveSignupRequestResponse {
  tenantId: string;
  tempPassword: string;
}

export interface RejectSignupRequestPayload {
  reason: string;
}
