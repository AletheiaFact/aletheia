import { atom } from "jotai";
import { Badge } from "../types/Badge";
import { indexOfItemBeingEdited } from "./editDrawer";

const badgesList = atom<Badge[]>([]);

const badgeBeeingEdited = atom(
    (get) => get(badgesList)[get(indexOfItemBeingEdited)]
);

const addBadgeToList = atom(null, (_get, set, badge: Badge) => {
    const newBadges = [..._get(badgesList), badge];
    set(badgesList, newBadges);
});

export { badgesList, addBadgeToList, badgeBeeingEdited };
