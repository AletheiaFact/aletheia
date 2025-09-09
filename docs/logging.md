# Intelligent Log Routing System

This document describes the intelligent log categorization system for CloudWatch stream routing.

## Log Categories

The Winston logger automatically categorizes all logs into the following categories:

### 1. `security` - Security Events
**CloudWatch Log Group**: `/aletheia/security`
- Authentication/authorization events
- Login/logout activities
- Token validation
- CSRF, XSS, injection attempts
- Unauthorized access attempts
- Session management
- CAPTCHA events
- Guard violations (SessionGuard, NameSpaceGuard, M2MGuard)

### 2. `performance` - Performance Events  
**CloudWatch Log Group**: `/aletheia/performance`
- Slow requests (>1s response time)
- Timeouts
- Memory/CPU issues
- Cache events
- Performance optimizations
- Bottleneck detection

### 3. `business` - Business Logic Events
**CloudWatch Log Group**: `/aletheia/business`
- Claim operations
- Fact-checking reviews
- Personality management
- User creation/management
- Content publishing
- Review submissions
- Notification events
- Report generation

### 4. `http` - HTTP Requests
**CloudWatch Log Group**: `/aletheia/http`
- All HTTP requests/responses
- API endpoint calls
- Next.js static asset requests
- Request/response metadata
- Status codes and response times

### 5. `database` - Database Events
**CloudWatch Log Group**: `/aletheia/database`
- MongoDB connections
- Mongoose operations
- Database queries
- Migrations and seeding
- Collection operations
- Index operations

### 6. `system` - System Events
**CloudWatch Log Group**: `/aletheia/system`
- Application startup/shutdown
- Service initialization
- Environment loading
- Next.js compilation events
- Module loading
- Configuration events

### 7. `external` - External Service Events
**CloudWatch Log Group**: `/aletheia/external`
- Novu notifications
- OpenAI API calls
- Zenvia messaging
- AWS S3 operations
- Ory authentication
- GitLab feature flags
- Third-party integrations

### 8. `error` - Application Errors
**CloudWatch Log Group**: `/aletheia/errors`
- All error-level logs
- Stack traces
- Exception handling
- Critical failures

### 9. `application` - General Application Logs
**CloudWatch Log Group**: `/aletheia/application`
- Default category for uncategorized logs
- General application flow
- Debug information

## Log Format

All logs are formatted as JSON with the following structure:

```json
{
  "level": "info|warn|error|debug|verbose",
  "message": "Log message",
  "category": "security|performance|business|http|database|system|external|error|application",
  "context": "ServiceName|MiddlewareName",
  "timestamp": "2023-12-01T10:30:45.123Z",
  "requestId": "req-1701427845123-abc123def",
  "responseTime": 250,
  "statusCode": 200,
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "trace": "Error stack trace (for errors only)"
}
```

## Terraform Configuration Example

```hcl
# CloudWatch Log Groups for each category
resource "aws_cloudwatch_log_group" "aletheia_security" {
  name              = "/aletheia/security"
  retention_in_days = 90
  
  tags = {
    Environment = var.environment
    Category    = "security"
  }
}

resource "aws_cloudwatch_log_group" "aletheia_performance" {
  name              = "/aletheia/performance"
  retention_in_days = 30
  
  tags = {
    Environment = var.environment
    Category    = "performance"
  }
}

resource "aws_cloudwatch_log_group" "aletheia_business" {
  name              = "/aletheia/business"
  retention_in_days = 365
  
  tags = {
    Environment = var.environment
    Category    = "business"
  }
}

# ... repeat for other categories

# CloudWatch Log Streams (auto-created by application)
# Format: /aletheia/{category}/{instance-id}

# Example CloudWatch Insights Queries
resource "aws_cloudwatch_query_definition" "security_alerts" {
  name = "aletheia-security-alerts"
  
  log_group_names = [
    aws_cloudwatch_log_group.aletheia_security.name
  ]
  
  query_string = <<EOF
fields @timestamp, message, context, ip
| filter level = "warn" or level = "error"
| sort @timestamp desc
| limit 100
EOF
}

resource "aws_cloudwatch_query_definition" "slow_requests" {
  name = "aletheia-slow-requests"
  
  log_group_names = [
    aws_cloudwatch_log_group.aletheia_performance.name,
    aws_cloudwatch_log_group.aletheia_http.name
  ]
  
  query_string = <<EOF
fields @timestamp, message, responseTime, url
| filter responseTime > 1000
| sort responseTime desc
| limit 50
EOF
}
```

## CloudWatch Agent Configuration

Configure the CloudWatch agent to route logs based on the `category` field:

```json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/aletheia/application.log",
            "log_group_name": "/aletheia/application",
            "log_stream_name": "{instance_id}",
            "multi_line_start_pattern": "{\"level\"",
            "filters": [
              {
                "type": "include",
                "expression": "\"category\":\"application\""
              }
            ]
          },
          {
            "file_path": "/var/log/aletheia/application.log", 
            "log_group_name": "/aletheia/security",
            "log_stream_name": "{instance_id}",
            "filters": [
              {
                "type": "include",
                "expression": "\"category\":\"security\""
              }
            ]
          }
        ]
      }
    }
  }
}
```

## Benefits

1. **Targeted Monitoring**: Set up specific alerts for each category
2. **Cost Optimization**: Different retention policies per log type
3. **Security Compliance**: Isolated security logs for auditing
4. **Performance Monitoring**: Dedicated performance metrics
5. **Business Intelligence**: Track business events separately
6. **Operational Efficiency**: Faster troubleshooting with categorized logs

## Usage in Application

The categorization happens automatically. No code changes needed. The system will:

1. Analyze each log entry's content and context
2. Apply intelligent categorization rules
3. Add the `category` field to the JSON log output
4. CloudWatch agent routes to appropriate log group based on category

This enables you to configure different CloudWatch streams, retention policies, and monitoring rules for each category in your Terraform configuration.