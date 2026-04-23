import { useApp } from "@/app/contexts/useApp";
import { translations } from "@/app/contexts/language-translations";

export function useLanguage() {
  const { language, direction, setLanguage } = useApp();

  return {
    language,
    direction,
    setLanguage,
    t: (key: string) => translations[language][key] || key,
  };
}
