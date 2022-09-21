import { createFormField, FormField } from "./FormField";

const submittedForm: FormField[] = [
    createFormField({
        fieldName: "rejectionComment",
        type: "textArea",
        defaultValue: "",
    }),
];

export default submittedForm;
