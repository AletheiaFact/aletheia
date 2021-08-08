import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { SourceDocument, Source } from "./schemas/source.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SourceService {
    constructor(
        @InjectModel(Source.name)
        private SourceModel: Model<SourceDocument>
    ) {}
    async create(data) {
        const source = new this.SourceModel(data);
        await source.save();
        return source;
    }
}
