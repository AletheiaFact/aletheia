import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { ClaimReviewTask, ClaimReviewTaskDocument } from "./schemas/claim-review-task.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateClaimReviewTaskDTO } from "./dto/create-claim-review-task.dto";
import { UpdateClaimReviewTaskDTO } from "./dto/update-claim-review-task.dto";

@Injectable()
export class ClaimReviewTaskService {
    private readonly logger = new Logger("ClaimReviewService");
    constructor(
        @InjectModel(ClaimReviewTask.name)
        private ClaimReviewTaskModel: Model<ClaimReviewTaskDocument>,
    ) {}

    getById(claimReviewTaskId: string) {
        return this.ClaimReviewTaskModel.findById(claimReviewTaskId)
    };

    async create(claimReviewTaskBody: CreateClaimReviewTaskDTO) {
        const newClaimReviewTask = new this.ClaimReviewTaskModel(claimReviewTaskBody);

        newClaimReviewTask.save();

        return newClaimReviewTask;
    };

    async update(sentence_hash: string, newClaimReviewTaskBody: UpdateClaimReviewTaskDTO) {
        const claimReviewTask = await this.getClaimReviewTaskBySentenceHash(sentence_hash)

        const newClaimReviewTaskContext = Object.assign(claimReviewTask.machine.context, newClaimReviewTaskBody.machine.context);
        
        const newClaimReviewTask = Object.assign(claimReviewTask, newClaimReviewTaskContext);

        const claimReviewTaskUpdated = await this.ClaimReviewTaskModel.updateOne(
            { _id: newClaimReviewTask._id },
            newClaimReviewTask
        );

        return claimReviewTaskUpdated;
    }

    getClaimReviewTaskBySentenceHash(sentence_hash: string) {
        return this.ClaimReviewTaskModel.findOne({ sentence_hash })
    };
};
