import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
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
    imports: [TopicModel],
    controllers: [TopicController],
    providers: [TopicService],
    exports: [TopicService],
})
export class TopicModule {}
