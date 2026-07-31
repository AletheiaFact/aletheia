import { PERSONALITY_SERVICE } from "../interfaces/personality.service.interface";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import { Provider } from "@nestjs/common";
import { MongoPersonalityService } from "./mongo/personality.service";
import dbConfig from "../config/db.config";

export const personalityServiceProvider: Provider = {
    provide: PERSONALITY_SERVICE,
    useFactory: (
        mongoService: MongoPersonalityService | null
    ): IPersonalityService => {
        if (dbConfig.type === "mongodb" && mongoService) {
            return mongoService;
        }
        throw new Error(`Unsupported DB_TYPE: ${dbConfig.type}`);
    },
    inject: [MongoPersonalityService],
};
