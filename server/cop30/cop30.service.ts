import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Sentence } from "../claim/types/sentence/schemas/sentence.schema";

@Injectable()
export class Cop30Service {
    constructor(
        @InjectModel(Sentence.name)
        private readonly sentenceModel: Model<Sentence>
    ) {}

    async getAllSentencesWithCop30Topic() {
        const topicValue = "Q115323194"; // Wikidata value for Conferência das Nações Unidas sobre as Mudanças Climáticas de 2025

        const aggregation = [
            { $match: { "topics.value": topicValue } },
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

        return this.sentenceModel.aggregate(aggregation).exec();
    }
}
