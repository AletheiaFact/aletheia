import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Enable OpenTelemetry diagnostic logging for debugging
// Set to DiagLogLevel.INFO for less verbose output in production
if (process.env.OTEL_LOG_LEVEL === 'debug') {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

// Define service resource attributes
const resource = resourceFromAttributes({
  [SEMRESATTRS_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || 'aletheia-backend',
  [SEMRESATTRS_SERVICE_VERSION]: process.env.npm_package_version || '1.0.0',
  [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
});

// Configure OTLP exporters to send data to the collector
const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
});

const metricExporter = new OTLPMetricExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
});

// Configure metric reader
const metricReader = new PeriodicExportingMetricReader({
  exporter: metricExporter,
  exportIntervalMillis: 60000, // Export metrics every 60 seconds
});

// Initialize the OpenTelemetry SDK
const sdk = new NodeSDK({
  resource,
  traceExporter,
  metricReader,
  instrumentations: [
    getNodeAutoInstrumentations({
      // Customize auto-instrumentation modules
      '@opentelemetry/instrumentation-fs': {
        enabled: false, // Disable file system instrumentation (can be noisy)
      },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-mongodb': {
        enabled: true,
      },
      '@opentelemetry/instrumentation-winston': {
        enabled: true,
      },
    }),
  ],
});

// Start the SDK (synchronous in this version)
try {
  sdk.start();
  console.log('OpenTelemetry SDK started successfully for backend');
} catch (error) {
  console.error('Error starting OpenTelemetry SDK:', error);
}

// Gracefully shut down the SDK on process exit
process.on('SIGTERM', async () => {
  try {
    await sdk.shutdown();
    console.log('OpenTelemetry SDK shut down successfully');
  } catch (error) {
    console.error('Error shutting down OpenTelemetry SDK:', error);
  } finally {
    process.exit(0);
  }
});

export default sdk;
