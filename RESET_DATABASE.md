# Reset Database with New Password

Follow these steps to remove the old database and initialize a fresh one with your new password.

## Steps to Reset Database

### 1. Stop and Remove Containers + Volumes

```bash
cd /root/midlifewellness
docker compose -f docker-compose.prod.yml down -v
```

This will:
- Stop all containers
- Remove containers
- **Remove all volumes** (including the old database data)

### 2. Verify Your .env_prodd File

Make sure your `.env_prodd` file has the new password set:

```bash
cat .env_prodd | grep POSTGRES_PASSWORD
```

It should show your new password.

### 3. Start Fresh Containers

```bash
docker compose -f docker-compose.prod.yml --env-file .env_prodd up -d --pull always
```

This will:
- Pull latest images
- Create new containers
- Initialize a fresh database with your new password

### 4. Wait for Database to be Ready

Check that the database container is healthy:

```bash
docker compose -f docker-compose.prod.yml ps
```

Wait until the `db` service shows as "healthy" (this may take 30-60 seconds).

### 5. Initialize Database Schema

Once the database is healthy, initialize the schema:

```bash
docker exec -it midlifewellness-webapp npm run db:push
```

This creates all the necessary tables.

### 6. Verify Everything Works

Check the logs to make sure there are no connection errors:

```bash
docker logs midlifewellness-webapp
docker logs midlifewellness-postgres
```

## Quick One-Liner (All Steps Combined)

If you want to do it all at once:

```bash
cd /root/midlifewellness && \
docker compose -f docker-compose.prod.yml down -v && \
docker compose -f docker-compose.prod.yml --env-file .env_prodd up -d --pull always && \
echo "Waiting for database to be ready..." && \
sleep 30 && \
docker exec -it midlifewellness-webapp npm run db:push && \
echo "Database reset complete!"
```

## Important Notes

⚠️ **WARNING**: The `down -v` command will **DELETE ALL DATABASE DATA**. Only do this if you're okay losing all existing data.

✅ After reset, your database will be initialized with:
- The new password from `.env_prodd`
- Fresh, empty database
- Schema will be created when you run `npm run db:push`

