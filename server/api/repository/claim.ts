import Parser from "../../lib/parser";
import { ILogger } from "../../lib/loggerInterface";

const Claim = require("../model/claimModel");
const ClaimReview = require("../model/claimReviewModel");
const Personality = require("../model/personalityModel");
const util = require("../../lib/util");
/**
 * @class ClaimRepository
 */
export default class ClaimRepository {
    optionsToUpdate: Object;
    logger: ILogger;

    constructor(logger: any = {}) {
        this.logger = logger;
        this.optionsToUpdate = {
            new: true,
            upsert: true
        };
    }

    listAll() {
        return Claim.find({}).lean();
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
        const reviews = await ClaimReview.aggregate([
            { $match: { claim: claim._id } },
            {
                $group: {
                    _id: "$sentence_hash",
                    topClassification: {
                        $accumulator: {
                            init: function() {
                                return {};
                            },
                            accumulate: function(state, classification) {
                                if (!state[classification]) {
                                    state[classification] = 1;
                                } else {
                                    state[classification]++;
                                }

                                return state;
                            },
                            accumulateArgs: ["$classification"],
                            merge: function(state1, state2) {
                                return { ...state1, ...state2 };
                            },
                            finalize: function(state) {
                                // Find the classification with bigger count
                                const topClassification = Object.keys(
                                    state
                                ).reduce((acc, classification) => {
                                    if (!state[acc]) {
                                        return classification;
                                    } else {
                                        return state[acc] >=
                                            state[classification]
                                            ? acc
                                            : classification;
                                    }
                                }, "");
                                // TODO: what can we do about ties?
                                return {
                                    classification: topClassification,
                                    count: state[topClassification]
                                };
                            },
                            lang: "js"
                        }
                    }
                }
            }
        ]).option({ serializeFunctions: true });
        return await this.postProcess(claim.toObject(), reviews);
    }

    private async postProcess(claim, reviews) {
        if (claim) {
            const stats = await this.getReviewStats(claim._id);
            claim = Object.assign(claim, { stats });
        }
        if (reviews.length > 0) {
            const content = this.transformContentObject(
                claim?.content?.object,
                reviews
            );
            claim = Object.assign(claim, { content });
        }
        return claim;
    }

    private transformContentObject(claimContent, reviews) {
        if (!claimContent) {
            return claimContent;
        }
        claimContent.forEach((paragraph, paragraphIndex) => {
            paragraph.content.forEach((sentence, sentenceIndex) => {
                const review = reviews.find(review => {
                    return review._id === sentence.props["data-hash"];
                });
                claimContent[paragraphIndex].content[
                    sentenceIndex
                ].props = Object.assign(sentence.props, {
                    topClassification: review.topClassification
                });
            });
        });
        return claimContent;
    }

    async getReviewStats(id) {
        const claim = await Claim.findById(id);
        const reviews = await ClaimReview.aggregate([
            { $match: { claim: claim._id } },
            { $group: { _id: "$classification", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        return util.formatStats(reviews);
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
