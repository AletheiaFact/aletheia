import { Injectable } from "@nestjs/common";
import type {
    BadgeCreateInput,
    BadgeUpdateInput,
    IBadgeService,
} from "../../interfaces/badge.service.interface";
import { IBadge } from "../../interfaces/badge.interface";
import { NotImplementedError } from "../../database/errors";

@Injectable()
export class PostgresBadgeService implements IBadgeService {
    async create(_badge: BadgeCreateInput): Promise<IBadge> {
        throw new NotImplementedError("postgres", "create");
    }

    async update(_badge: BadgeUpdateInput): Promise<IBadge | null> {
        throw new NotImplementedError("postgres", "update");
    }

    async listAll(): Promise<IBadge[]> {
        throw new NotImplementedError("postgres", "listAll");
    }

    async getById(_badgeId: string): Promise<IBadge | null> {
        throw new NotImplementedError("postgres", "getById");
    }
}
