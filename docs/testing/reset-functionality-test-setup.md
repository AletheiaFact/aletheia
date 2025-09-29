# Reset Functionality - Cypress Test Setup Guide

This document explains how to run the Cypress E2E tests for the "Reset to Initial State" functionality, including the complete setup required to match the GitHub CI pipeline.

## Prerequisites

- Node.js 18.19.1 (same version as CI)
- Yarn package manager
- Docker and Docker Compose
- Git

## Required Services Setup

The reset functionality tests require the same infrastructure as the main application:

### 1. MongoDB In-Memory Server
- **Purpose**: Database for storing review tasks and audit logs
- **Port**: 35025 (to avoid conflicts with local MongoDB on 27017)
- **Version**: MongoDB 6.0.17
- **Implementation**: Uses `mongodb-memory-server` for in-memory testing

### 2. Ory Kratos Identity Management
- **Purpose**: User authentication and authorization
- **Ports**: 
  - 4433 (public API)
  - 4434 (admin API)
- **Version**: oryd/kratos:v0.13.0
- **Configuration**: Located in `./ory_config/`

### 3. Application Server
- **Purpose**: Backend NestJS server and Next.js frontend
- **Port**: 3000
- **Configuration**: Uses `config.test.ci.yaml`

## Environment Variables

Create the following environment setup:

```bash
# Required for CI tests
export TEST_RECAPTCHA_SECRET="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
export TEST_RECAPTCHA_SITEKEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
export NEXT_PUBLIC_RECAPTCHA_SITEKEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
export CI_MONGODB_URI="mongodb://127.0.0.1:35025/Aletheia"
export ORY_SDK_URL="http://127.0.0.1:4433"
export MONGOMS_VERSION="6.0.17"
export CI=true
```

## Running the Reset Functionality Tests

### Option 1: Full Test Suite Setup (Recommended)

This approach mirrors the GitHub Actions CI pipeline exactly:

```bash
# 1. Install dependencies
yarn install

# 2. Copy configuration file
cp config/localConfig.example.ts config/localConfig.ts

# 3. Build the application
yarn build

# 4. Create Cypress environment file (add your user password)
echo '{"CI_ORY_USER_PASSWORD": "your_test_password_here"}' > ./cypress.env.json

# 5. Run the complete E2E setup with all services
yarn test:e2e:cy

# 6. In another terminal, run only the reset functionality tests
yarn cypress-run --spec "cypress/e2e/tests/reset-functionality.cy.ts"
```

### Option 2: Manual Service Setup

For more control over the setup process:

```bash
# Terminal 1: Start MongoDB in-memory server
yarn test:e2e:mongo-server

# Terminal 2: Start Ory Kratos services
yarn ory-kratos:cy

# Terminal 3: Wait for services and start application
wait-on tcp:127.0.0.1:35025 tcp:127.0.0.1:4433 tcp:127.0.0.1:4434
yarn test:e2e:app-server

# Terminal 4: Run the specific reset tests
yarn cypress-run --spec "cypress/e2e/tests/reset-functionality.cy.ts"
```

### Option 3: Quick Development Testing

For rapid iteration during development:

```bash
# Start all services in background
yarn test:e2e:cy &

# Wait for services to be ready
wait-on http://localhost:3000

# Run tests in headed mode for debugging
yarn cypress-open --spec "cypress/e2e/tests/reset-functionality.cy.ts"
```

## Test Structure

The reset functionality tests are organized into two main suites:

### Core Functionality Tests
- **Button Visibility**: Tests role-based access control
- **Confirmation Dialog**: Tests dialog behavior and validation
- **Reset Operation**: Tests successful reset with data clearing
- **State Management**: Tests workflow state transitions
- **Audit Logging**: Tests audit trail creation

### Edge Cases & Error Scenarios
- **API Error Handling**: Tests server error responses
- **Network Issues**: Tests timeout and connection issues
- **Concurrent Operations**: Tests prevention of multiple simultaneous resets

## Service Dependencies Verification

Before running tests, verify all services are running:

```bash
# Check MongoDB is running
curl http://localhost:35025 || echo "MongoDB not ready"

# Check Ory Kratos public API
curl http://localhost:4433/health/ready || echo "Kratos public not ready"

# Check Ory Kratos admin API
curl http://localhost:4434/health/ready || echo "Kratos admin not ready"

# Check application server
curl http://localhost:3000 || echo "Application not ready"
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are already in use
   lsof -i :35025 -i :4433 -i :4434 -i :3000
   
   # Kill conflicting processes if needed
   pkill -f "mongodb-memory-server"
   docker-compose down
   ```

2. **Docker Issues**
   ```bash
   # Clean up Docker containers
   docker-compose down --volumes
   docker system prune -f
   
   # Rebuild Kratos containers
   docker-compose up -d --build --force-recreate kratos kratos-migrate
   ```

3. **Database Connection Issues**
   ```bash
   # Verify MongoDB memory server is accessible
   mongosh mongodb://127.0.0.1:35025/Aletheia --eval "db.stats()"
   ```

4. **Authentication Issues**
   ```bash
   # Check Ory Kratos configuration
   docker-compose logs kratos
   
   # Verify identity schema
   curl http://localhost:4434/schemas
   ```

### Test Data Setup

The tests use fixtures from `cypress/fixtures/`:
- `claim.ts` - Test claim data
- `personality.ts` - Test personality data  
- `review.ts` - Test review data with sample content

### Cypress Configuration

The tests use these key locators (defined in `cypress/support/locators.ts`):
- `BTN_RESET_TO_INITIAL` - Reset button in toolbar
- `RESET_CONFIRMATION_DIALOG` - Confirmation dialog
- `RESET_REASON_INPUT` - Reason text input
- `RESET_CONFIRM_BUTTON` - Confirm reset button

## CI Pipeline Integration

This setup exactly matches the GitHub Actions workflow in `.github/workflows/nodejs.yml`:

1. **Build Step**: Compiles TypeScript and bundles assets
2. **Service Setup**: Starts MongoDB and Ory Kratos in Docker
3. **Environment**: Sets CI environment variables
4. **Test Execution**: Runs Cypress with `wait-on` for service readiness
5. **Cleanup**: Services are automatically torn down after tests

## Performance Considerations

- **MongoDB Memory Server**: Uses ~100MB RAM, starts in ~2-3 seconds
- **Ory Kratos**: Uses ~50MB RAM, starts in ~5-10 seconds
- **Application Build**: Takes ~30-60 seconds depending on system
- **Test Execution**: Reset functionality tests run in ~2-3 minutes

## Security Notes

- Uses Google's public test reCAPTCHA keys (safe for CI)
- MongoDB runs in memory only, no persistent data
- Ory Kratos uses SQLite file storage in Docker volume
- All services are localhost-only, not exposed externally