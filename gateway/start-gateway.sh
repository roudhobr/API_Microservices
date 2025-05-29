#!/bin/bash

echo "Starting TuneTrail API Gateway..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    php artisan key:generate
fi

# Install dependencies
echo "Installing dependencies..."
composer install --no-dev --optimize-autoloader

# Clear and cache config
echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start the gateway
echo "Starting gateway on port 8000..."
php artisan serve --host=0.0.0.0 --port=8000

echo "Gateway started successfully!"
echo "Health check: http://localhost:8000/api/health"
echo "Documentation: http://localhost:8000/api/docs"
