#!/bin/bash

echo "🚀 Setting up TuneTrail Complete Project..."

# Create main project directory
mkdir -p tunetrail-complete
cd tunetrail-complete

# Backend Services
echo "📦 Setting up Backend Services..."

services=("profile-service" "playlist-service" "social-service" "media-service" "comment-service" "analytics-service" "gateway")

for service in "${services[@]}"; do
    echo "Creating $service..."
    laravel new $service
    cd $service
    
    # Install required packages
    composer require laravel/sanctum
    composer require fruitcake/laravel-cors
    
    # Publish Sanctum
    php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
    
    # Create .env from example
    cp .env.example .env
    php artisan key:generate
    
    cd ..
done

# Frontend
echo "🎨 Setting up Frontend..."
npx create-react-app frontend --template typescript
cd frontend

# Install frontend dependencies
npm install axios react-router-dom lucide-react react-hot-toast
npm install -D tailwindcss postcss autoprefixer @types/react @types/react-dom
npx tailwindcss init -p

cd ..

# Create database setup script
echo "🗄️ Creating database setup..."
cat > setup-databases.sql << 'EOF'
CREATE DATABASE IF NOT EXISTS tunetrail_gateway;
CREATE DATABASE IF NOT EXISTS tunetrail_profile;
CREATE DATABASE IF NOT EXISTS tunetrail_playlist;
CREATE DATABASE IF NOT EXISTS tunetrail_social;
CREATE DATABASE IF NOT EXISTS tunetrail_media;
CREATE DATABASE IF NOT EXISTS tunetrail_comment;
CREATE DATABASE IF NOT EXISTS tunetrail_analytics;
SHOW DATABASES LIKE 'tunetrail_%';
EOF

# Create startup scripts
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting all TuneTrail services..."

# Start backend services
./start-all-services.sh &

# Start frontend
cd frontend && npm start &

echo "✅ All services started!"
echo "Frontend: http://localhost:3000"
echo "Gateway: http://localhost:8000"
EOF

chmod +x start-all.sh

echo ""
echo "🎉 TuneTrail Complete Project Setup Finished!"
echo ""
echo "📋 Next Steps:"
echo "1. Setup databases: mysql -u root -p < setup-databases.sql"
echo "2. Configure .env files in each service"
echo "3. Run migrations in each service"
echo "4. Start all services: ./start-all.sh"
echo ""
echo "📁 Project Structure:"
echo "├── profile-service/     # User profiles & timeline"
echo "├── playlist-service/    # Playlist management"
echo "├── social-service/      # Social feed & interactions"
echo "├── media-service/       # File uploads & media"
echo "├── comment-service/     # Comments & reactions"
echo "├── analytics-service/   # User analytics & insights"
echo "├── gateway/            # API Gateway"
echo "└── frontend/           # React.js frontend"
