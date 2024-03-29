import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { SourceDocument, Source } from "./schemas/source.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SourceService {
    constructor(
        @InjectModel(Source.name)
        private SourceModel: Model<SourceDocument>
    ) {}

    async create(data) {
        data.targetId = [Types.ObjectId(data.targetId)];
        data.user = Types.ObjectId(data.user);
        //TODO: don't create duplicate sources in one claim review task
        return await new this.SourceModel(data).save();
    }

    async updateTargetId(sourceId, newTargetId) {
        // false positive in sonar cloud
        const source = await this.SourceModel.findById(sourceId);
        source.targetId = [...source.targetId, newTargetId];
        source.save();
        return source;
    }

    async getByTargetId(targetId, page, pageSize, order = "asc") {
        targetId = Types.ObjectId(targetId);

        return this.SourceModel.find({ targetId })
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order });
    }

    find(match) {
        return this.SourceModel.find({ match }, { _id: 1, href: 1 });
    }

    getById(_id) {
        return this.SourceModel.findById(_id, { _id: 1, href: 1 });
    }
}
