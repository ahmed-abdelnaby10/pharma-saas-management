import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "@/shared/utils/constants";
import { getStoredLanguage } from "@/shared/utils/appSettings";

// Import translation files
import enCommon from "../locales/en/common.json";
import enAuth from "../locales/en/auth.json";
import enContact from "../locales/en/contact.json";
import enDownload from "../locales/en/download.json";
import enFeaturesPage from "../locales/en/features-page.json";
import enHomePage from "../locales/en/home-page.json";
import enPricingPage from "../locales/en/pricing-page.json";

import arCommon from "../locales/ar/common.json";
import arAuth from "../locales/ar/auth.json";
import arContact from "../locales/ar/contact.json";
import arDownload from "../locales/ar/download.json";
import arFeaturesPage from "../locales/ar/features-page.json";
import arHomePage from "../locales/ar/home-page.json";
import arPricingPage from "../locales/ar/pricing-page.json";

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    contact: enContact,
    download: enDownload,
    featuresPage: enFeaturesPage,
    homePage: enHomePage,
    pricingPage: enPricingPage,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    contact: arContact,
    download: arDownload,
    featuresPage: arFeaturesPage,
    homePage: arHomePage,
    pricingPage: arPricingPage,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  ns: ["common", "auth", "contact", "download", "featuresPage", "homePage", "pricingPage"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export default i18n;
