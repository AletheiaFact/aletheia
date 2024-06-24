import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClaimRevisionModule } from "../claim/claim-revision/claim-revision.module";
import { PersonalityModule } from "../personality/personality.module";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { SearchController } from "./search.controller";
import { ViewModule } from "../view/view.module";

@Module({
    imports: [
        ViewModule,
        SentenceModule,
        PersonalityModule.register(),
        ClaimRevisionModule,
        ConfigModule,
    ],
    controllers: [SearchController],
})
export class SearchModule {}
