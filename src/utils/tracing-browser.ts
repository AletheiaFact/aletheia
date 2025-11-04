import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
} from '@opentelemetry/sdk-trace-base';
import { ZoneContextManager } from '@opentelemetry/context-zone';

let isInitialized = false;

export function initializeTracing() {
  // Only initialize once and only in browser
  if (isInitialized || typeof window === 'undefined') {
    return;
  }

  // Define resource attributes for the frontend
  const resource = resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME || 'aletheia-frontend',
    [SEMRESATTRS_SERVICE_VERSION]: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
  });

  // Create a web tracer provider
  const provider = new WebTracerProvider({
    resource,
  });

  // Configure OTLP HTTP exporter for browser (gRPC not supported in browser)
  const otlpExporter = new OTLPTraceExporter({
    url: process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  });

  // Add batch span processor
  provider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));

  // Optional: Add console exporter for debugging in development
  if (process.env.NODE_ENV === 'development') {
    provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
  }

  // Register the provider
  provider.register({
    contextManager: new ZoneContextManager(),
  });

  // Register instrumentations for browser APIs
  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        // Ignore requests to OpenTelemetry collector to avoid loops
        ignoreUrls: [/localhost:4318/, /otel-collector/],
        propagateTraceHeaderCorsUrls: [
          // Add your backend URLs here to enable distributed tracing
          /localhost:3001/,
          new RegExp(process.env.NEXT_PUBLIC_API_URL || ''),
        ],
      }),
      new XMLHttpRequestInstrumentation({
        ignoreUrls: [/localhost:4318/, /otel-collector/],
        propagateTraceHeaderCorsUrls: [
          /localhost:3001/,
          new RegExp(process.env.NEXT_PUBLIC_API_URL || ''),
        ],
      }),
    ],
  });

  isInitialized = true;
  console.log('OpenTelemetry browser tracing initialized');
}

// Auto-initialize when this module is imported
if (typeof window !== 'undefined') {
  initializeTracing();
}
