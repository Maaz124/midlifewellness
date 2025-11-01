# Admin Panel Setup Guide

## Overview
The Admin Panel has been fully implemented with the following features:
- Separate admin authentication system
- Admin login page at `/admin/login`
- Admin dashboard at `/admin/dashboard`
- User statistics (total users, users with/without payments)
- Stripe key management interface

## Database Setup

### 1. Run Database Migration
First, you need to push the schema changes to your database:

```bash
npm run db:push
```

This will add:
- `is_admin` field to the `users` table
- `admin_config` table for storing configuration like Stripe keys

### 2. Create an Admin User

You need to manually set a user as admin. You can do this in your database:

```sql
-- Option 1: Update existing user to be admin
UPDATE users 
SET is_admin = true 
WHERE email = 'your-admin-email@example.com';

-- Option 2: Create a new admin user (requires registration first, then update)
-- After registering a user, run:
UPDATE users 
SET is_admin = true 
WHERE email = 'new-admin@example.com';
```

## Features

### Admin Login (`/admin/login`)
- Separate login page for administrators
- Only users with `is_admin = true` can log in
- Session-based authentication with `isAdmin` flag

### Admin Dashboard (`/admin/dashboard`)
The dashboard includes:

#### 1. User Statistics
- **Total Users**: Count of all registered users
- **Users with Payments**: Users who have coaching access or made resource purchases
- **Users without Payments**: Free tier users
- **Payment Rate**: Conversion percentage

#### 2. Stripe Keys Management
- View current Stripe publishable and secret keys
- Update Stripe keys (stored in `admin_config` table)
- Keys are stored securely in the database
- Secret key is masked when displayed
- Updates the Stripe instance in memory (may require server restart for full effect)

## API Endpoints

All admin endpoints require authentication via `isAdmin` middleware:

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/user` - Get current admin user
- `GET /api/admin/stats` - Get user statistics
- `GET /api/admin/stripe-keys` - Get Stripe keys
- `PUT /api/admin/stripe-keys` - Update Stripe keys

## Security Notes

1. **Admin Access**: Only users with `is_admin = true` can access admin routes
2. **Session Management**: Admin sessions are separate from regular user sessions
3. **Stripe Keys**: Secret keys are stored in the database and masked when displayed
4. **Middleware Protection**: All admin routes are protected by `isAdmin` middleware

## Usage

1. **First Time Setup**:
   - Run database migration: `npm run db:push`
   - Create an admin user in the database (see above)
   - Access `/admin/login` and log in with admin credentials

2. **Daily Use**:
   - Navigate to `/admin/login`
   - Enter admin email and password
   - View statistics and manage Stripe keys from the dashboard

3. **Updating Stripe Keys**:
   - Go to Admin Dashboard
   - Enter new publishable and secret keys
   - Click "Save Keys"
   - Keys are stored in the database
   - Server restart recommended for full effect

## Notes

- The admin dashboard is separate from the main site (no nav/footer)
- Admin login is completely separate from regular user login
- Stripe keys can be managed from the database or via the admin panel
- The system checks both database-stored keys and environment variables (env as fallback)
