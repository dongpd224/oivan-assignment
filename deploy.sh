#!/bin/bash

# Deployment script for Angular application
set -e

echo "🚀 Starting deployment process..."

# Build and tag the Docker image
echo "📦 Building Docker image..."
docker build -t oivan-web:latest .

# Optional: Tag for registry
# docker tag oivan-web:latest your-registry.com/oivan-web:latest

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker-compose down || true

# Start the new container
echo "▶️ Starting new container..."
docker-compose up -d

# Wait for health check
echo "🏥 Waiting for health check..."
sleep 10

# Check if container is healthy
if docker-compose ps | grep -q "healthy"; then
    echo "✅ Deployment successful! Application is running at http://localhost"
else
    echo "❌ Deployment failed! Check logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!"