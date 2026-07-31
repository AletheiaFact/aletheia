import { DynamicModule, Module, Provider } from "@nestjs/common";
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
import { PERSONALITY_SERVICE } from "../interfaces/personality.service.interface";
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
        const dbImports: DynamicModule["imports"] = [];
        const dbProviders: Provider[] = [personalityServiceProvider];

        if (dbConfig.type === "mongodb") {
            dbImports.push(PersonalityModel);
            dbProviders.push(MongoPersonalityService);
        } else {
            throw new Error(`Unsupported DB_TYPE: ${dbConfig.type}`);
        }

        return {
            module: PersonalityModule,
            imports: [
                ...dbImports,
                WikidataModule,
                ClaimReviewModule,
                ClaimRevisionModule,
                HistoryModule,
                ViewModule,
                ConfigModule,
                AbilityModule,
                CaptchaModule,
            ],
            providers: [...dbProviders, UtilService, WinstonLogger],
            controllers: [PersonalityController],
            exports: [PERSONALITY_SERVICE],
        };
    }
}
