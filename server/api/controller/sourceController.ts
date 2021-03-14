import SourceRepository from "../repository/source";
import { ILogger } from "../../lib/loggerInterface";

export default class SourceController {
    sourceRepository: SourceRepository;
    logger: ILogger;

    constructor({ logger }) {
        this.logger = logger;
        this.sourceRepository = new SourceRepository(logger);
    }

    create(body) {
        try {
            return this.sourceRepository.create(body);
        } catch (error) {
            return error;
        }
    }

    getSourceId(id) {
        try {
            return this.sourceRepository.getById(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return this.sourceRepository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await this.sourceRepository.delete(id);
            return { message: "Source successfully deleted" };
        } catch (error) {
            return error;
        }
    }
}
