import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { History, HistoryDocument, HistoryType } from "./schema/history.schema";

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
     * @param user User who made the change.
     * @param type Type of the change(create, personality or delete).
     * @param latestChange Model latest change .
     * @param previousChange Model previous change.
     * @returns Returns an object with de params necessary to create an history.
     */
    getHistoryParams(
        dataId,
        targetModel,
        user,
        type,
        latestChange,
        previousChange = null
    ) {
        const date = new Date();
        return {
            targetId: Types.ObjectId(dataId),
            targetModel,
            user: user?._id || user || null, //I need to make it optional because we still need to do M2M for chatbot
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

    /**
     * This function queries the database for the history of changes on a target.
     * @param targetId The id of the target.
     * @param targetModel The model of the target (claim or personality).
     * @param page The page of results, used in combination with pageSize to paginate results.
     * @param pageSize How many results per page.
     * @param order asc or desc.
     * @returns The paginated history of a target.
     */
    async getByTargetIdModelAndType(
        targetId,
        targetModel,
        page,
        pageSize,
        order = "asc",
        type = ""
    ) {
        let query;
        if (type) {
            query = {
                targetId: Types.ObjectId(targetId),
                targetModel,
                type,
            };
        } else {
            query = {
                targetId: Types.ObjectId(targetId),
                targetModel,
            };
        }
        return this.HistoryModel.find(query)
            .populate("user", "_id name")
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ date: order });
    }

    async getDescriptionForHide(content, target) {
        if (content?.isHidden) {
            const history = await this.getByTargetIdModelAndType(
                content._id,
                target,
                0,
                1,
                "desc",
                HistoryType.Hide
            );

            return history[0]?.details?.after?.description;
        }

        return "";
    }
}
