import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/languageStore";

const useLanguageChange = () => {
  const { language } = useLanguageStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Change the i18next language when the language state changes
    i18n.changeLanguage(language);
  }, [language, i18n]); // Run this effect whenever the language changes
};

export default useLanguageChange;
