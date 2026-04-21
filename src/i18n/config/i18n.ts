import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enCommon from "../locales/en/common.json";
import enAuth from "../locales/en/auth.json";
import enHome from "../locales/en/home.json";
import enCategories from "../locales/en/categories.json";
import enMaterials from "../locales/en/materials.json";
import enCart from "../locales/en/cart.json";
import enCheckout from "../locales/en/checkout.json";
import enPayment from "../locales/en/payment.json";
import enOrder from "../locales/en/order.json";
import enProfile from "../locales/en/profile.json";
import enLocations from "../locales/en/locations.json";

import arCommon from "../locales/ar/common.json";
import arAuth from "../locales/ar/auth.json";
import arHome from "../locales/ar/home.json";
import arCategories from "../locales/ar/categories.json";
import arMaterials from "../locales/ar/materials.json";
import arCart from "../locales/ar/cart.json";
import arCheckout from "../locales/ar/checkout.json";
import arPayment from "../locales/ar/payment.json";
import arOrder from "../locales/ar/order.json";
import arProfile from "../locales/ar/profile.json";
import arLocations from "../locales/ar/locations.json";

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    home: enHome,
    categories: enCategories,
    materials: enMaterials,
    cart: enCart,
    checkout: enCheckout,
    payment: enPayment,
    order: enOrder,
    profile: enProfile,
    locations: enLocations,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    home: arHome,
    categories: arCategories,
    materials: arMaterials,
    cart: arCart,
    checkout: arCheckout,
    payment: arPayment,
    order: arOrder,
    profile: arProfile,
    locations: arLocations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ar",
  fallbackLng: "ar",
  supportedLngs: ["en", "ar"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
