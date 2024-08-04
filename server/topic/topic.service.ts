import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Topic, TopicDocument } from "./schemas/topic.schema";
import slugify from "slugify";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ContentModelEnum, ReviewTaskTypeEnum } from "../types/enums";
import { ImageService } from "../claim/types/image/image.service";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { WikidataService } from "../wikidata/wikidata.service";

@Injectable()
export class TopicService {
    constructor(
        @InjectModel(Topic.name)
        private TopicModel: Model<TopicDocument>,
        private sentenceService: SentenceService,
        private imageService: ImageService,
        private verificationRequestService: VerificationRequestService,
        private wikidataService: WikidataService
    ) {}

    async getWikidataEntities(regex, language) {
        return await this.wikidataService.queryWikibaseEntities(
            regex,
            language
        );
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
            reviewTaskType,
        }: {
            contentModel: ContentModelEnum;
            topics: { label: string; value: string }[] | string[];
            data_hash: string;
            reviewTaskType: ReviewTaskTypeEnum;
        },
        language: string = "pt"
    ) {
        const createdTopics = await Promise.all(
            topics.map(async (topic) => {
                const slug = slugify(topic?.label || topic, {
                    lower: true,
                    strict: true,
                });
                const findedTopic = await this.getBySlug(slug);

                if (findedTopic) {
                    return findedTopic?.wikidataId
                        ? {
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
                        label: createdTopic.name,
                        value: createdTopic?.wikidataId,
                    };
                }
            })
        );

        if (reviewTaskType === ReviewTaskTypeEnum.VerificationRequest) {
            return this.verificationRequestService.updateVerificationRequestWithTopics(
                createdTopics,
                data_hash
            );
        }

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
