import { DynamicModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { Topic, TopicSchema } from "./mongo/schemas/topic.schema";
import { TopicController } from "./topic.controller";
import { MongoTopicService } from "./mongo/topic.service";
import { PostgresTopicService } from "./postgres/topic.service";
import { topicServiceProvider } from "./topic.provider";
import { ImageModule } from "../claim/types/image/image.module";
import { WikidataModule } from "../wikidata/wikidata.module";
import dbConfig from "../config/db.config";

const TopicModel = MongooseModule.forFeature([
    {
        name: Topic.name,
        schema: TopicSchema,
    },
]);

@Module({})
export class TopicModule {
    static register(): DynamicModule {
        const imports: any[] = [];
        const providers: any[] = [topicServiceProvider];

        if (dbConfig.type === "mongodb") {
            imports.push(TopicModel);
            providers.push(MongoTopicService);
        } else if (dbConfig.type === "postgres") {
            providers.push(PostgresTopicService);
        } else {
            throw new Error("Invalid DB_TYPE in configuration");
        }

        return {
            module: TopicModule,
            imports: [...imports, SentenceModule, ImageModule, WikidataModule],
            controllers: [TopicController],
            providers,
            exports: ["TopicService"],
        };
    }
}
