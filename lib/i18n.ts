import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en'; 
import  se  from '@/locales/se'; 

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: en },
      se: { translation: se },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;