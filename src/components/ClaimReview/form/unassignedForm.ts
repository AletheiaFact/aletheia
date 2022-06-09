import { createFormField, FormField } from "./FormField";

const unassignedForm: FormField[] = [
    createFormField({
        fieldName: "userId",
        type: "inputSearch",
        i18nKey: "assignUser",
    }),
];

export default unassignedForm;
