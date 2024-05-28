import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import {
    UnattributedDocument,
    Unattributed,
} from "./schemas/unattributed.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UnattributedService {
    constructor(
        @InjectModel(Unattributed.name)
        private UnattributedModel: Model<UnattributedDocument>
    ) {}

    create(UnattributedBody) {
        return new this.UnattributedModel(UnattributedBody).save();
    }
}
