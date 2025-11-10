# Docker Setup Summary

This document summarizes the Docker setup for the MidlifeWellness application.

## Files Created

### Docker Configuration Files
1. **Dockerfile.webapp** - Multi-stage build for the web application
   - Builds the React frontend and Node.js backend
   - Runs on port 5000 internally (mapped to 6000 externally)
   - Includes drizzle-kit and TypeScript for database migrations
   - Uses non-root user for security
   - Includes entrypoint script for permission handling

2. **Dockerfile.db** - PostgreSQL database image
   - Based on postgres:16-alpine
   - Runs on port 5432 internally (mapped to 5433 externally)
   - Includes health checks

3. **docker-compose.yml** - Orchestration configuration
   - Defines both webapp and db services
   - Configures networking between containers
   - Sets up volumes for data persistence
   - Maps ports correctly (6000:5000 for webapp, 5433:5432 for db)

4. **docker-entrypoint.sh** - Entrypoint script for webapp
   - Handles uploads directory permissions
   - Switches to non-root user before running application

5. **.dockerignore** - Build context optimization
   - Excludes unnecessary files from Docker build context
   - Keeps required files like package-lock.json and entrypoint script

### Build Scripts
1. **docker-build.sh** - Linux/Mac build script
2. **docker-build.ps1** - Windows PowerShell build script

### Documentation
1. **DOCKER_SETUP.md** - Comprehensive setup guide
2. **DOCKER_QUICKSTART.md** - Quick reference guide

## Port Mappings

- **Web Application**: 
  - Internal: 5000
  - External: 6000
  - Access: http://localhost:6000

- **Database**: 
  - Internal: 5432
  - External: 5433
  - Connection: postgresql://postgres:postgres@localhost:5433/midlife

## Key Features

1. **Separate Containers**: Web app and database are in separate containers
2. **Port Mapping**: External ports are different from internal ports as requested
3. **Database Migration**: Includes drizzle-kit for running `npm run db:push`
4. **Volume Persistence**: Database and uploads are stored in Docker volumes
5. **Security**: Runs as non-root user
6. **Health Checks**: Database includes health checks for reliable startup

## Build and Push Instructions

### Build Images
```bash
# Using build script
./docker-build.sh  # Linux/Mac
.\docker-build.ps1  # Windows

# Or manually
docker build -f Dockerfile.webapp -t midlifewellness-webapp:latest .
docker build -f Dockerfile.db -t midlifewellness-db:latest .
```

### Tag for Registry
```bash
docker tag midlifewellness-webapp:latest your-registry/midlifewellness-webapp:latest
docker tag midlifewellness-db:latest your-registry/midlifewellness-db:latest
```

### Push to Registry
```bash
docker push your-registry/midlifewellness-webapp:latest
docker push your-registry/midlifewellness-db:latest
```

## Deployment Steps

1. **Pull images on VPS**
   ```bash
   docker pull your-registry/midlifewellness-webapp:latest
   docker pull your-registry/midlifewellness-db:latest
   ```

2. **Update docker-compose.yml** with your registry images
   - Replace `build` sections with `image` fields
   - Update environment variables

3. **Start containers**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database**
   ```bash
   docker exec -it midlifewellness-webapp npm run db:push
   ```

5. **Update environment variables**
   - Set DATABASE_URL to use port 5433 when connecting from outside Docker
   - Set other required environment variables (SESSION_SECRET, etc.)

## Important Notes

1. **Database Port**: When connecting from outside Docker, use port 5433. Inside Docker network, use port 5432 with service name `db`.
2. **Database Initialization**: Always run `npm run db:push` after first deployment.
3. **Environment Variables**: Update DATABASE_URL and other environment variables in docker-compose.yml or .env file.
4. **Volume Persistence**: Data persists in Docker volumes. Use `docker-compose down -v` to remove volumes (WARNING: deletes all data).

## Troubleshooting

- Check container logs: `docker logs midlifewellness-webapp`
- Check database logs: `docker logs midlifewellness-postgres`
- Verify container status: `docker ps`
- Restart services: `docker-compose restart`

For more detailed information, see [DOCKER_SETUP.md](./DOCKER_SETUP.md) and [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md).

