import { createFormField, FormField } from "./FormField";

const reportedForm: FormField[] = [
    createFormField({
        fieldName: "classification",
        type: "select",
        defaultValue: "",
    }),
];

export default reportedForm;
