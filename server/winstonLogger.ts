import { LoggerService } from "@nestjs/common";
import * as winston from "winston";
import { Environments } from "./types/enums";

const isDevelopment = process.env.ENVIRONMENT === Environments.WATCH_DEV;

const devFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, context, trace }) => {
        const ctx = context ? `[${context}]` : "";
        const traceStr = trace ? `\n  → ${trace}` : "";
        return `${timestamp} ${level} ${ctx} ${message}${traceStr}`;
    })
);

const prodFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss.SSSZ" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const getLogLevel = (): string => {
    if (process.env.LOG_LEVEL) {
        return process.env.LOG_LEVEL;
    }
    return isDevelopment ? "debug" : "info";
};

export class WinstonLogger implements LoggerService {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: getLogLevel(),
            transports: [
                new winston.transports.Console({
                    format: isDevelopment ? devFormat : prodFormat,
                }),
            ],
        });
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, traceOrError?: string | Error, context?: string) {
        const trace =
            traceOrError instanceof Error ? traceOrError.stack : traceOrError;
        this.logger.error(message, { trace, context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, { context });
    }
}
