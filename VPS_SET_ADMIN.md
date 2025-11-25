# Setting Admin User on VPS

## Option 1: Using the set-admin script (if you have source code on VPS)

### Step 1: Access the webapp container
```bash
docker exec -it midlifewellness-webapp sh
```

### Step 2: Copy the script file into the container (from your VPS host)
If you have the source code on your VPS, you can copy the script into the container:

**From your VPS terminal (outside the container):**
```bash
# Copy the script file into the container
docker cp scripts/set-admin.ts midlifewellness-webapp:/app/scripts/set-admin.ts

# Copy the shared folder if needed (for schema)
docker cp shared midlifewellness-webapp:/app/shared

# Copy server/db.js if needed (check if it's in dist)
docker cp server/db.ts midlifewellness-webapp:/app/server/db.ts 2>/dev/null || echo "db.ts might be in dist"
```

### Step 3: Install tsx in the container (if not already installed)
```bash
# Inside the container
npm install tsx --save-dev
```

### Step 4: Run the script
```bash
# Inside the container
npm run set-admin <email@example.com>
# Or directly:
npx tsx scripts/set-admin.ts <email@example.com>
```

## Option 2: Direct SQL update (Simpler - Recommended)

### Step 1: Access the database container
```bash
docker exec -it midlifewellness-postgres psql -U postgres -d midlife
```

### Step 2: Update the user to admin
```sql
-- Replace 'your-email@example.com' with the actual email
UPDATE users 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

### Step 3: Verify the update
```sql
SELECT email, is_admin FROM users WHERE email = 'your-email@example.com';
```

### Step 4: Exit the database
```sql
\q
```

## Option 3: Run script from VPS host (if you have Node.js installed on VPS)

If you have the source code and Node.js installed on your VPS (not in the container):

```bash
# Navigate to your project directory on VPS
cd /path/to/MidlifeWellness

# Set the DATABASE_URL environment variable to point to the container
export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/midlife"

# Run the script
npm run set-admin <email@example.com>
```

## Quick Reference Commands

### List running containers
```bash
docker ps
```

### Access webapp container shell
```bash
docker exec -it midlifewellness-webapp sh
```

### Access database container
```bash
docker exec -it midlifewellness-postgres psql -U postgres -d midlife
```

### View container logs
```bash
docker logs midlifewellness-webapp
docker logs midlifewellness-postgres
```


