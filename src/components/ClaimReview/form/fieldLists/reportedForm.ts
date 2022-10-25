import { createFormField, FormField } from "./FormField";
import { fetchUserList } from "./unassignedForm";

const reportedForm: FormField[] = [
    createFormField({
        fieldName: "reviewerId",
        type: "inputSearch",
        i18nKey: "reviewer",
        defaultValue: "",
        extraProps: { dataLoader: fetchUserList, mode: "" },
    }),
];

export default reportedForm;
