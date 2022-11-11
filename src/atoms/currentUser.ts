import { atom } from "jotai";
import { Roles } from "../types/enums";

const isUserLoggedIn = atom(false);
const currentUserRole = atom(Roles.Regular);

export { isUserLoggedIn, currentUserRole };
