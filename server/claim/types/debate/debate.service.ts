import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
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
import type { BaseRequest } from "../../../types";
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

    async listAll(
        page: number,
        pageSize: number,
        order: string,
        query: Record<string, any>
    ) {
        return this.DebateModel.find({
            ...query,
        })
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order as any })
            .lean();
    }

    async create(claim: Record<string, any>, claimRevisionId: any) {
        let hashString = claim.personalities.join(" ");
        hashString += ` ${claim.title} ${claim.date.toString()}`;
        const data_hash = md5(hashString);
        const debate = {
            content: [] as any[],
            isLive: false,
            data_hash,
            claimRevisionId: claimRevisionId,
        };
        const debateCreated = await this.DebateModel.create(debate);
        await this.editorService.create(debateCreated._id);
        return debateCreated;
    }

    async addSpeechToDebate(debateId: string, speechId: any) {
        const debate = await this.DebateModel.findById(debateId);
        if (!debate) {
            throw new NotFoundException();
        }
        const previousDebate = debate.toObject();
        debate.content.push(speechId);
        debate.updatedAt = new Date();
        const newDebate = await debate.save();

        await this.saveHistory(newDebate, previousDebate);

        return newDebate;
    }

    async updateDebateStatus(debateId: string, isLive: boolean) {
        const debate = await this.DebateModel.findById(debateId);
        if (!debate) {
            throw new NotFoundException();
        }
        const previousDebate = debate.toObject();
        debate.updatedAt = new Date();
        debate.isLive = isLive;
        const newDebate = await debate.save();

        await this.saveHistory(newDebate, previousDebate);

        return newDebate;
    }

    private async saveHistory(
        newDebate: DebateDocument,
        previousDebate: Record<string, any>
    ) {
        const history = this.historyService.getHistoryParams(
            newDebate._id,
            TargetModel.Debate,
            this.req.user?._id,
            HistoryType.Update,
            newDebate,
            previousDebate
        );

        await this.historyService.createHistory(history as any);
    }
}
