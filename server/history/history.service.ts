import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, isValidObjectId } from "mongoose";
import { History, HistoryDocument, HistoryType } from "./schema/history.schema";
import {
    HistoryItem,
    HistoryQuery,
    HistoryResponse,
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
     * - a intern user object with _id field
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
        targetModel: string,
        performedBy: any,
        type: string,
        latestChange: any,
        previousChange = null
    ) {
        const date = new Date();
        const targetId = Types.ObjectId(dataId);
        let currentPerformedBy = null;

        if (performedBy?._id) {
            currentPerformedBy = Types.ObjectId(performedBy?._id);
        } else {
            currentPerformedBy = performedBy;
        }

        if (!isValidObjectId(dataId)) {
            throw new Error(`Invalid dataId received: ${dataId}`);
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
    async createHistory(data) {
        const newHistory = new this.HistoryModel(data);
        return newHistory.save();
    }

    async getHistoryForTarget(
        targetId: string,
        targetModel: string,
        query: HistoryQuery
    ): Promise<HistoryResponse> {
        const page = Math.max(Number(query.page) || 0, 0);
        const pageSize = Math.max(Number(query.pageSize) || 10, 1);
        const order = query.order === "desc" ? -1 : 1;
        const type = query.type || "";

        const mongoQuery: HistoryItem = {
            targetId: Types.ObjectId(targetId),
            targetModel,
        };
        if (type) mongoQuery.type = type;

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
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
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

    async getDescriptionForHide(content: any, target: string) {
        if (content?.isHidden) {
            const { history } = await this.getHistoryForTarget(content._id, target, {
                page: 0,
                pageSize: 1,
                order: "desc",
                type: HistoryType.Hide,
            });

            return history[0]?.details?.after?.description;
        }
        return "";
    }
}
