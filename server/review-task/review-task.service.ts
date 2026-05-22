import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    Scope,
    Logger,
    UnauthorizedException,
} from "@nestjs/common";
import { Model, Types, UpdateWriteOpResult } from "mongoose";
import { ReviewTask, ReviewTaskDocument } from "./schemas/review-task.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateReviewTaskDTO, Machine } from "./dto/create-review-task.dto";
import { UpdateReviewTaskDTO } from "./dto/update-review-task.dto";
import { SaveDraftDTO } from "./dto/save-draft.dto";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReportService } from "../report/report.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { HistoryService } from "../history/history.service";
import { StateEventService } from "../state-event/state-event.service";
import { TypeModel } from "../state-event/schema/state-event.schema";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../types";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { getQueryMatchForMachineValue } from "./mongo-utils";
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
import { Sentence } from "../claim/types/sentence/schemas/sentence.schema";
import { Source } from "../source/schemas/source.schema";

interface IListAllQuery {
    value: any;
    filterUser: { assigned: boolean; crossChecked: boolean; reviewed: boolean };
    nameSpace: string;
    reviewTaskType: ReviewTaskTypeEnum;
    page: number;
    pageSize: number;
    order: string | number;
}

interface IPostProcess {
    data_hash: string;
    machine: Machine;
    target: any; // TODO: Type this properly as Claim | VerificationRequest
    reviewTaskType: ReviewTaskTypeEnum;
}

