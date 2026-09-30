import type { ISourceService } from "../interfaces/source.service.interface";
import { Provider } from "@nestjs/common";
import { MongoSourceService } from "./mongo/source.service";
import { PostgresSourceService } from "./postgres/source.service";
import { createDbServiceProvider } from "../database/db-service.provider";

export const sourceServiceProvider: Provider =
    createDbServiceProvider<ISourceService>(
        "SourceService",
        MongoSourceService,
        PostgresSourceService
    );
