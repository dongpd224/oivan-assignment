# PowerShell deployment script for Angular application
param(
    [string]$Registry = "",
    [string]$Tag = "latest"
)

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

try {
    # Build and tag the Docker image
    Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
    docker build -t "oivan-web:$Tag" .
    
    if ($LASTEXITCODE -ne 0) {
        throw "Docker build failed"
    }

    # Optional: Tag for registry
    if ($Registry) {
        Write-Host "🏷️ Tagging image for registry..." -ForegroundColor Yellow
        docker tag "oivan-web:$Tag" "$Registry/oivan-web:$Tag"
        
        Write-Host "📤 Pushing to registry..." -ForegroundColor Yellow
        docker push "$Registry/oivan-web:$Tag"
    }

    # Stop existing container if running
    Write-Host "🛑 Stopping existing container..." -ForegroundColor Yellow
    docker-compose down 2>$null

    # Start the new container
    Write-Host "▶️ Starting new container..." -ForegroundColor Yellow
    docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to start container"
    }

    # Wait for health check
    Write-Host "🏥 Waiting for health check..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15

    # Check if container is healthy
    $containerStatus = docker-compose ps --format json | ConvertFrom-Json
    $webContainer = $containerStatus | Where-Object { $_.Service -eq "web" }
    
    if ($webContainer.Health -eq "healthy" -or $webContainer.State -eq "running") {
        Write-Host "✅ Deployment successful! Application is running at http://localhost" -ForegroundColor Green
    } else {
        Write-Host "❌ Deployment may have issues. Check logs with: docker-compose logs" -ForegroundColor Red
        docker-compose logs web
    }

    Write-Host "🎉 Deployment completed!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Check logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}