# Grafana Setup Guide for OpenTelemetry

## Quick Start

Grafana is already running and ready to use! This guide will help you configure it to view your application logs.

## Access Grafana

1. Open your browser and go to: **http://localhost:3002**

2. You'll see the Grafana login page. You can either:
   - Click **"Skip"** to use anonymous access (already configured with Admin role)
   - Or login with default credentials: `admin` / `admin` (will prompt to change password)

## Configure Loki Data Source

To view logs from your application, you need to add Loki as a data source:

### Step 1: Add Loki Data Source

1. In Grafana, click on the **menu icon** (☰) in the top left
2. Navigate to **Connections** → **Data sources**
3. Click **"Add data source"**
4. Search for and select **"Loki"**

### Step 2: Configure Loki

On the Loki configuration page, enter:

- **Name**: `Loki` (or any name you prefer)
- **URL**: `http://loki:3100`
- Leave other settings as default

Click **"Save & test"** at the bottom. You should see a green success message.

## Viewing Logs

### Using Explore

1. Click the **Explore** icon (compass) in the left sidebar
2. Select **"Loki"** from the data source dropdown at the top
3. You should see a log query builder

### Basic Log Queries

Once your application is running, try these queries:

**View all logs from the backend:**
```logql
{service_name="aletheia-backend"}
```

**View all logs from the frontend:**
```logql
{service_name="aletheia-frontend"}
```

**Filter by log level (error logs only):**
```logql
{service_name="aletheia-backend"} |= "error"
```

**Filter by HTTP status code:**
```logql
{service_name="aletheia-backend"} | json | http_status_code >= 400
```

### Live Tail

To see logs in real-time as they come in:

1. In the Explore view, click the **"Live"** button in the top right
2. Logs will stream in real-time as your application generates them

## Creating Dashboards

### Quick Dashboard Creation

1. Click **Dashboards** (icon with four squares) in the left sidebar
2. Click **"New"** → **"New Dashboard"**
3. Click **"Add visualization"**
4. Select **"Loki"** as the data source
5. Enter your query and customize the visualization
6. Click **"Apply"** to add to dashboard
7. Click **"Save dashboard"** icon (floppy disk) and give it a name

### Recommended Dashboard Panels

**Log Volume Over Time:**
- Query: `sum(count_over_time({service_name=~".+"} [1m]))`
- Visualization: Time series (graph)
- Shows log rate over time

**Error Rate:**
- Query: `sum(count_over_time({service_name=~".+"} |= "error" [5m]))`
- Visualization: Time series
- Shows error logs over time

**Recent Logs Table:**
- Query: `{service_name="aletheia-backend"}`
- Visualization: Logs
- Shows recent log entries in table format

## Tips and Tricks

### Log Labels

Your logs will have these labels automatically:
- `service_name`: "aletheia-backend" or "aletheia-frontend"
- `level`: Log level (info, warn, error, debug)
- Additional labels from your application

### LogQL Syntax

LogQL is Loki's query language. Here are some useful operators:

- `|=` - Contains string
- `!=` - Doesn't contain string
- `|~ "regex"` - Matches regex
- `| json` - Parse JSON logs
- `| logfmt` - Parse logfmt logs

**Example - Find all failed MongoDB queries:**
```logql
{service_name="aletheia-backend"} |= "mongodb" |= "error"
```

### Time Range

- Use the time picker in the top right to select your desired time range
- Options: Last 5 minutes, Last 1 hour, Last 24 hours, etc.
- Or select a custom range

### Refresh Rate

- Click the refresh icon (↻) to set auto-refresh
- Options: Off, 5s, 10s, 30s, 1m, etc.

## Troubleshooting

### No logs appearing?

1. **Check your application is running:**
   ```bash
   yarn dev
   ```

2. **Verify Loki is receiving logs:**
   ```bash
   curl http://localhost:3100/ready
   ```
   Should return "ready"

3. **Check OpenTelemetry Collector logs:**
   ```bash
   docker-compose logs otel-collector | grep -i loki
   ```

4. **Verify Loki has data:**
   ```bash
   curl http://localhost:3100/loki/api/v1/labels
   ```

### Connection issues?

If you see "Data source connected, but no labels received":
- Make sure your application is running and generating logs
- Wait a few seconds for logs to be ingested
- Try querying with a broader time range (last 1 hour)

### Loki data source test fails?

1. Make sure Loki container is running:
   ```bash
   docker-compose ps loki
   ```

2. Restart Loki if needed:
   ```bash
   docker-compose restart loki
   ```

3. Check the URL is `http://loki:3100` (not `localhost`)

## Advanced Features

### Alerts

You can create alerts based on log patterns:

1. Create a dashboard panel with your query
2. Click the panel title → **Edit**
3. Go to the **Alert** tab
4. Click **"Create alert rule from this panel"**
5. Configure your alert conditions
6. Set up notification channels (email, Slack, etc.)

### Variables

Create dynamic dashboards with variables:

1. In dashboard settings, go to **Variables**
2. Add a new variable (e.g., `service_name`)
3. Use it in queries: `{service_name="$service_name"}`
4. Users can select different services from a dropdown

### Annotations

Mark important events on your graphs:

1. Go to dashboard settings → **Annotations**
2. Add a new annotation
3. Use a Loki query to mark events
4. Example: Mark all deployments or errors

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Open search
- `G + E` - Go to Explore
- `G + D` - Go to Dashboards
- `Shift + T` - Time range picker
- `Ctrl/Cmd + S` - Save dashboard

## Sample Dashboards

You can import pre-built dashboards from Grafana.com:

1. Go to **Dashboards** → **New** → **Import**
2. Enter dashboard ID or JSON
3. Popular dashboard IDs:
   - **13639** - Loki & Promtail logs
   - **12019** - Loki dashboard

## Next Steps

Once you're comfortable with logs:

1. **Add Jaeger** for distributed tracing visualization (see OPENTELEMETRY.md)
2. **Add Prometheus** for metrics collection
3. **Connect them all in Grafana** for a complete observability solution
4. **Set up alerts** for critical errors or performance issues
5. **Create team dashboards** for monitoring your services

## Resources

- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
- [Loki Documentation](https://grafana.com/docs/loki/latest/)
- [LogQL Guide](https://grafana.com/docs/loki/latest/logql/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)

---

**Need help?** Check the troubleshooting section above or see OPENTELEMETRY.md for more details.
