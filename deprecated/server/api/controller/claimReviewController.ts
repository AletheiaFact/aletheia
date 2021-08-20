import ClaimReviewRepository from "../repository/claimReview";
import { ILogger } from "../../lib/loggerInterface";

export default class ClaimReviewController {
    claimReviewRepository: ClaimReviewRepository;
    logger: ILogger;

    constructor({ logger }) {
        this.logger = logger;
        this.claimReviewRepository = new ClaimReviewRepository(logger);
    }

    listAll() {
        try {
            return this.claimReviewRepository.listAll();
        } catch (error) {
            return error;
        }
    }

    create(body) {
        try {
            return this.claimReviewRepository.create(body);
        } catch (error) {
            return error;
        }
    }

    getClaimReviewId(id) {
        try {
            return this.claimReviewRepository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return this.claimReviewRepository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await this.claimReviewRepository.delete(id);
            return { message: "Claim Review successfully deleted" };
        } catch (error) {
            return error;
        }
    }
}
