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
        return this.claimRepository.listAll();
    }

    create(body) {
        return this.claimRepository.create(body);
    }

    getClaimId(id) {
        return this.claimRepository.getById(id);
    }

    async update(id, body) {
        return this.claimRepository.update(id, body);
    }

    async delete(id) {
        await this.claimRepository.delete(id);
        return { message: "Claim successfully deleted" };
    }
}
