import { Injectable, Inject, Scope, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { Claim, ClaimDocument } from "../claim/schemas/claim.schema";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ClaimRevisionService } from "../claim-revision/claim-revision.service";
import { HistoryService } from "../history/history.service";
import { StateEventService } from "../state-event/state-event.service";
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { TypeModel } from "../state-event/schema/state-event.schema";
import { ISoftDeletedModel } from "mongoose-softdelete-typescript";
import { REQUEST } from "@nestjs/core";
import { BaseRequest } from "../types";
import { ContentModelEnum } from "../claim-revision/schema/claim-revision.schema";

type ClaimMatchParameters = (
    | { _id: string }
    | { personality: string; slug: string }
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
        private claimRevisionService: ClaimRevisionService
    ) {}

    async listAll(page, pageSize, order, query) {
        query.personality = query.personality
            ? Types.ObjectId(query.personality)
            : null;

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

    count(query: any = {}) {
        return this.ClaimModel.countDocuments().where(query);
    }

    /**
     * This function will create a new claim and claim Revision and save it to the dataBase.
     * Also creates a History Module that tracks creation of claims.
     * @param claim ClaimBody received of the client.
     * @returns Return a new claim object.
     */
    async create(claim) {
        if (Array.isArray(claim.personality)) {
            claim.personality = claim.personality.map((personality) => {
                return Types.ObjectId(personality);
            });
        } else {
            claim.personality = claim.personality
                ? Types.ObjectId(claim.personality)
                : null;
        }
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
        const claim = await this._getClaim({ _id: claimId }, undefined, false);
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

    async getById(claimId) {
        return this._getClaim({ _id: claimId });
    }

    async getByPersonalityIdAndClaimSlug(
        personalityId,
        claimSlug,
        revisionId = undefined,
        population = true
    ) {
        return this._getClaim(
            { personality: personalityId, slug: claimSlug },
            revisionId,
            true,
            population
        );
    }

    private async _getClaim(
        match: ClaimMatchParameters,
        revisionId = undefined,
        postprocess = true,
        population = true
    ) {
        let claim;
        if (revisionId) {
            const rawClaim = await this.ClaimModel.findOne(match).select({
                latestRevision: 0,
            });
            // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
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
                    .populate("personality", "_id name")
                    .populate("sources", "_id link")
                    .populate("latestRevision")
                    .lean();
            } else {
                const foundClaim = await this.ClaimModel.findOne(
                    match,
                    "_id personality latestRevision"
                )
                    .populate("personality", "_id name")
                    .populate("sources", "_id link")
                    .populate({
                        path: "latestRevision",
                        select: { title: 1, contentModel: 1, date: 1, slug: 1 },
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

            processedClaim.content =
                processedClaim.contentModel === ContentModelEnum.Speech
                    ? processedClaim.content[0].content
                    : processedClaim.content[0];

            if (processedClaim?.content) {
                processedClaim.content = this.transformContentObject(
                    processedClaim.content,
                    reviews
                );
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
            } else {
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

    private transformContentObject(claimContent, reviews) {
        if (!claimContent || reviews.length <= 0) {
            return claimContent;
        }
        if (claimContent.type === "image") {
            const claimReview = reviews.find((review) => {
                return review._id.data_hash === claimContent.data_hash;
            });
            if (claimReview) {
                claimContent.props = Object.assign(claimContent.props, {
                    classification: claimReview._id.classification[0],
                });
            }
        } else {
            claimContent.forEach((paragraph, paragraphIndex) => {
                paragraph.content.forEach((sentence, sentenceIndex) => {
                    const claimReview = reviews.find((review) => {
                        return review._id.data_hash === sentence.data_hash;
                    });
                    if (claimReview) {
                        claimContent[paragraphIndex].content[
                            sentenceIndex
                        ].props = Object.assign(sentence.props, {
                            classification: claimReview._id.classification[0],
                        });
                    }
                });
            });
        }

        return claimContent;
    }
}
