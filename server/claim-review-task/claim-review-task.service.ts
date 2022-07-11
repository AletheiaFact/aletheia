import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import {
    ClaimReviewTask,
    ClaimReviewTaskDocument,
} from "./schemas/claim-review-task.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateClaimReviewTaskDTO } from "./dto/create-claim-review-task.dto";
import { UpdateClaimReviewTaskDTO } from "./dto/update-claim-review-task.dto";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReportService } from "../report/report.service";

@Injectable()
export class ClaimReviewTaskService {
    constructor(
        @InjectModel(ClaimReviewTask.name)
        private ClaimReviewTaskModel: Model<ClaimReviewTaskDocument>,
        private claimReviewService: ClaimReviewService,
        private reportService: ReportService
    ) { }

    async listAll(page, pageSize, order, value) {

        return await this.ClaimReviewTaskModel.aggregate([
            { "$match": { "machine.value": value } },
            { "$skip": page * pageSize },
            { "$sample": { size: 5 } },
            { "$sort": { _id: 1 } },
            {
                "$lookup": {
                    from: 'users',
                    localField: 'machine.context.reviewData.userId',
                    foreignField: '_id',
                    as: 'machine.context.reviewData.userId'
                }
            },
            {
                "$project": {
                    sentence_hash: 1,
                    "machine.value": 1,
                    "machine.context.reviewData.userId.name": 1
                }
            },
            {
                "$group": {
                    _id: "$machine.value",
                    reviews: {
                        "$push": { sentence_hash: "$sentence_hash", userId: "$machine.context.reviewData.userId.name" }
                    }
                }
            },
        ])
    }

    getById(claimReviewTaskId: string) {
        return this.ClaimReviewTaskModel.findById(claimReviewTaskId);
    }

    async create(claimReviewTaskBody: CreateClaimReviewTaskDTO) {
        claimReviewTaskBody.machine.context.reviewData.userId = Types.ObjectId(claimReviewTaskBody.machine.context.reviewData.userId);
        const newClaimReviewTask = new this.ClaimReviewTaskModel(
            claimReviewTaskBody
        );
        newClaimReviewTask.save();
        return newClaimReviewTask;
    }

    async update(
        sentence_hash: string,
        newClaimReviewTaskBody: UpdateClaimReviewTaskDTO
    ) {
        // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
        try {
            newClaimReviewTaskBody.machine.context.reviewData.userId = Types.ObjectId(newClaimReviewTaskBody.machine.context.reviewData.userId);
            const claimReviewTask = await this.getClaimReviewTaskBySentenceHash(
                sentence_hash
            );
            const newClaimReviewTaskMachine = Object.assign(
                claimReviewTask.machine,
                newClaimReviewTaskBody.machine
            );
            const newClaimReviewTask = Object.assign(
                claimReviewTask,
                newClaimReviewTaskMachine
            );

            if (newClaimReviewTaskMachine.value === "published") {
                const claimReviewData =
                    newClaimReviewTaskMachine.context.claimReview;

                const newReport = Object.assign(
                    newClaimReviewTaskMachine.context.reviewData,
                    { sentence_hash }
                )

                const report = await this.reportService.create(newReport);

                this.claimReviewService.create(
                    {
                        ...claimReviewData,
                        report,
                    },
                    sentence_hash
                );
            }

            return this.ClaimReviewTaskModel.updateOne(
                { _id: newClaimReviewTask._id },
                newClaimReviewTask
            );
        } catch (e) {
            throw new Error(e);
        }
    }

    getClaimReviewTaskBySentenceHash(sentence_hash: string) {
        return this.ClaimReviewTaskModel.findOne({ sentence_hash });
    }
}
