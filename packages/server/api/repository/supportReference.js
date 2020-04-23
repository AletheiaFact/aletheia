const SupportReference = require("../model/supportReference");

const optionsToUpdate = {
    new: true,
    upsert: true
};

/**
 * @class SupportReferenceRepository
 */
module.exports = class SupportReferenceRepository {
    static async listAll(page, pageSize, order, query) {
        return SupportReference.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ createdAt: order })
            .lean();
    }

    static create(supportReference) {
        const newSupportReference = new SupportReference(supportReference);
        return newSupportReference.save();
    }

    static async getById(supportReferenceId) {
        const supportReference = await SupportReference.findById(
            supportReferenceId
        );
        return supportReference;
    }

    static async update(supportReferenceId, supportReferenceBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const supportReference = await this.getById(supportReferenceId);
            const newSupportReference = Object.assign(
                supportReference,
                supportReferenceBody
            );
            const supportReferenceUpdate = await SupportReference.findByIdAndUpdate(
                supportReferenceId,
                newSupportReference,
                optionsToUpdate
            );
            return supportReferenceUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    static delete(supportReferenceId) {
        return SupportReference.findByIdAndRemove(supportReferenceId);
    }

    static count(query) {
        return SupportReference.countDocuments().where(query);
    }
};
