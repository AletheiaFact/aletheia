# OpenTelemetry Integration Guide

This document explains how to use OpenTelemetry for observability in the Aletheia platform.

## Overview

OpenTelemetry is integrated into both the backend (NestJS) and frontend (Next.js) applications to provide:

- **Distributed Tracing**: Track requests across frontend and backend
- **Metrics**: Monitor application performance
- **Logging**: Centralized log collection with context

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Next.js        │────▶│  NestJS         │
│  Frontend       │     │  Backend        │
│  (Browser)      │     │  (Node.js)      │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │ OTLP/HTTP             │ OTLP/gRPC
         │ :4318                 │ :4317
         │                       │
         ▼                       ▼
    ┌─────────────────────────────────┐
    │  OpenTelemetry Collector        │
    │  (Docker Container)             │
    └────────────┬────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────┐
    │  Exporters:                    │
    │  - Console (dev)               │
    │  - File                        │
    │  - Jaeger (optional)           │
    │  - Prometheus (optional)       │
    └────────────────────────────────┘
```

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Required environment variables for OpenTelemetry:

**Backend (server-side):**
- `OTEL_SERVICE_NAME`: Name of the backend service (default: `aletheia-backend`)
- `OTEL_EXPORTER_OTLP_ENDPOINT`: OTLP gRPC endpoint (default: `http://localhost:4317`)
- `OTEL_LOG_LEVEL`: Logging level for OpenTelemetry SDK (default: `info`, set to `debug` for verbose output)

**Frontend (client-side):**
- `NEXT_PUBLIC_OTEL_SERVICE_NAME`: Name of the frontend service (default: `aletheia-frontend`)
- `NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT`: OTLP HTTP endpoint (default: `http://localhost:4318/v1/traces`)
- `NEXT_PUBLIC_APP_VERSION`: Application version for tracking
- `NEXT_PUBLIC_API_URL`: Backend API URL for trace correlation

### 2. Start OpenTelemetry Collector

The OpenTelemetry Collector runs as a Docker container. Start it with:

```bash
docker-compose up -d otel-collector
```

Verify it's running:

```bash
docker-compose ps otel-collector
```

The collector exposes the following ports:
- **4317**: OTLP gRPC receiver (backend)
- **4318**: OTLP HTTP receiver (frontend)
- **13133**: Health check endpoint
- **55679**: zPages extension (debugging)

### 3. Start the Application

```bash
# Install dependencies if not already done
yarn install

# Start development server (both backend and frontend)
yarn dev
```

### 4. Verify Telemetry Data

**Console Output:**
In development mode, traces will be logged to the console. Look for messages like:
```
OpenTelemetry SDK started successfully for backend
OpenTelemetry browser tracing initialized
```

**Check Collector Logs:**
```bash
docker-compose logs -f otel-collector
```

**Access zPages (Debugging):**
The OpenTelemetry Collector provides several debugging pages:
- http://localhost:55679/debug/servicez - Service information
- http://localhost:55679/debug/pipelinez - Pipeline configurations
- http://localhost:55679/debug/tracez - Trace samples (displays traces once app is running)
- http://localhost:55679/debug/extensionz - Extension information
- http://localhost:55679/debug/featurez - Feature gates

**Check Exported Files:**
Trace data is saved to `./data/otel-data/traces.json` (configurable via `DATA_PATH` in docker-compose.yaml)

**Access Grafana UI (Logs, Traces, Metrics):**
Grafana provides a powerful UI for viewing all your telemetry data:
1. Open http://localhost:3002 in your browser
2. Click "Skip" or login (anonymous access is enabled by default)
3. Go to **Connections** → **Data sources** → **Add data source**
4. Select **Loki** and configure:
   - Name: `Loki`
   - URL: `http://loki:3100`
   - Click **Save & test**
5. Go to **Explore** (compass icon in sidebar)
6. Select "Loki" from the dropdown
7. You can now query and view your logs!

**Quick Grafana Tips:**
- Use label filters to search logs: `{service_name="aletheia-backend"}`
- View logs in real-time by clicking the "Live" button
- Create dashboards to visualize metrics and logs together
- Use LogQL queries for advanced log filtering

## Configuration Files

### OpenTelemetry Collector Configuration

The collector is configured in `otel-collector-config.yaml`:

- **Receivers**: Accept telemetry data via OTLP (gRPC and HTTP)
- **Processors**: Process data (batching, memory limiting)
- **Exporters**: Send data to various backends

### Backend Instrumentation

**File**: `server/tracing.ts`

Auto-instrumentation includes:
- HTTP/HTTPS requests
- Express middleware
- MongoDB queries
- Winston logger integration

### Frontend Instrumentation

