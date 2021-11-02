import { Injectable } from "@nestjs/common";
import {Model, Types} from "mongoose";
import { SourceDocument, Source } from "./schemas/source.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SourceService {
    constructor(
        @InjectModel(Source.name)
        private SourceModel: Model<SourceDocument>
    ) {}
    async create(data) {
        data.targetId = new Types.ObjectId(data.targetId);
        data.user = new Types.ObjectId(data.user);
        const source = new this.SourceModel(data);
        await source.save();
        return source;
    }
}
