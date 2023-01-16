import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Debate, DebateDocument } from "./schemas/debate.schema";
const md5 = require("md5");

@Injectable()
export class DebateService {
    constructor(
        @InjectModel(Debate.name)
        private DebateModel: Model<DebateDocument>
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
        let hashString = claim.personality.join(" ");
        hashString += ` ${claim.title} ${claim.date.toString()}`;
        const data_hash = md5(hashString);
        const debate = {
            content: [],
            isLive: false,
            data_hash,
        };
        return this.DebateModel.create(debate);
    }

    async getByDataHash(dataHash) {
        return this.DebateModel.findOne({ dataHash });
    }
}
