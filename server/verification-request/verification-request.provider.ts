import type {
    IVerificationRequestService,
    IVerificationRequestStatsService,
} from "../interfaces/verification-request.service.interface";
import { Provider } from "@nestjs/common";
import { MongoVerificationRequestService } from "./mongo/verification-request.service";
import { PostgresVerificationRequestService } from "./postgres/verification-request.service";
import { MongoVerificationRequestStatsService } from "./mongo/verification-request-stats.service";
import { PostgresVerificationRequestStatsService } from "./postgres/verification-request-stats.service";
import { createDbServiceProvider } from "../database/db-service.provider";

export const verificationRequestServiceProvider: Provider =
    createDbServiceProvider<IVerificationRequestService>(
        "VerificationRequestService",
        MongoVerificationRequestService,
        PostgresVerificationRequestService
    );

export const verificationRequestStatsServiceProvider: Provider =
    createDbServiceProvider<IVerificationRequestStatsService>(
        "VerificationRequestStatsService",
        MongoVerificationRequestStatsService,
        PostgresVerificationRequestStatsService
    );
