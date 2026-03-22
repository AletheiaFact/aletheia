import { ClassificationEnum } from "../../../../types/enums";
import {
    createFormField,
    FormField,
    fieldValidation,
} from "../../../Form/FormField";

const visualEditor: FormField[] = [
    createFormField({
        fieldName: "visualEditor",
        type: "visualEditor",
        defaultValue: "",
        required: false,
    }),

    createFormField({
        fieldName: "classification",
        type: "select",
        defaultValue: "",
        required: false,
        rules: {
            validate: {
                validClassification: (value) =>
                    !value ||
                    value === "" ||
                    fieldValidation(value, isValidClassification) ||
                    "common:requiredFieldError",
            },
        },
    }),
];

function isValidClassification(string) {
    return Object.values(ClassificationEnum).includes(string);
}

export default visualEditor;
