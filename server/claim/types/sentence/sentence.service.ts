import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { SentenceDocument, Sentence } from "./schemas/sentence.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ReportService } from "../../../report/report.service";

@Injectable()
export class SentenceService {
    constructor(
        @InjectModel(Sentence.name)
        private SentenceModel: Model<SentenceDocument>,
        private reportService: ReportService
    ) {}

    async create(sentenceBody) {
        const newSentence = await new this.SentenceModel(sentenceBody).save();
        return newSentence._id;
    }

    async getByDataHash(data_hash) {
        const report = await this.reportService.findByDataHash(data_hash);
        const sentence = await this.SentenceModel.findOne({ data_hash });
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

        const newSentence = {
            ...sentence.toObject(),
            topics,
        };
        return this.SentenceModel.updateOne({ _id: sentence._id }, newSentence);
    }

    async findAll(searchText, pageSize, skipedDocuments, filter) {
        let pipeline: object[] = [
            {
                $lookup: {
                    from: "paragraphs",
                    localField: "_id",
                    foreignField: "content",
                    as: "claim",
                },
            },
            {
                $lookup: {
                    from: "speeches",
                    localField: "claim._id",
                    foreignField: "content",
                    as: "claim",
                },
            },
            {
                $lookup: {
                    from: "claimrevisions",
                    localField: "claim._id",
                    foreignField: "contentId",
                    as: "claim",
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
            {
                $project: {
                    content: 1,
                    data_hash: 1,
                    props: 1,
                    "personality.slug": 1,
                    "personality.name": 1,
                    "claim.slug": 1,
                    "claim.date": 1,
                    "claim.contentModel": 1,
                },
            },
            {
                $facet: {
                    rows: [
                        {
                            $skip: skipedDocuments || 0,
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
            },
        ];

        if (searchText) {
            pipeline.splice(0, 0, {
                $search: {
                    index: "sentence_fields",
                    text: {
                        query: searchText,
                        path: "content",
                        fuzzy: {
                            maxEdits: 2,
                        },
                    },
                },
            });
        } else {
            pipeline.splice(0, 0, {
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
            pipeline.splice(1, 0, {
                $match: {
                    topics: { $in: Array.isArray(filter) ? filter : [filter] },
                },
            });
        }

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
