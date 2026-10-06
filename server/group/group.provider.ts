import type { IGroupService } from "../interfaces/group.service.interface";
import { Provider } from "@nestjs/common";
import { MongoGroupService } from "./mongo/group.service";
import { PostgresGroupService } from "./postgres/group.service";
import { createDbServiceProvider } from "../database/db-service.provider";

export const groupServiceProvider: Provider =
    createDbServiceProvider<IGroupService>(
        "GroupService",
        MongoGroupService,
        PostgresGroupService
    );
