import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        global: {
            loading: "Loading...",
            back_button: "Back"
        },
        header: {
            search_personality: "Search personality"
        },
        personality: {
            profile_button: "See profile"
        },
        footer: {
            copyright: "Aletheia ©2020 Created by Open Tesseract"
        },
        claimReviewForm: {
            titleEmpty: "Choose a sentence to review",
            title: "Review the sentence",
            placeholder: "Choose a classification",
            "not-fact": "Not fact",
            true: "True",
            "true-but": "True, but",
            arguable: "Arguable",
            misleading: "Misleading",
            false: "False",
            unsustainable: "Unsustainable",
            exaggerated: "Exaggerated",
            unverifiable: "Unverifiable"
        }
    },
    pt: {
        global: {
            loading: "Carregando...",
            back_button: "Voltar"
        },
        header: {
            search_personality: "Busque uma personalidade"
        },
        personality: {
            profile_button: "Veja o perfil"
        },
        footer: {
            copyright: "Aletheia ©2020 Criado por Open Tesseract"
        },
        claimReviewForm: {
            titleEmpty: "Escolha uma frase para revisar",
            title: "Classifique a frase",
            placeholder: "Selecione uma classificação",
            "not-fact": "Não é fato",
            true: "Verdadeiro",
            "true-but": "Verdadeiro, mas",
            arguable: "Discutível",
            misleading: "Enganoso",
            false: "Falso",
            unsustainable: "Insustentável",
            exaggerated: "Exagerado",
            unverifiable: "Inverificável"
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
