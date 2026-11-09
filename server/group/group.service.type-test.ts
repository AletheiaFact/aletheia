import type { IGroupService } from "../interfaces/group.service.interface";
import type { MongoGroupService } from "./mongo/group.service";
import type { PostgresGroupService } from "./postgres/group.service";
import type { ExactlyImplements } from "../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<MongoGroupService, IGroupService> =
    true;
export const _pgExact: ExactlyImplements<PostgresGroupService, IGroupService> =
    true;
