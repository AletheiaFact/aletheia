import type { ITopicService } from "../interfaces/topic.service.interface";
import { Provider } from "@nestjs/common";
import { MongoTopicService } from "./mongo/topic.service";
import { PostgresTopicService } from "./postgres/topic.service";
import { createDbServiceProvider } from "../database/db-service.provider";

export const topicServiceProvider: Provider =
    createDbServiceProvider<ITopicService>(
        "TopicService",
        MongoTopicService,
        PostgresTopicService
    );
