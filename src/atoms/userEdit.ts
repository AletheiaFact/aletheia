import { atom, PrimitiveAtom } from "jotai";
import { User } from "../types/User";

const isUserEditDrawerOpen = atom(false);
const atomUserList = atom<User[]>([]);

// the 'as PrimitiveAtom<T>' is necessary if we want to initialize the atom as null
const indexOfUserBeingEdited = atom<number | null>(null) as PrimitiveAtom<
    number | null
>;

// when the first parameter is null the atom is derived and write-only
// and only updates other atoms, the user parameter could have any name
const startEditingUser = atom(null, (_get, set, userId) => {
    const index = _get(atomUserList).findIndex((user) => user._id === userId);

    set(indexOfUserBeingEdited, index);
    set(isUserEditDrawerOpen, true);
});

// this is a derived read-only atom that returns the user being edited
const userBeingEdited = atom(
    (get) => get(atomUserList)[get(indexOfUserBeingEdited)]
);

const finishEditingUser = atom(null, (_get, set, user: User) => {
    const index = _get(indexOfUserBeingEdited);
    if (index) {
        const newUsers = [..._get(atomUserList)];
        newUsers[index] = user;
        set(atomUserList, newUsers);
        set(indexOfUserBeingEdited, null);
        set(isUserEditDrawerOpen, false);
    }
});

export {
    isUserEditDrawerOpen,
    indexOfUserBeingEdited,
    atomUserList,
    startEditingUser,
    finishEditingUser,
    userBeingEdited,
};
