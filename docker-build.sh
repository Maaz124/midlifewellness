#!/bin/bash
# Build script for Docker images

set -e

echo "Building Docker images for MidlifeWellness..."

# Build webapp image
echo "Building webapp image..."
docker build -f Dockerfile.webapp -t midlifewellness-webapp:latest .

# Build database image
echo "Building database image..."
docker build -f Dockerfile.db -t midlifewellness-db:latest .

echo "Build completed successfully!"
echo ""
echo "Images created:"
echo "  - midlifewellness-webapp:latest"
echo "  - midlifewellness-db:latest"
echo ""
echo "To tag for your registry, run:"
echo "  docker tag midlifewellness-webapp:latest your-registry/midlifewellness-webapp:latest"
echo "  docker tag midlifewellness-db:latest your-registry/midlifewellness-db:latest"
echo ""
echo "To push to registry, run:"
echo "  docker push your-registry/midlifewellness-webapp:latest"
echo "  docker push your-registry/midlifewellness-db:latest"

