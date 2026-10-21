import type { IPersonalityService } from "../interfaces/personality.service.interface";
import { Provider } from "@nestjs/common";
import { MongoPersonalityService } from "./mongo/personality.service";
import { PostgresPersonalityService } from "./postgres/personality.service";
import { createDbServiceProvider } from "../database/db-service.provider";

export const personalityServiceProvider: Provider =
    createDbServiceProvider<IPersonalityService>(
        "PersonalityService",
        MongoPersonalityService,
        PostgresPersonalityService
    );
