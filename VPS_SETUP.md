# VPS Setup Instructions

## WebSocket/HMR Configuration Fix

The WebSocket connection error (`ws://localhost:undefined`) occurs because Vite's HMR (Hot Module Replacement) needs to know the correct host for WebSocket connections on a VPS.

## Solution

Set the following environment variable on your VPS:

```bash
export VITE_HMR_HOST=178.128.119.158
```

Or if using a domain:
```bash
export VITE_HMR_HOST=yourdomain.com
```

## For Production (Recommended)

If you're running in production mode, HMR is automatically disabled. Make sure:

```bash
export NODE_ENV=production
```

This will:
- Disable Vite HMR (no WebSocket needed)
- Serve static files instead
- Improve performance

## Environment Variables Checklist

Make sure these are set on your VPS:

1. **Database:**
   ```bash
   export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/midlife
   ```

2. **Session Secret:**
   ```bash
   export SESSION_SECRET=your-secret-key-here
   ```

3. **For Development (if using HMR):**
   ```bash
   export VITE_HMR_HOST=178.128.119.158  # Your VPS IP
   export NODE_ENV=development
   ```

4. **For Production:**
   ```bash
   export NODE_ENV=production
   ```

## Quick Fix

If you just want to disable HMR and use production mode:

1. Set `NODE_ENV=production` in your environment
2. Restart your server
3. The app will serve static files (no WebSocket needed)

## Testing

After setting the environment variables, restart your server and check:
- No WebSocket errors in browser console
- App loads correctly
- API endpoints work

