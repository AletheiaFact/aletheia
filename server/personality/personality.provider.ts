import type { IPersonalityService } from "../interfaces/personality.service.interface";
import { Provider } from "@nestjs/common";
import { MongoPersonalityService } from "./mongo/personality.service";
import dbConfig from "../config/db.config";

export const personalityServiceProvider: Provider = {
    provide: "PersonalityService",
    useFactory: (
        mongoService: MongoPersonalityService | null
    ): IPersonalityService => {
        if (dbConfig.type === "mongodb" && mongoService) {
            return mongoService;
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }
    },
    inject: [MongoPersonalityService],
};
