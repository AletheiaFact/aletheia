import {Injectable, Logger} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { Claim, ClaimDocument } from "../claim/schemas/claim.schema";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ParserService } from "../parser/parser.service";
import { SourceService } from "../source/source.service";
import { ClaimRevisionService } from "../claim-revision/claim-revision.service";

type ClaimMatchParameters = ({ _id: string } | { personality: string, slug: string }) & FilterQuery<ClaimDocument>;

@Injectable()
export class ClaimService {
    private optionsToUpdate: { new: boolean; upsert: boolean };
    private readonly logger = new Logger("ClaimService");

    constructor(
        @InjectModel(Claim.name)
        private ClaimModel: Model<ClaimDocument>,
        private claimReviewService: ClaimReviewService,
        private claimRevisionService: ClaimRevisionService,
        private sourceService: SourceService,
        private parserService: ParserService
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    async listAll(page, pageSize, order, query) {
        if (query.personality) {
            query.personality = new Types.ObjectId(query.personality)
        }
        const claims = await this.ClaimModel.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();
        return Promise.all(
            claims.map(async (claim) => {
                let claimRevision = await this.claimRevisionService.getRevision(claim._id)
                return this.postProcess({
                    ...claim,
                    ...claimRevision.toObject()
                });
            })
        );
    }

    count(query: any = {}) {
        return this.ClaimModel.countDocuments().where(query);
    }

    async create(claim) {
        claim.personality = new Types.ObjectId(claim.personality);
        const newClaim = new this.ClaimModel(claim);
        const newClaimRevision = await this.claimRevisionService.create(newClaim._id, claim)
        newClaim.latestRevision = newClaimRevision._id
        newClaim.slug = newClaimRevision.slug
        newClaim.save();

        return {
            ...newClaim.toObject(),
            ...newClaimRevision.toObject()
        }
    }

    async update(claimId, claimRevisionUpdate) {
        const claim = await this._getClaim({ _id: claimId }, false);
        const latestRevision = claim.toObject().latestRevision
        delete latestRevision._id
        const newClaimRevision =
            await this.claimRevisionService.create(claim._id, {
                ...latestRevision,
                ...claimRevisionUpdate
            })
        claim.latestRevision = newClaimRevision._id
        claim.slug = newClaimRevision.slug
        claim.save()
        return newClaimRevision;
    }

    delete(claimId) {
        // TODO: use soft-delete instead
        // this means that when deleting it should actually update
        // the deleted field with the boolean value 'true'
        return this.ClaimModel.findByIdAndRemove(claimId);
    }

    // TODO: add optional revisionId that will fetch a specifc revision that matches
    async getById(claimId) {
        return this._getClaim({_id: claimId})
    }

    async getByPersonalityIdAndClaimSlug(personalityId, claimSlug) {
        return this._getClaim({personality: personalityId, slug: claimSlug})
    }

    private async _getClaim(match: ClaimMatchParameters, postprocess = true) {
        const claim =
            await this.ClaimModel.findOne(match)
                .populate("personality", "_id name")
                .populate("sources", "_id link classification")
                .populate("latestRevision")

        if (!claim) {
            return {};
        }


        return postprocess === true ? this.postProcess(claim.toObject()) : claim;
    }

    /**
     * This function return all personality claims
     * @param claim all personality claims
     * @returns return all claims
     */
    private async postProcess(claim) {
        // TODO: we should not transform the object in this function
        claim = {
            ...claim.latestRevision, // the order matters
            ...claim,
            latestRevision: undefined
        }
        const reviews = await this.claimReviewService.getReviewsByClaimId(
            claim._id
        );
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
                    if (sentence.props.topClassification) {
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
                    return review._id === sentence.props["data-hash"];
                });
                if (claimReview) {
                    claimContent[paragraphIndex].content[sentenceIndex].props =
                        Object.assign(sentence.props, {
                            topClassification: claimReview.topClassification,
                        });
                }
            });
        });
        return claimContent;
    }

    findOneAndUpdate(query, push) {
        return this.ClaimModel.findOneAndUpdate(
            { ...query },
            { $push: { ...push } },
            { new: true },
            (e) => {
                if (e) {
                    throw e;
                }
            }
        );
    }
}
