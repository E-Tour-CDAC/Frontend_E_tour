import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "ja", label: "JA" }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex gap-2 pointer-events-auto z-[9999]">
      {languages.map((lang) => {
        const isActive = i18n.language === lang.code;

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => changeLang(lang.code)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-md border
              cursor-pointer transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-teal-600
              ${
                isActive
                  ? "bg-teal-700 text-white border-teal-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-teal-600 hover:text-white hover:border-teal-600"
              }
            `}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
