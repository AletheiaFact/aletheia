import { atom } from "jotai";
import { Roles } from "../types/enums";

const isUserLoggedIn = atom(false);
const currentUserRole = atom(Roles.Regular);
const currentUserId = atom("");

export { isUserLoggedIn, currentUserRole, currentUserId };
