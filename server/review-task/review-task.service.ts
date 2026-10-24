import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    Scope,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { ClientSession, Model, Types, UpdateWriteOpResult } from "mongoose";
import { ReviewTask, ReviewTaskDocument } from "./schemas/review-task.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateReviewTaskDTO, Machine } from "./dto/create-review-task.dto";
import { UpdateReviewTaskDTO } from "./dto/update-review-task.dto";
import { SaveDraftDTO } from "./dto/save-draft.dto";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../types";
import type { ISentenceService } from "../interfaces/sentence.service.interface";
import { getQueryMatchForMachineValue } from "./mongo-utils";
import { buildDateQuery } from "../../src/utils/date.utils";
import { Roles } from "../auth/ability/ability.factory";
import { ImageService } from "../claim/types/image/image.service";
import {
    ContentModelEnum,
    ReportModelEnum,
    ReviewTaskTypeEnum,
} from "../types/enums";
import { EditorParseService } from "../editor-parse/editor-parse.service";
import { CommentService } from "./comment/comment.service";
import { CommentEnum } from "./comment/schema/comment.schema";
import { User } from "../users/schemas/user.schema";
import { Image } from "../claim/types/image/schemas/image.schema";
import type { ISentence } from "../interfaces/claim-content.interface";
import { Source } from "../source/mongo/schemas/source.schema";
import { ReviewTaskEffectsService } from "./review-task-effects.service";
import {
    buildListPipeline,
    buildNotDeletedCountPipeline,
} from "./review-task.pipelines";

interface IListAllQuery {
    value: any;
    filterUser: { assigned: boolean; crossChecked: boolean; reviewed: boolean };
    nameSpace: string;
    reviewTaskType: ReviewTaskTypeEnum;
    page: number;
    pageSize: number;
    order: string | number;
    startDate?: string;
    endDate?: string;
}

interface IPostProcess {
    data_hash: string;
    machine: Machine;
    target: any; // TODO: Type this properly as Claim | VerificationRequest
    reviewTaskType: ReviewTaskTypeEnum;
}

export interface IReviewTask {
    content: Source | ISentence | Image;
    usersName: string[];
    value: string;
    personalityName?: string;
    claimTitle?: string;
    targetId: string;
    personalityId?: string;
    contentModel?: string;
}

