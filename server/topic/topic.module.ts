import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SentenceModule } from "../sentence/sentence.module";
import { Topic, TopicSchema } from "./schemas/topic.schema";
import { TopicController } from "./topic.controller";
import { TopicService } from "./topic.service";

const TopicModel = MongooseModule.forFeature([
    {
        name: Topic.name,
        schema: TopicSchema,
    },
]);

@Module({
    imports: [TopicModel, SentenceModule],
    controllers: [TopicController],
    providers: [TopicService],
    exports: [TopicService],
})
export class TopicModule {}