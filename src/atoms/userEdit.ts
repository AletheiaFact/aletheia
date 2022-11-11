import { atom, PrimitiveAtom } from "jotai";
import { User } from "../types/User";

const isUserEditDrawerOpen = atom(false);

// the 'as PrimitiveAtom<T>' is necessary if we want to initialize the atom as null
const userBeingEdited = atom<User>(null) as PrimitiveAtom<User>;

// when the first parameter is null the atom is derived and write-only
// and only updates other atoms, the user parameter could have any name
const startEditingUser = atom(null, (_get, set, user) => {
    set(userBeingEdited, user);
    set(isUserEditDrawerOpen, true);
});

export { isUserEditDrawerOpen, userBeingEdited, startEditingUser };
