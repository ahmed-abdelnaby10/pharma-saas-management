import React, { createContext, useContext, useState } from 'react';

interface Branch {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

interface Tenant {
  id: string;
  name: string;
  plan: 'basic' | 'professional' | 'enterprise';
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

interface AppContextType {
  tenant: Tenant | null;
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  currentShift: Shift | null;
  setCurrentShift: (shift: Shift | null) => void;
  user: { id: string; name: string; role: 'owner' | 'pharmacist' } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data for demo
const mockTenant: Tenant = {
  id: 'tenant-1',
  name: 'Green Valley Pharmacy',
  plan: 'professional',
  branches: [
    { id: 'branch-1', name: 'Main Branch', address: 'Downtown Medical Center', isActive: true },
    { id: 'branch-2', name: 'North Branch', address: 'North District Mall', isActive: true },
    { id: 'branch-3', name: 'West Branch', address: 'West Shopping Complex', isActive: true },
  ],
};

const mockUser = {
  id: 'user-1',
  name: 'Ahmed Al-Rashid',
  role: 'owner' as const,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tenant] = useState<Tenant>(mockTenant);
  const [currentBranch, setCurrentBranch] = useState<Branch>(mockTenant.branches[0]);
  const [currentShift, setCurrentShift] = useState<Shift | null>({
    id: 'shift-1',
    branchId: 'branch-1',
    userId: 'user-1',
    startTime: new Date(),
    startingCash: 500,
    isOpen: true,
  });
  const [user] = useState(mockUser);

  return (
    <AppContext.Provider
      value={{
        tenant,
        currentBranch,
        setCurrentBranch,
        currentShift,
        setCurrentShift,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
