import { Injectable, Logger, Scope } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Topic, TopicDocument } from "./schemas/topic.schema";
import slugify from "slugify";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ContentModelEnum } from "../types/enums";
import { ImageService } from "../claim/types/image/image.service";
import { WikidataService } from "../wikidata/wikidata.service";

@Injectable({ scope: Scope.REQUEST })
export class TopicService {
    private readonly logger = new Logger(TopicService.name);
    constructor(
        @InjectModel(Topic.name)
        private TopicModel: Model<TopicDocument>,
        private sentenceService: SentenceService,
        private imageService: ImageService,
        private wikidataService: WikidataService
    ) {}

    async getWikidataEntities(regex, language) {
        return await this.wikidataService.queryWikibaseEntities(
            regex,
            language
        );
    }

  async searchTopics(
    query: string,
    language = "pt",
    limit = 10
  ): Promise<Topic[]> {
    if (typeof language !== "string") {
       throw new TypeError("Invalid language");
    }

    return this.TopicModel.find({
    name: { $regex: query, $options: "i" },
    language: { $eq: language }
  })
    .limit(limit)
    .sort({ name: 1 });
  }

    /**
     *
     * @param getTopics options to fetch topics
     * @returns return all topics from wikidata database that match to topicName from input
     */
    async findAll(getTopics, language = "pt"): Promise<Topic[]> {
        return this.getWikidataEntities(getTopics.topicName, language);
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
            contentModel?: ContentModelEnum;
            topics:
                | { label: string; value: string }[]
                | string[]
                | (string | { label: string; value: string })[];
            data_hash?: string;
        },
        language: string = "pt"
    ) {
        try {
            const createdTopics = await Promise.all(
                topics.map(async (topic) => {
                    const slug = slugify(topic?.label || topic.slug || topic, {
                        lower: true,
                        strict: true,
                    });
                    const findedTopic = await this.getBySlug(slug);

                    if (findedTopic) {
                        return findedTopic?.wikidataId
                            ? {
                                  id: findedTopic._id,
                                  label: findedTopic?.name,
                                  value: findedTopic?.wikidataId,
                              }
                            : findedTopic.slug;
                    } else {
                        const newTopic = {
                            name: topic?.label || topic,
                            wikidataId: topic?.value,
                            slug,
                            language,
                        };

                        const createdTopic = await new this.TopicModel(
                            newTopic
                        ).save();

                        return {
                            id: createdTopic._id,
                            label: createdTopic.name,
                            value: createdTopic?.wikidataId,
                        };
                    }
                })
            );

            if (contentModel === ContentModelEnum.Image) {
                return this.imageService.updateImageWithTopics(
                    createdTopics,
                    data_hash
                );
            } else if (contentModel) {
                return this.sentenceService.updateSentenceWithTopics(
                    createdTopics,
                    data_hash
                );
            } else {
                return createdTopics;
            }
        } catch (error) {
            this.logger.error(
                `Failed to create topics or update related content: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    /**
     *
     * @param slug topic slug
     * @returns topic
     */
    getBySlug(slug) {
        return this.TopicModel.findOne({ slug });
    }

    /**
     *
     * @param names topic names array
     * @returns topics
     */
    findByNames(names: string[]) {
        return this.TopicModel.find({ name: { $in: names } });
    }

    /**
     *
     * @param wikidataIds topic names array
     * @returns wikidataIds
     */
    findByWikidataIds(wikidataIds: string[]) {
        return this.TopicModel.find({ wikidataId: { $in: wikidataIds } });
    }

    /**
     * Find or create a Topic for impact area
     * Used by verification request AI task callback
     * @param topicData object with { slug?, name, wikidataId?, language?, description? }
     * @returns the existing or newly created topic document
     */
    async findOrCreateTopic(topicData: {
        name: string;
        wikidataId?: string;
        language?: string;
        description?: string; // Future use
    }): Promise<Topic> {
        try {
            const slug = slugify(topicData.name, { lower: true, strict: true });

            const existingTopic = await this.TopicModel.findOne({ slug });

            if (existingTopic) {
                return existingTopic;
            }

            const newTopic = {
                name: topicData.name,
                slug,
                language: topicData.language || "pt",
                wikidataId: topicData.wikidataId || undefined,
            };

            const createdTopic = await new this.TopicModel(newTopic).save();

            return createdTopic;
        } catch (error) {
            this.logger.error(
                `Failed to find or create topic for "${topicData.name}": ${error.message}`,
                error.stack
            );
            throw error;
        }
    }
}
