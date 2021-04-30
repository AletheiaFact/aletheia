import PersonalityRepository from "../repository/personality";
import { ILogger } from "../../lib/loggerInterface";

export class PersonalityController {
    personalityRepository: PersonalityRepository;
    logger: ILogger;

    constructor({ logger }) {
        this.logger = logger;
        this.personalityRepository = new PersonalityRepository(logger);
    }

    async listAll(query, language) {
        const { page = 0, pageSize = 10, order = "asc" } = query;
        const queryInputs = await this.verifyInputsQuery(query);

        return Promise.all([
            this.personalityRepository.listAll(
                page,
                parseInt(pageSize, 10),
                order,
                queryInputs,
                query.language,
                query.withSuggestions
            ),
            this.personalityRepository.count(queryInputs)
        ])
            .then(([personalities, totalPersonalities]) => {
                const totalPages = Math.ceil(
                    totalPersonalities / parseInt(pageSize, 10)
                );

                this.logger.log(
                    "info",
                    `Found ${totalPersonalities} personalities. Page ${page} of ${totalPages}`
                );

                return {
                    personalities,
                    totalPersonalities,
                    totalPages,
                    page,
                    pageSize
                };
            })
            .catch(error => this.logger.log("error", error));
    }

    verifyInputsQuery(query) {
        const queryInputs = {};
        if (query.name) {
            // @ts-ignore
            queryInputs.name = { $regex: query.name, $options: "i" };
        }
        return queryInputs;
    }

    create(body) {
        try {
            return this.personalityRepository.create(body);
        } catch (error) {
            this.logger.log("error", error);
            return error;
        }
    }

    getPersonalityId(id, language) {
        return this.personalityRepository.getById(id, language).catch(err => {
            this.logger.log("error", err);
            return err;
        });
    }

    getReviewStats(id) {
        return this.personalityRepository.getReviewStats(id).catch(err => {
            this.logger.log("error", err);
            return err;
        });
    }

    async update(id, body) {
        return this.personalityRepository.update(id, body).catch(err => {
            this.logger.log("error", err);
            return err;
        });
    }

    async delete(id) {
        try {
            await this.personalityRepository.delete(id);
            return { message: "Personality successfully deleted" };
        } catch (error) {
            this.logger.log("error", error);
            return error;
        }
    }
}
