#!/bin/bash

# Docker Build Test Script for Aletheia
# This script mimics the CI/CD pipeline Docker build process locally

set -e  # Exit on any error

echo "🐳 Starting Docker build test for Aletheia..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running ✓"

# Check if Dockerfile exists
if [ ! -f "Dockerfile" ]; then
    print_error "Dockerfile not found in current directory"
    exit 1
fi

print_status "Dockerfile found ✓"

# Build arguments (similar to CI environment)
BUILD_ARGS=(
    --build-arg ENVIRONMENT=development
    --build-arg NEXT_PUBLIC_UMAMI_SITE_ID="test"
    --build-arg NEXT_PUBLIC_RECAPTCHA_SITEKEY="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
)

# Docker build command
DOCKER_TAG="aletheia-test-local"

print_status "Starting Docker build..."
print_warning "This may take several minutes..."

# Run the build with verbose output
if docker build "${BUILD_ARGS[@]}" -t "$DOCKER_TAG" .; then
    print_status "✅ Docker build completed successfully!"
    
    # Show image info
    print_status "Image details:"
    docker images "$DOCKER_TAG" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    
    echo ""
    print_status "🎉 Build test passed! Your changes are compatible with the Docker environment."
    
    # Optional: Run a quick container test
    echo ""
    read -p "Do you want to test running the container? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Starting container test..."
        if docker run --rm -d --name aletheia-test -p 3001:3000 "$DOCKER_TAG"; then
            print_status "Container started successfully on port 3001"
            print_status "You can test it at: http://localhost:3001"
            print_warning "Container is running in background. Stop it with: docker stop aletheia-test"
        else
            print_error "Failed to start container"
        fi
    fi
    
else
    print_error "❌ Docker build failed!"
    print_error "Check the error messages above for details."
    exit 1
fi

echo ""
print_status "Test completed. You can clean up the test image with:"
echo "docker rmi $DOCKER_TAG"