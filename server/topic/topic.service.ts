import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Topic, TopicDocument } from "./schemas/topic.schema";

@Injectable()
export class TopicService {
    constructor(
        @InjectModel(Topic.name)
        private TopicModel: Model<TopicDocument>
    ) {}

    async create(topics) {
        await Promise.all(
            topics.map(async (topic) => {
                console.log(topic, "Topic");
                const newTopic = {
                    name: topic,
                    slug: topic,
                    language: "pt",
                };
                return new this.TopicModel(newTopic).save();
            })
        );
    }
}
