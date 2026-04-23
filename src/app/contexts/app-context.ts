import { createContext } from "react";

interface Branch {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

interface Tenant {
  id: string;
  name: string;
  plan: "basic" | "professional" | "enterprise";
  branches: Branch[];
}

interface Shift {
  id: string;
  branchId: string;
  userId: string;
  startTime: Date;
  startingCash: number;
  isOpen: boolean;
}

export interface AppContextType {
  tenant: Tenant | null;
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  currentShift: Shift | null;
  setCurrentShift: (shift: Shift | null) => void;
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    role: "owner" | "pharmacist";
  } | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const mockTenant: Tenant = {
  id: "tenant-1",
  name: "Green Valley Pharmacy",
  plan: "professional",
  branches: [
    {
      id: "branch-1",
      name: "Main Branch",
      address: "Downtown Medical Center",
      isActive: true,
    },
    {
      id: "branch-2",
      name: "North Branch",
      address: "North District Mall",
      isActive: true,
    },
    {
      id: "branch-3",
      name: "West Branch",
      address: "West Shopping Complex",
      isActive: true,
    },
  ],
};

export const mockUser = {
  id: "user-1",
  name: "Ahmed Al-Rashid",
  email: "ahmed@greenvalley.example",
  role: "owner" as const,
};
