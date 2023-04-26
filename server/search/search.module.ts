import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClaimRevisionModule } from "../claim/claim-revision/claim-revision.module";
import { PersonalityModule } from "../personality/personality.module";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { SearchController } from "./search.controller";

@Module({
    imports: [
        SentenceModule,
        PersonalityModule,
        ClaimRevisionModule,
        ConfigModule,
    ],
    controllers: [SearchController],
})
export class SearchModule {}
