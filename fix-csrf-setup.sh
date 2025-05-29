#!/bin/bash

echo "🔧 Fixing CSRF Token Issues..."

# Gateway Service
echo "Configuring Gateway Service..."
cd gateway

# Clear all caches
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear

# Publish Sanctum if not already done
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --force

# Generate app key if needed
php artisan key:generate

# Run migrations
php artisan migrate --force

cd ..

# Profile Service
echo "Configuring Profile Service..."
cd profile-service

# Clear all caches
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear

# Publish Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --force

# Generate app key if needed
php artisan key:generate

# Run migrations
php artisan migrate --force

cd ..

echo "✅ CSRF Configuration Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Make sure all services are stopped"
echo "2. Start all services: ./start-all-services.sh"
echo "3. Test login/register from frontend"
echo ""
echo "🔍 If still having issues, check:"
echo "- Backend logs: tail -f logs/*.log"
echo "- Frontend network tab in browser"
echo "- CORS headers in response"
