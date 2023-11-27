import { createFormField, FormField } from "../../../Form/FormField";
import { fetchUserList } from "./unassignedForm";

const selectCrossCheckerForm: FormField[] = [
    createFormField({
        fieldName: "crossCheckerId",
        type: "inputSearch",
        i18nKey: "crossChecker",
        defaultValue: "",
        extraProps: { dataLoader: fetchUserList, mode: "" },
    }),
];

export default selectCrossCheckerForm;
