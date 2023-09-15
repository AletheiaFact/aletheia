import { Injectable, Inject, Scope, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { Claim, ClaimDocument } from "../claim/schemas/claim.schema";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ClaimRevisionService } from "./claim-revision/claim-revision.service";
import { HistoryService } from "../history/history.service";
import { StateEventService } from "../state-event/state-event.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { TypeModel } from "../state-event/schema/state-event.schema";
import { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "../types";
import { ContentModelEnum } from "../types/enums";
import { ClaimReviewTaskService } from "../claim-review-task/claim-review-task.service";
import { UtilService } from "../util";

type ClaimMatchParameters = (
    | { _id: string; isHidden?: boolean }
    | { personalities: string; slug: string; isHidden?: boolean }
) &
    FilterQuery<ClaimDocument>;

@Injectable({ scope: Scope.REQUEST })
export class ClaimService {
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(Claim.name)
        private ClaimModel: ISoftDeletedModel<ClaimDocument> &
            Model<ClaimDocument>,
        private claimReviewService: ClaimReviewService,
        private historyService: HistoryService,
        private stateEventService: StateEventService,
        private claimRevisionService: ClaimRevisionService,
        private claimReviewTaskService: ClaimReviewTaskService,
        private util: UtilService
    ) {}

    async listAll(page, pageSize, order, query) {
        if (!query.isHidden) {
            // Modify query.personalities only if isHidden is false
            query.personalities = query.personalities
                ? Types.ObjectId(query.personalities)
                : [];
        }

        const claims = await this.ClaimModel.find(query)
            .populate("latestRevision")
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();

        return Promise.all(
            claims.map((claim) => {
                return this.postProcess({
                    ...claim.latestRevision,
                    ...claim,
                });
            })
        );
    }

    async count(query: any = {}) {
        const claims = await this.ClaimModel.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "personalities",
                    localField: "personalities",
                    foreignField: "_id",
                    as: "personalities",
                },
            },
            {
                $unwind: {
                    path: "$personalities",
                    preserveNullAndEmptyArrays: true,
                    includeArrayIndex: "arrayIndex",
                },
            },
            {
                $group: {
                    _id: "$_id",
                    doc: { $first: "$$ROOT" },
                },
            },
            {
                $replaceRoot: { newRoot: "$doc" },
            },
            {
                $match: {
                    $or: [
                        { "personalities.isHidden": { $ne: true } },
                        { personalities: { $exists: false } },
                    ],
                },
            },
            {
                $count: "totalCount",
            },
        ]);

        return claims.length > 0 ? claims[0].totalCount : 0;
    }

    /**
     * This function will create a new claim and claim Revision and save it to the dataBase.
     * Also creates a History Module that tracks creation of claims.
     * @param claim ClaimBody received of the client.
     * @returns Return a new claim object.
     */
    async create(claim) {
        claim.personalities = claim.personalities.map((personality) => {
            return Types.ObjectId(personality);
        });

        const newClaim = new this.ClaimModel(claim);
        const newClaimRevision = await this.claimRevisionService.create(
            newClaim._id,
            claim
        );
        newClaim.latestRevision = newClaimRevision._id;
        newClaim.slug = newClaimRevision.slug;

        const user = this.req.user;

        const history = this.historyService.getHistoryParams(
            newClaim._id,
            TargetModel.Claim,
            user,
            HistoryType.Create,
            newClaim.latestRevision
        );
        const stateEvent = this.stateEventService.getStateEventParams(
            newClaim._id,
            TypeModel.Claim
        );

        this.historyService.createHistory(history);
        this.stateEventService.createStateEvent(stateEvent);

        newClaim.save();
        return {
            ...newClaimRevision.toObject(),
            ...newClaim.toObject(),
        };
    }

    /**
     * This function creates a new claim with the old claim data
     * and overwrite with the new data, keeping data that hasn't changed.
     * Also creates a History Module that tracks updation of claims.
     * @param claimId Claim id which wants updated.
     * @param claimRevisionUpdate ClaimBody received of the client.
     * @returns Return a new claim object.
     */
    async update(claimId, claimRevisionUpdate) {
        const claim = await this._getClaim(
            { _id: claimId, isHidden: false },
            undefined,
            false
        );
        const previousRevision = claim.toObject().latestRevision;
        delete previousRevision._id;
        const newClaimRevision = await this.claimRevisionService.create(
            claim._id,
            {
                ...previousRevision,
                ...claimRevisionUpdate,
            }
        );
        claim.latestRevision = newClaimRevision._id;
        claim.slug = newClaimRevision.slug;

        const user = this.req.user;

        const history = this.historyService.getHistoryParams(
            claimId,
            TargetModel.Claim,
            user,
            HistoryType.Update,
            newClaimRevision,
            previousRevision
        );

        await this.historyService.createHistory(history);

        claim.save();
        return newClaimRevision;
    }

    /**
     * This function does a soft deletion, doesn't delete claim in DataBase,
     * but omit its in the front page
     * Also creates a History Module that tracks deletion of claims.
     * @param claimId Claim id which wants to delete
     * @returns Returns the claim with the param isDeleted equal to true
     */
    async delete(claimId) {
        const user = this.req.user;
        const previousClaim = await this.getById(claimId);
        const history = this.historyService.getHistoryParams(
            claimId,
            TargetModel.Claim,
            user,
            HistoryType.Delete,
            null,
            previousClaim
        );
        await this.historyService.createHistory(history);
        return this.ClaimModel.softDelete({ _id: claimId });
    }

    async hideOrUnhideClaim(claimId, isHidden, description) {
        try {
            const claim = await this.ClaimModel.findById(claimId);

            if (!claim) {
                throw new Error("Claim not found");
            }

            const newClaim = {
                ...claim.toObject(),
                isHidden,
            };

            const before = { isHidden: !isHidden };
            const after = isHidden ? { isHidden, description } : { isHidden };

            const history = this.historyService.getHistoryParams(
                newClaim._id,
                TargetModel.Claim,
                this.req?.user,
                isHidden ? HistoryType.Hide : HistoryType.Unhide,
                after,
                before
            );
            this.historyService.createHistory(history);

            return await this.ClaimModel.updateOne(
                { _id: claim._id },
                newClaim
            );
        } catch (e) {
            console.error(e);
            throw new NotFoundException();
        }
    }

    async getById(claimId) {
        return this._getClaim(
            this.util.getParamsBasedOnUserRole({ _id: claimId }, this.req)
        );
    }

    async getByPersonalityIdAndClaimSlug(
        personalityId,
        claimSlug,
        revisionId = undefined,
        population = true
    ) {
        const queryOptions = this.util.getParamsBasedOnUserRole(
            {
                personalities: personalityId,
                slug: claimSlug,
            },
            this.req
        );
        return this._getClaim(queryOptions, revisionId, true, population);
    }

    private async _getClaim(
        match: ClaimMatchParameters,
        revisionId = undefined,
        postprocess = true,
        population = true
    ) {
        try {
            let claim;
            if (revisionId) {
                const rawClaim = await this.ClaimModel.findOne(match).select({
                    latestRevision: 0,
                });

                const revision = await this.claimRevisionService.getRevision({
                    _id: revisionId,
                    claimId: rawClaim._id,
                });

                if (!revision || !rawClaim) {
                    throw new NotFoundException();
                }

                claim = {
                    ...rawClaim,
                    revision,
                };
            } else {
                if (population) {
                    claim = await this.ClaimModel.findOne(match)
                        .populate("personalities")
                        .populate("sources", "_id link")
                        .populate("latestRevision")
                        .lean();
                } else {
                    const foundClaim = await this.ClaimModel.findOne(
                        match,
                        "_id personalities latestRevision isHidden"
                    )
                        .populate("personalities", "_id name")
                        .populate("sources", "_id link")
                        .populate({
                            path: "latestRevision",
                            select: {
                                title: 1,
                                contentModel: 1,
                                date: 1,
                                slug: 1,
                            },
                        })
                        .lean();

                    claim = {
                        ...foundClaim.latestRevision,
                        ...foundClaim,
                        latestRevision: undefined,
                    };
                }
            }
            if (!claim) {
                throw new NotFoundException();
            }
            return postprocess === true && population === true
                ? this.postProcess(claim)
                : claim;
        } catch (e) {
            throw new NotFoundException();
        }
    }

    /**
     * This function merges claim, latestRevision and reviewStats data
     * @param claim claim from query
     * @returns return the claim with available revision and reviewStats data
     */
    private async postProcess(claim) {
        let processedClaim = {
            ...(claim?.latestRevision || claim?.revision),
            ...claim,
            latestRevision: undefined,
        };
        if (claim) {
            const reviews = await this.claimReviewService.getReviewsByClaimId(
                claim._id
            );
            const claimReviewTasks =
                await this.claimReviewTaskService.getReviewTasksByClaimId(
                    claim._id
                );

            processedClaim.content =
                processedClaim.contentModel === ContentModelEnum.Speech
                    ? processedClaim.content[0].content
                    : processedClaim.content[0];

            if (processedClaim?.content) {
                if (processedClaim?.contentModel === ContentModelEnum.Debate) {
                    processedClaim.content.content =
                        processedClaim.content.content.map((speech) => {
                            const content = this.transformContentObject(
                                speech.content,
                                reviews,
                                claimReviewTasks
                            );
                            return { ...speech, content };
                        });
                } else {
                    processedClaim.content = this.transformContentObject(
                        processedClaim.content,
                        reviews,
                        claimReviewTasks
                    );
                }
            }
            const reviewStats =
                await this.claimReviewService.getReviewStatsByClaimId(
                    claim._id
                );
            const overallStats = this.calculateOverallStats(processedClaim);
            const stats = { ...reviewStats, ...overallStats };
            processedClaim = Object.assign(processedClaim, { stats });
        }
        return processedClaim;
    }

    private calculateOverallStats(claim) {
        let totalClaims = 0;
        let totalClaimsReviewed = 0;

        if (claim?.content) {
            if (claim?.contentModel === ContentModelEnum.Image) {
                totalClaims += 1;
                if (claim.content.props.classification) {
                    totalClaimsReviewed++;
                }
            } else if (claim?.content.length > 0) {
                claim.content.forEach((p) => {
                    totalClaims += p.content.length;
                    p.content.forEach((sentence) => {
                        if (sentence.props.classification) {
                            totalClaimsReviewed++;
                        }
                    });
                }, 0);
            }
        }
        return {
            totalClaims,
            totalClaimsReviewed,
        };
    }

    private transformContentObject(claimContent, reviews, claimReviewTasks) {
        if (
            !claimContent ||
            (reviews.length <= 0 && claimReviewTasks.length <= 0)
        ) {
            return claimContent;
        }

        const processReview = (sentence, classification) => ({
            ...sentence,
            props: {
                ...sentence.props,
                classification,
            },
        });

        if (claimContent.type === ContentModelEnum.Image) {
            const claimReview = reviews.find(
                (review) => review._id.data_hash === claimContent.data_hash
            );

            if (claimReview) {
                claimContent.props = {
                    ...claimContent.props,
                    classification: claimReview._id.classification[0],
                };
            }
        } else {
            claimContent.forEach((paragraph, paragraphIndex) => {
                claimContent[paragraphIndex].content = paragraph.content.map(
                    (sentence) => {
                        const claimReview = reviews.find(
                            (review) =>
                                review?._id.data_hash === sentence.data_hash
                        );

                        if (claimReview) {
                            return processReview(
                                sentence,
                                claimReview._id.classification[0]
                            );
                        }

                        const claimReviewTask = claimReviewTasks.find(
                            (task) => task?.data_hash === sentence.data_hash
                        );

                        if (claimReviewTask) {
                            return processReview(sentence, "in-progress");
                        }

                        return sentence;
                    }
                );
            });
        }

        return claimContent;
    }
}
