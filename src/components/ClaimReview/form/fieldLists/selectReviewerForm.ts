import { createFormField, FormField } from "../../../Form/FormField";
import { fetchUserList } from "./unassignedForm";

const selectReviewerForm: FormField[] = [
    createFormField({
        fieldName: "reviewerId",
        type: "inputSearch",
        i18nKey: "reviewer",
        defaultValue: "",
        extraProps: { dataLoader: fetchUserList, mode: "" },
    }),
];

export default selectReviewerForm;
