import { Injectable, Logger, Scope } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Topic, TopicDocument } from "./schemas/topic.schema";
import { SentenceService } from "../../claim/types/sentence/sentence.service";
import { ContentModelEnum } from "../../types/enums";
import { TopicData } from "../types/topic.interfaces";
import { ImageService } from "../../claim/types/image/image.service";
import { WikidataService } from "../../wikidata/wikidata.service";
import { toError } from "../../util/error-handling";
import { ImpactArea } from "../constants/impact-areas";
import type { ITopicService } from "../../interfaces/topic.service.interface";
import {
    buildTopicFromInput,
    buildTopicFromTopicData,
    deriveTopicSlug,
    escapeRegex,
    findMatchedAlias,
    listImpactAreas,
    normalizeText,
    toExistingTopicRef,
    topicInputSlugSource,
} from "../shared/topic.rules";

@Injectable({ scope: Scope.REQUEST })
export class MongoTopicService implements ITopicService {
    private readonly logger = new Logger(MongoTopicService.name);
    constructor(
        @InjectModel(Topic.name)
        private readonly TopicModel: Model<TopicDocument>,
        private readonly sentenceService: SentenceService,
        private readonly imageService: ImageService,
        private readonly wikidataService: WikidataService
    ) {}

    async getWikidataEntities(regex: string, language: string) {
        return await this.wikidataService.queryWikibaseEntities(
            regex,
            language
        );
    }

    async searchTopics(
        query: string,
        language = "pt",
        limit = 10
    ): Promise<any> {
        if (typeof language !== "string") {
            throw new TypeError("Invalid language");
        }

        const normalizedQuery = normalizeText(query);
        const searchRegex = new RegExp(normalizedQuery, "i");

        const topics = await this.TopicModel.find({
            language: { $eq: language },
            $or: [
                { name: { $regex: searchRegex } },
                { aliases: { $regex: searchRegex } },
            ],
        })
            .limit(limit)
            .sort({ name: 1 });

        const normalizedQueryLower = normalizedQuery.toLowerCase();
        return topics.map((topic) => {
            const topicObj = topic.toObject();
            const matchedAlias = findMatchedAlias(
                topicObj.aliases,
                normalizedQueryLower
            );
            return { ...topicObj, matchedAlias };
        });
    }

    /**
     *
     * @param getTopics options to fetch topics
     * @returns return all topics from wikidata database that match to topicName from input
     */
    async findAll(getTopics: { topicName: string }, language = "pt") {
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
                | { label: string; value: string; aliases?: string[] }[]
                | string[]
                | (
                      | string
                      | { label: string; value: string; aliases?: string[] }
                  )[];
            data_hash?: string;
        },
        language: string = "pt"
    ): Promise<any> {
        try {
            const createdTopics = await Promise.all(
                topics.map(async (topic: any) => {
                    const slug = deriveTopicSlug(topicInputSlugSource(topic));
                    const findedTopic = await this.getBySlug(slug);

                    if (findedTopic) {
                        return toExistingTopicRef(findedTopic);
                    } else {
                        const newTopic = buildTopicFromInput(
                            topic,
                            slug,
                            language
                        );

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
                    data_hash!
                );
            } else if (contentModel) {
                return this.sentenceService.updateSentenceWithTopics(
                    createdTopics,
                    data_hash!
                );
            } else {
                return createdTopics;
            }
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Failed to create topics or update related content: ${err.message}`,
                err.stack
            );
            throw error;
        }
    }

    /**
     *
     * @param slug topic slug
     * @returns topic
     */
    getBySlug(slug: string): Promise<TopicDocument | null> {
        return this.TopicModel.findOne({ slug }).exec();
    }

    /**
     * @returns the closed list of impact areas a verification request can have
     */
    getImpactAreas(): Pick<ImpactArea, "name" | "slug">[] {
        return listImpactAreas();
    }

    /**
     * Find topics by name or alias with case-insensitive matching
     * @param names topic names array
     * @returns Promise resolving to array of matching topics
     */
    findByNames(names: string[]): Promise<TopicDocument[]> {
        const nameConditions = names.flatMap((name) => {
            const escapedName = escapeRegex(name);
            return [
                { name: { $regex: new RegExp(`^${escapedName}$`, "i") } },
                { aliases: { $regex: new RegExp(`^${escapedName}$`, "i") } },
            ];
        });

        return this.TopicModel.find({
            $or: nameConditions,
        }).exec();
    }

    /**
     *
     * @param wikidataIds topic names array
     * @returns wikidataIds
     */
    findByWikidataIds(wikidataIds: string[]): Promise<TopicDocument[]> {
        return this.TopicModel.find({
            wikidataId: { $in: wikidataIds },
        }).exec();
    }

    /**
     * Find or create a Topic for impact area
     * Used by verification request AI task callback
     * @param topicData object with { slug?, name, wikidataId?, language?, description? }
     * @returns the existing or newly created topic document
     */
    async findOrCreateTopic(topicData: TopicData): Promise<TopicDocument> {
        try {
            const newTopic = buildTopicFromTopicData(topicData);

            const existingTopic = await this.TopicModel.findOne({
                slug: newTopic.slug,
            });

            if (existingTopic) {
                return existingTopic;
            }

            const createdTopic = await new this.TopicModel(newTopic).save();

            return createdTopic;
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Failed to find or create topic for "${topicData.name}": ${err.message}`,
                err.stack
            );
            throw error;
        }
    }
}
