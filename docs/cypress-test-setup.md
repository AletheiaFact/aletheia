# Cypress Test Setup Documentation

## Overview

This document describes the complete setup process for running Cypress tests for the Aletheia fact-checking platform, specifically designed to match the GitHub CI pipeline environment while maintaining isolation from the local development environment.

## Architecture

The Cypress test environment uses:

- **Isolated Docker Containers**: Separate docker-compose configuration (`docker-compose.cypress.yml`) with dedicated volumes to avoid conflicts with local development
- **MongoDB Memory Server**: Dedicated MongoDB instance running on port 35026 (different from dev port 35025)
- **Ory Kratos Services**: Fresh containers for authentication with isolated database state
- **Application Server**: Test configuration with seeded data

## Key Components

### 1. Docker Configuration (`docker-compose.cypress.yml`)

```yaml
version: "3"
services:
  kratos-migrate-cypress:
    image: oryd/kratos:v0.13.0
    # Isolated database migration for tests
    volumes:
      - kratos-sqlite-cypress:/var/lib/sqlite
      
  kratos-cypress:
    # Authentication service with fresh state
    ports:
      - "4433:4433" # public
      - "4434:4434" # admin
    volumes:
      - kratos-sqlite-cypress:/var/lib/sqlite
      
  mailslurper-cypress:
    # Email testing service
    ports:
      - "4436:4436"
      - "4437:4437"

volumes:
  kratos-sqlite-cypress:
    driver: local  # Isolated from dev environment
```

### 2. MongoDB Server (`server/mongodb-cypress.server.ts`)

```typescript
import { MongoMemoryServer } from "mongodb-memory-server";

(async () => {
    const db = await MongoMemoryServer.create({
        instance: { port: 35026 }, // Different from dev port
        binary: { version: "6.0.17" },
    });
    console.info(db.getUri());
})();
```

### 3. Test Script (`scripts/test-reset-functionality.sh`)

Automated script that:
- Sets up environment variables
- Starts MongoDB Memory Server on dedicated port
- Launches isolated Ory Kratos containers
- Seeds test database
- Runs application server
- Executes Cypress tests
- Cleans up resources

## Environment Variables

The test environment uses the following key variables:

```bash
export CI_MONGODB_URI="mongodb://127.0.0.1:35026/Aletheia"
export ORY_SDK_URL="http://127.0.0.1:4433"
export TEST_RECAPTCHA_SECRET="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
export TEST_RECAPTCHA_SITEKEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
export MONGOMS_VERSION="6.0.17"
export CI=true
export NODE_OPTIONS="--max_old_space_size=4096"
```

## Service Health Checks

The script includes health checks for all services:

- MongoDB Memory Server: `http://127.0.0.1:35026`
- Ory Kratos Public API: `http://127.0.0.1:4433/health/ready`
- Ory Kratos Admin API: `http://127.0.0.1:4434/health/ready`
- Application Server: `http://localhost:3000`

## Running Tests

### Quick Start

```bash
# Run all reset functionality tests
yarn test:reset-functionality

# Or manually run the script
./scripts/test-reset-functionality.sh
```

### Manual Setup (for debugging)

```bash
# 1. Start isolated services
yarn ory-kratos:cy-isolated

# 2. Start MongoDB Memory Server
node dist/server/mongodb-cypress.server.js &

# 3. Seed database and start app
yarn seed:ci && yarn start -c config.test.ci.yaml &

# 4. Run specific tests
yarn cypress-run --spec "cypress/e2e/tests/reset-functionality.cy.ts"
```

## Isolation Benefits

1. **No Local Environment Interference**: Uses separate Docker volumes and ports
2. **Fresh State**: Each test run starts with clean containers and database
3. **Parallel Development**: Can run tests while developing locally
4. **CI Compatibility**: Matches GitHub Actions environment exactly

## Cleanup Process

The test script automatically handles cleanup:
- Stops isolated Docker containers only (`docker-compose -f docker-compose.cypress.yml down`)
- Kills test-specific processes
- Removes test volumes
- Preserves local development environment

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Tests use port 35026 for MongoDB (dev uses 35025)
2. **Container Platform Warnings**: ARM64/AMD64 platform warnings are harmless
3. **Service Startup Time**: Health checks wait up to 30 attempts (30 seconds)

### Debug Commands

```bash
# Check service health
curl http://127.0.0.1:4433/health/ready
curl http://localhost:3000

# View container logs
docker-compose -f docker-compose.cypress.yml logs kratos-cypress

# Manual cleanup
docker-compose -f docker-compose.cypress.yml down --volumes --remove-orphans
```

## Reset Functionality Tests

The test suite (`cypress/e2e/tests/reset-functionality.cy.ts`) covers:

1. **Core Functionality**: Reset button visibility, confirmation dialog, API calls
2. **Permission Testing**: Role-based access (Admin, SuperAdmin, assigned fact-checkers)
3. **Edge Cases**: API errors, invalid states, network failures
4. **UI Integration**: Material-UI components, form validation, state management

### Test Structure

```typescript
describe('Reset to Initial State Functionality', () => {
  // Core functionality tests
  it('should show reset button for admin users')
  it('should show confirmation dialog when reset is clicked')
  it('should reset the task when confirmed')
  // ... more tests
})

describe('Reset Functionality - Edge Cases', () => {
  // Error and edge case scenarios
  it('should handle API errors gracefully')
  it('should validate required reason field')
  // ... more tests
})
```

## Performance Metrics

- **Setup Time**: ~30-60 seconds (includes Docker container startup)
- **Test Execution**: ~2-3 minutes for full suite
- **Cleanup Time**: ~5-10 seconds
- **Resource Usage**: Minimal impact on local development environment

## GitHub CI Integration

The setup exactly matches the GitHub Actions workflow:
- Same MongoDB Memory Server version (6.0.17)
- Same Ory Kratos version (v0.13.0)
- Same environment variables and ports
- Same build and seed process

This ensures tests that pass locally will pass in CI.