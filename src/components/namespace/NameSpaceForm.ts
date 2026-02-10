import { fetchUserList } from "../ClaimReview/form/fieldLists/unassignedForm";
import { createFormField, FormField } from "../Form/FormField";

const lifecycleNameSpaceForm: FormField[] = [
    createFormField({
        fieldName: "name",
        type: "text",
        defaultValue: "",
        i18nNamespace: "namespaces",
        i18nKey: "nameColumn",

    }),
    createFormField({
        fieldName: "usersId",
        type: "inputSearch",
        defaultValue: "",
        i18nKey: "assignUser",
        extraProps: { dataLoader: fetchUserList },
    }),
];

export default lifecycleNameSpaceForm;
