import { fetchUserList } from "../ClaimReview/form/fieldLists/unassignedForm";
import { createFormField, FormField } from "../Form/FormField";

const lifecycleBadgesForm: FormField[] = [
    createFormField({
        fieldName: "name",
        type: "text",
        defaultValue: "",
        i18nNamespace: "badges",
    }),
    createFormField({
        fieldName: "description",
        type: "text",
        defaultValue: "",
        i18nNamespace: "badges",
    }),
    createFormField({
        fieldName: "imageField",
        type: "imageUpload",
        defaultValue: "",
        i18nNamespace: "badges",
    }),
    createFormField({
        fieldName: "usersId",
        type: "inputSearch",
        defaultValue: "",
        i18nKey: "assignUser",
        extraProps: { dataLoader: fetchUserList },
        required: false,
    }),
];

export default lifecycleBadgesForm;
