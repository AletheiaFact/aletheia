import type { IBadgeService } from "../interfaces/badge.service.interface";
import { Provider } from "@nestjs/common";
import { MongoBadgeService } from "./mongo/badge.service";
import { PostgresBadgeService } from "./postgres/badge.service";
import { createDbServiceProvider } from "../database/db-service.provider";

export const badgeServiceProvider: Provider =
    createDbServiceProvider<IBadgeService>(
        "BadgeService",
        MongoBadgeService,
        PostgresBadgeService
    );
