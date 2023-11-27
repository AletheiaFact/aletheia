import { ClassificationEnum } from "../../../../types/enums";
import {
    createFormField,
    FormField,
    fieldValidation,
} from "../../../Form/FormField";

const assignedCollaborativeForm: FormField[] = [
    createFormField({
        fieldName: "collaborativeEditor",
        type: "collaborative",
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

export default assignedCollaborativeForm;
