import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
    VerificationRequest,
    VerificationRequestDocument,
} from "./schema/verification-request.schema";
import { Model } from "mongoose";

@Injectable()
export class VerificationRequestService {
    constructor(
        @InjectModel(VerificationRequest.name)
        private VerificationRequestModel: Model<VerificationRequestDocument>
    ) {}

    async createVerificationRequest(data) {
        const date = new Date();
        const body = {
            content: data,
            date: date,
        };
        const newVerificationRequest = new this.VerificationRequestModel(body);
        return newVerificationRequest.save();
    }
}
