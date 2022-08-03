import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    HistoryTrack,
    HistoryTrackDocument,
} from "./schema/history-track.schema";

@Injectable()
export class HistoryTrackService {
    constructor(
        @InjectModel(HistoryTrack.name)
        private HistoryTrackModel: Model<HistoryTrackDocument>
    ) {}

    getHistoryTrackParams(claimId, type, draft = false, taskId = null) {
        const date = new Date();
        return {
            claimId,
            type,
            taskId,
            draft,
            date,
        };
    }

    async createHistoryTrack(data) {
        const newHistoryTrack = new this.HistoryTrackModel(data);
        return newHistoryTrack.save();
    }
}
