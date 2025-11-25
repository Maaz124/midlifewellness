# Docker Networking Explained

## How Containers Communicate

### Container-to-Container Communication (Inside Docker Network)

When containers are on the same Docker network (like `midlifewellness-network`), they communicate using:

1. **Service Names**: Instead of `localhost`, use the service name (e.g., `db`)
2. **Internal Ports**: Use the internal container port (e.g., `5432`), NOT the external mapped port

**Example:**
```
# Web app container connecting to database container
DATABASE_URL=postgresql://postgres:postgres@db:5432/midlife
                         ↑              ↑
                    service name    internal port
```

### External Access (From Host Machine)

When connecting from outside Docker (your host machine, external tools, etc.):

1. **Use `localhost`**: Connect to `localhost` or `127.0.0.1`
2. **External Port**: Use the external mapped port (e.g., `5433`)

**Example:**
```
# From your host machine or external tools
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/midlife
                         ↑                    ↑
                      localhost          external port
```

## Port Mappings Explained

In `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # External port 5433 maps to internal port 5432
  #   ↑     ↑
  #  host  container
```

This means:
- **Inside Docker**: Containers use port `5432` (internal)
- **Outside Docker**: Access via port `5433` (external)

## Environment Variables Priority

1. **docker-compose.yml environment section** (highest priority)
2. **.env file** (if using `${VARIABLE:-default}` syntax)
3. **System environment variables**

### Current Configuration

The `docker-compose.yml` uses:
```yaml
environment:
  - DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@db:5432/midlife}
```

This means:
- If `.env` file has `DATABASE_URL`, it will be used
- If not, it defaults to `postgresql://postgres:postgres@db:5432/midlife`
- **The value in docker-compose.yml environment section takes precedence**

## Database Connection Logic

The application (`server/db.ts`) automatically detects the database type:

1. **Local PostgreSQL** (Docker/localhost): Uses `pg` driver
   - Detects: `localhost`, `127.0.0.1`, `db` (service name), or non-Neon URLs
   
2. **Neon Database** (Cloud): Uses Neon serverless driver
   - Detects: URLs containing `neon.tech` or Neon-specific patterns

## Configuration Scenarios

### Scenario 1: Running with Docker Compose

**For container-to-container communication:**
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/midlife
```

**Why `db:5432`?**
- `db` = service name in docker-compose.yml
- `5432` = internal container port
- Docker DNS resolves `db` to the database container's IP

### Scenario 2: Connecting from Host Machine

**For external tools (pgAdmin, DBeaver, etc.):**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/midlife
```

**Why `localhost:5433`?**
- `localhost` = your host machine
- `5433` = external port mapped in docker-compose.yml

### Scenario 3: Running Locally (No Docker)

**For local development:**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/midlife
```

**Why `localhost:5432`?**
- `localhost` = local PostgreSQL instance
- `5432` = standard PostgreSQL port

## Network Architecture

```
┌─────────────────────────────────────────────────┐
│              Host Machine                       │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │     Docker Network (bridge)              │  │
│  │                                           │  │
│  │  ┌──────────────┐      ┌──────────────┐ │  │
│  │  │  Web App     │      │  Database    │ │  │
│  │  │  Container   │──────│  Container   │ │  │
│  │  │  Port 5000   │      │  Port 5432   │ │  │
│  │  │  (internal)  │      │  (internal)  │ │  │
│  │  └──────┬───────┘      └──────┬───────┘ │  │
│  │         │                      │         │  │
│  └─────────┼──────────────────────┼─────────┘  │
│            │                      │             │
│        6000:5000              5433:5432        │
│            │                      │             │
│            └──────────────────────┘             │
│                   External Access               │
└─────────────────────────────────────────────────┘
```

## Troubleshooting

### Container Can't Connect to Database

1. **Check service name**: Ensure `DATABASE_URL` uses `db` (service name), not `localhost`
2. **Check port**: Use `5432` (internal), not `5433` (external)
3. **Check network**: Both containers must be on the same network
4. **Check health**: Database container must be healthy before webapp starts

### External Tools Can't Connect

1. **Check port**: Use `5433` (external), not `5432` (internal)
2. **Check host**: Use `localhost`, not `db`
3. **Check firewall**: Ensure port 5433 is not blocked

### Environment Variable Not Working

1. **Check priority**: docker-compose.yml overrides .env file
2. **Check syntax**: Use `${VARIABLE:-default}` in docker-compose.yml
3. **Check file**: Ensure .env file is in the same directory as docker-compose.yml

## Best Practices

1. **Use service names** for container-to-container communication
2. **Use localhost** for external access
3. **Document port mappings** clearly
4. **Use .env files** for sensitive data (and add to .gitignore)
5. **Use docker-compose.yml** for default values and container-specific configs

## Summary

- **Inside Docker**: `db:5432` (service name + internal port)
- **Outside Docker**: `localhost:5433` (localhost + external port)
- **docker-compose.yml environment** overrides `.env` file
- **Port mapping** only affects external access, not container communication



