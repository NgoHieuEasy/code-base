import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // Tải file json từ thư mục public/locales
  .use(LanguageDetector) // Tự động nhận diện ngôn ngữ trình duyệt
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi', // Ngôn ngữ mặc định
    debug: false,
    keySeparator: '.',
    interpolation: {
      escapeValue: false, 
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    }
  });

export default i18n;