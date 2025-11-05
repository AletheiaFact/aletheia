import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { resourceFromAttributes, defaultResource } from "@opentelemetry/resources";
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";

export class TelemetryConfig {
    private sdk: NodeSDK;
    private prometheusExporter: PrometheusExporter;

    constructor(config: {
        serviceName: string;
        serviceVersion?: string;
        metricsPort?: number;
        logsEndpoint?: string;
        enableAutoInstrumentation?: boolean;
    }) {
        const {
            serviceName,
            serviceVersion = "1.0.0",
            metricsPort = 9464,
            logsEndpoint = "http://localhost:4318/v1/logs",
            enableAutoInstrumentation = true,
        } = config;

        // Define resource
        const resource = defaultResource().merge(
            resourceFromAttributes({
                [SEMRESATTRS_SERVICE_NAME]: serviceName,
                [SEMRESATTRS_SERVICE_VERSION]: serviceVersion,
            })
        );

        // Prometheus exporter for metrics (pull-based, starts HTTP server)
        this.prometheusExporter = new PrometheusExporter(
            {
                port: metricsPort,
            },
            () => {
                console.log(
                    `Prometheus metrics available at http://localhost:${metricsPort}/metrics`
                );
            }
        );

        // OTLP HTTP exporter for logs
        const logExporter = new OTLPLogExporter({
            url: logsEndpoint,
        });

        // Auto-instrumentations
        const instrumentations = enableAutoInstrumentation
            ? [
                  getNodeAutoInstrumentations({
                      "@opentelemetry/instrumentation-fs": {
                          enabled: false, // Disable fs instrumentation to reduce noise
                      },
                  }),
                  new WinstonInstrumentation({
                      // This will automatically inject trace context into Winston logs
                      logHook: (span, record) => {
                          record["resource.service.name"] = serviceName;
                      },
                  }),
              ]
            : [];

        // Initialize SDK
        this.sdk = new NodeSDK({
            resource,
            logRecordProcessor: new BatchLogRecordProcessor(logExporter),
            metricReader: this.prometheusExporter,
            instrumentations,
        });
    }

    start(): void {
        this.sdk.start();
        console.log("OpenTelemetry SDK started successfully");
    }

    async shutdown(): Promise<void> {
        await this.sdk.shutdown();
        console.log("OpenTelemetry SDK shut down successfully");
    }

    getPrometheusExporter(): PrometheusExporter {
        return this.prometheusExporter;
    }
}
