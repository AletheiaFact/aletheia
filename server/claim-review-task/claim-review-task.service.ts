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
import { ContentModelEnum } from "../types/enums";
import lookupUsers from "../mongo-pipelines/lookupUsers";
import lookUpPersonalityties from "../mongo-pipelines/lookUpPersonalityties";
import lookupClaims from "../mongo-pipelines/lookupClaims";
import lookupClaimReviews from "../mongo-pipelines/lookupClaimReviews";
import lookupClaimRevisions from "../mongo-pipelines/lookupClaimRevisions";
import { EditorParseService } from "../editor-parse/editor-parse.service";

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
        private editorParseService: EditorParseService
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

    _buildPipeline(value, filterUser) {
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
            })
        );

        this._verifyMachineValueAndAddMatchPipeline(pipeline, value);

        return pipeline;
    }

    async listAll(page, pageSize, order, value, filterUser) {
        const pipeline = this._buildPipeline(value, filterUser);
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

                let reviewHref = contentModelPathMap[contentModel];

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

    async _createReportAndClaimReview(data_hash, machine) {
        const claimReviewData = machine.context.claimReview;

        const newReport = Object.assign(machine.context.reviewData, {
            data_hash,
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

    async create(claimReviewTaskBody: CreateClaimReviewTaskDTO) {
        const claimReviewTask = await this.getClaimReviewTaskByDataHash(
            claimReviewTaskBody.data_hash
        );

        claimReviewTaskBody.machine.context.reviewData.usersId =
            claimReviewTaskBody.machine.context.reviewData.usersId.map(
                (userId) => {
                    return Types.ObjectId(userId);
                }
            );

        if (claimReviewTaskBody.machine.context.reviewData.reviewerId) {
            claimReviewTaskBody.machine.context.reviewData.reviewerId =
                Types.ObjectId(
                    claimReviewTaskBody.machine.context.reviewData.reviewerId
                ) || "";
        }

        if (claimReviewTask) {
            return this.update(
                claimReviewTaskBody.data_hash,
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

    async update(
        data_hash: string,
        { machine }: UpdateClaimReviewTaskDTO,
        history: boolean = true
    ) {
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

        const loggedInUser = this.req.user;

        if (newClaimReviewTaskMachine.value === "published") {
            if (
                loggedInUser.role !== Roles.Admin &&
                loggedInUser.role !== Roles.SuperAdmin &&
                loggedInUser._id !==
                    machine.context.reviewData.reviewerId.toString()
            ) {
                throw new ForbiddenException(
                    "This user does not have permission to publish the report"
                );
            }
            this._createReportAndClaimReview(
                data_hash,
                newClaimReviewTask.machine
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
        return this.ClaimReviewTaskModel.findOne({
            data_hash,
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

    async countReviewTasksNotDeleted(query, filterUser) {
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
                        { $project: { isDeleted: 1 } },
                    ],
                    as: "machine.context.claimReview.claim",
                }),
                {
                    $match: {
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

    getEditorContentObject(schema) {
        return this.editorParseService.schema2editor(schema);
    }

    async getHtmlFromSchema(schema) {
        const htmlContent = this.editorParseService.schema2html(schema);
        return {
            ...schema,
            ...htmlContent,
        };
    }
}
