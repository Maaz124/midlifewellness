# Stripe Database Configuration - Fixed

## Problem
The frontend was hardcoded to use `VITE_STRIPE_PUBLIC_KEY` from build-time environment variables, which meant it couldn't use Stripe keys stored in the database via the admin panel.

## Solution
The application now fetches Stripe keys dynamically from the database at runtime:

1. **Public API Endpoint**: Created `/api/stripe-public-key` endpoint that returns the Stripe publishable key from the database (safe to expose publicly)
2. **Frontend Updates**: Both `checkout.tsx` and `resource-checkout.tsx` now fetch the Stripe publishable key from the API instead of using build-time env variables
3. **Backend Updates**: All payment endpoints now use `getStripeInstance()` which checks the database first, then falls back to environment variables

## How It Works

### Database-First Configuration
1. Stripe keys stored in the `admin_config` table take precedence
2. Environment variables (`STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`) are used as fallback
3. Keys are cached for 1 minute to reduce database queries
4. Cache is automatically cleared when keys are updated via admin panel

### Frontend Flow
1. Frontend fetches `/api/stripe-public-key` on page load
2. Stripe is initialized with the key from the API
3. Payment forms work with the dynamically loaded key

### Backend Flow
1. Payment endpoints use `getStripeInstance()` which:
   - Checks database for Stripe secret key
   - Falls back to `STRIPE_SECRET_KEY` environment variable
   - Returns a Stripe instance ready for API calls

## Setting Up Stripe Keys

### Via Admin Panel (Recommended)
1. Log in to `/admin/login`
2. Navigate to the admin dashboard
3. Go to the Stripe Keys section
4. Enter your Stripe Publishable Key and Secret Key
5. Click Save
6. Keys are immediately available (cache cleared automatically)

### Via Environment Variables (Fallback)
Add to your `.env` file on VPS:
```bash
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## API Endpoints

### Public Endpoints
- `GET /api/stripe-public-key` - Returns Stripe publishable key (no authentication required)

### Admin Endpoints (Requires Admin Authentication)
- `GET /api/admin/stripe-keys` - Get both keys (for admin dashboard)
- `PUT /api/admin/stripe-keys` - Update keys in database

## Benefits

1. **No Rebuild Required**: Keys can be updated via admin panel without rebuilding Docker images
2. **Database-First**: Keys stored in database are the source of truth
3. **Environment Fallback**: Still works with environment variables if database doesn't have keys
4. **Automatic Cache Clearing**: Cache is cleared when keys are updated via admin panel
5. **Secure**: Secret key is never exposed to frontend (only publishable key)

## Testing

After adding Stripe keys via admin panel:
1. Refresh the checkout page
2. You should see the payment form (no longer see "Payments Not Configured")
3. Test payment flow with Stripe test cards

## Notes

- The cache TTL is 1 minute, so changes may take up to 1 minute to reflect
- When keys are updated via admin panel, the cache is immediately cleared
- The frontend will show a loading state while fetching the Stripe key
- If keys are not configured, the frontend will show a helpful error message


