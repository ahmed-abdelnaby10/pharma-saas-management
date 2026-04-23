const APP_LANGUAGE_KEY = "pharmacy-language";
const APP_THEME_KEY = "pharmacy-theme";

export function resolveDirection(language: Language): Direction {
  return language === "ar" ? "rtl" : "ltr";
}

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(APP_LANGUAGE_KEY);
  return storedLanguage === "ar" ? "ar" : "en";
}

export function setStoredLanguage(language: Language) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(APP_LANGUAGE_KEY, language);
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(APP_THEME_KEY);
  return storedTheme === "dark" ? "dark" : "light";
}

export function setStoredTheme(theme: Theme) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(APP_THEME_KEY, theme);
}

export function syncDocumentSettings(language: Language, theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  const direction = resolveDirection(language);

  document.documentElement.lang = language;
  document.documentElement.dir = direction;
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}
