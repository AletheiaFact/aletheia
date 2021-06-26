import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Claim, ClaimDocument } from "../claim/schemas/claim.schema";

@Injectable()
export class ClaimService {
    constructor(
        @InjectModel(Claim.name)
        private ClaimModel: Model<ClaimDocument>
    ) {}

    count(query: any = {}) {
        return this.ClaimModel.countDocuments().where(query);
    }
}
