import { LoggerService } from "@nestjs/common";

export default class Logger implements LoggerService {
    private logger: any;
    constructor(logger) {
        this.logger = logger;
    }

    log(message) {
        this.logger.log("info", message);
    }

    debug(message: any, context?: string): any {
        this.logger.log("debug", message);
    }

    error(message: any, trace?: string, context?: string): any {
        this.logger.log("error", message + trace);
    }

    verbose(message: any, context?: string): any {
        this.logger.log("verbose", message);
    }

    warn(message: any, context?: string): any {
        this.logger.log("warn", message);
    }
}
