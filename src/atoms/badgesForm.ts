import { atom } from "jotai";
import { Badge } from "../types/Badge";

const isBadgesFormOpen = atom(false);

const badgesList = atom<Badge[]>([]);

const addBadgeToList = atom(null, (_get, set, badge: Badge) => {
    const newBadges = [..._get(badgesList), badge];
    set(badgesList, newBadges);
});

export { isBadgesFormOpen, badgesList, addBadgeToList };
