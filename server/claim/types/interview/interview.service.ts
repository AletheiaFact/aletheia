import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EditorService } from "../../../editor/editor.service";
import { Model } from "mongoose";
import { Interview, InterviewDocument } from "./schemas/interview.schema";
import { HistoryService } from "../../../history/history.service";
import {
    HistoryType,
    TargetModel,
} from "../../../history/schema/history.schema";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../../../types";
const md5 = require("md5");

@Injectable({ scope: Scope.REQUEST })
export class InterviewService {
    constructor(
        @InjectModel(Interview.name)
        private InterviewModel: Model<InterviewDocument>,
        private editorService: EditorService,
        private historyService: HistoryService,
        @Inject(REQUEST) private req: BaseRequest
    ) { }

    async listAll(page, pageSize, order, query) {
        return this.InterviewModel.find({
            ...query,
        })
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();
    }

    async create(claim, claimRevisionId) {
        let hashString = claim.personalities.join(" ");
        hashString += ` ${claim.title} ${claim.date.toString()}`;
        const data_hash = md5(hashString);
        const Interview = {
            content: [],
            isLive: false,
            data_hash,
            claimRevisionId: claimRevisionId,
        };
        const InterviewCreated = await this.InterviewModel.create(Interview);
        await this.editorService.create(InterviewCreated._id);
        return InterviewCreated;
    }

    async addSpeechToInterview(InterviewId, speechId) {
        const Interview = await this.InterviewModel.findById(InterviewId);
        const previousInterview = Interview.toObject();
        Interview.content.push(speechId);
        Interview.updatedAt = new Date();
        const newInterview = await Interview.save();

        await this.saveHistory(newInterview, previousInterview);

        return newInterview;
    }

    async updateInterviewStatus(InterviewId, isLive) {
        const Interview = await this.InterviewModel.findById(InterviewId);
        const previousInterview = Interview.toObject();
        Interview.updatedAt = new Date();
        Interview.isLive = isLive;
        const newInterview = await Interview.save();

        await this.saveHistory(newInterview, previousInterview);

        return newInterview;
    }

    private async saveHistory(newInterview, previousInterview) {
        const history = this.historyService.getHistoryParams(
            newInterview._id,
            TargetModel.Interview,
            this.req.user,
            HistoryType.Update,
            newInterview,
            previousInterview
        );

        await this.historyService.createHistory(history);
    }
}