**File**: `src/utils/tracing-browser.ts`

Auto-instrumentation includes:
- Fetch API calls
- XMLHttpRequest calls
- Distributed tracing with backend (trace headers propagation)

## Visualization Tools

### Grafana + Loki (Already Installed) ✓

Grafana and Loki are already configured and running! Access Grafana at http://localhost:3002 to view logs, traces, and metrics in a unified UI.

## Adding Additional Exporters

### Jaeger (Distributed Tracing UI)

1. Add Jaeger to `docker-compose.yaml`:

```yaml
jaeger:
  container_name: jaeger
  image: jaegertracing/all-in-one:latest
  ports:
    - "16686:16686"  # Jaeger UI
    - "14250:14250"  # gRPC
  networks:
    - intranet
```

2. Uncomment the Jaeger exporter in `otel-collector-config.yaml`:

```yaml
exporters:
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [logging, file, jaeger]  # Add jaeger here
```

3. Restart services:

```bash
docker-compose up -d jaeger
docker-compose restart otel-collector
```

4. Access Jaeger UI: http://localhost:16686

### Prometheus (Metrics)

1. Add Prometheus to `docker-compose.yaml`:

```yaml
prometheus:
  container_name: prometheus
  image: prom/prometheus:latest
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"
  networks:
    - intranet
```

2. Create `prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'otel-collector'
    static_configs:
      - targets: ['otel-collector:8889']
```

3. Uncomment Prometheus exporter in `otel-collector-config.yaml`:

```yaml
exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [logging, prometheus]  # Add prometheus here
```

4. Add port mapping to otel-collector in `docker-compose.yaml`:

```yaml
otel-collector:
  ports:
    - "8889:8889"  # Prometheus metrics
```

## Custom Instrumentation

### Backend (NestJS)

Add custom spans in your code:

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('my-service');

async myMethod() {
  const span = tracer.startSpan('myMethod');

  try {
    // Your code here
    span.setAttribute('custom.attribute', 'value');
    const result = await someOperation();
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message
    });
    throw error;
  } finally {
    span.end();
  }
}
```

### Frontend (Next.js)

Add custom spans in browser code:

```typescript
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('my-component');

function handleClick() {
  const span = tracer.startSpan('button-click');
  span.setAttribute('button.id', 'submit-button');

  try {
    // Your code here
    performAction();
  } finally {
    span.end();
  }
}
```

## Troubleshooting

### No Traces Appearing

1. **Check collector is running:**
   ```bash
   docker-compose ps otel-collector
   ```

2. **Check collector logs:**
   ```bash
   docker-compose logs otel-collector
   ```

3. **Verify environment variables:**
   Ensure all `OTEL_*` and `NEXT_PUBLIC_OTEL_*` variables are set correctly.

4. **Check network connectivity:**
   Backend should connect to `localhost:4317` (gRPC)
   Frontend should connect to `localhost:4318` (HTTP)

### CORS Issues (Frontend)

If browser blocks requests to the collector:

1. The collector is configured to accept HTTP requests, but you may need to add CORS configuration.

2. In production, use a backend proxy or API gateway instead of sending directly from browser.

### Performance Impact

OpenTelemetry has minimal performance impact:
- Backend: ~1-5% CPU overhead
- Frontend: ~1-2% overhead for instrumented requests
- Network: Traces are batched and compressed

To reduce overhead in production:
- Adjust batch sizes in `otel-collector-config.yaml`
- Use sampling (not all traces need to be collected)
- Disable debug logging

## Production Deployment

For production use:

1. **Use managed services:**
   - Honeycomb, Lightstep, DataDog, New Relic, etc.
   - Update `OTEL_EXPORTER_OTLP_ENDPOINT` to point to your service

2. **Enable sampling:**
   Configure sampling in `server/tracing.ts` and `src/utils/tracing-browser.ts`

3. **Secure endpoints:**
   Use HTTPS and authentication for OTLP endpoints

4. **Monitor collector:**
   Set up alerts for collector health and performance

5. **Frontend considerations:**
   - Consider using a backend proxy for telemetry to avoid CORS
   - Implement sampling to reduce browser overhead
   - Filter sensitive data from traces

## Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [OpenTelemetry JavaScript SDK](https://github.com/open-telemetry/opentelemetry-js)
- [OTLP Specification](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/otlp.md)
- [Collector Configuration](https://opentelemetry.io/docs/collector/configuration/)

## Support

For issues or questions about OpenTelemetry integration:
1. Check the troubleshooting section above
2. Review collector logs: `docker-compose logs otel-collector`
3. Enable debug logging: Set `OTEL_LOG_LEVEL=debug` in `.env`
