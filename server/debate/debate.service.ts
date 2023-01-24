import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EditorService } from "../editor/editor.service";
import { Model } from "mongoose";
import { Debate, DebateDocument } from "./schemas/debate.schema";
const md5 = require("md5");

@Injectable()
export class DebateService {
    constructor(
        @InjectModel(Debate.name)
        private DebateModel: Model<DebateDocument>,
        private editorService: EditorService
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

    async getByDataHash(data_hash) {
        return this.DebateModel.findOne({ data_hash });
    }
}
