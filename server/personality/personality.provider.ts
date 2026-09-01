import type { IPersonalityService } from "../interfaces/personality.service.interface";
import { Provider } from "@nestjs/common";
import { MongoPersonalityService } from "./mongo/personality.service";
import { PostgresPersonalityService } from "./postgres/personality.service";
import dbConfig from "../config/db.config";

export const personalityServiceProvider: Provider = {
    provide: "PersonalityService",
    useFactory: (
        mongoService: MongoPersonalityService | null,
        pgService: PostgresPersonalityService | null
    ): IPersonalityService => {
        if (dbConfig.type === "mongodb" && mongoService) {
            return mongoService as unknown as IPersonalityService;
        }
        if (dbConfig.type === "postgres" && pgService) {
            return pgService;
        }
        throw new Error("Invalid DB_TYPE in configuration");
    },
    inject: [
        { token: MongoPersonalityService, optional: true } as any,
        { token: PostgresPersonalityService, optional: true } as any,
    ],
};
