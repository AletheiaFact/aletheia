import usersApi from "../../../../api/userApi";
import { Roles } from "../../../../types/enums";
import { createFormField, FormField } from "../../../Form/FormField";

export const fetchUserList = async (name, t, nameSpace) => {
    const userSearchResults = await usersApi.getUsers(
        {
            searchName: name,
            filterOutRoles: [Roles.Regular],
            nameSpaceSlug: nameSpace,
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
        fieldName: "usersId",
        type: "inputSearch",
        i18nKey: "assignUser",
        extraProps: { dataLoader: fetchUserList },
    }),
];

export default unassignedForm;
