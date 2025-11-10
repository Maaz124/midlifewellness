# Docker Quick Start Guide

## Quick Build and Push

### 1. Build Images

**On Windows (PowerShell):**
```powershell
.\docker-build.ps1
```

**On Linux/Mac:**
```bash
chmod +x docker-build.sh
./docker-build.sh
```

**Or manually:**
```bash
docker build -f Dockerfile.webapp -t midlifewellness-webapp:latest .
docker build -f Dockerfile.db -t midlifewellness-db:latest .
```

### 2. Tag for Your Registry

```bash
# Replace 'your-registry' with your Docker Hub username or registry URL
docker tag midlifewellness-webapp:latest your-registry/midlifewellness-webapp:latest
docker tag midlifewellness-db:latest your-registry/midlifewellness-db:latest
```

### 3. Push to Registry

```bash
docker login
docker push your-registry/midlifewellness-webapp:latest
docker push your-registry/midlifewellness-db:latest
```

## Deploy on VPS

### 1. Pull Images
```bash
docker pull your-registry/midlifewellness-webapp:latest
docker pull your-registry/midlifewellness-db:latest
```

### 2. Update docker-compose.yml

Update the `DATABASE_URL` environment variable in `docker-compose.yml`:
- If using Docker Compose: `postgresql://postgres:postgres@db:5432/midlife`
- If running containers separately: `postgresql://postgres:postgres@localhost:5433/midlife`

### 3. Start Containers
```bash
docker-compose up -d
```

### 4. Initialize Database
```bash
docker exec -it midlifewellness-webapp npm run db:push
```

## Port Mappings

- **Web App**: Access on port 6000 (internal: 5000)
- **Database**: Access on port 5433 (internal: 5432)

## Important Notes

1. **Update DATABASE_URL**: Change the port to 5433 in your environment variables when connecting from outside Docker
2. **Database Initialization**: Always run `npm run db:push` after first deployment
3. **Environment Variables**: Set all required environment variables in `docker-compose.yml` or `.env` file
4. **Volume Persistence**: Database and uploads are stored in Docker volumes

## Troubleshooting

**Check logs:**
```bash
docker logs midlifewellness-webapp
docker logs midlifewellness-postgres
```

**Restart services:**
```bash
docker-compose restart
```

**Stop and remove:**
```bash
docker-compose down
```

For detailed information, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

