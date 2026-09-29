import type { ISourceService } from "../interfaces/source.service.interface";
import { Provider } from "@nestjs/common";
import { MongoSourceService } from "./mongo/source.service";
import { PostgresSourceService } from "./postgres/source.service";
import dbConfig from "../config/db.config";

export const sourceServiceProvider: Provider = {
    provide: "SourceService",
    useFactory: (
        mongoService: MongoSourceService | null,
        pgService: PostgresSourceService | null
    ): ISourceService => {
        if (dbConfig.type === "mongodb" && mongoService) {
            return mongoService as unknown as ISourceService;
        }
        if (dbConfig.type === "postgres" && pgService) {
            return pgService;
        }
        throw new Error("Invalid DB_TYPE in configuration");
    },
    inject: [
        { token: MongoSourceService, optional: true } as any,
        { token: PostgresSourceService, optional: true } as any,
    ],
};
