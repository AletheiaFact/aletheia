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
        const source = new this.SourceModel(data);
        await source.save();
        return source;
    }

    async update(sourceId, newTargetId) {
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
}
