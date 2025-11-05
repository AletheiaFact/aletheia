# OpenTelemetry Observability Stack

This directory contains the configuration for the OpenTelemetry observability stack used by the Aletheia application.

## Overview

The observability stack consists of:

- **OpenTelemetry Collector**: Receives, processes, and exports telemetry data
- **Prometheus**: Metrics storage and querying
- **Loki**: Log aggregation and querying
- **Grafana**: Visualization dashboard for metrics and logs

## Architecture

```
┌─────────────────┐
│ Aletheia App    │
│ (NestJS)        │
└────────┬────────┘
         │
         │ Metrics (Prometheus format on :9464)
         │ Logs (OTLP HTTP to :4318)
         │
         ▼
┌─────────────────────────┐
│ OpenTelemetry Collector │
│ (:4318, :4317)          │
└─────┬─────────┬─────────┘
      │         │
      │         ├──────────► Loki (:3100)
      │         │            [Logs]
      │         │
      │         └──────────► Prometheus (:9090)
      │                      [Metrics]
      │
      ▼
┌─────────────┐
│  Grafana    │
│  (:3001)    │
└─────────────┘
```

## Quick Start

### 1. Start the Observability Stack

From the project root directory:

```bash
# Start only the observability stack
docker-compose -f docker-compose.observability.yaml up -d

# Or start with the main application stack
docker-compose -f docker-compose.yaml -f docker-compose.observability.yaml up -d
```

### 2. Start the Aletheia Application

Make sure your `config.yaml` includes the telemetry configuration:

```yaml
telemetry:
  metricsPort: 9464
  logsEndpoint: http://localhost:4318/v1/logs
  enableAutoInstrumentation: true
```

Then start the application:

```bash
yarn dev
```

### 3. Access the Dashboards

- **Grafana**: http://localhost:3002
  - Default credentials: `admin` / `admin`
  - Pre-configured dashboards available under "Aletheia" folder

- **Prometheus**: http://localhost:9090
  - Direct access to metrics and query interface

- **Loki**: http://localhost:3100
  - Usually accessed through Grafana

- **OpenTelemetry Collector Metrics**: http://localhost:8888/metrics
  - Internal collector metrics

## Configuration Files

### OpenTelemetry Collector

**File**: `otel-collector-config.yaml`

The collector is configured with:
- **Receivers**: OTLP (HTTP and gRPC), Prometheus scraper
- **Processors**: Batch processing, resource attributes, memory limiter
- **Exporters**: Loki (logs), Prometheus (metrics)

To modify the configuration:
1. Edit `otel-collector-config.yaml`
2. Restart the collector: `docker-compose -f docker-compose.observability.yaml restart otel-collector`

### Prometheus

**File**: `prometheus.yml`

Scrapes metrics from:
- OpenTelemetry Collector (port 8889)
- Aletheia application (port 9464)
- Loki
- Grafana

### Loki

**File**: `loki-config.yaml`

Configured for local development with:
- Filesystem storage
- 7-day retention
- JSON format support

### Grafana

**Directory**: `grafana/`

Contains:
- **Datasources**: Automatic provisioning of Prometheus and Loki
- **Dashboards**: Pre-built dashboard for Aletheia application metrics

## Available Metrics

The Aletheia application exposes the following custom metrics:

### HTTP Metrics
- `http_requests_total`: Counter of total HTTP requests
  - Labels: `method`, `route`, `status`
- `http_request_duration_ms`: Histogram of request duration
  - Labels: `method`, `route`, `status`

### Connection Metrics
- `active_connections`: Current number of active connections

### Database Metrics
- `database_queries_total`: Counter of database queries
  - Labels: `operation`, `collection`
- `database_query_duration_ms`: Histogram of query duration
  - Labels: `operation`, `collection`

### Error Metrics
- `errors_total`: Counter of errors
  - Labels: `type`, `message`

