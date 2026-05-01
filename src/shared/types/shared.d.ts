type Language = "en" | "ar";
type Theme = "light" | "dark";
type Direction = "ltr" | "rtl";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "pharmacist" | "cashier" | "admin";
  branchId?: string;
  tenantId?: string;
}

interface AppContextType {
  user: AppUser | null;
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/** Backend paginated data shape: { data: T[], meta: { total, page, limit, totalPages } } */
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Generic list params shared across list endpoints */
interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  branchId?: string;
}
