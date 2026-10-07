import type {
    IVerificationRequestService,
    IVerificationRequestStatsService,
} from "../interfaces/verification-request.service.interface";
import type { MongoVerificationRequestService } from "./mongo/verification-request.service";
import type { PostgresVerificationRequestService } from "./postgres/verification-request.service";
import type { MongoVerificationRequestStatsService } from "./mongo/verification-request-stats.service";
import type { PostgresVerificationRequestStatsService } from "./postgres/verification-request-stats.service";
import type { ExactlyImplements } from "../interfaces/service-surface.type";

export const _mongoExact: ExactlyImplements<
    MongoVerificationRequestService,
    IVerificationRequestService
> = true;
export const _pgExact: ExactlyImplements<
    PostgresVerificationRequestService,
    IVerificationRequestService
> = true;
export const _mongoStatsExact: ExactlyImplements<
    MongoVerificationRequestStatsService,
    IVerificationRequestStatsService
> = true;
export const _pgStatsExact: ExactlyImplements<
    PostgresVerificationRequestStatsService,
    IVerificationRequestStatsService
> = true;
