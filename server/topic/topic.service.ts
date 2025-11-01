import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Topic, TopicDocument } from "./schemas/topic.schema";
import slugify from "slugify";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ContentModelEnum } from "../types/enums";
import { ImageService } from "../claim/types/image/image.service";
import { WikidataService } from "../wikidata/wikidata.service";

@Injectable()
export class TopicService {
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
      topics: { label: string; value: string }[] | string[] | (string | { label: string; value: string })[];
      data_hash?: string;
    },
    language: string = "pt"
  ) {
    try {
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
        return this.imageService.updateImageWithTopics(createdTopics, data_hash);
      } else if (contentModel) {
        return this.sentenceService.updateSentenceWithTopics(
          createdTopics, data_hash
        );
      } else {
        return createdTopics;
      }
    } catch (error) {
      console.error("Error creating topics:", error);
      throw new Error("Failed to create topics or update related content");
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
  async findByNames(names: string[]) {
    return this.TopicModel.find({ name: { $in: names } });
  }

  
}
