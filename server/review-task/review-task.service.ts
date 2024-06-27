import { ForbiddenException, Inject, Injectable, Scope } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { ReviewTask, ReviewTaskDocument } from "./schemas/review-task.schema";
import { InjectModel } from "@nestjs/mongoose";
import { CreateReviewTaskDTO } from "./dto/create-review-task.dto";
import { UpdateReviewTaskDTO } from "./dto/update-review-task.dto";
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
import { ContentModelEnum, ReportModelEnum } from "../types/enums";
import lookupUsers from "../mongo-pipelines/lookupUsers";
import lookUpPersonalityties from "../mongo-pipelines/lookUpPersonalityties";
import lookupClaims from "../mongo-pipelines/lookupClaims";
import lookupClaimReviews from "../mongo-pipelines/lookupClaimReviews";
import lookupClaimRevisions from "../mongo-pipelines/lookupClaimRevisions";
import { EditorParseService } from "../editor-parse/editor-parse.service";
import { CommentService } from "./comment/comment.service";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { CommentEnum } from "./comment/schema/comment.schema";

@Injectable({ scope: Scope.REQUEST })
export class ReviewTaskService {
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
    ) {}

    _verifyMachineValueAndAddMatchPipeline(pipeline, value) {
        if (value === "published") {
            pipeline.push(
                lookupClaimReviews({
                    as: "machine.context.claimReview.claimReview",
                }),
                { $unwind: "$machine.context.claimReview.claimReview" },
                {
                    $match: {
                        "machine.context.claimReview.claimReview.isDeleted":
                            false,
                        "machine.context.claimReview.claim.isDeleted": false,
                    },
                }
            );
        } else {
            pipeline.push({
                $match: {
                    "machine.context.claimReview.claim.isDeleted": false,
                },
            });
        }
    }

    _buildPipeline(value, filterUser, nameSpace) {
        const pipeline = [];
        const query = getQueryMatchForMachineValue(value);
        const fieldMap = {
            assigned: "machine.context.reviewData.usersId",
            crossChecked: "machine.context.reviewData.crossCheckerId",
            reviewed: "machine.context.reviewData.reviewerId",
        };

        Object.keys(filterUser).forEach((key) => {
            const value = filterUser[key];
            if (value === true || value === "true") {
                const queryPath = fieldMap[key];
                query[queryPath] = Types.ObjectId(this.req.user._id);
            }
        });

        pipeline.push(
            { $match: query },
            lookupUsers(),
            lookUpPersonalityties(TargetModel.ReviewTask),
            lookupClaims(TargetModel.ReviewTask, {
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$claimId"] } } },
                    lookupClaimRevisions(TargetModel.ReviewTask),
                    { $unwind: "$latestRevision" },
                ],
                as: "machine.context.claimReview.claim",
            }),
            {
                $match: {
                    "machine.context.claimReview.claim.nameSpace": nameSpace,
                },
            }
        );

        this._verifyMachineValueAndAddMatchPipeline(pipeline, value);

        return pipeline;
    }

    async listAll(page, pageSize, order, value, filterUser, nameSpace) {
        const pipeline = this._buildPipeline(value, filterUser, nameSpace);
        pipeline.push(
            { $sort: { _id: order === "asc" ? 1 : -1 } },
            { $skip: page * pageSize },
            { $limit: pageSize }
        );

        const reviewTasks = await this.ReviewTaskModel.aggregate(
            pipeline
        ).exec();

        return Promise.all(
            reviewTasks?.map(async ({ data_hash, machine }) => {
                const {
                    personality: [personality],
                    claim: [claim],
                }: any = machine.context.claimReview;
                const { title, contentModel } = claim.latestRevision;
                const isContentImage = contentModel === ContentModelEnum.Image;

                const personalityPath = `/personality/${personality?.slug}`;

                const contentModelPathMap = {
                    [ContentModelEnum.Debate]: `/claim/${claim?._id}/debate`,
                    [ContentModelEnum.Image]: personality
                        ? `${personalityPath}/claim/${claim?.slug}/${claim?._id}`
                        : `/claim/${claim?._id}`,
                    [ContentModelEnum.Speech]: `${personalityPath}/claim/${claim?.slug}/sentence/${data_hash}`,
                };

                let reviewHref =
                    nameSpace !== NameSpaceEnum.Main
                        ? `/${nameSpace}${contentModelPathMap[contentModel]}`
                        : contentModelPathMap[contentModel];

                const usersName = machine.context.reviewData.users.map(
                    (user) => {
                        return user.name;
                    }
                );

                const content = isContentImage
                    ? await this.imageService.getByDataHash(data_hash)
                    : await this.sentenceService.getByDataHash(data_hash);

                return {
                    content,
                    usersName,
                    value: machine.value,
                    personalityName: personality?.name,
                    claimTitle: title,
                    claimId: claim._id,
                    personalityId: personality?._id,
                    reviewHref,
                    contentModel,
                };
            })
        );
    }

    getById(reviewTaskId: string) {
        return this.ReviewTaskModel.findById(reviewTaskId);
    }

    _createReviewTaskHistory(newReviewTask, previousReviewTask = null) {
        let historyType;

        if (typeof newReviewTask.machine.value === "object") {
            historyType =
                newReviewTask.machine.value?.[
                    Object.keys(newReviewTask.machine.value)[0]
                ] === "draft"
                    ? HistoryType.Draft
                    : Object.keys(newReviewTask.machine.value)[0];
        }

        const user = this.req.user;

        const history = this.historyService.getHistoryParams(
            newReviewTask._id,
            TargetModel.ReviewTask,
            user,
            historyType || HistoryType.Published,
            {
                ...newReviewTask.machine.context.reviewData,
                ...newReviewTask.machine.context.claimReview.claim,
                value: newReviewTask.machine.value,
            },
            previousReviewTask && {
                ...previousReviewTask.machine.context.reviewData,
                ...previousReviewTask.machine.context.claimReview.claim,
                value: previousReviewTask.machine.value,
            }
        );

        this.historyService.createHistory(history);
    }

    _createStateEvent(newReviewTask) {
        let typeModel;
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
            Types.ObjectId(newReviewTask.machine.context.claimReview.claim),
            typeModel || TypeModel.Published,
            draft,
            newReviewTask._id
        );

        this.stateEventService.createStateEvent(stateEvent);
    }

    async _createReportAndClaimReview(
        data_hash,
        machine,
        reportModel,
        nameSpace
    ) {
        const claimReviewData = machine.context.claimReview;

        const newReport = Object.assign(machine.context.reviewData, {
            data_hash,
            reportModel,
        });

        const report = await this.reportService.create(newReport);

        this.claimReviewService.create(
            {
                ...claimReviewData,
                report,
                nameSpace,
            },
            data_hash,
            reportModel
        );
    }

    _returnObjectId(data): any {
        if (Array.isArray(data)) {
            return data.map((item) =>
                item._id ? Types.ObjectId(item._id) || "" : Types.ObjectId(item)
            );
        }
    }

    _createCrossCheckingComment(comment, text, targetId) {
        const newCrossCheckingComment = {
            comment,
            text,
            type: CommentEnum.crossChecking,
            targetId,
            user: this.req.user._id,
        };
        return this.commentService.create(newCrossCheckingComment);
    }

    async create(reviewTaskBody: CreateReviewTaskDTO) {
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
                Types.ObjectId(reviewDataBody.reviewerId) || "";
        }

        if (reviewDataBody.crossCheckerId) {
            reviewTaskBody.machine.context.reviewData.crossCheckerId =
                Types.ObjectId(reviewDataBody.crossCheckerId) || "";
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
                reviewDataBody.crossCheckingComment,
                reviewDataBody.crossCheckingClassification,
                reviewTask._id
            );
            reviewTaskBody.machine.context.reviewData.crossCheckingComments.push(
                crossCheckingComment._id
            );
        }

        if (reviewTask) {
            return this.update(
                reviewTaskBody.data_hash,
                reviewTaskBody,
                reviewTaskBody.nameSpace,
                reviewTask.reportModel
            );
        } else {
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
    ) {
        // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
        const reviewTask = await this.getReviewTaskByDataHash(data_hash);

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
            machine,
            data_hash,
            reportModel
        );

        if (history) {
            this._createReviewTaskHistory(newReviewTask, reviewTask);
            this._createStateEvent(newReviewTask);
        }

        return this.ReviewTaskModel.updateOne(
            { _id: newReviewTask._id },
            newReviewTask
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

    async getReviewTasksByClaimId(claimId: string) {
        return await this.ReviewTaskModel.aggregate([
            {
                $match: {
                    "machine.context.claimReview.claim": claimId.toString(),
                    "machine.value": { $ne: "published" },
                },
            },
        ]);
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
            const preloadedAsignees = [];
            const usersId = [];
            reviewTask.machine.context.reviewData.usersId.forEach(
                (assignee) => {
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

    async countReviewTasksNotDeleted(query, filterUser, nameSpace) {
        try {
            const fieldMap = {
                assigned: "machine.context.reviewData.usersId",
                crossChecked: "machine.context.reviewData.crossCheckerId",
                reviewed: "machine.context.reviewData.reviewerId",
            };

            Object.keys(filterUser).forEach((key) => {
                const value = filterUser[key];
                if (value === true || value === "true") {
                    const queryPath = fieldMap[key];
                    query[queryPath] = Types.ObjectId(this.req.user._id);
                }
            });

            const pipeline = [
                { $match: query },
                lookupClaimReviews({
                    as: "machine.context.claimReview.claimReview",
                }),
                lookupClaims(TargetModel.ReviewTask, {
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$claimId"] } } },
                        { $project: { isDeleted: 1, nameSpace: 1 } },
                    ],
                    as: "machine.context.claimReview.claim",
                }),
                {
                    $match: {
                        "machine.context.claimReview.claim.nameSpace":
                            nameSpace,
                        "machine.context.claimReview.claimReview.isDeleted": {
                            $ne: true,
                        },
                        "machine.context.claimReview.claim.isDeleted": {
                            $ne: true,
                        },
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
            console.error("Error in countReviewTasksNotDeleted:", error);
            throw error;
        }
    }

    getEditorContentObject(schema, reportModel, reviewTaskType) {
        return this.editorParseService.schema2editor(
            schema,
            reportModel,
            reviewTaskType
        );
    }

    async addComment(data_hash, comment) {
        const reviewTask = await this.getReviewTaskByDataHash(data_hash);
        const reviewData = reviewTask.machine.context.reviewData;
        const newComment = await this.commentService.create({
            ...comment,
            targetId: reviewTask._id,
        });

        if (!reviewData.reviewComments) {
            reviewData.reviewComments = [];
        }

        reviewData.reviewComments.push(Types.ObjectId(newComment?._id));

        const { machine } = await this.ReviewTaskModel.findOneAndUpdate(
            { _id: reviewTask._id },
            { "machine.context.reviewData": reviewData },
            { new: true }
        );

        return {
            reviewData: machine.context.reviewData,
            comment: newComment,
        };
    }

    async deleteComment(data_hash, commentId) {
        const commentIdObject = Types.ObjectId(commentId);
        const reviewTask = await this.getReviewTaskByDataHash(data_hash);
        const reviewData = reviewTask.machine.context.reviewData;
        reviewData.reviewComments = reviewData.reviewComments.filter(
            (comment) => !comment._id.equals(commentIdObject)
        );
        reviewData.reviewComments = reviewData.crossCheckingComments.filter(
            (comment) => !comment._id.equals(commentIdObject)
        );

        return this.ReviewTaskModel.findByIdAndUpdate(reviewTask._id, {
            "machine.context.reviewData": reviewData,
        });
    }

    async getHtmlFromSchema(schema) {
        const htmlContent = this.editorParseService.schema2html(schema);
        return {
            ...schema,
            ...htmlContent,
        };
    }

    private _publishReviewTask(
        reviewTaskMachine,
        nameSpace,
        machine,
        data_hash,
        reportModel
    ) {
        const loggedInUser = this.req.user;

        if (
            reviewTaskMachine.value === "published" &&
            reportModel !== ReportModelEnum.Request
        ) {
            if (
                loggedInUser.role[nameSpace] !== Roles.Admin &&
                loggedInUser.role[nameSpace] !== Roles.SuperAdmin &&
                loggedInUser._id !==
                    machine.context.reviewData.reviewerId.toString()
            ) {
                throw new ForbiddenException(
                    "This user does not have permission to publish the report"
                );
            }
            this._createReportAndClaimReview(
                data_hash,
                reviewTaskMachine.machine,
                reportModel,
                nameSpace
            );
        }
    }
}
