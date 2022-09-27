import { ClassificationEnum } from "../../../../machine/enums";
import { createFormField, fieldValidation, FormField } from "./FormField";
import { fetchUserList } from "./unassignedForm";

const reportedForm: FormField[] = [
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
        fieldName: "revisorId",
        type: "inputSearch",
        i18nKey: "revisor",
        defaultValue: "",
        extraProps: { dataLoader: fetchUserList, mode: "" },
    }),
];

function isValidClassification(string) {
    return Object.values(ClassificationEnum).includes(string);
}

//fazer um custom validation pra nao aceitar assigned users to be review

export default reportedForm;
