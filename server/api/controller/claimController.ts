import ClaimRepository from "../repository/claim";
import { ILogger } from "../../lib/loggerInterface";

export default class ClaimController {
    claimRepository: ClaimRepository;
    logger: ILogger;

    constructor({ logger }) {
        this.logger = logger;
        this.claimRepository = new ClaimRepository(logger);
    }

    listAll() {
        try {
            return this.claimRepository.listAll();
        } catch (error) {
            return error;
        }
    }

    create(body) {
        try {
            return this.claimRepository.create(body);
        } catch (error) {
            return error;
        }
    }

    getClaimId(id) {
        try {
            return this.claimRepository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return this.claimRepository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await this.claimRepository.delete(id);
            return { message: "Claim successfully deleted" };
        } catch (error) {
            return error;
        }
    }
}
