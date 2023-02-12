import { atom } from "jotai";
import { Roles } from "../types/enums";

const isLoggedIn = atom(false);
const currentUserRole = atom(Roles.Regular);

export { isLoggedIn, currentUserRole };
