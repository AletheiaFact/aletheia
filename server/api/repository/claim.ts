import Parser from "../../lib/parser";
import { ILogger } from "../../lib/loggerInterface";
import ClaimReviewRepository from "./claimReview";

const Claim = require("../model/claimModel");
const Personality = require("../model/personalityModel");

/**
 * @class ClaimRepository
 */
export default class ClaimRepository {
    optionsToUpdate: Object;
    logger: ILogger;
    private claimReviewRepository: ClaimReviewRepository;

    constructor(logger: any = {}) {
        this.logger = logger;
        this.claimReviewRepository = new ClaimReviewRepository(logger);
        this.optionsToUpdate = {
            new: true,
            upsert: true
        };
    }

    async listAll(page, pageSize, order, query) {
        const claims = await Claim.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ _id: order })
            .lean();
        return Promise.all(
            claims.map(claim => {
                return this.postProcess(claim);
            })
        );
    }

    count(query) {
        return Claim.countDocuments().where(query);
    }

    create(claim) {
        return new Promise((resolve, reject) => {
            const p = new Parser();
            claim.content = p.parse(claim.content);
            const newClaim = new Claim(claim);
            newClaim.save((err, claim) => {
                if (err) {
                    reject(err);
                }
                Personality.findOneAndUpdate(
                    { _id: claim.personality },
                    { $push: { claims: claim } },
                    { new: true },
                    err => {
                        if (err) {
                            reject(err);
                        }
                    }
                );
            });
            resolve(newClaim);
        });
    }

    async getById(claimId) {
        const claim = await Claim.findById(claimId)
            .populate("personality", "_id name")
            .populate("sources", "_id link classification");
        if (!claim) {
            // TODO: handle 404 for claim not found
            return {};
        }

        return this.postProcess(claim.toObject());
    }

    private async postProcess(claim) {
        const reviews = await this.claimReviewRepository.getReviewsByClaimId(
            claim._id
        );
        if (claim) {
            if (claim?.content?.object) {
                claim.content.object = this.transformContentObject(
                    claim.content.object,
                    reviews
                );
            }
            const reviewStats = await this.claimReviewRepository.getReviewStatsByClaimId(
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
            claim.content.object.forEach(p => {
                totalClaims += p.content.length;
                p.content.forEach(sentence => {
                    if (sentence.props.topClassification) {
                        totalClaimsReviewed++;
                    }
                });
            }, 0);
        }
        return {
            totalClaims,
            totalClaimsReviewed
        };
    }

    private transformContentObject(claimContent, reviews) {
        if (!claimContent || reviews.length <= 0) {
            return claimContent;
        }
        claimContent.forEach((paragraph, paragraphIndex) => {
            paragraph.content.forEach((sentence, sentenceIndex) => {
                const claimReview = reviews.find(review => {
                    return review._id === sentence.props["data-hash"];
                });
                if (claimReview) {
                    claimContent[paragraphIndex].content[
                        sentenceIndex
                    ].props = Object.assign(sentence.props, {
                        topClassification: claimReview.topClassification
                    });
                }
            });
        });
        return claimContent;
    }

    async update(claimId, claimBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const claim = await this.getById(claimId);
            const p = new Parser();
            claimBody.content = p.parse(claimBody.content);
            const newClaim = Object.assign(claim, claimBody);
            const claimUpdate = await Claim.findByIdAndUpdate(
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
        return Claim.findByIdAndRemove(claimId);
    }
}
