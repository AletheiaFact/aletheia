import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EditorService } from "../../../editor/editor.service";
import { Model } from "mongoose";
import { Debate, DebateDocument } from "./schemas/debate.schema";
import { HistoryService } from "../../../history/history.service";
import {
    HistoryType,
    TargetModel,
} from "../../../history/schema/history.schema";
import { REQUEST } from "@nestjs/core";
import { BaseRequest } from "../../../types";
const md5 = require("md5");

@Injectable({ scope: Scope.REQUEST })
export class DebateService {
    constructor(
        @InjectModel(Debate.name)
        private DebateModel: Model<DebateDocument>,
        private editorService: EditorService,
        private historyService: HistoryService,
        @Inject(REQUEST) private req: BaseRequest
    ) {}

    async listAll(page, pageSize, order, query) {
        return this.DebateModel.find({
            ...query,
        })
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();
    }

    async create(claim) {
        let hashString = claim.personalities.join(" ");
        hashString += ` ${claim.title} ${claim.date.toString()}`;
        const data_hash = md5(hashString);
        const debate = {
            content: [],
            isLive: false,
            data_hash,
        };
        const debateCreated = await this.DebateModel.create(debate);
        await this.editorService.create(debateCreated._id);
        return debateCreated;
    }

    async addSpeechToDebate(debateId, speechId) {
        const debate = await this.DebateModel.findById(debateId);
        const previousDebate = debate.toObject();
        debate.content.push(speechId);
        debate.updatedAt = new Date();
        const newDebate = await debate.save();

        await this.saveHistory(newDebate, previousDebate);

        return newDebate;
    }

    async updateDebateStatus(debateId, isLive) {
        const debate = await this.DebateModel.findById(debateId);
        const previousDebate = debate.toObject();
        debate.updatedAt = new Date();
        debate.isLive = isLive;
        const newDebate = await debate.save();

        await this.saveHistory(newDebate, previousDebate);

        return newDebate;
    }

    private async saveHistory(newDebate, previousDebate) {
        const history = this.historyService.getHistoryParams(
            newDebate._id,
            TargetModel.Debate,
            this.req.user,
            HistoryType.Update,
            newDebate,
            previousDebate
        );

        await this.historyService.createHistory(history);
    }
}
