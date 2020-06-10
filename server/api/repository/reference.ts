const Reference = require("../model/referenceModel");
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
 * @class ReferenceRepository
 */
export default class ReferenceRepository {
    static async listAll(page, pageSize, order, query) {
        return Reference.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ createdAt: order })
            .lean();
    }

    static create(reference) {
        return new Promise((resolve, reject) => {
            const newReference = new Reference(reference);
            newReference.save((err, reference) => {
                if (err) {
                    reject(err);
                }

                models[reference.targetModel].findOneAndUpdate(
                    { _id: reference.targetId },
                    { $push: { references: reference } },
                    { new: true },
                    err => {
                        if (err) {
                            reject(err);
                        }
                    }
                );
            });
            resolve(newReference);
        });
    }

    static async getById(referenceId) {
        const reference = await Reference.findById(referenceId);
        return reference;
    }

    static async update(referenceId, referenceBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const reference = await this.getById(referenceId);
            const newReference = Object.assign(reference, referenceBody);
            const referenceUpdate = await Reference.findByIdAndUpdate(
                referenceId,
                newReference,
                optionsToUpdate
            );
            return referenceUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    static delete(referenceId) {
        return Reference.findByIdAndRemove(referenceId);
    }

    static count(query) {
        return Reference.countDocuments().where(query);
    }
}
