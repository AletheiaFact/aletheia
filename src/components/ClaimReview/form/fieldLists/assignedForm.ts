import { ClassificationEnum } from "../../../../types/enums";
import {
    createFormField,
    FormField,
    fieldValidation,
} from "../../../Form/FormField";

const assignedForm: FormField[] = [
    createFormField({
        fieldName: "classification",
        type: "select",
        defaultValue: "",
        rules: {
            validate: {
                validClassification: (value) =>
                    fieldValidation(value, isValidClassification) ||
                    "common:requiredFieldError",
            },
        },
    }),
    createFormField({
        fieldName: "summary",
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

function isValidClassification(string) {
    return Object.values(ClassificationEnum).includes(string);
}

export default assignedForm;
