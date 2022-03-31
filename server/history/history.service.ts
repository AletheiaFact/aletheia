import {Injectable, Logger} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { History, HistoryDocument } from "./schema/history.schema";

@Injectable()
export class HistoryService {
    private optionsToUpdate: { new: boolean; upsert: boolean };
    private readonly logger = new Logger("HistoryService");

    constructor(
        @InjectModel(History.name)
        private HistoryModel: Model<HistoryDocument>,
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    getHistoryParams(dataId, target, user, type, latestRevision, previousRevision = null) {
        return {
            targetId: new Types.ObjectId(dataId),
            targetModel: target,
            type: type,
            user: user._id,
            details: {
                after: latestRevision,
                before: previousRevision
            },
        }
    }

    async createHistory(data) {
        const newHistory = new this.HistoryModel(data);
        return newHistory.save();
    }
}