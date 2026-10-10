import type { IClaimRevisionService } from "../../interfaces/claim-revision.service.interface";
import { Provider } from "@nestjs/common";
import { MongoClaimRevisionService } from "./mongo/claim-revision.service";
import { PostgresClaimRevisionService } from "./postgres/claim-revision.service";
import { createDbServiceProvider } from "../../database/db-service.provider";

export const claimRevisionServiceProvider: Provider =
    createDbServiceProvider<IClaimRevisionService>(
        "ClaimRevisionService",
        MongoClaimRevisionService,
        PostgresClaimRevisionService
    );
