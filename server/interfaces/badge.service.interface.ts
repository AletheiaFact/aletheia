import type { IBadge } from "./badge.interface";

export type BadgeImageRef = { _id?: any; [key: string]: any };

export type BadgeCreateInput = {
    name: string;
    description: string;
    image: BadgeImageRef;
    [key: string]: any;
};

export type BadgeUpdateInput = BadgeCreateInput & { _id: any };

export type IBadgeService = {
    create(badge: BadgeCreateInput): Promise<IBadge>;
    update(badge: BadgeUpdateInput): Promise<IBadge | null>;
    listAll(): Promise<IBadge[]>;
    getById(badgeId: string): Promise<IBadge | null>;
};
