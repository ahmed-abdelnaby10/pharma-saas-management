export type CatalogItemCategory =
  | "medicine"
  | "cosmetic"
  | "supplement"
  | "equipment"
  | "other";

export interface CatalogItem {
  id: string;
  nameEn: string;
  nameAr?: string;
  sku?: string;
  barcode?: string;
  category: CatalogItemCategory;
  unit?: string;
  description?: string;
  manufacturer?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCatalogItemPayload {
  nameEn: string;
  nameAr?: string;
  sku?: string;
  barcode?: string;
  category: CatalogItemCategory;
  unit?: string;
  description?: string;
  manufacturer?: string;
}

export type UpdateCatalogItemPayload = Partial<CreateCatalogItemPayload> & {
  isActive?: boolean;
};

export interface CatalogListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: CatalogItemCategory;
  isActive?: boolean;
}
