import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { Model, PipelineStage } from "mongoose";
import { SentenceDocument, Sentence } from "./schemas/sentence.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ReportService } from "../../../report/report.service";
import { UtilService } from "../../../util";
import type { Cop30Sentence } from "../../../../src/types/Cop30Sentence";
import { TopicRelatedSentencesResponse } from "./types/sentence.interfaces";
import { allCop30WikiDataIds } from "../../../../src/constants/cop30Filters";
import type { Cop30Stats } from "../../../../src/types/Cop30Stats";
import { buildStats } from "../../../../src/components/Home/COP30/utils/classification";

interface FindAllOptionsFilters {
    searchText: string;
    pageSize: number;
    language?: string;
    skippedDocuments?: number;
    filter?: string | string[];
    nameSpace?: string;
}

@Injectable()
export class SentenceService {
    private readonly logger = new Logger(SentenceService.name);

    constructor(
        @InjectModel(Sentence.name)
        private SentenceModel: Model<SentenceDocument>,
        private reportService: ReportService,
        private util: UtilService
    ) {}

    /**
         * Fetches sentences based on topic values and enriches them with review classification.
         * Uses an aggregation pipeline for cross-collection lookup.
         * @param query - Topic wikidataId array to filter sentences.
         * @returns A list of sentences with their respective classification.
         */
    async getSentencesByTopics(query: string[]): Promise<TopicRelatedSentencesResponse[]> {
        try {
            this.logger.debug(`Fetching sentences for topics: ${query.join(', ')}`);

            const aggregation: any[] = [
                { $match: { "topics.value": { $in: query } } },
                {
                    $lookup: {
                        from: "reviewtasks",
                        let: { sentenceDataHash: "$data_hash" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            "$machine.context.reviewData.data_hash",
                                            "$$sentenceDataHash",
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    classification: "$machine.context.reviewData.classification",
                                },
                            },
                        ],
                        as: "reviewInfo",
                    },
                },
                {
                    $addFields: {
                        classification: {
                            $arrayElemAt: ["$reviewInfo.classification", 0],
                        },
                    },
                },
                { $project: { reviewInfo: 0 } },
            ];

            const result = await this.SentenceModel.aggregate(aggregation).exec();

            this.logger.log(`Found ${result.length} sentences for the requested topics.`);

