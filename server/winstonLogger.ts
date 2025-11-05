import { LoggerService } from "@nestjs/common";
import * as winston from "winston";
import { OpenTelemetryTransport } from "./telemetry/winston-otel-transport";

export class WinstonLogger implements LoggerService {
    private logger: winston.Logger;

    constructor() {
        const transports: any[] = [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.json()),
            }),
        ];

        // Add OpenTelemetry transport if not in test environment
        if (process.env.NODE_ENV !== "test") {
            try {
                transports.push(new OpenTelemetryTransport());
            } catch (error) {
                console.warn(
                    "Failed to initialize OpenTelemetry transport for Winston:",
                    error
                );
            }
        }

        this.logger = winston.createLogger({
            transports,
        });
    }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace: string, context?: string) {
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
