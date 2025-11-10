#!/bin/sh
# Docker entrypoint script to handle permissions and initialization

set -e

# Create uploads directory if it doesn't exist and set permissions
if [ ! -d "/app/uploads" ]; then
    mkdir -p /app/uploads/resources
    chown -R nodejs:nodejs /app/uploads
fi

# Ensure uploads directory has correct permissions
chown -R nodejs:nodejs /app/uploads 2>/dev/null || true

# Switch to nodejs user and run the application
exec su-exec nodejs "$@"