            return result;
        } catch (error) {
            this.logger.error(`Error in getSentencesByTopics: ${error.message}`, error.stack);
            throw new InternalServerErrorException("Failed to aggregate sentences with review data.");
        }
    }

    async getSentencesWithCop30Topics(): Promise<Cop30Sentence[]> {
        const aggregation = [
            { $match: { "topics.value": { $in: allCop30WikiDataIds } } },
            {
                $lookup: {
                    from: "reviewtasks",
                    let: { sentenceDataHash: "$data_hash" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        "$machine.context.reviewData.data_hash",
                                        "$$sentenceDataHash",
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                classification:
                                    "$machine.context.reviewData.classification",
                            },
                        },
                    ],
                    as: "reviewInfo",
                },
            },
            {
                $addFields: {
                    classification: {
                        $arrayElemAt: ["$reviewInfo.classification", 0],
                    },
                },
            },
            { $project: { reviewInfo: 0 } },
        ];

        return this.SentenceModel.aggregate(aggregation).exec();
    }

    async getCop30Stats(): Promise<Cop30Stats> {
        const sentences = await this.getSentencesWithCop30Topics();

        return buildStats(sentences);
    }

    /**
     * Searches for sentence data hashes associated with a specific topic.
     * @param topicWikidataId - The topic identifier.
     * @returns Array of sentence data hashes.
     */
    async getHashesByTopic(topicWikidataId: string): Promise<string[]> {
        this.logger.debug(`Fetching sentence hashes for topic: ${topicWikidataId}`);
        try {
            const sentences = await this.SentenceModel.find(
              { "topics.value": { $eq: topicWikidataId } },
              { data_hash: 1 }
            ).lean();

            this.logger.debug(`Successfully retrieved ${sentences.length} sentence hashes for topic: ${topicWikidataId}`);
  
            return sentences.map((sentence) => sentence.data_hash);
        } catch (error) {
            this.logger.error(`Failed to fetch sentence hashes for topic: ${topicWikidataId}`, error.stack);
            throw new InternalServerErrorException(`An error occurred while retrieving sentences for the requested topic.`);
        }
    }

    async create(sentenceBody) {
        const newSentence = await new this.SentenceModel(sentenceBody).save();
        return newSentence._id;
    }

    async getByDataHash(data_hash: string) {
        if (!data_hash) {
            throw new BadRequestException(
                "Invalid data_hash: must be a string."
            );
        }
        const report = await this.reportService.findByDataHash(data_hash);
        const sentence = await this.SentenceModel.findOne({
            data_hash: { $eq: data_hash },
        });
        if (sentence) {
            sentence.props = {
                classification: report?.classification,
                ...sentence.props,
            };
            return sentence;
        } else {
            throw new NotFoundException();
        }
    }

    async updateSentenceWithTopics(
        topics,
        data_hash
    ): Promise<SentenceDocument> {
        const sentence = await this.getByDataHash(data_hash);

        if (!Array.isArray(topics)) {
            throw new BadRequestException("Invalid topics array.");
        }
        return this.SentenceModel.findByIdAndUpdate(
            { _id: sentence._id },
            { $set: { topics } }
        );
    }

    async findAll({
        searchText,
        pageSize,
        skippedDocuments,
        filter,
        nameSpace,
    }: FindAllOptionsFilters) {
        let pipeline: PipelineStage[] = [];

        if (searchText) {
            pipeline.push({
                $search: {
                    index: "sentence_fields",
                    text: {
                        query: searchText,
                        path: "content",
                        fuzzy: {
                            maxEdits: 1, // Using maxEdits: 1 to allow minor typos or spelling errors in search queries.
                        },
                    },
                },
            });
        } else {
            pipeline.push({
                $search: {
                    index: "sentence_fields",
                    text: {
                        query: filter,
                        path: "topics",
                        fuzzy: {
                            maxEdits: 2,
                        },
                    },
                },
            });
        }

        if (filter) {
            pipeline.push({
                $match: {
                    topics: { $in: Array.isArray(filter) ? filter : [filter] },
                },
            });
        }

        pipeline.push(
            {
                $lookup: {
                    from: "claimrevisions",
                    localField: "claimRevisionId",
                    foreignField: "_id",
                    as: "claim",
                },
            },
            {
                $lookup: {
                    from: "claims",
                    localField: "claim.claimId",
                    foreignField: "_id",
                    as: "claimContent",
                },
            },
            {
                $lookup: {
                    from: "personalities",
                    localField: "claim.personalities",
                    foreignField: "_id",
                    as: "personality",
                },
            },
            this.util.getVisibilityMatch(nameSpace),
            {
                $project: {
                    content: 1,
                    data_hash: 1,
                    props: 1,
                    "personality.slug": 1,
                    "personality.name": 1,
                    "claim.slug": 1,
                    "claim.date": 1,
                    "claim._id": 1,
                    "claim.contentModel": 1,
                },
            },
            {
                $facet: {
                    rows: [
                        {
                            $skip: skippedDocuments || 0,
                        },
                        {
                            $limit: pageSize,
                        },
                    ],
                    totalRows: [
                        {
                            $count: "totalRows",
                        },
                    ],
                },
            },
            {
                $set: {
                    totalRows: {
                        $arrayElemAt: ["$totalRows.totalRows", 0],
                    },
                },
            }
        );

        const sentences = await this.SentenceModel.aggregate(pipeline);

        return {
            totalRows: sentences[0].totalRows,
            processedSentences: await Promise.all(
                sentences[0].rows.map(async (sentence) => {
                    const sentenceWithProps = await this.getByDataHash(
                        sentence.data_hash
                    );
                    return Object.assign(
                        sentence,
                        sentenceWithProps.toObject()
                    );
                })
            ),
        };
    }
}
