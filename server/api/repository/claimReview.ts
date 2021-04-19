import { ILogger } from "../../lib/loggerInterface";

const ClaimReview = require("../model/claimReviewModel");
const Claim = require("../model/claimModel");
const Source = require("../model/sourceModel");

/**
 * @class ClaimReviewRepository
 */
export default class ClaimReviewRepository {
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
        return ClaimReview.find({}).lean();
    }

    async create(claimReview) {
        const newClaimReview = new ClaimReview(claimReview);
        if (claimReview.source) {
            const source = new Source({
                link: claimReview.source,
                targetId: newClaimReview.id,
                targetModel: "ClaimReview"
            });
            await source.save();
            newClaimReview.sources = [source];
        }

        return newClaimReview.save((err, review) => {
            if (err) {
                throw err;
            }
            Claim.findOneAndUpdate(
                { _id: claimReview.claim },
                { $push: { claimReviews: review } },
                { new: true },
                err => {
                    if (err) {
                        throw err;
                    }
                }
            );
        });
    }

    getById(claimReviewId) {
        return ClaimReview.findById(claimReviewId)
            .populate("claims", "_id title")
            .populate("sources", "_id link classification");
    }

    async update(claimReviewId, claimReviewBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const claimReview = await this.getById(claimReviewId);
            const newClaimReview = Object.assign(claimReview, claimReviewBody);
            const claimReviewUpdate = await ClaimReview.findByIdAndUpdate(
                claimReviewId,
                newClaimReview,
                this.optionsToUpdate
            );
            return claimReviewUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    delete(claimReviewId) {
        return ClaimReview.findByIdAndRemove(claimReviewId);
    }
}
