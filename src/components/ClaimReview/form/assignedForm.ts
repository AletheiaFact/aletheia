import { createFormField, FormField, fieldValidation } from "./FormField";

const assignedForm: FormField[] = [
    createFormField({
        fieldName: "summary",
        type: "textArea",
        defaultValue: "",
    }),
    createFormField({
        fieldName: "questions",
        type: "textList",
        addInputLabel: "claimReviewForm:addQuestionLabel",
        defaultValue: [],
    }),
    createFormField({
        fieldName: "report",
        type: "textArea",
        defaultValue: "",
    }),
    createFormField({
        fieldName: "verification",
        type: "textArea",
        defaultValue: "",
    }),
    createFormField({
        fieldName: "sources",
        type: "textList",
        i18nKey: "sources",
        addInputLabel: "claimReviewForm:addSourceLabel",
        defaultValue: [],
        rules: {
            validate: {
                checkUrl: (value) =>
                    fieldValidation(value, isValidHttpUrl) ||
                    "sourceForm:errorMessageValidURL",
            },
        },
    }),
];

function isValidHttpUrl(string) {
    let url: URL;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export default assignedForm;