@Injectable({ scope: Scope.REQUEST })
export class ReviewTaskService {
    private readonly logger = new Logger(ReviewTaskService.name);
    fieldMap: Record<string, string>;
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(ReviewTask.name)
        private ReviewTaskModel: Model<ReviewTaskDocument>,
        private effects: ReviewTaskEffectsService,
        @Inject("SentenceService") private sentenceService: ISentenceService,
        private imageService: ImageService,
        private editorParseService: EditorParseService,
        private commentService: CommentService
    ) {
        this.fieldMap = {
            assigned: "machine.context.reviewData.usersId",
            crossChecked: "machine.context.reviewData.crossCheckerId",
            reviewed: "machine.context.reviewData.reviewerId",
        };
    }

    getQueryObject(
        value: string,
        filterUser: Record<string, boolean | string>,
        startDate?: string,
        endDate?: string
    ): Record<string, any> {
        const query = getQueryMatchForMachineValue(value);

        const dateQuery = buildDateQuery(startDate, endDate);
        if (dateQuery) query.createdAt = dateQuery;

        Object.keys(filterUser).forEach((key) => {
            const filterValue = filterUser[key];
            if (filterValue === true || filterValue === "true") {
                const queryPath = this.fieldMap[key];
                query[queryPath] = new Types.ObjectId(this.req.user._id);
            }
        });

        return query;
    }

    async listAll(query: IListAllQuery): Promise<IReviewTask[]> {
        const pipeline = buildListPipeline(
            this.getQueryObject(
                query.value,
                query.filterUser,
                query.startDate,
                query.endDate
            ),
            query.value,
            query.nameSpace,
            query.reviewTaskType
        );
        pipeline.push(
            { $sort: { _id: query.order === "asc" ? 1 : -1 } },
            { $skip: query.page * query.pageSize },
            { $limit: query.pageSize }
        );

        const reviewTasks = await this.ReviewTaskModel.aggregate(
            pipeline
        ).exec();

        return Promise.all(
            reviewTasks?.map((reviewTask: any) => this.postProcess(reviewTask))
        );
    }

    /**
     * Post-processes review task data after aggregation pipeline
     * Handles optional fields gracefully for different review types
     * @param params - PostProcess parameters
     * @returns Formatted review task data
     */
    async postProcess({
        data_hash,
        machine,
        target,
        reviewTaskType,
    }: IPostProcess): Promise<IReviewTask> {
        const personality = machine.context?.review?.personality;
        const reviewData = machine.context?.reviewData;
        const latestRevision = target?.latestRevision;

        const usersId: User[] = reviewData?.usersId || [];

        const usersName: string[] = usersId
            .map((user) => user?.name)
            .filter(
                (name): name is string =>
                    typeof name === "string" && name.length > 0
            );

        const contentModel = latestRevision?.contentModel;
        const claimTitle = latestRevision?.title;
        const isContentImage = contentModel === ContentModelEnum.Image;

        let content: Source | ISentence | Image = target;

        if (reviewTaskType === ReviewTaskTypeEnum.Claim && latestRevision) {
            if (isContentImage) {
                content = await this.imageService.getByDataHash(data_hash);
            } else {
                content = await this.sentenceService.getByDataHash(data_hash);
            }
        }

        const result: IReviewTask = {
            content,
            usersName,
            value: machine.value,
            targetId: target._id,
        };

        if (personality?.name) {
            result.personalityName = personality.name;
        }
        if (personality && "_id" in personality && personality._id) {
            result.personalityId =
                typeof personality._id === "string"
                    ? personality._id
                    : personality._id.toString();
        }
        if (claimTitle) {
            result.claimTitle = claimTitle;
        }
        if (contentModel) {
            result.contentModel = contentModel;
        }

        return result;
    }

    getById(reviewTaskId: string): Promise<ReviewTaskDocument | null> {
        return this.ReviewTaskModel.findById(reviewTaskId).exec();
    }

    _returnObjectId(data: any): any {
        if (Array.isArray(data)) {
            return data.map((item: any) =>
                item._id
                    ? new Types.ObjectId(item._id) || ""
                    : new Types.ObjectId(item)
            );
        }
    }

    _createCrossCheckingComment(
        comment: string,
        text: string,
        targetId: Types.ObjectId
    ) {
        const newCrossCheckingComment = {
            comment,
            text,
            type: CommentEnum.crossChecking,
            targetId,
            user: this.req.user._id,
        };
        return this.commentService.create(newCrossCheckingComment);
    }

    async create(
        reviewTaskBody: CreateReviewTaskDTO
    ): Promise<ReviewTaskDocument | UpdateWriteOpResult> {
        const reviewDataBody = reviewTaskBody.machine.context.reviewData;
        const reviewTask = await this.getReviewTaskByDataHash(
            reviewTaskBody.data_hash
        );

        const createCrossCheckingComment =
            reviewTask?.machine?.value === "addCommentCrossChecking" &&
            reviewDataBody.crossCheckingClassification &&
            reviewDataBody.crossCheckingComment;

        reviewTaskBody.machine.context.reviewData.usersId =
            this._returnObjectId(reviewDataBody.usersId);

        reviewTaskBody.machine.context.reviewData.group = this._returnObjectId(
            reviewDataBody.group
        );

        if (reviewDataBody.reviewerId) {
            reviewTaskBody.machine.context.reviewData.reviewerId =
                new Types.ObjectId(reviewDataBody.reviewerId) || "";
        }

        if (reviewDataBody.crossCheckerId) {
            reviewTaskBody.machine.context.reviewData.crossCheckerId =
                new Types.ObjectId(reviewDataBody.crossCheckerId) || "";
        }

        if (reviewDataBody.reviewComments) {
            void this.commentService.updateManyComments(
                reviewDataBody.reviewComments
            );
            reviewTaskBody.machine.context.reviewData.reviewComments =
                this._returnObjectId(reviewDataBody.reviewComments);
        }

        if (reviewDataBody.crossCheckingComments) {
            reviewTaskBody.machine.context.reviewData.crossCheckingComments =
                this._returnObjectId(reviewDataBody.crossCheckingComments);
        }

        if (createCrossCheckingComment) {
            const crossCheckingComment = await this._createCrossCheckingComment(
                reviewDataBody.crossCheckingComment!,
                reviewDataBody.crossCheckingClassification!,
                reviewTask!._id
            );
            reviewTaskBody.machine.context.reviewData.crossCheckingComments!.push(
                crossCheckingComment._id
            );
        }

        if (reviewTask) {
            this.logger.log(
                `[ReviewTask] State transition for data_hash=${reviewTaskBody.data_hash} ` +
                    `by user=${this.req.user?._id}: ` +
                    `"${reviewTask.machine?.value}" → "${reviewTaskBody.machine?.value}"`
            );
            return this.update(
                reviewTaskBody.data_hash,
                reviewTaskBody,
                reviewTaskBody.nameSpace,
                reviewTask.reportModel
            );
        } else {
            this.logger.log(
                `[ReviewTask] Creating new review task: data_hash=${reviewTaskBody.data_hash}, ` +
                    `reportModel=${reviewTaskBody.reportModel}, ` +
                    `initialState="${reviewTaskBody.machine?.value}", ` +
                    `user=${this.req.user?._id}`
            );
            const newReviewTask = new this.ReviewTaskModel(reviewTaskBody);
            void newReviewTask.save();
            void this.effects.recordHistory(newReviewTask);
            this.effects.recordStateEvent(newReviewTask);
            return newReviewTask;
        }
    }

    async update(
        data_hash: string,
        { machine }: UpdateReviewTaskDTO,
        nameSpace: string,
        reportModel: string,
        history: boolean = true
    ): Promise<ReviewTaskDocument> {
        // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
        const reviewTask = await this.getReviewTaskByDataHash(data_hash);
        if (!reviewTask) {
            throw new NotFoundException(
                `Review task not found for data_hash: ${data_hash}`
            );
        }

        const newReviewTaskMachine = {
            ...reviewTask.machine,
            ...machine,
        };

        const newReviewTask = {
            ...reviewTask.toObject(),
            machine: newReviewTaskMachine,
        };

        this._publishReviewTask(
            newReviewTask,
            nameSpace,
            machine!,
            data_hash,
            reportModel
        );

        if (history) {
            void this.effects.recordHistory(newReviewTask, reviewTask);
            this.effects.recordStateEvent(newReviewTask);
        }

        const updated = await this.ReviewTaskModel.findByIdAndUpdate(
            reviewTask._id,
            {
                $set: { machine: newReviewTaskMachine },
            }
        );
        if (!updated) {
            throw new NotFoundException(
                `ReviewTask not found: ${reviewTask._id}`
            );
        }
        return updated;
    }

    private static readonly ALLOWED_DRAFT_REVIEW_DATA_FIELDS = [
        "summary",
        "questions",
        "report",
        "verification",
        "sources",
        "classification",
        "visualEditor",
        "crossCheckingClassification",
        "crossCheckingComment",
        "rejectionComment",
    ];

    private static readonly ALLOWED_DRAFT_REVIEW_FIELDS = [
        "usersId",
        "personality",
        "isPartialReview",
        "targetId",
    ];

    async saveDraft(data_hash: string, saveDraftBody: SaveDraftDTO) {
        if (!this.req.user) {
            this.logger.warn(
                `Unauthenticated save-draft attempt for data_hash=${data_hash}`
            );
            throw new UnauthorizedException(
                "Authentication required to save a draft"
            );
        }

        let reviewTask = await this.getReviewTaskByDataHash(data_hash);

        // If review task doesn't exist yet (e.g. InformativeNews auto-assigns
        // before first submission), create a minimal document for the draft
        if (!reviewTask && saveDraftBody.reportModel && saveDraftBody.target) {
            const loggedInUserId = this.req.user._id;
            const newReviewTask = new this.ReviewTaskModel({
                data_hash,
                reportModel: saveDraftBody.reportModel,
                nameSpace: saveDraftBody.nameSpace || "main",
                reviewTaskType: saveDraftBody.reviewTaskType || "Claim",
                target: saveDraftBody.target,
                machine: {
                    context: {
                        reviewData: { usersId: [loggedInUserId] },
                        review: {
                            personality:
                                saveDraftBody.machine.context.review
                                    ?.personality || "",
                            isPartialReview: true,
                        },
                    },
                    // XState's persisted shape for the compound `assigned`
                    // state; a plain string is invisible to the Kanban query.
                    value: { assigned: "draft" },
                },
            });
            await newReviewTask.save();
            this.logger.log(
                `[ReviewTask] Auto-created draft for data_hash=${data_hash}, ` +
                    `reportModel=${saveDraftBody.reportModel}, user=${loggedInUserId}`
            );
            reviewTask = newReviewTask;
        } else if (!reviewTask) {
            throw new NotFoundException("Review task not found");
        }

        // Ownership check: only assignees or admins can save drafts
        const loggedInUser = this.req.user;
        const assignees =
            reviewTask.machine?.context?.reviewData?.usersId || [];
        const isAssignee = assignees
            .map((id: any) => id.toString())
            .includes(loggedInUser._id.toString());
        const userRole = (loggedInUser.role as Record<string, Roles>)?.[
            reviewTask.nameSpace
        ];
        const isAdminUser =
            userRole === Roles.Admin || userRole === Roles.SuperAdmin;

        if (!isAssignee && !isAdminUser) {
            this.logger.warn(
                `[ReviewTask] Draft save denied for data_hash=${data_hash}: ` +
                    `user=${loggedInUser._id} is not assignee and role="${userRole}" is not admin`
            );
            throw new ForbiddenException("Not authorized to save this draft");
        }

        const setFields: Record<string, any> = {};

        // Merge reviewData fields individually (whitelisted only)
        if (saveDraftBody.machine.context.reviewData) {
            const draftReviewData = saveDraftBody.machine.context.reviewData;
            for (const [key, value] of Object.entries(draftReviewData)) {
                if (
                    value !== undefined &&
                    ReviewTaskService.ALLOWED_DRAFT_REVIEW_DATA_FIELDS.includes(
                        key
                    )
                ) {
                    setFields[`machine.context.reviewData.${key}`] = value;
                }
            }
        }

        // Merge review fields individually (whitelisted only)
        if (saveDraftBody.machine.context.review) {
            const draftReview = saveDraftBody.machine.context.review;
            for (const [key, value] of Object.entries(draftReview)) {
                if (
                    value !== undefined &&
                    ReviewTaskService.ALLOWED_DRAFT_REVIEW_FIELDS.includes(key)
                ) {
                    setFields[`machine.context.review.${key}`] = value;
                }
            }
        }

        if (Object.keys(setFields).length === 0) {
            return reviewTask;
        }

        return this.ReviewTaskModel.findOneAndUpdate(
            { data_hash },
            { $set: setFields },
            { new: true }
        );
    }

    getReviewTaskByDataHash(data_hash: string) {
        const commentPopulation = [
            {
                path: "user",
                select: "name",
            },
            {
                path: "replies",
                populate: {
                    path: "user",
                    select: "name",
                },
            },
        ];

        return this.ReviewTaskModel.findOne({ data_hash })
            .populate({
                path: "machine.context.reviewData.reviewComments",
                model: "Comment",
                populate: commentPopulation,
            })
            .populate({
                path: "machine.context.reviewData.crossCheckingComments",
                model: "Comment",
                populate: commentPopulation,
            });
    }

    async getReviewTasksByClaimId(targetId: string) {
        return await this.ReviewTaskModel.find({
            target: targetId.toString(),
            "machine.value": { $ne: "published" },
        });
    }

    async getReviewTaskByDataHashWithUsernames(data_hash: string) {
        // This may cause a false positive in sonarCloud
        const reviewTask = await this.getReviewTaskByDataHash(data_hash)
            .populate({
                path: "machine.context.reviewData.usersId",
                model: "User",
                select: "name",
            })
            .populate({
                path: "machine.context.reviewData.crossCheckerId",
                model: "User",
                select: "name",
            })
            .populate({
                path: "machine.context.reviewData.reviewerId",
                model: "User",
                select: "name",
            });

        if (reviewTask) {
            const preloadedAsignees: any[] = [];
            const usersId: any[] = [];
            reviewTask.machine.context.reviewData.usersId!.forEach(
                (assignee: any) => {
                    preloadedAsignees.push({
                        value: assignee._id,
                        label: assignee.name,
                    });
                    usersId.push(assignee._id);
                }
            );
            reviewTask.machine.context.reviewData.usersId = usersId;
            reviewTask.machine.context.preloadedOptions = {
                usersId: preloadedAsignees,
            };

            if (reviewTask.machine.context.reviewData.crossCheckerId) {
                const crossCheckerUser =
                    reviewTask.machine.context.reviewData.crossCheckerId;
                reviewTask.machine.context.preloadedOptions.crossCheckerId = [
                    {
                        value: crossCheckerUser._id,
                        label: crossCheckerUser.name,
                    },
                ];
                reviewTask.machine.context.reviewData.crossCheckerId =
                    crossCheckerUser._id;
            }

            if (reviewTask.machine.context.reviewData.reviewerId) {
                const reviewerUser =
                    reviewTask.machine.context.reviewData.reviewerId;
                reviewTask.machine.context.preloadedOptions.reviewerId = [
                    {
                        value: reviewerUser._id,
                        label: reviewerUser.name,
                    },
                ];
                reviewTask.machine.context.reviewData.reviewerId =
                    reviewerUser._id;
            }
        }

        return reviewTask;
    }

    count(query: any = {}) {
        return this.ReviewTaskModel.countDocuments().where(query);
    }

    async countReviewTasksNotDeleted(
        value: string,
        filterUser: Record<string, boolean | string>,
        nameSpace: string,
        reviewTaskType: ReviewTaskTypeEnum,
        startDate?: string,
        endDate?: string
    ): Promise<number> {
        try {
            const query: any = this.getQueryObject(
                value,
                filterUser,
                startDate,
                endDate
            );

            const pipeline = buildNotDeletedCountPipeline(
                query,
                nameSpace,
                reviewTaskType
            );

            const result = await this.ReviewTaskModel.aggregate(
                pipeline
            ).exec();

            if (result.length > 0) {
                return result[0].count;
            }

            return 0;
        } catch (error) {
            this.logger.error("Error in countReviewTasksNotDeleted:", error);
            throw error;
        }
    }

    async getEditorContentObject(
        schema: any,
        reportModel: ReportModelEnum | string,
        reviewTaskType: string
    ) {
        const editorContent = await this.editorParseService.schema2editor(
            schema,
            reportModel as ReportModelEnum,
            reviewTaskType
        );
        return this.editorParseService.removeTrailingParagraph(editorContent);
    }

    async addComment(data_hash: string, comment: any) {
        const reviewTask = await this.getReviewTaskByDataHash(data_hash);
        if (!reviewTask) {
            throw new NotFoundException(
                `Review task not found for data_hash: ${data_hash}`
            );
        }
        const reviewData = reviewTask.machine.context.reviewData;
        const newComment = await this.commentService.create({
            ...comment,
            targetId: reviewTask._id,
        });

        if (!reviewData.reviewComments) {
            reviewData.reviewComments = [];
        }

        reviewData.reviewComments.push(newComment?._id as Types.ObjectId);

        const updatedTask = await this.ReviewTaskModel.findOneAndUpdate(
            { _id: reviewTask._id },
            { "machine.context.reviewData": reviewData },
            { new: true }
        );

        return {
            reviewData: updatedTask!.machine.context.reviewData,
            comment: newComment,
        };
    }

    async deleteComment(data_hash: string, commentId: string) {
        const commentIdObject = new Types.ObjectId(commentId);
        const reviewTask = await this.getReviewTaskByDataHash(data_hash);
        if (!reviewTask) {
            throw new NotFoundException(
                `Review task not found for data_hash: ${data_hash}`
            );
        }
        const reviewData = reviewTask.machine.context.reviewData;
        reviewData.reviewComments = (reviewData.reviewComments ?? []).filter(
            (comment: any) => !comment._id.equals(commentIdObject)
        );
        reviewData.crossCheckingComments = (
            reviewData.crossCheckingComments ?? []
        ).filter((comment: any) => !comment._id.equals(commentIdObject));

        return this.ReviewTaskModel.findByIdAndUpdate(reviewTask._id, {
            "machine.context.reviewData": reviewData,
        });
    }

    async getHtmlFromSchema(schema: any) {
        const htmlContent = this.editorParseService.schema2html(schema);
        return {
            ...schema,
            ...htmlContent,
        };
    }

    private _publishReviewTask(
        reviewTaskMachine: any,
        nameSpace: string,
        machine: Machine,
        data_hash: string,
        reportModel: string
    ) {
        const loggedInUser = this.req.user;
        const userRole = loggedInUser.role as Record<string, Roles>;

        if (
            reviewTaskMachine.machine.value === "published" &&
            reportModel !== ReportModelEnum.Request
        ) {
            if (
                userRole[nameSpace] !== Roles.Admin &&
                userRole[nameSpace] !== Roles.SuperAdmin &&
                loggedInUser._id !==
                    machine.context.reviewData.reviewerId.toString()
            ) {
                this.logger.warn(
                    `[ReviewTask] Publish denied for data_hash=${data_hash}: ` +
                        `user=${loggedInUser._id} role="${userRole[nameSpace]}" ` +
                        `is not reviewer (${machine.context.reviewData.reviewerId}) and not admin`
                );
                throw new ForbiddenException(
                    "This user does not have permission to publish the report"
                );
            }
            this.logger.log(
                `[ReviewTask] Publishing report: data_hash=${data_hash}, ` +
                    `reportModel=${reportModel}, publishedBy=${loggedInUser._id}`
            );
            void this.effects.createReportAndClaimReview(
                data_hash,
                reviewTaskMachine.machine,
                reportModel,
                nameSpace,
                reviewTaskMachine.target,
                reviewTaskMachine.reviewTaskType
            );
        }
    }

    async cascadeUpdateDataHash(
        oldHash: string,
        newHash: string,
        claimId: Types.ObjectId | string,
        session: ClientSession
    ): Promise<number> {
        const result = await this.ReviewTaskModel.updateMany(
            { data_hash: oldHash, target: claimId, onModel: "Claim" },
            { $set: { data_hash: newHash } },
            { session }
        );
        return result.modifiedCount ?? 0;
    }
}
