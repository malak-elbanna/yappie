#!/bin/bash

# Wait for database
echo "Waiting for database..."
while ! nc -z profile-db 5432; do
    sleep 1
done
echo "Database is ready!"

if [ ! -d "migrations" ]; then
    echo "Creating migrations directory..."
    flask db init
fi

echo "Generating new migrations..."
flask db migrate -m "automatic migration $(date +%Y%m%d_%H%M%S)"

echo "Applying migrations..."
flask db upgrade

echo "Starting application..."
exec "$@"