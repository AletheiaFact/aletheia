const Reference = require("../model/referenceModel");

const optionsToUpdate = {
    new: true,
    upsert: true
};

/**
 * @class ReferenceRepository
 */
module.exports = class ReferenceRepository {
    static async listAll(page, pageSize, order, query) {
        return Reference.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ createdAt: order })
            .lean();
    }

    static create(reference) {
        const newReference = new Reference(reference);
        return newReference.save();
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
};
