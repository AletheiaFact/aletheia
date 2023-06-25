import { atom } from "jotai";
import { User } from "../types/User";
import { indexOfItemBeingEdited } from "./editDrawer";

const atomUserList = atom<User[]>([]);

// this is a derived read-only atom that returns the user being edited
const userBeingEdited = atom(
    (get) => get(atomUserList)[get(indexOfItemBeingEdited)]
);

export { atomUserList, userBeingEdited };
