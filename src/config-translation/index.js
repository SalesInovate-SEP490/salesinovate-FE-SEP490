import i18next from 'i18next';
import translationEN from '../locales/en/translation.json';
import translationVI from '../locales/vi/translation.json';
import { initReactI18next } from 'react-i18next';


const resource = {
    en: { translation: translationEN },
    vi: { translation: translationVI },
};

// Check if a language preference is saved in localStorage
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18next.use(initReactI18next).init({
    lng: savedLanguage,
    debug: true,
    resources: resource,
});