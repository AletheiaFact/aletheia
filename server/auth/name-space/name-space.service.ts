import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { NameSpaceDocument, NameSpace } from "./schemas/name-space.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class NameSpaceService {
    constructor(
        @InjectModel(NameSpace.name)
        private NameSpaceModel: Model<NameSpaceDocument>
    ) {}

    create(nameSpace) {
        nameSpace.users = nameSpace.users.map((userId) =>
            Types.ObjectId(userId)
        );
        return new this.NameSpaceModel(nameSpace).save();
    }

    findOne(match) {
        return this.NameSpaceModel.findOne(match);
    }

    getById(_id) {
        return this.NameSpaceModel.findById(_id);
    }
}
