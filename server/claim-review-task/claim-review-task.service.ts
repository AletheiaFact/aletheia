import { Injectable, Logger } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { ClaimReviewTask, ClaimReviewTaskDocument } from "./schemas/claim-review-task.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UtilService } from "../util";
import { SourceService } from "../source/source.service";
import { HistoryService } from "../history/history.service";

@Injectable()
export class ClaimReviewTaskService {
    private readonly logger = new Logger("ClaimReviewService");
    constructor(
        @InjectModel(ClaimReviewTask.name)
        private ClaimReviewModel: Model<ClaimReviewTaskDocument>,
    ) {}

    create(claimReviewTaskBody) {
        console.log(claimReviewTaskBody)
        const newClaimReviewTask = new this.ClaimReviewModel(claimReviewTaskBody);
        console.log(newClaimReviewTask)
        // newClaimReviewTask.save()
        return newClaimReviewTask
    }
}