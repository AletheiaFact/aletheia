import type { IUnattributedService } from "../../../interfaces/unattributed.service.interface";
import type { MongoUnattributedService } from "./mongo/unattributed.service";
import type { PostgresUnattributedService } from "./postgres/unattributed.service";
import type { ExactlyImplements } from "../../../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<
    MongoUnattributedService,
    IUnattributedService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresUnattributedService,
    IUnattributedService
> = true;
