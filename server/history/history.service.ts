import {Injectable, Logger} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { HistoryDocument } from "./schema/history.schema";

@Injectable()
export class HistoryService {
    private optionsToUpdate: { new: boolean; upsert: boolean };
    private readonly logger = new Logger("HistoryService");

    constructor(
        @InjectModel('HISTORY_MODEL')
        private HistoryModel: Model<HistoryDocument>,
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    getHistoryParams(dataId, targetModel, user, type, latestRevision, previousRevision = null) {
        const date = new Date()
        return {
            targetId: new Types.ObjectId(dataId),
            targetModel,
            user: user._id,
            type,
            details: {
                after: latestRevision,
                before: previousRevision
            },
            date,
        }
    }

    async createHistory(data) {
        const newHistory = new this.HistoryModel(data);
        return newHistory.save();
    }
}