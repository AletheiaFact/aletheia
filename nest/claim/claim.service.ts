import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Claim, ClaimDocument } from "../claim/schemas/claim.schema";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { PersonalityService } from "../personality/personality.service";
import { ParserService } from "../parser/parser.service";

@Injectable()
export class ClaimService {
    private optionsToUpdate: { new: boolean; upsert: boolean };

    constructor(
        @InjectModel(Claim.name)
        private ClaimModel: Model<ClaimDocument>,
        private claimReviewService: ClaimReviewService,
        private personalityService: PersonalityService,
        private parserService: ParserService
    ) {
        this.optionsToUpdate = {
            new: true,
            upsert: true,
        };
    }

    async listAll(page, pageSize, order, query) {
        const claims = await this.ClaimModel.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();
        return Promise.all(
            claims.map((claim) => {
                return this.postProcess(claim);
            })
        );
    }

    count(query: any = {}) {
        return this.ClaimModel.countDocuments().where(query);
    }

    create(claim) {
        return new Promise((resolve, reject) => {
            claim.content = this.parserService.parse(claim.content);
            const newClaim = new this.ClaimModel(claim);
            newClaim.save((err, claim) => {
                if (err) {
                    reject(err);
                }
                this.personalityService.findOneAndUpdate(
                    { _id: claim.personality },
                    { claims: claim }
                );
            });
            resolve(newClaim);
        });
    }
    async update(claimId, claimBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const claim = await this.getById(claimId);
            claimBody.content = this.parserService.parse(claimBody.content);
            const newClaim = Object.assign(claim, claimBody);
            const claimUpdate = await this.ClaimModel.findByIdAndUpdate(
                claimId,
                newClaim,
                this.optionsToUpdate
            );
            return claimUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    delete(claimId) {
        return this.ClaimModel.findByIdAndRemove(claimId);
    }

    async getById(claimId) {
        const claim = await this.ClaimModel.findById(claimId)
            .populate("personality", "_id name")
            .populate("sources", "_id link classification");
        if (!claim) {
            // TODO: handle 404 for claim not found
            return {};
        }

        return this.postProcess(claim.toObject());
    }

    private async postProcess(claim) {
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
}
