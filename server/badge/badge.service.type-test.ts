import type { IBadgeService } from "../interfaces/badge.service.interface";
import type { MongoBadgeService } from "./mongo/badge.service";
import type { PostgresBadgeService } from "./postgres/badge.service";
import type { ExactlyImplements } from "../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<MongoBadgeService, IBadgeService> =
    true;
export const _pgExact: ExactlyImplements<PostgresBadgeService, IBadgeService> =
    true;
