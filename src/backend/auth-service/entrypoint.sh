#!/bin/bash

echo "Waiting for database..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "Running database migrations..."
flask db upgrade

echo "Creating admin..."
python scripts/admin_setup.py

exec "$@"
