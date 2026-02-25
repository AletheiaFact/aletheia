import { Roles } from "../types/enums";

export const canEdit = (currentUser, userId) => {
    const isSelectedSuperAdmin = currentUser?.role === Roles.SuperAdmin;
    const editingSelf = currentUser?._id === userId;
    return (isSelectedSuperAdmin && editingSelf) || !isSelectedSuperAdmin;
};

const Permission = {
    isAdmin: (role: Roles) => [Roles.Admin, Roles.SuperAdmin].includes(role),
    isChecker: (role: Roles) => [Roles.Reviewer, Roles.FactChecker].includes(role),
    isStaff: (role: Roles) => Permission.isAdmin(role) || Permission.isChecker(role)
};

export const { isAdmin, isChecker, isStaff } = Permission;
