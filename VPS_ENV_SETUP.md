# Setting Up Environment Variables on VPS

## Overview
The webapp container needs environment variables for payments (Stripe), email (Gmail), and session management.

## Quick Setup

### Step 1: Create .env file on your VPS

On your VPS, navigate to the directory where your `docker-compose.prod.yml` file is located, then create a `.env` file:

```bash
# On your VPS
nano .env
```

### Step 2: Add your environment variables

Copy and paste this template, then fill in your actual values:

```bash
# Session Secret (generate a random string)
SESSION_SECRET=your-random-secret-here

# Stripe Payment Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
COACHING_INBOX=coaching@midliferebalance.com
```

### Step 3: Generate a secure session secret

Generate a random secret for SESSION_SECRET:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `SESSION_SECRET` value.

### Step 4: Save and restart containers

After creating/updating the `.env` file:

```bash
# Stop containers
docker-compose -f docker-compose.prod.yml down

# Start containers (they will automatically read the .env file)
docker-compose -f docker-compose.prod.yml up -d

# Check logs to verify
docker-compose -f docker-compose.prod.yml logs -f webapp
```

## Getting Your Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)
3. Copy your **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for production)
4. Add them to your `.env` file

## Getting Gmail App Password

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable it if not already enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Generate a new app password for "Mail"
5. Copy the 16-character password and use it as `GMAIL_APP_PASSWORD`

## Important Notes

### Frontend Stripe Key (VITE_STRIPE_PUBLIC_KEY)

The frontend needs `VITE_STRIPE_PUBLIC_KEY` at **build time**. Since you're using a pre-built Docker image (`maaz124/midlife-app:latest`), you have two options:

#### Option 1: Store Stripe keys in Database (Recommended)
After setting up your admin user, you can use the admin panel to store Stripe keys in the database:
1. Log in to `/admin/login`
2. Go to the admin dashboard
3. Add your Stripe keys in the Stripe Keys section
4. The app will use keys from the database (with env var fallback)

#### Option 2: Rebuild Docker Image with VITE_STRIPE_PUBLIC_KEY
If you need to rebuild the image with the frontend Stripe key:

```bash
# In your local development environment
export VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
docker build -f Dockerfile.webapp -t maaz124/midlife-app:latest .
docker push maaz124/midlife-app:latest

# Then on VPS, pull the new image
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

### Server-side Payments

The server-side Stripe configuration will work immediately with just the environment variables:
- `STRIPE_SECRET_KEY` - Used for creating payment intents
- The app also checks the database for Stripe keys (admin panel can override env vars)

## Verifying Configuration

### Check if environment variables are loaded:

```bash
# Access the webapp container
docker exec -it midlifewellness-webapp sh

# Check environment variables (without exposing secrets)
env | grep -E "STRIPE|GMAIL|SESSION" | sed 's/=.*/=***/'

# Exit container
exit
```

### Check application logs:

```bash
docker logs midlifewellness-webapp
```

Look for any errors related to Stripe or email configuration.

## Security Best Practices

1. **Never commit `.env` file to git** - It should be in `.gitignore`
2. **Use strong secrets** - Generate random strings for `SESSION_SECRET`
3. **Restrict file permissions** - On your VPS:
   ```bash
   chmod 600 .env
   ```
4. **Use production Stripe keys** - Switch from `sk_test_` to `sk_live_` when going live
5. **Rotate secrets regularly** - Change `SESSION_SECRET` periodically

## Troubleshooting

### Payments not working?
1. Check that `STRIPE_SECRET_KEY` is set correctly
2. Verify Stripe keys are active in Stripe dashboard
3. Check container logs: `docker logs midlifewellness-webapp`
4. Try storing keys via admin panel (database takes precedence)

### Email not working?
1. Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correct
2. Make sure 2-Step Verification is enabled on Google account
3. Check that app password was generated correctly
4. Check container logs for email errors

### Environment variables not loading?
1. Make sure `.env` file is in the same directory as `docker-compose.prod.yml`
2. Restart containers after creating/updating `.env` file
3. Check file permissions: `ls -la .env`
4. Verify variable names match exactly (case-sensitive)

## File Structure on VPS

Your VPS directory should look like this:

```
/path/to/your/project/
├── docker-compose.prod.yml
├── .env                    # Your environment variables (not in git)
└── (other files)
```

## Updating Environment Variables

After updating `.env` file:

```bash
# Restart the webapp service to reload env vars
docker-compose -f docker-compose.prod.yml restart webapp

# Or recreate the container
docker-compose -f docker-compose.prod.yml up -d --force-recreate webapp
```


