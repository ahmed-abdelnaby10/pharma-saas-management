type Language = "en" | "ar";
type Theme = "light" | "dark";
type Direction = "ltr" | "rtl";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "pharmacist";
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

interface PaginatedResponse<T> {
  next: number;
  previous: number;
  count: number;
  data: T[];
}
