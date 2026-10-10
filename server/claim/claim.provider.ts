import type { IClaimService } from "../interfaces/claim.service.interface";
import { Provider } from "@nestjs/common";
import { MongoClaimService } from "./mongo/claim.service";
import { PostgresClaimService } from "./postgres/claim.service";
import { createDbServiceProvider } from "../database/db-service.provider";

export const claimServiceProvider: Provider =
    createDbServiceProvider<IClaimService>(
        "ClaimService",
        MongoClaimService,
        PostgresClaimService
    );
