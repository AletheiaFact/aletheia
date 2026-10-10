import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import {
    UnattributedDocument,
    Unattributed,
} from "./schemas/unattributed.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class MongoUnattributedService {
    constructor(
        @InjectModel(Unattributed.name)
        private UnattributedModel: Model<UnattributedDocument>
    ) {}

    create(UnattributedBody: Record<string, any>) {
        return new this.UnattributedModel(UnattributedBody).save();
    }
}
