import { ILogger } from "../../lib/loggerInterface";

const Source = require("../model/sourceModel");
const Claim = require("../model/claimModel");
const ClaimReview = require("../model/claimReviewModel");

/**
 * @class SourceRepository
 */
export default class SourceRepository {
    optionsToUpdate: Object;
    logger: ILogger;
    models: Object;

    constructor(logger: any = {}) {
        this.logger = logger;
        this.models = {
            Claim,
            ClaimReview
        };
        this.optionsToUpdate = {
            new: true,
            upsert: true
        };
    }

    async listAll(page, pageSize, order, query) {
        return Source.find(query)
            .skip(page * pageSize)
            .limit(pageSize)
            .sort({ createdAt: order })
            .lean();
    }

    create(source) {
        return new Promise((resolve, reject) => {
            const newSource = new Source(source);
            newSource.save((err, source) => {
                if (err) {
                    reject(err);
                }

                this.models[source.targetModel].findOneAndUpdate(
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

    async getById(sourceId) {
        const source = await Source.findById(sourceId);
        return source;
    }

    async update(sourceId, sourceBody) {
        // eslint-disable-next-line no-useless-catch
        try {
            const source = await this.getById(sourceId);
            const newSource = Object.assign(source, sourceBody);
            const sourceUpdate = await Source.findByIdAndUpdate(
                sourceId,
                newSource,
                this.optionsToUpdate
            );
            return sourceUpdate;
        } catch (error) {
            // TODO: log to service-runner
            throw error;
        }
    }

    delete(sourceId) {
        return Source.findByIdAndRemove(sourceId);
    }

    count(query) {
        return Source.countDocuments().where(query);
    }
}
