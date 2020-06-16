const Source = require("../model/sourceModel");
const Claim = require("../model/claimModel");
const ClaimReview = require("../model/claimReviewModel");

const models = {
    Claim,
    ClaimReview
};

const optionsToUpdate = {
    new: true,
    upsert: true
};

/**
 * @class SourceRepository
 */
export default class SourceRepository {
    static async listAll(page, pageSize, order, query) {
        return Source.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ createdAt: order })
            .lean();
    }

    static create(source) {
        return new Promise((resolve, reject) => {
            const newSource = new Source(source);
            newSource.save((err, source) => {
                if (err) {
                    reject(err);
                }

                models[source.targetModel].findOneAndUpdate(
                    { _id: source.targetId },
                    { $push: { sources: source } },
                    { new: true },
                    err => {
                        if (err) {
                            reject(err);
                        }
                    }
                );
            });
            resolve(newSource);
        });
    }

    static async getById(sourceId) {
        const source = await Source.findById(sourceId);
        return source;
    }

    static async update(sourceId, sourceBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const source = await this.getById(sourceId);
            const newSource = Object.assign(source, sourceBody);
            const sourceUpdate = await Source.findByIdAndUpdate(
                sourceId,
                newSource,
                optionsToUpdate
            );
            return sourceUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    static delete(sourceId) {
        return Source.findByIdAndRemove(sourceId);
    }

    static count(query) {
        return Source.countDocuments().where(query);
    }
}
