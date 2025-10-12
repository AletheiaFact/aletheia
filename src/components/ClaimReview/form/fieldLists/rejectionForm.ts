import {
    createFormField,
    FormField,
} from "../../../Form/FormField";

const rejectionForm: FormField[] = [
    createFormField({
        fieldName: "rejectionComment",
        type: "textArea",
        defaultValue: "",
        required: true,
    }),
];

export default rejectionForm;