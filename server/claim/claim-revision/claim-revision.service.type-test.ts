import type { IClaimRevisionService } from "../../interfaces/claim-revision.service.interface";
import type { MongoClaimRevisionService } from "./mongo/claim-revision.service";
import type { PostgresClaimRevisionService } from "./postgres/claim-revision.service";
import type { ExactlyImplements } from "../../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<
    MongoClaimRevisionService,
    IClaimRevisionService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresClaimRevisionService,
    IClaimRevisionService
> = true;
