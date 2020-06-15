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
            profile_button: "See profile",
            add_button: "Add"
        },
        footer: {
            copyright: "Aletheia ©2020 Created by Open Tesseract"
        },
        personalityCreateForm: {
            errorMessage: "Error while saving personality",
            successMessage: "profile created with success",
            errorNameRequired: "Please insert a name",
            errorDescriptionRequired: "Please insert a description",
            description: "Description",
            name: "Nome",
            wikidata: "Wikidata ID",
            saveButton: "Save personality"
        },
        personalityCTA: {
            header: "Didn't find who you were looking for?",
            footer: "And help us grow our database!",
            button: "Add personality"
        },
        claimReviewForm: {
            titleEmpty: "Choose a sentence to review",
            title: "Review the sentence",
            selectLabel: "Review this claim",
            sourceLabel: "Provide a link to a reliable source",
            sourcePlaceholder: "Paste URL",
            addReviewButton: "Add review",
            placeholder: "Choose a classification",
            "not-fact": "Not fact",
            true: "True",
            "true-but": "True, but",
            arguable: "Arguable",
            misleading: "Misleading",
            false: "False",
            unsustainable: "Unsustainable",
            exaggerated: "Exaggerated",
            unverifiable: "Unverifiable",
            errorMessage: "Error while sending review",
            successMessage: "Review succeeded"
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
            profile_button: "Veja o perfil",
            add_button: "Inserir"
        },
        footer: {
            copyright: "Aletheia ©2020 Criado por Open Tesseract"
        },
        personalityCreateForm: {
            errorMessage: "Erro ao salvar personalidade",
            successMessage: "perfil criado com sucesso",
            errorNameRequired: "Por favor, insira um nome",
            errorDescriptionRequired: "Por favor, insira uma descrição",
            description: "Descrição",
            name: "Nome",
            wikidata: "ID Wikidata",
            saveButton: "Salvar personalidade"
        },
        personalityCTA: {
            header: "Não encontrou o que procurava?",
            footer: "e ajude-nos a aumentar o nosso banco de dados!",
            button: "Incluir personalidade"
        },
        claimReviewForm: {
            titleEmpty: "Escolha uma frase para revisar",
            title: "Classifique a frase",
            selectLabel: "Revise essa frase",
            sourceLabel: "Forneça um link de uma fonte confiável",
            sourcePlaceholder: "Cole uma URL",
            addReviewButton: "Adicione revisão",
            placeholder: "Selecione uma classificação",
            "not-fact": "Não é fato",
            true: "Verdadeiro",
            "true-but": "Verdadeiro, mas",
            arguable: "Discutível",
            misleading: "Enganoso",
            false: "Falso",
            unsustainable: "Insustentável",
            exaggerated: "Exagerado",
            unverifiable: "Inverificável",
            errorMessage: "Erro ao enviar revisão",
            successMessage: "Revisão concluída"
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
