import { Module } from "@nestjs/common";
import { ClaimRevisionModule } from "../claim-revision/claim-revision.module";
import { PersonalityModule } from "../personality/personality.module";
import { SentenceModule } from "../sentence/sentence.module";
import { SearchController } from "./search.controller";

@Module({
    imports: [SentenceModule, PersonalityModule, ClaimRevisionModule],
    controllers: [SearchController],
})
export class SearchModule {}
