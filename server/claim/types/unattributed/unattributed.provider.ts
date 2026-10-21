import type { IUnattributedService } from "../../../interfaces/unattributed.service.interface";
import { Provider } from "@nestjs/common";
import { MongoUnattributedService } from "./mongo/unattributed.service";
import { PostgresUnattributedService } from "./postgres/unattributed.service";
import { createDbServiceProvider } from "../../../database/db-service.provider";

export const unattributedServiceProvider: Provider =
    createDbServiceProvider<IUnattributedService>(
        "UnattributedService",
        MongoUnattributedService,
        PostgresUnattributedService
    );
