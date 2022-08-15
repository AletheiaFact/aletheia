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
import { StateEventService } from "../state-event/state-event.service";
import { TypeModel } from "../state-event/schema/state-event.schema";
import { REQUEST } from "@nestjs/core";
import { BaseRequest } from "../types";
import { SentenceService } from "../sentence/sentence.service";

@Injectable({ scope: Scope.REQUEST })
export class ClaimReviewTaskService {
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(ClaimReviewTask.name)
        private ClaimReviewTaskModel: Model<ClaimReviewTaskDocument>,
        private claimReviewService: ClaimReviewService,
        private reportService: ReportService,
        private historyService: HistoryService,
        private stateEventService: StateEventService,
        private senteceService: SentenceService
    ) {}

    async listAll(page, pageSize, order, value) {
        const query =
            value === "published"
                ? { "machine.value": value }
                : { [`machine.value.${value}`]: { $exists: true } };
        const reviewTasks = await this.ClaimReviewTaskModel.find({
            ...query,
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

        return Promise.all(
            reviewTasks.map(async ({ sentence_hash, machine }) => {
                const { personality, claim } = machine.context.claimReview;
                const reviewHref = `/personality/${personality.slug}/claim/${claim.slug}/sentence/${sentence_hash}`;
                const usersName = machine.context.reviewData.usersId.map(
                    (user) => {
                        return user.name;
                    }
                );

                const sentenceContent = await this.senteceService.getByDataHash(
                    sentence_hash
                );
                return {
                    sentence_hash,
                    sentenceContent: sentenceContent.content,
                    usersName,
                    value: machine.value,
                    personalityName: personality.name,
                    claimTitle: claim.latestRevision.title,
                    reviewHref,
                };
            })
        );
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
            historyType || HistoryType.Published,
            {
                ...newClaimReviewTask.machine.context.reviewData,
                ...newClaimReviewTask.machine.context.claimReview.claim,
                value: newClaimReviewTask.machine.value,
            },
            previousClaimReviewTask && {
                ...previousClaimReviewTask.machine.context.reviewData,
                ...previousClaimReviewTask.machine.context.claimReview.claim,
                value: previousClaimReviewTask.machine.value,
            }
        );

        this.historyService.createHistory(history);
    }

    _createStateEvent(newClaimReviewTask) {
        let typeModel;
        let draft = false;

        if (typeof newClaimReviewTask.machine.value === "object") {
            draft =
                newClaimReviewTask.machine.value?.[
                    Object.keys(newClaimReviewTask.machine.value)[0]
                ] === "draft"
                    ? true
                    : false;

            typeModel = Object.keys(newClaimReviewTask.machine.value)[0];
        }

        const stateEvent = this.stateEventService.getStateEventParams(
            Types.ObjectId(
                newClaimReviewTask.machine.context.claimReview.claim
            ),
            typeModel || TypeModel.Published,
            draft,
            newClaimReviewTask._id
        );

        this.stateEventService.createStateEvent(stateEvent);
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
            this._createStateEvent(newClaimReviewTask);
            return newClaimReviewTask;
        }
    }

    async update(sentence_hash: string, { machine }: UpdateClaimReviewTaskDTO) {
        // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
        try {
            const claimReviewTask = await this.getClaimReviewTaskBySentenceHash(
                sentence_hash
            );

            const newClaimReviewTaskMachine = {
                ...claimReviewTask.machine,
                ...machine,
            };

            const newClaimReviewTask = {
                ...claimReviewTask.toObject(),
                machine: newClaimReviewTaskMachine,
            };

            if (newClaimReviewTaskMachine.value === "published") {
                this._createReportAndClaimReview(
                    sentence_hash,
                    newClaimReviewTask.machine
                );
            }

            this._createReviewTaskHistory(newClaimReviewTask, claimReviewTask);
            this._createStateEvent(newClaimReviewTask);

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
