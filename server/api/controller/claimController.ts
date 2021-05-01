import ClaimRepository from "../repository/claim";
import { ILogger } from "../../lib/loggerInterface";

export default class ClaimController {
    claimRepository: ClaimRepository;
    logger: ILogger;

    constructor({ logger }) {
        this.logger = logger;
        this.claimRepository = new ClaimRepository(logger);
    }

    listAll(query) {
        const { page = 0, pageSize = 10, order = "asc" } = query;
        const queryInputs = this.verifyInputsQuery(query);

        return Promise.all([
            this.claimRepository.listAll(
                page,
                parseInt(pageSize, 10),
                order,
                queryInputs
            ),
            this.claimRepository.count(queryInputs)
        ])
            .then(([claims, totalClaims]) => {
                const totalPages = Math.ceil(
                    totalClaims / parseInt(pageSize, 10)
                );

                this.logger.log(
                    "info",
                    `Found ${totalClaims} claims. Page ${page} of ${totalPages}`
                );

                return {
                    claims,
                    totalClaims,
                    totalPages,
                    page,
                    pageSize
                };
            })
            .catch(error => this.logger.log("error", error));
    }

    verifyInputsQuery(query) {
        const queryInputs = {};
        if (query.personality) {
            // @ts-ignore
            queryInputs.personality = query.personality;
        }
        return queryInputs;
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
