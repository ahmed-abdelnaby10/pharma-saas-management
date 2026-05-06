export type SignupRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SignupRequestListParams {
  status?: SignupRequestStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApproveSignupRequestPayload {
  adminEmail?: string;
}

export interface RejectSignupRequestPayload {
  rejectionReason: string;
}

export interface RejectState {
  id: string;
  name: string;
}

export interface SignupRequest {
  id: string;
  planId: string;
  plan?: {
    id: string;
    code: string;
    name: string;
  } | null;
  fullName: string;
  email: string;
  phone?: string | null;
  pharmacyNameEn: string;
  pharmacyNameAr: string;
  preferredLanguage?: "en" | "ar";
  notes?: string | null;
  status: SignupRequestStatus;
  reviewedById?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
}
