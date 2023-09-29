import { Roles } from "../types/enums";

export const canEdit = (currentUser, userId) => {
    const isSelectedSuperAdmin = currentUser?.role === Roles.SuperAdmin;
    const editingSelf = currentUser?._id === userId;
    return (isSelectedSuperAdmin && editingSelf) || !isSelectedSuperAdmin;
};
