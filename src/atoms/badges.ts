import { atom } from "jotai";
import { Badge } from "../types/Badge";
import { indexOfItemBeingEdited } from "./editDrawer";

const atomBadgesList = atom<Badge[]>([]);

const badgeBeeingEdited = atom(
    (get) => get(atomBadgesList)[get(indexOfItemBeingEdited)]
);

const addBadgeToList = atom(null, (_get, set, badge: Badge) => {
    const newBadges = [..._get(atomBadgesList), badge];
    set(atomBadgesList, newBadges);
});

export { atomBadgesList, addBadgeToList, badgeBeeingEdited };
