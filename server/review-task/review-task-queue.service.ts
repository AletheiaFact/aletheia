import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ReportModelEnum, ReviewTaskTypeEnum } from "../types/enums";
import type { Machine } from "./dto/create-review-task.dto";
import { ReviewTaskEffectsService } from "./review-task-effects.service";
import { ReviewTask, ReviewTaskDocument } from "./schemas/review-task.schema";
import { toError } from "../util/error-handling";

/**
 * Race-free work-queue primitives over review tasks (used by the MCP task
 * queue). Kept apart from ReviewTaskService, which serves the web app's
 * save-the-whole-machine flow. All Mongo access stays in this module so a
 * Postgres port only swaps these queries.
 */
@Injectable()
export class ReviewTaskQueueService {
    private readonly logger = new Logger(ReviewTaskQueueService.name);

    constructor(
        @InjectModel(ReviewTask.name)
        private ReviewTaskModel: Model<ReviewTaskDocument>,
        private effects: ReviewTaskEffectsService
    ) {}

    /**
     * Atomically moves the first task matching `filter` (by `sort`) through
     * a transition. The guarded findOneAndUpdate is what makes work-queue
     * hand-outs race-free: two callers can never both match the same source
     * state. History and state events are recorded afterwards, best-effort:
     * if that fails the transition stands and the failure is only logged.
     */
    async transitionAtomically(
        filter: Record<string, any>,
        update: Record<string, any>,
        sort: Record<string, 1 | -1> = { _id: 1 }
    ): Promise<ReviewTaskDocument | null> {
        const previous = await this.ReviewTaskModel.findOneAndUpdate(
            filter,
            update,
            { sort, new: false }
        );
        if (!previous) {
            return null;
        }
        const updated = await this.ReviewTaskModel.findById(previous._id);
        if (!updated) {
            return null;
        }
        try {
            await this.effects.recordHistory(
                updated.toObject(),
                previous.toObject()
            );
            this.effects.recordStateEvent(updated.toObject());
        } catch (error) {
            this.logger.error(
                `[ReviewTask] Transition of data_hash=${updated.data_hash} ` +
                    `stands but history/state event failed: ${error}`
            );
        }
        return updated;
    }

    /**
     * Guarded update that is not a workflow transition (a draft save, a
     * comment link): applies `update` only if `filter` still matches, with
     * no history or state event, like the web's draft endpoint. Returns the
     * updated task, or `null` when the filter no longer matches.
     */
    updateAtomically(
        filter: Record<string, any>,
        update: Record<string, any>
    ): Promise<ReviewTaskDocument | null> {
        return this.ReviewTaskModel.findOneAndUpdate(filter, update, {
            new: true,
        }).exec();
    }

    /**
     * Inserts an `unassigned` task unless one already exists for the
     * data_hash. Relies on the unique data_hash index, so concurrent
     * enqueues of the same sentence yield one task. Returns whether a task
     * was created.
     */
    async enqueueUnassigned(reviewTask: {
        data_hash: string;
        reportModel: ReportModelEnum;
        reviewTaskType: ReviewTaskTypeEnum;
        nameSpace: string;
        target: string;
        machine: Machine;
    }): Promise<boolean> {
        const result = await this.ReviewTaskModel.updateOne(
            { data_hash: reviewTask.data_hash },
            { $setOnInsert: reviewTask },
            { upsert: true }
        ).catch((error) => {
            // A concurrent upsert lost the unique-index race: the task exists.
            if (toError(error).code === 11000) {
                return { upsertedCount: 0 };
            }
            throw error;
        });
        return result.upsertedCount > 0;
    }

    /**
     * Inserts a task that is already assigned. Unlike ReviewTaskService.create
     * (the web path, which saves without awaiting), the insert is awaited, so
     * a caller that loses the unique data_hash race gets `null` instead of a
     * task it does not own.
     */
    async createAssigned(reviewTask: {
        data_hash: string;
        reportModel: ReportModelEnum;
        reviewTaskType: ReviewTaskTypeEnum;
        nameSpace: string;
        target: string;
        machine: Machine;
    }): Promise<ReviewTaskDocument | null> {
        let created: ReviewTaskDocument;
        try {
            created = await this.ReviewTaskModel.create(reviewTask);
        } catch (error) {
            if (toError(error).code === 11000) {
                return null;
            }
            throw error;
        }
        try {
            await this.effects.recordHistory(created.toObject());
            this.effects.recordStateEvent(created.toObject());
        } catch (error) {
            this.logger.error(
                `[ReviewTask] Created data_hash=${created.data_hash} ` +
                    `but history/state event failed: ${error}`
            );
        }
        return created;
    }

    findOldest(
        filter: Record<string, any>,
        page = 0,
        pageSize = 1
    ): Promise<ReviewTaskDocument[]> {
        return this.ReviewTaskModel.find(filter)
            .sort({ _id: 1 })
            .skip(page * pageSize)
            .limit(pageSize)
            .exec();
    }

    countMatching(filter: Record<string, any>): Promise<number> {
        return this.ReviewTaskModel.countDocuments(filter).exec();
    }

    /**
     * Publishes a `submitted` task the way the web publish event does:
     * creates the Report and ClaimReview and records history and the state
     * event. The state flip is guarded so a task is published at most once.
     * If the Report or ClaimReview cannot be created, the task goes back to
     * `submitted` so the publish can be retried.
     */
    async publishSubmitted(
        reviewTaskId: string
    ): Promise<ReviewTaskDocument | null> {
        const published = await this.transitionAtomically(
            {
                _id: new Types.ObjectId(reviewTaskId),
                "machine.value": "submitted",
            },
            { $set: { "machine.value": "published" } }
        );
        if (!published) {
            return null;
        }
        try {
            await this.effects.createReportAndClaimReview(
                published.data_hash,
                published.toObject().machine,
                published.reportModel,
                published.nameSpace,
                published.target,
                published.reviewTaskType
            );
        } catch (error) {
            await this.ReviewTaskModel.updateOne(
                { _id: published._id, "machine.value": "published" },
                { $set: { "machine.value": "submitted" } }
            );
            this.logger.error(
                `[ReviewTask] Publish of data_hash=${published.data_hash} ` +
                    `reverted to submitted: ${error}`
            );
            throw error;
        }
        return published;
    }
}
