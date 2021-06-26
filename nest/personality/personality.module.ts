import { Module } from "@nestjs/common";
import { PersonalityService } from "./personality.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Personality, PersonalitySchema } from "./schemas/personality.schema";
import { UtilService } from "../util";
import { WikidataModule } from "../wikidata/wikidata.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { PersonalityController } from "./personality.controller";
import Logger from "../logger";

const PersonalityModel = MongooseModule.forFeature([
    {
        name: Personality.name,
        schema: PersonalitySchema,
    },
]);

@Module({
    imports: [PersonalityModel, WikidataModule, ClaimReviewModule],
    providers: [UtilService, PersonalityService, Logger],
    controllers: [PersonalityController],
})
export class PersonalityModule {}
