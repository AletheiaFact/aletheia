import { Inject, Injectable, Scope } from "@nestjs/common";
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
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { HistoryService } from "../history/history.service";
import { REQUEST } from "@nestjs/core";
import { BaseRequest } from "../types";

@Injectable({ scope: Scope.REQUEST })
export class ClaimReviewTaskService {
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(ClaimReviewTask.name)
        private ClaimReviewTaskModel: Model<ClaimReviewTaskDocument>,
        private claimReviewService: ClaimReviewService,
        private reportService: ReportService,
        private historyService: HistoryService
    ) {}

    async listAll(page, pageSize, order, value) {
        const reviewTasks = await this.ClaimReviewTaskModel.find({
            "machine.value": value,
        })
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .populate({
                path: "machine.context.reviewData.usersId",
                model: "User",
                select: "name",
            })
            .populate({
                path: "machine.context.claimReview.personality",
                model: "Personality",
                select: "slug name",
            })
            .populate({
                path: "machine.context.claimReview.claim",
                model: "Claim",
                populate: {
                    path: "latestRevision",
                    select: "title",
                },
                select: "slug",
            });

        return reviewTasks.map(({ sentence_hash, machine }) => {
            const { personality, claim } = machine.context.claimReview;
            const reviewHref = `/personality/${personality.slug}/claim/${claim.slug}/sentence/${sentence_hash}`;
            const usersName = machine.context.reviewData.usersId.map((user) => {
                return user.name;
            });

            return {
                sentence_hash,
                usersName,
                value: machine.value,
                personalityName: personality.name,
                claimTitle: claim.latestRevision.title,
                reviewHref,
            };
        });
    }

    getById(claimReviewTaskId: string) {
        return this.ClaimReviewTaskModel.findById(claimReviewTaskId);
    }

    _createReviewTaskHistory(
        newClaimReviewTask,
        previousClaimReviewTask = null
    ) {
        let historyType;

        if (typeof newClaimReviewTask.machine.value === "object") {
            historyType =
                newClaimReviewTask.machine.value?.[
                    Object.keys(newClaimReviewTask.machine.value)[0]
                ] === "draft"
                    ? HistoryType.Draft
                    : Object.keys(newClaimReviewTask.machine.value)[0];
        }

        const user = this.req.user;

        const history = this.historyService.getHistoryParams(
            newClaimReviewTask._id,
            TargetModel.ClaimReviewTask,
            user,
            historyType || HistoryType.Update,
            {
                ...newClaimReviewTask.machine.context.reviewData,
                value: newClaimReviewTask.machine.value,
            },
            previousClaimReviewTask && {
                ...previousClaimReviewTask.machine.context.reviewData,
                value: previousClaimReviewTask.machine.value,
            }
        );

        this.historyService.createHistory(history);
    }

    _tranformUserIdInObjectId(userId) {
        return (userId = Types.ObjectId(userId));
    }

    async _createReportAndClaimReview(sentence_hash, machine) {
        const claimReviewData = machine.context.claimReview;

        const newReport = Object.assign(machine.context.reviewData, {
            sentence_hash,
        });

        const report = await this.reportService.create(newReport);

        this.claimReviewService.create(
            {
                ...claimReviewData,
                report,
            },
            sentence_hash
        );
    }

    async create(claimReviewTaskBody: CreateClaimReviewTaskDTO) {
        const claimReviewTask = await this.getClaimReviewTaskBySentenceHash(
            claimReviewTaskBody.sentence_hash
        );

        claimReviewTaskBody.machine.context.reviewData.usersId =
            claimReviewTaskBody.machine.context.reviewData.usersId.map(
                (userId) => {
                    return Types.ObjectId(userId);
                }
            );

        if (claimReviewTask) {
            return this.update(
                claimReviewTaskBody.sentence_hash,
                claimReviewTaskBody
            );
        } else {
            const newClaimReviewTask = new this.ClaimReviewTaskModel(
                claimReviewTaskBody
            );
            newClaimReviewTask.save();
            this._createReviewTaskHistory(newClaimReviewTask);
            return newClaimReviewTask;
        }
    }

    async update(
        sentence_hash: string,
        newClaimReviewTaskBody: UpdateClaimReviewTaskDTO
    ) {
        // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
        try {
            const claimReviewTask = await this.getClaimReviewTaskBySentenceHash(
                sentence_hash
            );

            const newClaimReviewTaskMachine = {
                ...claimReviewTask.machine,
                ...newClaimReviewTaskBody.machine,
            };

            const newClaimReviewTask = {
                ...claimReviewTask.toObject(),
                machine: newClaimReviewTaskMachine,
            };

            if (newClaimReviewTaskMachine.value === "published") {
                this._createReportAndClaimReview(
                    sentence_hash,
                    newClaimReviewTask
                );
            }

            this._createReviewTaskHistory(newClaimReviewTask, claimReviewTask);

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

    count(query: any = {}) {
        return this.ClaimReviewTaskModel.countDocuments().where(query);
    }
}
