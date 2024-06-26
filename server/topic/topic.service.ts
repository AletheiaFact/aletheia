import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Topic, TopicDocument } from "./schemas/topic.schema";
import slugify from "slugify";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ContentModelEnum } from "../types/enums";
import { ImageService } from "../claim/types/image/image.service";

@Injectable()
export class TopicService {
    constructor(
        @InjectModel(Topic.name)
        private TopicModel: Model<TopicDocument>,
        private sentenceService: SentenceService,
        private imageService: ImageService
    ) {}

    /**
     *
     * @param getTopics options to fetch topics
     * @returns return all topics that match to topicName from input
     */
    async findAll(getTopics): Promise<Topic[]> {
        const { topicName } = getTopics;
        return this.TopicModel.aggregate([
            { $match: { name: { $regex: topicName, $options: "i" } } },
            { $project: { _id: 1, name: 1 } },
        ]);
    }

    /**
     * iteration on each item in the topic set, checking if it already exists
     * if it does not exist will create a new topic
     * @param content model, topics array and data hash
     * @param language topics language
     * @returns updated sentence or image with new topics
     */
    async create(
        {
            contentModel,
            topics,
            data_hash,
        }: {
            contentModel: ContentModelEnum;
            topics: string[];
            data_hash: string;
        },
        language: string = "pt"
    ) {
        const createdTopics = await Promise.all(
            topics.map(async (topic) => {
                const slug = slugify(topic, { lower: true, strict: true });
                const findedTopic = await this.getBySlug(slug);

                if (findedTopic) {
                    return findedTopic.slug;
                } else {
                    const newTopic = {
                        name: topic,
                        slug,
                        language,
                    };
                    return (await new this.TopicModel(newTopic).save()).slug;
                }
            })
        );

        return contentModel === ContentModelEnum.Image
            ? this.imageService.updateImageWithTopics(createdTopics, data_hash)
            : this.sentenceService.updateSentenceWithTopics(
                  createdTopics,
                  data_hash
              );
    }

    /**
     *
     * @param slug topic slug
     * @returns topic
     */
    getBySlug(slug) {
        return this.TopicModel.findOne({ slug });
    }
}
