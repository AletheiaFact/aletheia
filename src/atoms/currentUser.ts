import { atom } from "jotai";
import { Roles } from "../types/enums";

// User authentication atoms
const isUserLoggedIn = atom(false);
const currentUserRole = atom(Roles.Regular);
const currentUserId = atom("");
const currentAuthentication = atom("");

export {
    isUserLoggedIn,
    currentUserRole,
    currentUserId,
    currentAuthentication,
};
