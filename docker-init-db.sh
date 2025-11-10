#!/bin/sh
# Database initialization script for Docker container
# This script runs the database schema migration

echo "Waiting for database to be ready..."
sleep 5

echo "Running database schema migration..."
npm run db:push

if [ $? -eq 0 ]; then
    echo "Database schema migration completed successfully!"
else
    echo "Database schema migration failed!"
    exit 1
fi

