import { createFormField, FormField } from "./FormField";

const rejectedForm: FormField[] = [
    createFormField({
        fieldName: "rejectionComment",
        type: "textArea",
        defaultValue: "",
    }),
];

export default rejectedForm;
