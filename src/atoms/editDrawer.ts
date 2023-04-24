import { atom, PrimitiveAtom } from "jotai";

const isEditDrawerOpen = atom(false);
// the 'as PrimitiveAtom<T>' is necessary if we want to initialize the atom as null
const indexOfItemBeingEdited = atom<number | null>(null) as PrimitiveAtom<
    number | null
>;

// when the first parameter is null the atom is derived and write-only
// and only updates other atoms, the update parameter could have any name
const startEditingItem = atom(
    null,
    (_get, set, update: { itemId: string; listAtom: PrimitiveAtom<any[]> }) => {
        const index = _get(update.listAtom).findIndex(
            (item) => item._id === update.itemId
        );

        set(indexOfItemBeingEdited, index);
        set(isEditDrawerOpen, true);
    }
);

const finishEditingItem = atom(
    null,
    (_get, set, update: { newItem: any; listAtom: PrimitiveAtom<any[]> }) => {
        const index = _get(indexOfItemBeingEdited);
        if (index >= 0) {
            const newBadges = [..._get(update.listAtom)];
            newBadges[index] = update.newItem;
            set(update.listAtom, newBadges);
            set(indexOfItemBeingEdited, null);
            set(isEditDrawerOpen, false);
        }
    }
);

const cancelEditingItem = atom(null, (_get, set) => {
    set(indexOfItemBeingEdited, null);
    set(isEditDrawerOpen, false);
});

export {
    indexOfItemBeingEdited,
    isEditDrawerOpen,
    startEditingItem,
    finishEditingItem,
    cancelEditingItem,
};
