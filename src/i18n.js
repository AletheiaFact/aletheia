import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        header: {
            "search_personality": "Search personality"
        },
        footer: {
            "copyright": "Aletheia ©2020 Created by Open Tesseract"
        }
    },
    pt: {
        header: {
            "search_personality": "Busque uma personalidade"
        },
        footer: {
            "copyright": "Aletheia ©2020 Criado por Open Tesseract"
        }
    }
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .use(LanguageDetector)
    .init({
        resources,
        load: "languageOnly",
        fallbackLng: "pt",
        lng: navigator.language || navigator.userLanguage,

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
