import { Module } from "@nestjs/common";
import { PersonalityModule } from "../personality/personality.module";
import { SentenceModule } from "../sentence/sentence.module";
import { TopicModule } from "../topic/topic.module";
import { SearchController } from "./search.controller";

@Module({
    imports: [SentenceModule, PersonalityModule, TopicModule],
    controllers: [SearchController],
})
export class SearchModule {}
