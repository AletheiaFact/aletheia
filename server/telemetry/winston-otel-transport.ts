import TransportStream = require("winston-transport");
import { logs, SeverityNumber } from "@opentelemetry/api-logs";

/**
 * Custom Winston transport that sends logs to OpenTelemetry
 */
export class OpenTelemetryTransport extends TransportStream {
    private logger: any;

    constructor(opts?: TransportStream.TransportStreamOptions) {
        super(opts);
        // Get the logger from the global logger provider
        const loggerProvider = logs.getLoggerProvider();
        this.logger = loggerProvider.getLogger("winston", "1.0.0");
    }

    log(info: any, callback: () => void) {
        setImmediate(() => {
            this.emit("logged", info);
        });

        // Map Winston level to OpenTelemetry severity
        const severityMap: { [key: string]: SeverityNumber } = {
            error: SeverityNumber.ERROR,
            warn: SeverityNumber.WARN,
            info: SeverityNumber.INFO,
            http: SeverityNumber.INFO,
            verbose: SeverityNumber.DEBUG,
            debug: SeverityNumber.DEBUG,
            silly: SeverityNumber.TRACE,
        };

        const severity = severityMap[info.level] || SeverityNumber.INFO;

        // Emit log record to OpenTelemetry
        this.logger.emit({
            severityNumber: severity,
            severityText: info.level.toUpperCase(),
            body: info.message,
            attributes: {
                "log.logger": "winston",
                "service.name": "aletheia",
                ...(info.context && { "log.context": info.context }),
                ...(info.trace && { "log.trace": info.trace }),
                // Include any additional fields from Winston
                ...Object.keys(info)
                    .filter(
                        (key) =>
                            !["level", "message", "timestamp", "context", "trace"].includes(key)
                    )
                    .reduce((acc, key) => {
                        acc[`log.${key}`] = info[key];
                        return acc;
                    }, {} as any),
            },
            timestamp: Date.now(),
        });

        callback();
    }
}
