import { useEffect, useState, type ReactNode } from "react";
import {
  AppContext,
  type AppContextType,
  mockTenant,
  mockUser,
} from "@/app/contexts/app-context";
import {
  getStoredLanguage,
  getStoredTheme,
  resolveDirection,
  setStoredLanguage,
  setStoredTheme,
  syncDocumentSettings,
} from "@/shared/utils/appSettings";

export function AppProvider({ children }: { children: ReactNode }) {
  const [tenant] = useState(mockTenant);
  const [currentBranch, setCurrentBranch] = useState(mockTenant.branches[0]);
  const [currentShift, setCurrentShift] = useState<AppContextType["currentShift"]>({
    id: "shift-1",
    branchId: "branch-1",
    userId: "user-1",
    startTime: new Date(),
    startingCash: 500,
    isOpen: true,
  });
  const [user] = useState(mockUser);
  const [language, setLanguageState] = useState<Language>(() =>
    getStoredLanguage(),
  );
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());
  const direction = resolveDirection(language);

  useEffect(() => {
    setStoredLanguage(language);
    setStoredTheme(theme);
    syncDocumentSettings(language, theme);
  }, [language, theme]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  };

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
  };

  const toggleTheme = () => {
    setThemeState((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  };

  return (
    <AppContext.Provider
      value={{
        tenant,
        currentBranch,
        setCurrentBranch,
        currentShift,
        setCurrentShift,
        language,
        direction,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
