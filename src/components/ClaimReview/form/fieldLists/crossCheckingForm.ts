import { ClassificationEnum } from "../../../../types/enums";
import {
    createFormField,
    FormField,
    fieldValidation,
} from "../../../Form/FormField";

const crossCheckingForm: FormField[] = [
    //TODO: Create Enum of fieldName based on reviewData
    createFormField({
        fieldName: "crossCheckingComment",
        type: "textArea",
        defaultValue: "",
    }),

    createFormField({
        fieldName: "crossCheckingClassification",
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

export default crossCheckingForm;
