import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, isValidObjectId } from "mongoose";
import {
    History,
    HistoryDocument,
    HistoryType,
    TargetModel,
} from "./schema/history.schema";
import {
    AfterAndBeforeType,
    HEX24,
    HistoryItem,
    HistoryQuery,
    HistoryResponse,
    IHideableContent,
    PerformedBy,
} from "./types/history.interfaces";

@Injectable()
export class HistoryService {
    private optionsToUpdate: { new: boolean; upsert: boolean };
    private readonly logger = new Logger("HistoryService");

    constructor(
        @InjectModel(History.name)
        private HistoryModel: Model<HistoryDocument>
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    /**
     * This function return an history object.
     * @param dataId Target Id.
     * @param targetModel The model of the target(claim or personality ).
     * @param performedBy The actor who performed the change. Can be:
     * - an array of internal user object IDs
     * - a string of the internal user id
     * - a string representing chatbot ID
     * - a Machine-to-Machine (M2M) object
     * - null if unknown or invalid
     * @param type Type of the change(create, personality or delete).
     * @param latestChange Model latest change .
     * @param previousChange Model previous change.
     * @returns Returns an object with de params necessary to create an history.
     */
    getHistoryParams(
        dataId: string,
        targetModel: TargetModel,
        performedBy: PerformedBy,
        type: HistoryType,
        latestChange: AfterAndBeforeType,
        previousChange?: AfterAndBeforeType
    ) {
        if (!isValidObjectId(dataId)) {
            throw new Error(`Invalid dataId received: ${dataId}`);
        }

        const date = new Date();
        const targetId = new Types.ObjectId(dataId);
        let currentPerformedBy = null;

        if (typeof performedBy === "string" && HEX24.test(performedBy)) {
            currentPerformedBy = new Types.ObjectId(performedBy);
        } else {
            currentPerformedBy = performedBy;
        }

        return {
            targetId: targetId,
            targetModel,
            user: currentPerformedBy,
            type,
            details: {
                after: latestChange,
                before: previousChange,
            },
            date,
        };
    }

    /**
     * This function create a new history document to database
     * @param data Object with the history data
     * @returns Returns a new history document to database
     */
    async createHistory(
        data: Partial<HistoryDocument>
    ): Promise<HistoryDocument> {
        const newHistory = new this.HistoryModel(data);
        return newHistory.save();
    }

    async getHistoryForTarget(
        targetId: string,
        targetModel: TargetModel,
        query: HistoryQuery
    ): Promise<HistoryResponse> {
        const page = Math.max(Number(query.page) || 0, 0);
        const pageSize = Math.max(Number(query.pageSize) || 10, 1);
        const order = query.order === "desc" ? -1 : 1;

        const mongoQuery: HistoryItem = {
            targetId: new Types.ObjectId(targetId),
            targetModel,
        };
        if (query.type && query.type.length > 0) {
            mongoQuery.type = { $in: query.type };
        }

        const result = await this.HistoryModel.aggregate([
            { $match: mongoQuery },
            {
                $facet: {
                    data: [
                        { $sort: { date: order } },
                        { $skip: page * pageSize },
                        { $limit: pageSize },
                        ...this.getUserLookupStages(),
                    ],
                    totalCount: [{ $count: "total" }],
                },
            },
        ]);

        const totalChanges = result[0]?.totalCount[0]?.total || 0;

        return {
            history: result[0]?.data || [],
            totalChanges,
            totalPages: Math.ceil(totalChanges / pageSize),
            page,
            pageSize,
        };
    }

    private getUserLookupStages() {
        return [
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$user" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                { $type: "$$userId" },
                                                "objectId",
                                            ],
                                        },
                                        { $eq: ["$_id", "$$userId"] },
                                    ],
                                },
                            },
                        },
                        { $project: { _id: 1, name: 1 } },
                    ],
                    as: "userLookup",
                },
            },
            {
                $addFields: {
                    user: {
                        $cond: [
                            { $gt: [{ $size: "$userLookup" }, 0] },
                            { $arrayElemAt: ["$userLookup", 0] },
                            "$user",
                        ],
                    },
                },
            },
            { $project: { userLookup: 0 } },
        ];
    }

    async getDescriptionForHide(
        content: IHideableContent,
        target: TargetModel
    ) {
        if (!content?._id || !content?.isHidden) {
            return "";
        }
        const { history } = await this.getHistoryForTarget(content._id, target, {
            page: 0,
            pageSize: 1,
            order: "desc",
            type: [HistoryType.Hide],
        });

        return history[0]?.details?.after?.description || "";
    }
}
