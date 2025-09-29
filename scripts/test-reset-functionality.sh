#!/bin/bash

# Reset Functionality Test Runner
# This script sets up the complete environment and runs only the reset functionality tests

set -e  # Exit on any error

echo "🚀 Setting up Reset Functionality Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a service is ready
check_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1

    echo -n "🔍 Checking $name..."
    while [ $attempt -le $max_attempts ]; do
        if curl -s --fail "$url" > /dev/null 2>&1; then
            echo -e " ${GREEN}✓${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
        ((attempt++))
    done
    echo -e " ${RED}✗${NC}"
    echo -e "${RED}❌ $name failed to start after $max_attempts attempts${NC}"
    return 1
}

# Function to cleanup background processes
cleanup() {
    echo -e "\n🧹 Cleaning up..."
    
    # Kill background jobs
    jobs -p | xargs -r kill 2>/dev/null || true
    
    # Stop Cypress-specific Docker containers only
    docker-compose -f docker-compose.cypress.yml down --volumes --remove-orphans 2>/dev/null || true
    
    # Kill any remaining processes on our ports
    pkill -f "mongodb-memory-server" 2>/dev/null || true
    pkill -f "nest start" 2>/dev/null || true
    pkill -f "next start" 2>/dev/null || true
    lsof -ti:35026 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

# Set up cleanup trap
trap cleanup EXIT

# Set required environment variables
export TEST_RECAPTCHA_SECRET="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
export TEST_RECAPTCHA_SITEKEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
export NEXT_PUBLIC_RECAPTCHA_SITEKEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
export CI_MONGODB_URI="mongodb://127.0.0.1:35026/Aletheia"
export ORY_SDK_URL="http://127.0.0.1:4433"
export MONGOMS_VERSION="6.0.17"
export CI=true
export NODE_OPTIONS="--max_old_space_size=4096"

echo -e "${BLUE}📋 Environment variables set${NC}"

# Check if we have the required files
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    yarn install
fi

# Copy configuration file
if [ ! -f "config/localConfig.ts" ]; then
    echo -e "${YELLOW}⚙️  Copying configuration file...${NC}"
    cp config/localConfig.example.ts config/localConfig.ts
fi

# Build the application if needed
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}🔨 Building application...${NC}"
    yarn build
fi

# Create Cypress environment file
echo -e "${YELLOW}🔐 Setting up Cypress environment...${NC}"
if [ -z "$CI_ORY_USER_PASSWORD" ]; then
    # Use default test password if not provided
    export CI_ORY_USER_PASSWORD="testpassword123"
fi
echo "{\"CI_ORY_USER_PASSWORD\": \"$CI_ORY_USER_PASSWORD\"}" > ./cypress.env.json

# Start MongoDB Memory Server for Cypress tests
echo -e "${YELLOW}🍃 Starting MongoDB Memory Server for Cypress tests...${NC}"
node dist/server/mongodb-cypress.server.js &
MONGO_PID=$!

# Clean up any existing Cypress test containers first
echo -e "${YELLOW}🧹 Cleaning up existing Cypress test containers...${NC}"
docker-compose -f docker-compose.cypress.yml down --volumes --remove-orphans 2>/dev/null || true

# Start Ory Kratos services with fresh state using dedicated Cypress containers
echo -e "${YELLOW}🔐 Starting Ory Kratos services for Cypress tests...${NC}"
docker-compose -f docker-compose.cypress.yml up -d --build --force-recreate

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
check_service "http://127.0.0.1:35026" "MongoDB Memory Server" || exit 1
check_service "http://127.0.0.1:4433/health/ready" "Ory Kratos Public API" || exit 1
check_service "http://127.0.0.1:4434/health/ready" "Ory Kratos Admin API" || exit 1

# Seed the database and start the application server
echo -e "${YELLOW}🌱 Seeding database and starting application server...${NC}"
yarn seed:ci &
sleep 5  # Give seed time to complete

yarn start -c config.test.ci.yaml &
APP_PID=$!

# Wait for application to be ready
check_service "http://localhost:3000" "Application Server" || exit 1

echo -e "${GREEN}✅ All services are running!${NC}"
echo -e "${BLUE}🎯 Running Reset Functionality Tests...${NC}"

# Run the specific reset functionality tests
if [ -f "node_modules/.bin/cypress" ]; then
    # Run tests headless using yarn with debug configuration (enables screenshots/videos)
    echo -e "${BLUE}📸 Running tests with screenshots and videos enabled for troubleshooting${NC}"
    yarn cypress-run --spec "cypress/e2e/tests/reset-functionality.cy.ts" --config-file cypress.debug.config.ts
    TEST_RESULT=$?
    
    # Report screenshot/video locations
    if [ -d "cypress/screenshots" ] && [ "$(ls -A cypress/screenshots)" ]; then
        echo -e "${YELLOW}📸 Screenshots saved to: cypress/screenshots/${NC}"
    fi
    if [ -d "cypress/videos" ] && [ "$(ls -A cypress/videos)" ]; then
        echo -e "${YELLOW}🎥 Videos saved to: cypress/videos/${NC}"
    fi
else
    echo -e "${RED}❌ Cypress not found. Please install Cypress first.${NC}"
    exit 1
fi

# Report results
if [ $TEST_RESULT -eq 0 ]; then
    echo -e "\n${GREEN}🎉 Reset Functionality Tests Passed!${NC}"
else
    echo -e "\n${RED}❌ Reset Functionality Tests Failed${NC}"
fi

# Cleanup happens automatically via trap

exit $TEST_RESULT