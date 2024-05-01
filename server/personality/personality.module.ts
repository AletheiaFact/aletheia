import { Module } from "@nestjs/common";
import { PersonalityService } from "./personality.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Personality, PersonalitySchema } from "./schemas/personality.schema";
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

const PersonalityModel = MongooseModule.forFeature([
    {
        name: Personality.name,
        schema: PersonalitySchema,
    },
]);

@Module({
    imports: [
        PersonalityModel,
        WikidataModule,
        ClaimReviewModule,
        ClaimRevisionModule,
        HistoryModule,
        ViewModule,
        ConfigModule,
        AbilityModule,
        CaptchaModule,
    ],
    exports: [PersonalityService],
    providers: [UtilService, PersonalityService, WinstonLogger],
    controllers: [PersonalityController],
})
export class PersonalityModule {}