## Using Custom Metrics in Your Code

The telemetry service is available throughout the application via dependency injection:

```typescript
import { TelemetryService } from './telemetry/telemetry.service';

@Injectable()
export class MyService {
  constructor(private readonly telemetryService: TelemetryService) {}

  async myMethod() {
    // Record an HTTP request
    this.telemetryService.recordHttpRequest('GET', '/api/users', 200, 123);

    // Record a database query
    this.telemetryService.recordDatabaseQuery('find', 'users', 45);

    // Record an error
    this.telemetryService.recordError('ValidationError', 'Invalid input');

    // Create custom metrics
    const meter = this.telemetryService.getMeter();
    const customCounter = meter.createCounter('my_custom_metric', {
      description: 'My custom metric description',
    });
    customCounter.add(1, { label: 'value' });
  }
}
```

## Logs

Application logs are automatically sent to Loki via the OpenTelemetry Collector. The Winston logger is instrumented to include trace context.

To view logs in Grafana:
1. Navigate to "Explore"
2. Select "Loki" datasource
3. Use LogQL queries, for example:
   - All logs: `{service_name="aletheia"}`
   - Error logs: `{service_name="aletheia"} |= "error"`
   - Logs for specific route: `{service_name="aletheia"} |= "/api/users"`

## Default Grafana Dashboard

The pre-built dashboard includes:

1. **HTTP Request Rate**: Requests per second by route and method
2. **HTTP Request Duration**: P95 and P50 latency
3. **Active Connections**: Current number of active connections
4. **Error Rate**: Errors per second
5. **Database Query Rate**: Database operations per second
6. **Application Logs**: Real-time log viewer with filtering

## Troubleshooting

### Metrics not appearing in Prometheus

1. Check if the application is running and the metrics endpoint is accessible:
   ```bash
   curl http://localhost:9464/metrics
   ```

2. Check if the OpenTelemetry Collector is scraping:
   ```bash
   docker logs otel-collector
   ```

3. Verify Prometheus targets in the UI: http://localhost:9090/targets

### Logs not appearing in Loki

1. Check OpenTelemetry Collector logs:
   ```bash
   docker logs otel-collector
   ```

2. Verify the application is sending logs:
   - Check application logs for telemetry initialization messages
   - Ensure `logsEndpoint` in config.yaml is correct

3. Query Loki directly:
   ```bash
   curl -G -s "http://localhost:3100/loki/api/v1/query" --data-urlencode 'query={service_name="aletheia"}'
   ```

### Grafana datasource not working

1. Check if Prometheus and Loki containers are running:
   ```bash
   docker-compose -f docker-compose.observability.yaml ps
   ```

2. Test connectivity from Grafana container:
   ```bash
   docker exec grafana curl http://prometheus:9090/-/healthy
   docker exec grafana curl http://loki:3100/ready
   ```

## Performance Considerations

### For Development
The default configuration is optimized for local development with:
- Short retention periods
- Frequent scraping intervals (10s)
- Debug logging enabled

### For Production
Consider adjusting:

1. **Loki retention**: Increase retention period in `loki-config.yaml`
2. **Prometheus retention**: Add `--storage.tsdb.retention.time` flag
3. **Collector batch size**: Increase for better throughput
4. **Scrape intervals**: Reduce to 30s or 1m to decrease load
5. **Logging level**: Set to `info` or `warn` in production

Example production adjustments in `otel-collector-config.yaml`:
```yaml
processors:
  batch:
    timeout: 30s
    send_batch_size: 5000

exporters:
  logging:
    loglevel: info
```

## Stopping the Stack

```bash
# Stop and remove containers
docker-compose -f docker-compose.observability.yaml down

# Stop and remove containers + volumes (deletes all data)
docker-compose -f docker-compose.observability.yaml down -v
```

## Further Reading

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Loki Documentation](https://grafana.com/docs/loki/latest/)
- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
