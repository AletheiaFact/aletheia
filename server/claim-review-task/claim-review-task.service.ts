import { ForbiddenException, Inject, Injectable, Scope } from "@nestjs/common";
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
export class ClaimReviewTaskService {
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(ClaimReviewTask.name)
        private ClaimReviewTaskModel: Model<ClaimReviewTaskDocument>,
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

        if (filterUser === true) {
            query["machine.context.reviewData.usersId"] = Types.ObjectId(
                this.req.user._id
            );
        }

        pipeline.push(
            { $match: query },
            lookupUsers(),
            lookUpPersonalityties(TargetModel.ClaimReviewTask),
            lookupClaims(TargetModel.ClaimReviewTask, {
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$claimId"] } } },
                    lookupClaimRevisions(TargetModel.ClaimReviewTask),
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

        const reviewTasks = await this.ClaimReviewTaskModel.aggregate(
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

    async _createReportAndClaimReview(data_hash, machine, reportModel) {
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
            },
            data_hash
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

    async create(claimReviewTaskBody: CreateClaimReviewTaskDTO) {
        const reviewDataBody = claimReviewTaskBody.machine.context.reviewData;
        const claimReviewTask = await this.getClaimReviewTaskByDataHash(
            claimReviewTaskBody.data_hash
        );

        const createCrossCheckingComment =
            claimReviewTask?.machine?.value === "addCommentCrossChecking" &&
            reviewDataBody.crossCheckingClassification &&
            reviewDataBody.crossCheckingComment;

        claimReviewTaskBody.machine.context.reviewData.usersId =
            this._returnObjectId(reviewDataBody.usersId);

        if (reviewDataBody.reviewerId) {
            claimReviewTaskBody.machine.context.reviewData.reviewerId =
                Types.ObjectId(reviewDataBody.reviewerId) || "";
        }

        if (reviewDataBody.crossCheckerId) {
            claimReviewTaskBody.machine.context.reviewData.crossCheckerId =
                Types.ObjectId(reviewDataBody.crossCheckerId) || "";
        }

        if (reviewDataBody.reviewComments) {
            this.commentService.updateManyComments(
                reviewDataBody.reviewComments
            );
            claimReviewTaskBody.machine.context.reviewData.reviewComments =
                this._returnObjectId(reviewDataBody.reviewComments);
        }

        if (reviewDataBody.crossCheckingComments) {
            claimReviewTaskBody.machine.context.reviewData.crossCheckingComments =
                this._returnObjectId(reviewDataBody.crossCheckingComments);
        }

        if (createCrossCheckingComment) {
            const crossCheckingComment = await this._createCrossCheckingComment(
                reviewDataBody.crossCheckingComment,
                reviewDataBody.crossCheckingClassification,
                claimReviewTask._id
            );
            claimReviewTaskBody.machine.context.reviewData.crossCheckingComments.push(
                crossCheckingComment._id
            );
        }

        if (claimReviewTask) {
            return this.update(
                claimReviewTaskBody.data_hash,
                claimReviewTask.reportModel,
                claimReviewTaskBody,
                claimReviewTaskBody.nameSpace
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

    async update(
        data_hash: string,
        reportModel: ReportModelEnum,
        { machine }: UpdateClaimReviewTaskDTO,
        nameSpace: string,
        history: boolean = true
    ) {
        const loggedInUser = this.req.user;
        // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
        const claimReviewTask = await this.getClaimReviewTaskByDataHash(
            data_hash
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
                newClaimReviewTask.machine,
                reportModel
            );
        }

        if (history) {
            this._createReviewTaskHistory(newClaimReviewTask, claimReviewTask);
            this._createStateEvent(newClaimReviewTask);
        }

        return this.ClaimReviewTaskModel.updateOne(
            { _id: newClaimReviewTask._id },
            newClaimReviewTask
        );
    }

    getClaimReviewTaskByDataHash(data_hash: string) {
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

        return this.ClaimReviewTaskModel.findOne({ data_hash })
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
        return await this.ClaimReviewTaskModel.aggregate([
            {
                $match: {
                    "machine.context.claimReview.claim": claimId.toString(),
                    "machine.value": { $ne: "published" },
                },
            },
        ]);
    }

    async getClaimReviewTaskByDataHashWithUsernames(data_hash: string) {
        // This may cause a false positive in sonarCloud
        const claimReviewTask = await this.getClaimReviewTaskByDataHash(
            data_hash
        )
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

        if (claimReviewTask) {
            const preloadedAsignees = [];
            const usersId = [];
            claimReviewTask.machine.context.reviewData.usersId.forEach(
                (assignee) => {
                    preloadedAsignees.push({
                        value: assignee._id,
                        label: assignee.name,
                    });
                    usersId.push(assignee._id);
                }
            );
            claimReviewTask.machine.context.reviewData.usersId = usersId;
            claimReviewTask.machine.context.preloadedOptions = {
                usersId: preloadedAsignees,
            };

            if (claimReviewTask.machine.context.reviewData.crossCheckerId) {
                const crossCheckerUser =
                    claimReviewTask.machine.context.reviewData.crossCheckerId;
                claimReviewTask.machine.context.preloadedOptions.crossCheckerId =
                    [
                        {
                            value: crossCheckerUser._id,
                            label: crossCheckerUser.name,
                        },
                    ];
                claimReviewTask.machine.context.reviewData.crossCheckerId =
                    crossCheckerUser._id;
            }

            if (claimReviewTask.machine.context.reviewData.reviewerId) {
                const reviewerUser =
                    claimReviewTask.machine.context.reviewData.reviewerId;
                claimReviewTask.machine.context.preloadedOptions.reviewerId = [
                    {
                        value: reviewerUser._id,
                        label: reviewerUser.name,
                    },
                ];
                claimReviewTask.machine.context.reviewData.reviewerId =
                    reviewerUser._id;
            }
        }

        return claimReviewTask;
    }

    count(query: any = {}) {
        return this.ClaimReviewTaskModel.countDocuments().where(query);
    }

    async countReviewTasksNotDeleted(query, filterUser, nameSpace) {
        try {
            if (filterUser === true) {
                query["machine.context.reviewData.usersId"] = Types.ObjectId(
                    this.req.user._id
                );
            }

            const pipeline = [
                { $match: query },
                lookupClaimReviews({
                    as: "machine.context.claimReview.claimReview",
                }),
                lookupClaims(TargetModel.ClaimReviewTask, {
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

            const result = await this.ClaimReviewTaskModel.aggregate(
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

    getEditorContentObject(schema, reportModel) {
        return this.editorParseService.schema2editor(schema, reportModel);
    }

    async addComment(data_hash, comment) {
        const claimReviewTask = await this.getClaimReviewTaskByDataHash(
            data_hash
        );
        const reviewData = claimReviewTask.machine.context.reviewData;
        const newComment = await this.commentService.create({
            ...comment,
            targetId: claimReviewTask._id,
        });

        if (!reviewData.reviewComments) {
            reviewData.reviewComments = [];
        }

        reviewData.reviewComments.push(Types.ObjectId(newComment?._id));

        const { machine } = await this.ClaimReviewTaskModel.findOneAndUpdate(
            { _id: claimReviewTask._id },
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
        const claimReviewTask = await this.getClaimReviewTaskByDataHash(
            data_hash
        );
        const reviewData = claimReviewTask.machine.context.reviewData;
        reviewData.reviewComments = reviewData.reviewComments.filter(
            (comment) => !comment._id.equals(commentIdObject)
        );
        reviewData.reviewComments = reviewData.crossCheckingComments.filter(
            (comment) => !comment._id.equals(commentIdObject)
        );

        return this.ClaimReviewTaskModel.findByIdAndUpdate(
            claimReviewTask._id,
            { "machine.context.reviewData": reviewData }
        );
    }

    async getHtmlFromSchema(schema) {
        const htmlContent = this.editorParseService.schema2html(schema);
        return {
            ...schema,
            ...htmlContent,
        };
    }
}
