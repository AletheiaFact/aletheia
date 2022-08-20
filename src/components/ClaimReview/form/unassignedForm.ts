import { createFormField, FormField } from "./FormField";

const unassignedForm: FormField[] = [
    createFormField({
        fieldName: "usersId",
        type: "inputSearch",
        i18nKey: "assignUser",
    }),
];

export default unassignedForm;
