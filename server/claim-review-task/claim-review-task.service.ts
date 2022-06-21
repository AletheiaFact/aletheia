import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { ClaimReviewTask, ClaimReviewTaskDocument } from "./schemas/claim-review-task.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateClaimReviewTaskDTO } from "./dto/create-claim-review-task.dto";
import { UpdateClaimReviewTaskDTO } from "./dto/update-claim-review-task.dto";
import { ClaimReviewService } from "../claim-review/claim-review.service";

@Injectable()
export class ClaimReviewTaskService {
    constructor(
        @InjectModel(ClaimReviewTask.name)
        private ClaimReviewTaskModel: Model<ClaimReviewTaskDocument>,
        private claimReviewService: ClaimReviewService,
    ) {}

    getById(claimReviewTaskId: string) {
        return this.ClaimReviewTaskModel.findById(claimReviewTaskId)
    }

    async create(claimReviewTaskBody: CreateClaimReviewTaskDTO) {
        const newClaimReviewTask = new this.ClaimReviewTaskModel(claimReviewTaskBody);
        newClaimReviewTask.save();
        return newClaimReviewTask;
    }

    async update(sentence_hash: string, newClaimReviewTaskBody: UpdateClaimReviewTaskDTO) {
        // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
        try {
            const claimReviewTask = await this.getClaimReviewTaskBySentenceHash(sentence_hash)
            const newClaimReviewTaskMachine = Object.assign(claimReviewTask.machine, newClaimReviewTaskBody.machine);
            const newClaimReviewTask = Object.assign(claimReviewTask, newClaimReviewTaskMachine);

            if (newClaimReviewTask.machine.value === "published") {
                this.claimReviewService.create(newClaimReviewTask.machine.context.reviewData)
            }
            
            return this.ClaimReviewTaskModel.updateOne(
                { _id: newClaimReviewTask._id },
                newClaimReviewTask
            );
        } catch(e) {
            throw new Error(e);
        }
        
    }

    getClaimReviewTaskBySentenceHash(sentence_hash: string) {
        return this.ClaimReviewTaskModel.findOne({ sentence_hash })
    }
}
