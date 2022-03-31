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

    async createHistory(data) {
        const newHistory = new this.HistoryModel(data);
        return newHistory.save();
    }
}