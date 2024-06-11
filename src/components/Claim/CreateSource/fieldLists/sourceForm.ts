import { ClassificationEnum } from "../../../../types/enums";
import {
    createFormField,
    FormField,
    fieldValidation,
} from "../../../Form/FormField";

const sourceForm: FormField[] = [
    createFormField({
        fieldName: "sourceEditor",
        type: "sourceEditor",
        defaultValue: "",
    }),

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
];

function isValidClassification(string) {
    return Object.values(ClassificationEnum).includes(string);
}

export default sourceForm;
