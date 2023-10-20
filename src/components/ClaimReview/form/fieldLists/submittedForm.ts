import { createFormField, FormField } from "../../../Form/FormField";

const submittedForm: FormField[] = [
    createFormField({
        fieldName: "collaborativeEditor",
        type: "collaborative",
        defaultValue: "",
    }),
];

export default submittedForm;
