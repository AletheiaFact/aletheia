import { createFormField, FormField } from "./FormField";

const reportedForm: FormField[] = [
    createFormField({
        fieldName: "classification",
        type: "select",
        defaultValue: "",
    }),
    createFormField({
        fieldName: "revisorId",
        type: "inputSearch",
        i18nKey: "revisor",
    }),
];

export default reportedForm;