export interface IReviewTask {
    content: Source | Sentence | Image;
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
        private claimReviewService: ClaimReviewService,
        private reportService: ReportService,
        private historyService: HistoryService,
        private stateEventService: StateEventService,
        private sentenceService: SentenceService,
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
        filterUser: Record<string, boolean | string>
    ): Record<string, any> {
        const query = getQueryMatchForMachineValue(value);

        Object.keys(filterUser).forEach((key) => {
            const filterValue = filterUser[key];
            if (filterValue === true || filterValue === "true") {
                const queryPath = this.fieldMap[key];
                query[queryPath] = new Types.ObjectId(this.req.user._id);
            }
        });

        return query;
    }

    _verifyMachineValueAndAddMatchPipeline(
        pipeline: any[],
        value: string,
        reviewTaskType: ReviewTaskTypeEnum
    ): number {
        if (
            value === "published" &&
            reviewTaskType !== ReviewTaskTypeEnum.VerificationRequest
        ) {
            return pipeline.push(
                {
                    $lookup: {
                        from: "claimreviews",
                        localField: "data_hash",
                        foreignField: "data_hash",
                        as: "machine.context.claimReview.claimReview",
                    },
                },
                { $unwind: "$machine.context.claimReview.claimReview" },
                {
                    $match: {
                        "machine.context.claimReview.claimReview.isDeleted":
                            false,
                        $or: [
                            { "target.isDeleted": false },
                            { "target.isDeleted": { $exists: false } },
                        ],
                    },
                }
            );
        }

        return pipeline.push({
            $match: {
                $or: [
                    { "target.isDeleted": false },
                    { "target.isDeleted": { $exists: false } },
                ],
            },
        });
    }

    buildLookupPipeline(reviewTaskType: ReviewTaskTypeEnum) {
        let pipeline: any[] = [
            {
                $match: {
                    $expr: {
                        $and: [
                            { $ne: ["$$targetId", null] },
                            { $eq: ["$_id", "$$targetId"] },
                        ],
                    },
                },
            },
        ];

        if (reviewTaskType === ReviewTaskTypeEnum.Claim) {
            pipeline.push(
                {
                    $lookup: {
                        from: "claimrevisions",
                        localField: "latestRevision",
                        foreignField: "_id",
                        as: "latestRevision",
                    },
                },
                { $unwind: "$latestRevision" }
            );
        }

        return pipeline;
    }

    _buildPipeline({
        value,
        filterUser,
        nameSpace,
        reviewTaskType,
    }: IListAllQuery): any[] {
        const pipeline: any[] = [];
        const query = this.getQueryObject(value, filterUser);

        pipeline.push(
            { $match: { ...query, reviewTaskType, nameSpace } },
            {
                $lookup: {
                    from: "users",
                    let: { usersId: "$machine.context.reviewData.usersId" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$usersId"] } } },
                        { $project: { name: 1 } },
                    ],
                    as: "machine.context.reviewData.usersId",
                },
            },
            {
                $lookup: {
                    from: "personalities",
                    let: {
                        personalityId: {
                            $let: {
                                vars: {
                                    personalityValue:
                                        "$machine.context.review.personality",
                                },
                                in: {
                                    $cond: [
                                        {
                                            $and: [
                                                {
                                                    $ne: [
                                                        "$$personalityValue",
                                                        null,
                                                    ],
                                                },
                                                {
                                                    $ne: [
                                                        "$$personalityValue",
                                                        "",
                                                    ],
                                                },
                                            ],
                                        },
                                        { $toObjectId: "$$personalityValue" },
                                        null,
                                    ],
                                },
                            },
                        },
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $ne: ["$$personalityId", null] },
                                        { $eq: ["$_id", "$$personalityId"] },
                                    ],
                                },
                            },
                        },
                        { $project: { slug: 1, name: 1, _id: 1 } },
                    ],
                    as: "machine.context.review.personality",
                },
            },
            {
                $unwind: {
                    path: "$machine.context.review.personality",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: `${reviewTaskType.toLowerCase()}s`,
                    let: {
                        targetId: {
                            $let: {
                                vars: { targetValue: "$target" },
                                in: {
                                    $cond: [
                                        {
                                            $and: [
                                                {
                                                    $ne: [
                                                        "$$targetValue",
                                                        null,
                                                    ],
                                                },
                                                { $ne: ["$$targetValue", ""] },
                                            ],
                                        },
                                        { $toObjectId: "$$targetValue" },
                                        null,
                                    ],
                                },
                            },
                        },
                    },
                    pipeline: this.buildLookupPipeline(reviewTaskType),
                    as: "target",
                },
            },
            { $unwind: { path: "$target", preserveNullAndEmptyArrays: true } }
        );

        this._verifyMachineValueAndAddMatchPipeline(
            pipeline,
            value,
            reviewTaskType
        );

        return pipeline;
    }

    async listAll(query: IListAllQuery): Promise<IReviewTask[]> {
        const pipeline = this._buildPipeline(query);
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

        let content: Source | Sentence | Image = target;

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

    async _createReviewTaskHistory(
        newReviewTask: any,
        previousReviewTask: any = null
    ) {
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

    _createStateEvent(newReviewTask: any) {
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

        this.stateEventService.createStateEvent(stateEvent as any);
    }

    async _createReportAndClaimReview(
        data_hash: string,
        machine: Machine,
        reportModel: string,
        nameSpace: string,
        target: any,
        targetModel: string
    ) {
        const reviewData = machine.context.review;

        const newReport = Object.assign(machine.context.reviewData, {
            data_hash,
            reportModel,
        });

        const report = await this.reportService.create(newReport);

        this.claimReviewService.create(
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
            this.commentService.updateManyComments(
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
            newReviewTask.save();
            this._createReviewTaskHistory(newReviewTask);
            this._createStateEvent(newReviewTask);
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
            this._createReviewTaskHistory(newReviewTask, reviewTask);
            this._createStateEvent(newReviewTask);
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
                    value: "assigned",
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
        reviewTaskType: ReviewTaskTypeEnum
    ): Promise<number> {
        try {
            const query: any = this.getQueryObject(value, filterUser);

            const pipeline: any[] = [
                { $match: { ...query, nameSpace, reviewTaskType } },
                {
                    $lookup: {
                        from: "claimreviews",
                        localField: "data_hash",
                        foreignField: "data_hash",
                        as: "machine.context.review.claimReview",
                    },
                },
                {
                    $lookup: {
                        from:
                            reviewTaskType === ReviewTaskTypeEnum.Claim
                                ? "claims"
                                : "sources",
                        let: { targetId: { $toObjectId: "$target" } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$targetId"] },
                                },
                            },
                            { $project: { isDeleted: 1 } },
                        ],
                        as: "target",
                    },
                },
                {
                    $match: {
                        "machine.context.review.claimReview.isDeleted": {
                            $ne: true,
                        },
                        $or: [
                            { "target.isDeleted": false },
                            { "target.isDeleted": { $exists: false } },
                        ],
                    },
                },
                { $count: "count" },
            ];

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
            this._createReportAndClaimReview(
                data_hash,
                reviewTaskMachine.machine,
                reportModel,
                nameSpace,
                reviewTaskMachine.target,
                reviewTaskMachine.reviewTaskType
            );
        }
    }
}
