# Docker Setup Guide for MidlifeWellness

This guide explains how to build and deploy the MidlifeWellness application using Docker.

## Overview

The application consists of two Docker images:
1. **Web Application** - Node.js/Express server running on port 5000 (mapped to 6000 externally)
2. **PostgreSQL Database** - Database running on port 5432 (mapped to 5433 externally)

## Prerequisites

- Docker installed on your system
- Docker Compose installed (optional, for easier orchestration)

## Building the Docker Images

### Option 1: Build Individual Images

#### Build Web Application Image
```bash
docker build -f Dockerfile.webapp -t midlifewellness-webapp:latest .
```

#### Build Database Image
```bash
docker build -f Dockerfile.db -t midlifewellness-db:latest .
```

### Option 2: Build Using Docker Compose
```bash
docker-compose build
```

## Running with Docker Compose

1. **Update Environment Variables**
   
   Create a `.env` file or set environment variables in `docker-compose.yml`:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@db:5432/midlife
   SESSION_SECRET=your-session-secret-here
   GMAIL_USER=your-email@example.com
   GMAIL_APP_PASSWORD=your-app-password
   COACHING_INBOX=coaching@midliferebalance.com
   ```

2. **Start the Services**
   ```bash
   docker-compose up -d
   ```

3. **Initialize the Database Schema**
   
   After the containers are running, you need to push the database schema:
   ```bash
   # Get into the webapp container
   docker exec -it midlifewellness-webapp sh
   
   # Run the database push command
   npm run db:push
   
   # Exit the container
   exit
   ```

   Or run it directly:
   ```bash
   docker exec -it midlifewellness-webapp npm run db:push
   ```

## Running Individual Containers

### Database Container
```bash
docker run -d \
  --name midlifewellness-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=midlife \
  -p 5433:5432 \
  -v pgdata:/var/lib/postgresql/data \
  midlifewellness-db:latest
```

### Web Application Container
```bash
docker run -d \
  --name midlifewellness-webapp \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5433/midlife \
  -p 6000:5000 \
  --link midlifewellness-postgres:db \
  midlifewellness-webapp:latest
```

**Note**: When running containers separately, update `DATABASE_URL` to point to your database. If running on the same host, use `host.docker.internal:5433` or the host's IP address.

## Port Mappings

- **Web Application**: Internal port 5000 → External port 6000
- **Database**: Internal port 5432 → External port 5433

## Pushing Images to VPS

### Tag Images for Your Registry

```bash
# Tag webapp image
docker tag midlifewellness-webapp:latest your-registry/midlifewellness-webapp:latest

# Tag database image
docker tag midlifewellness-db:latest your-registry/midlifewellness-db:latest
```

### Push to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push webapp image
docker push your-registry/midlifewellness-webapp:latest

# Push database image
docker push your-registry/midlifewellness-db:latest
```

### Push to Private Registry

```bash
# Login to your private registry
docker login your-registry.com

# Push images
docker push your-registry.com/midlifewellness-webapp:latest
docker push your-registry.com/midlifewellness-db:latest
```

## Deploying on VPS

### On Your VPS:

1. **Pull the Images**
   ```bash
   docker pull your-registry/midlifewellness-webapp:latest
   docker pull your-registry/midlifewellness-db:latest
   ```

2. **Create docker-compose.yml on VPS**
   
   Copy the `docker-compose.yml` file to your VPS and update environment variables.

3. **Start the Services**
   ```bash
   docker-compose up -d
   ```

4. **Initialize Database Schema**
   ```bash
   docker exec -it midlifewellness-webapp npm run db:push
   ```

5. **Update Environment Variables**
   
   Make sure to update `DATABASE_URL` in your environment to use port 5433:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/midlife
   ```
   
   Or if using Docker Compose with service names:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@db:5432/midlife
   ```

## Environment Variables

Required environment variables for the web application:

- `DATABASE_URL` - PostgreSQL connection string (use port 5433 externally, 5432 internally in Docker network)
- `NODE_ENV` - Set to `production`
- `PORT` - Set to `5000` (internal port)
- `SESSION_SECRET` - Secret key for session management
- `GMAIL_USER` - Gmail address for sending emails (optional)
- `GMAIL_APP_PASSWORD` - Gmail app password (optional)
- `COACHING_INBOX` - Coaching inbox email address (optional)

## Database Initialization

After starting the containers, you must run the database schema migration:

```bash
docker exec -it midlifewellness-webapp npm run db:push
```

This will create all necessary tables in the database.

## Troubleshooting

### Check Container Logs
```bash
# Web application logs
docker logs midlifewellness-webapp

# Database logs
docker logs midlifewellness-postgres
```

### Check Container Status
```bash
docker ps
```

### Access Container Shell
```bash
# Web application
docker exec -it midlifewellness-webapp sh

# Database
docker exec -it midlifewellness-postgres sh
```

### Restart Containers
```bash
docker-compose restart
```

### Stop and Remove Containers
```bash
docker-compose down
```

### Remove Volumes (WARNING: This will delete all data)
```bash
docker-compose down -v
```

## Health Checks

The database container includes a health check that verifies PostgreSQL is ready to accept connections. The web application waits for the database to be healthy before starting.

## Network Configuration

Both containers are connected via a Docker bridge network (`midlifewellness-network`), allowing them to communicate using service names (e.g., `db:5432`).

## Volume Persistence

- `pgdata` volume: Stores PostgreSQL data (persists across container restarts)
- `uploads` volume: Stores uploaded files (persists across container restarts)

## Security Notes

1. Change default PostgreSQL passwords in production
2. Use strong `SESSION_SECRET` values
3. Keep environment variables secure
4. Use HTTPS in production (configure reverse proxy like Nginx)
5. Regularly update Docker images for security patches

