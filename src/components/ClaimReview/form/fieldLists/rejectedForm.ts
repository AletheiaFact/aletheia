import { createFormField, FormField } from "../../../Form/FormField";

const rejectedForm: FormField[] = [
    createFormField({
        fieldName: "rejectionComment",
        type: "textArea",
        defaultValue: "",
    }),
];

export default rejectedForm;
