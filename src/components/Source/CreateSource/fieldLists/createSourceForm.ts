import { createFormField, FormField } from "../../../Form/FormField";

const createSourceForm: FormField[] = [
    createFormField({
        fieldName: "source",
        type: "text",
        defaultValue: "",
    }),
];

export default createSourceForm;
