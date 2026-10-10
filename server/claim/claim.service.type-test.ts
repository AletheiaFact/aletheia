import type { IClaimService } from "../interfaces/claim.service.interface";
import type { MongoClaimService } from "./mongo/claim.service";
import type { PostgresClaimService } from "./postgres/claim.service";
import type { ExactlyImplements } from "../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<MongoClaimService, IClaimService> =
    true;
export const _pgExact: ExactlyImplements<PostgresClaimService, IClaimService> =
    true;
