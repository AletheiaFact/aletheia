import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { Topic, TopicSchema } from "./schemas/topic.schema";
import { TopicController } from "./topic.controller";
import { TopicService } from "./topic.service";
import { ImageModule } from "../claim/types/image/image.module";
import { WikidataModule } from "../wikidata/wikidata.module";

const TopicModel = MongooseModule.forFeature([
    {
        name: Topic.name,
        schema: TopicSchema,
    },
]);

@Module({
    imports: [TopicModel, SentenceModule, ImageModule, WikidataModule],
    controllers: [TopicController],
    providers: [TopicService],
    exports: [TopicService],
})
export class TopicModule {}
