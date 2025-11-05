import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TelemetryConfig } from "./telemetry.config";
import { metrics } from "@opentelemetry/api";
import { Counter, Histogram, UpDownCounter } from "@opentelemetry/api";

@Injectable()
export class TelemetryService implements OnModuleInit {
    private telemetryConfig: TelemetryConfig;
    private meter: any;

    // Common metrics
    public httpRequestsTotal: Counter;
    public httpRequestDuration: Histogram;
    public activeConnections: UpDownCounter;
    public databaseQueriesTotal: Counter;
    public databaseQueryDuration: Histogram;
    public errorTotal: Counter;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        const config = { metricsPort: 9464, logsEndpoint: "http://localhost:4318/v1/logs", enableAutoInstrumentation: true }//this.configService.get("telemetry");
        const name = "aletheia"//this.configService.get("name") || "aletheia";

        // Initialize telemetry
        this.telemetryConfig = new TelemetryConfig({
            serviceName: name,
            serviceVersion: this.configService.get("version") || "1.0.0",
            metricsPort: config?.metricsPort || 9464,
            logsEndpoint:
                config?.logsEndpoint || "http://localhost:4318/v1/logs",
            enableAutoInstrumentation:
                config?.enableAutoInstrumentation !== false,
        });

        this.telemetryConfig.start();

        // Get meter for custom metrics
        this.meter = metrics.getMeter(name);

        // Initialize common metrics
        this.httpRequestsTotal = this.meter.createCounter("http_requests_total", {
            description: "Total number of HTTP requests",
        });

        this.httpRequestDuration = this.meter.createHistogram(
            "http_request_duration_ms",
            {
                description: "HTTP request duration in milliseconds",
            }
        );

        this.activeConnections = this.meter.createUpDownCounter(
            "active_connections",
            {
                description: "Number of active connections",
            }
        );

        this.databaseQueriesTotal = this.meter.createCounter(
            "database_queries_total",
            {
                description: "Total number of database queries",
            }
        );

        this.databaseQueryDuration = this.meter.createHistogram(
            "database_query_duration_ms",
            {
                description: "Database query duration in milliseconds",
            }
        );

        this.errorTotal = this.meter.createCounter("errors_total", {
            description: "Total number of errors",
        });
    }

    async shutdown(): Promise<void> {
        if (this.telemetryConfig) {
            await this.telemetryConfig.shutdown();
        }
    }

    getMeter() {
        return this.meter;
    }

    /**
     * Record an HTTP request
     */
    recordHttpRequest(
        method: string,
        route: string,
        statusCode: number,
        duration: number
    ) {
        this.httpRequestsTotal.add(1, {
            method,
            route,
            status: statusCode,
        });

        this.httpRequestDuration.record(duration, {
            method,
            route,
            status: statusCode,
        });
    }

    /**
     * Record a database query
     */
    recordDatabaseQuery(operation: string, collection: string, duration: number) {
        this.databaseQueriesTotal.add(1, {
            operation,
            collection,
        });

        this.databaseQueryDuration.record(duration, {
            operation,
            collection,
        });
    }

    /**
     * Record an error
     */
    recordError(errorType: string, errorMessage: string) {
        this.errorTotal.add(1, {
            type: errorType,
            message: errorMessage,
        });
    }

    /**
     * Increment active connections
     */
    incrementActiveConnections() {
        this.activeConnections.add(1);
    }

    /**
     * Decrement active connections
     */
    decrementActiveConnections() {
        this.activeConnections.add(-1);
    }
}
