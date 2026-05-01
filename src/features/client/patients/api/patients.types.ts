export interface Patient {
  id: string;
  name: string;
  nationalId?: string;
  dateOfBirth?: string; // ISO date
  gender?: "male" | "female" | "other";
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null; // soft-delete
}

export interface PatientListParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatePatientPayload {
  name: string;
  nationalId?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export type UpdatePatientPayload = Partial<CreatePatientPayload>;
