import usersApi from "../../../../api/userApi";
import { createFormField, FormField } from "../../../Form/FormField";

export const fetchUserList = async (
    name,
    t,
    nameSpace,
    filterOutRoles,
    canAssignUsers
) => {
    const userSearchResults = await usersApi.getUsers(
        {
            searchName: name,
            filterOutRoles,
            nameSpaceSlug: nameSpace,
            canAssignUsers,
        },
        t
    );
    return userSearchResults.map((user) => ({
        label: user.name,
        value: user._id,
        role: user.role,
    }));
};

const unassignedForm: FormField[] = [
    createFormField({
        fieldName: "visualEditor",
        type: "visualEditor",
        defaultValue: "",
    }),
    createFormField({
        fieldName: "usersId",
        type: "inputSearch",
        i18nKey: "assignUser",
        extraProps: { dataLoader: fetchUserList },
    }),
];

export default unassignedForm;
