import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { SentenceDocument, Sentence } from "./schemas/sentence.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ReportService } from "../../../report/report.service";
import { UtilService } from "../../../util";

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
    constructor(
        @InjectModel(Sentence.name)
        private SentenceModel: Model<SentenceDocument>,
        private reportService: ReportService,
        private util: UtilService
    ) {}

    async create(sentenceBody) {
        const newSentence = await new this.SentenceModel(sentenceBody).save();
        return newSentence._id;
    }

    async getByDataHash(data_hash) {
        if (typeof data_hash !== "string") {
          throw new BadRequestException("Invalid data_hash: must be a string.");
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

    async updateSentenceWithTopics(topics, data_hash) {
        const sentence = await this.getByDataHash(data_hash);

        if (!Array.isArray(topics) || !topics.every((t) => typeof t === "string")) {
          throw new BadRequestException("Invalid topics array.");
        }

        const newSentence = {
            ...sentence.toObject(),
            topics,
        };
        return this.SentenceModel.updateOne(
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
        let pipeline: object[] = [];

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