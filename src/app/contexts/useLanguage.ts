import { useApp } from "@/app/contexts/useApp";
import i18n from "@/i18n/config/i18n";
import type { TOptions } from "i18next";
import { useTranslation } from "react-i18next";

const FALLBACK_NAMESPACES = ["common", "auth"] as const;

export function useLanguage() {
  const { language, direction, setLanguage } = useApp();
  const { t: translate } = useTranslation();
  const translateAny = translate as (...args: any[]) => any;

  const t = (key: string, options?: TOptions) => {
    if (key.includes(":") || options?.ns) {
      return translateAny(key, options);
    }

    for (const namespace of FALLBACK_NAMESPACES) {
      if (i18n.exists(key, { ...options, ns: namespace })) {
        return translateAny(key, { ...options, ns: namespace });
      }
    }

    return translateAny(key, options);
  };

  return {
    language,
    direction,
    setLanguage,
    t,
  };
}
