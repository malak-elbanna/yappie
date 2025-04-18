#!/bin/sh

echo "Waiting for database..."
while ! nc -z profile-db 5432; do   
    sleep 1
done
echo "Database is up!"

echo "Running database migrations..."
flask db upgrade

exec "$@"
