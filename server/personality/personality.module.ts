import { DynamicModule, Logger, Module } from "@nestjs/common";
import { MongoPersonalityService } from "./mongo/personality.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
    Personality,
    PersonalitySchema,
} from "./mongo/schemas/personality.schema";
import { UtilService } from "../util";
import { WikidataModule } from "../wikidata/wikidata.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ClaimRevisionModule } from "../claim/claim-revision/claim-revision.module";
import { HistoryModule } from "../history/history.module";
import { PersonalityController } from "./personality.controller";
import { WinstonLogger } from "../winstonLogger";
import { ViewModule } from "../view/view.module";
import { ConfigModule } from "@nestjs/config";
import { CaptchaModule } from "../captcha/captcha.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { personalityServiceProvider } from "./personality.provider";
import dbConfig from "../config/db.config";

const PersonalityModel = MongooseModule.forFeature([
    {
        name: Personality.name,
        schema: PersonalitySchema,
    },
]);

@Module({})
export class PersonalityModule {
    static register(): DynamicModule {
        const imports = [];
        const providers = [personalityServiceProvider];
        const logger = new Logger("PersonalityModule");

        logger.log(`Database selected: ${dbConfig.type}`);

        if (dbConfig.type === "mongodb") {
            imports.push(
                PersonalityModel,
                WikidataModule,
                ClaimReviewModule,
                ClaimRevisionModule,
                HistoryModule,
                ViewModule,
                ConfigModule,
                AbilityModule,
                CaptchaModule
            );
            providers.push(UtilService, MongoPersonalityService, WinstonLogger);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: PersonalityModule,
            imports,
            providers,
            controllers: [PersonalityController],
            exports: ["PersonalityService"],
        };
    }
}
