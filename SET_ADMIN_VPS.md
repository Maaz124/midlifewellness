# Set Admin User on VPS - Quick Guide

## Step 1: Access the Database Container

Run this command on your VPS terminal:

```bash
docker exec -it midlifewellness-postgres psql -U postgres -d midlife
```

This will connect you to the PostgreSQL database inside the container.

## Step 2: Check Existing Users (Optional)

First, let's see what users exist in your database:

```sql
SELECT email, first_name, last_name, is_admin FROM users;
```

## Step 3: Set User as Admin

Replace `your-email@example.com` with the actual email address of the user you want to make an admin:

```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

**Example:**
```sql
UPDATE users SET is_admin = true WHERE email = 'admin@midliferebalance.com';
```

## Step 4: Verify the Update

Check that the user is now an admin:

```sql
SELECT email, first_name, last_name, is_admin FROM users WHERE email = 'your-email@example.com';
```

You should see `is_admin = t` (true) for that user.

## Step 5: Exit the Database

Type:

```sql
\q
```

## Complete Example Session

Here's what a complete session would look like:

```bash
# On your VPS terminal
$ docker exec -it midlifewellness-postgres psql -U postgres -d midlife

# Inside psql
midlife=# SELECT email, is_admin FROM users;
           email            | is_admin 
----------------------------+----------
 user@example.com           | f
 admin@example.com          | f
(2 rows)

midlife=# UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
UPDATE 1

midlife=# SELECT email, is_admin FROM users WHERE email = 'admin@example.com';
        email         | is_admin 
----------------------+----------
 admin@example.com    | t
(1 row)

midlife=# \q
```

## Troubleshooting

### If the container name is different:
List all running containers to find the correct name:
```bash
docker ps
```

### If the user doesn't exist:
Make sure the user has registered first. You can only set existing users as admin.

### If you get a permission error:
Make sure you're using the correct credentials:
- User: `postgres`
- Password: `postgres`
- Database: `midlife`


