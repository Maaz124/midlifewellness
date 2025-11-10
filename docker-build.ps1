# PowerShell build script for Docker images (Windows)

Write-Host "Building Docker images for MidlifeWellness..." -ForegroundColor Green

# Build webapp image
Write-Host "Building webapp image..." -ForegroundColor Yellow
docker build -f Dockerfile.webapp -t midlifewellness-webapp:latest .

# Build database image
Write-Host "Building database image..." -ForegroundColor Yellow
docker build -f Dockerfile.db -t midlifewellness-db:latest .

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Images created:" -ForegroundColor Cyan
Write-Host "  - midlifewellness-webapp:latest"
Write-Host "  - midlifewellness-db:latest"
Write-Host ""
Write-Host "To tag for your registry, run:" -ForegroundColor Cyan
Write-Host "  docker tag midlifewellness-webapp:latest your-registry/midlifewellness-webapp:latest"
Write-Host "  docker tag midlifewellness-db:latest your-registry/midlifewellness-db:latest"
Write-Host ""
Write-Host "To push to registry, run:" -ForegroundColor Cyan
Write-Host "  docker push your-registry/midlifewellness-webapp:latest"
Write-Host "  docker push your-registry/midlifewellness-db:latest"

