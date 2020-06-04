import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        global: {
            loading: "Loading..."
        },
        header: {
            search_personality: "Search personality"
        },
        personality: {
            profile_button: "See profile"
        },
        footer: {
            copyright: "Aletheia ©2020 Created by Open Tesseract"
        }
    },
    pt: {
        global: {
            loading: "Carregando..."
        },
        header: {
            search_personality: "Busque uma personalidade"
        },
        personality: {
            profile_button: "Veja o perfil"
        },
        footer: {
            copyright: "Aletheia ©2020 Criado por Open Tesseract"
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
