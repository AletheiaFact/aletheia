import { Injectable, Inject, Logger, Scope, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { Claim, ClaimDocument } from "../claim/schemas/claim.schema";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ClaimRevisionService } from "../claim-revision/claim-revision.service";
import { HistoryService } from "../history/history.service"
import { HistoryType, TargetModel } from "../history/schema/history.schema";
import { ISoftDeletedModel } from 'mongoose-softdelete-typescript';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

type ClaimMatchParameters = ({ _id: string } | { personality: string, slug: string }) & FilterQuery<ClaimDocument>;

@Injectable({ scope: Scope.REQUEST })
export class ClaimService {
    private optionsToUpdate: { new: boolean; upsert: boolean };
    private readonly logger = new Logger("ClaimService");

    constructor(
        @Inject(REQUEST) private req: Request,
        @InjectModel(Claim.name)
        private ClaimModel: ISoftDeletedModel<ClaimDocument> & Model<ClaimDocument>,
        private claimReviewService: ClaimReviewService,
        private historyService: HistoryService,
        private claimRevisionService: ClaimRevisionService,
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    async listAll(page, pageSize, order, query) {
        if (query.personality) {
            query.personality = Types.ObjectId(query.personality)
        }
        const claims = await this.ClaimModel.find(query)
            .populate({ path: 'latestRevision', populate: { path: 'content', select: "content" } })
            .populate("speeches")
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();

        return Promise.all(
            claims.map(async (claim) => {
                // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
                return this.postProcess({
                    ...claim.latestRevision,
                    ...claim
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
        claim.personality = Types.ObjectId(claim.personality);
        const newClaim = new this.ClaimModel(claim);
        const newClaimRevision = await this.claimRevisionService.create(newClaim._id, claim)
        newClaim.latestRevision = newClaimRevision._id
        newClaim.slug = newClaimRevision.slug

        const user = this.req.user

        const history =
            this.historyService.getHistoryParams(
                newClaim._id,
                TargetModel.Claim,
                user,
                HistoryType.Create,
                newClaim.latestRevision
            )
        await this.historyService.createHistory(history)

        newClaim.save();

        return {
            ...newClaim.toObject(),
            ...newClaimRevision.toObject()
        }
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
        const previousRevision = claim.toObject().latestRevision
        delete previousRevision._id
        const newClaimRevision =
            await this.claimRevisionService.create(claim._id, {
                ...previousRevision,
                ...claimRevisionUpdate
            })
        claim.latestRevision = newClaimRevision._id
        claim.slug = newClaimRevision.slug

        const user = this.req.user

        const history =
            this.historyService.getHistoryParams(
                claimId,
                TargetModel.Claim,
                user,
                HistoryType.Update,
                newClaimRevision,
                previousRevision
            )
        await this.historyService.createHistory(history)

        claim.save()
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
        const user = this.req.user
        const previousClaim = await this.getById(claimId)
        const history = this.historyService.getHistoryParams(
            claimId,
            TargetModel.Claim,
            user,
            HistoryType.Delete,
            null,
            previousClaim
        )
        await this.historyService.createHistory(history)
        return this.ClaimModel.softDelete({ _id: claimId });
    }

    // TODO: add optional revisionId that will fetch a specifc revision that matches
    async getById(claimId) {
        return this._getClaim({_id: claimId})
    }

    async getByPersonalityIdAndClaimSlug(personalityId, claimSlug, revisionId = undefined) {
        return this._getClaim({personality: personalityId, slug: claimSlug}, revisionId)
    }

    private async _getClaim(match: ClaimMatchParameters, revisionId = undefined, postprocess = true) {
        let claim
        if(revisionId) {
            const rawClaim = await this.ClaimModel.aggregate([
                { $match: match },
                { $project: { "latestRevision": 0}}
            ])
            // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
            const revision = (await this.claimRevisionService.getRevision(revisionId)).toObject()
            claim = {
                ...rawClaim[0],
                revision
            }
        } else {
            // This line may cause a false positive in sonarCloud because if we remove the await, we cannot iterate through the results
            claim = await this.ClaimModel.findOne(match)
                .populate("personality", "_id name")
                .populate("sources", "_id link classification")
                .populate({ path: 'latestRevision', populate: { path: 'content', select: "content" } })
            claim = claim.toObject()
        }
        if (!claim) {
            throw new NotFoundException()
        }
        return postprocess === true ? this.postProcess(claim) : claim;
    }

    /**
     * This function return all personality claims
     * @param claim all personality claims
     * @returns return all claims
     */
    private async postProcess(claim) {
        // TODO: we should not transform the object in this function
        claim = {
            ...(claim?.latestRevision || claim?.revision),
            ...claim,
            latestRevision: undefined
        }
        const reviews = await this.claimReviewService.getReviewsByClaimId(
            claim._id
        );

        claim.content = claim.content[0].content
        
        if (claim) {
            if (claim?.content?.object) {
                claim.content.object = this.transformContentObject(
                    claim.content.object,
                    reviews
                );
            }
            const reviewStats =
                await this.claimReviewService.getReviewStatsByClaimId(
                    claim._id
                );
            const overallStats = this.calculateOverallStats(claim);
            const stats = { ...reviewStats, ...overallStats };
            claim = Object.assign(claim, { stats });
        }
        return claim;
    }

    private calculateOverallStats(claim) {
        let totalClaims = 0;
        let totalClaimsReviewed = 0;
        if (claim?.content?.object) {
            claim.content.object.forEach((p) => {
                totalClaims += p.content.length;
                p.content.forEach((sentence) => {
                    if (sentence.props.classification) {
                        totalClaimsReviewed++;
                    }
                });
            }, 0);
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
        claimContent.forEach((paragraph, paragraphIndex) => {
            paragraph.content.forEach((sentence, sentenceIndex) => {
                const claimReview = reviews.find((review) => {
                    return review._id.sentence_hash === sentence.props["data-hash"];
                });
                if (claimReview) {
                    claimContent[paragraphIndex].content[sentenceIndex].props =
                        Object.assign(sentence.props, {
                            classification: claimReview._id.classification[0],
                        });
                }
            });
        });
        return claimContent;
    }
}
