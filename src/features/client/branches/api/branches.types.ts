export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  manager?: string;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchPayload {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  manager?: string;
  isActive?: boolean;
}

export type UpdateBranchPayload = Partial<CreateBranchPayload>;

export interface BranchListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}
