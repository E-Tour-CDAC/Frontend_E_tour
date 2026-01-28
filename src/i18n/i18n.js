import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import ja from "./locales/ja.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      ja: { translation: ja },
    },

    // 🔑 Priority order for language detection
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
