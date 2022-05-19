import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { ClaimReviewTask, ClaimReviewTaskDocument } from "./schemas/claim-review-task.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ClaimReviewTaskService {
    private readonly logger = new Logger("ClaimReviewService");
    constructor(
        @InjectModel(ClaimReviewTask.name)
        private ClaimReviewModel: Model<ClaimReviewTaskDocument>,
    ) {}

    create(claimReviewTaskBody) {
        const newClaimReviewTask = new this.ClaimReviewModel(claimReviewTaskBody);
        newClaimReviewTask.save()
        return newClaimReviewTask
    }
}
