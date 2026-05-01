export type PrescriptionStatus = "PENDING" | "DISPENSED" | "CANCELLED";

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName?: string;
  quantity: number;
  dosage?: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId?: string;
  patientName?: string;
  doctorName?: string;
  doctorLicense?: string;
  status: PrescriptionStatus;
  issuedDate?: string; // ISO date
  expiryDate?: string; // ISO date
  notes?: string;
  items: PrescriptionItem[];
  saleId?: string; // linked sale after dispensing
  branchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionListParams {
  status?: PrescriptionStatus;
  patientId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PrescriptionItemPayload {
  medicineId: string;
  quantity: number;
  dosage?: string;
  instructions?: string;
}

export interface CreatePrescriptionPayload {
  patientId?: string;
  doctorName?: string;
  doctorLicense?: string;
  issuedDate?: string;
  expiryDate?: string;
  notes?: string;
  items: PrescriptionItemPayload[];
}

export type UpdatePrescriptionPayload = Partial<
  Omit<CreatePrescriptionPayload, "items"> & { items?: PrescriptionItemPayload[] }
>;

export interface DispensePrescriptionPayload {
  saleId: string;
}
