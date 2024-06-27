import { createFormField, FormField } from "../../../Form/FormField";

const submittedForm: FormField[] = [
    createFormField({
        fieldName: "visualEditor",
        type: "visualEditor",
        defaultValue: "",
    }),
];

export default submittedForm;
