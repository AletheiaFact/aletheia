import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Types } from "mongoose";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { HistoryService } from "../history/history.service";
import type { IReportService } from "../interfaces/report.service.interface";
import { TypeModel } from "../state-event/schema/state-event.schema";
import { StateEventService } from "../state-event/state-event.service";
import type { BaseRequest } from "../types";
import type { Machine } from "./dto/create-review-task.dto";

/**
 * What a review-task transition records besides the task itself: the
 * history entry, the state event, and on publish the Report and ClaimReview.
 * Shared by the web path (ReviewTaskService) and the work queue
 * (ReviewTaskQueueService) so both leave the same trail.
 */
@Injectable({ scope: Scope.REQUEST })
export class ReviewTaskEffectsService {
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        private claimReviewService: ClaimReviewService,
        @Inject("ReportService") private reportService: IReportService,
        private historyService: HistoryService,
        private stateEventService: StateEventService
    ) {}

    async recordHistory(newReviewTask: any, previousReviewTask: any = null) {
        let historyType: HistoryType | string | undefined;

        if (typeof newReviewTask.machine.value === "object") {
            historyType =
                newReviewTask.machine.value?.[
                    Object.keys(newReviewTask.machine.value)[0]
                ] === "draft"
                    ? HistoryType.Draft
                    : Object.keys(newReviewTask.machine.value)[0];
        }

        const user = this.req.user?._id;

        const history = this.historyService.getHistoryParams(
            newReviewTask._id,
            TargetModel.ReviewTask,
            user,
            (historyType || HistoryType.Published) as HistoryType,
            {
                ...newReviewTask.machine.context.reviewData,
                ...newReviewTask.machine.context.review.target,
                value: newReviewTask.machine.value,
            },
            previousReviewTask && {
                ...previousReviewTask.machine.context.reviewData,
                ...previousReviewTask.machine.context.review.target,
                value: previousReviewTask.machine.value,
            }
        );

        await this.historyService.createHistory(history as any);
    }

    recordStateEvent(newReviewTask: any) {
        let typeModel: string | undefined;
        let draft = false;

        if (typeof newReviewTask.machine.value === "object") {
            draft =
                newReviewTask.machine.value?.[
                    Object.keys(newReviewTask.machine.value)[0]
                ] === "draft"
                    ? true
                    : false;

            typeModel = Object.keys(newReviewTask.machine.value)[0];
        }

        const stateEvent = this.stateEventService.getStateEventParams(
            new Types.ObjectId(
                newReviewTask.machine.context.review.target
            ) as any,
            typeModel || TypeModel.Published,
            draft,
            newReviewTask._id
        );

        void this.stateEventService.createStateEvent(stateEvent as any);
    }

    async createReportAndClaimReview(
        data_hash: string,
        machine: Machine,
        reportModel: string,
        nameSpace: string,
        target: any,
        targetModel: string,
        classificationMethodology?: string
    ) {
        const reviewData = machine.context.review;

        const newReport = Object.assign(machine.context.reviewData, {
            data_hash,
            reportModel,
            ...(classificationMethodology && { classificationMethodology }),
        });

        const report = await this.reportService.create(newReport);

        await this.claimReviewService.create(
            {
                ...reviewData,
                report,
                nameSpace,
                target,
                targetModel,
            },
            data_hash,
            reportModel
        );
    }
}
