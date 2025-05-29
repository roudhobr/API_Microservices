#!/bin/bash

echo "🚀 Starting TuneTrail Microservices..."

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Function to start service
start_service() {
    local service_name=$1
    local port=$2
    local service_dir=$3
    
    echo "Starting $service_name on port $port..."
    
    if [ ! -d "$service_dir" ]; then
        echo "❌ Directory $service_dir not found!"
        return 1
    fi
    
    cd "$service_dir"
    
    # Check if .env exists
    if [ ! -f .env ]; then
        echo "Creating .env file for $service_name..."
        cp .env.example .env
        php artisan key:generate
    fi
    
    # Install dependencies if needed
    if [ ! -d "vendor" ]; then
        echo "Installing dependencies for $service_name..."
        composer install
    fi
    
    # Run migrations
    echo "Running migrations for $service_name..."
    php artisan migrate --force
    
    # Start service in background
    nohup php artisan serve --host=0.0.0.0 --port=$port > "../logs/${service_name}.log" 2>&1 &
    echo $! > "../pids/${service_name}.pid"
    
    echo "✅ $service_name started on port $port (PID: $(cat ../pids/${service_name}.pid))"
    cd ..
}

# Create directories for logs and PIDs
mkdir -p logs pids

# Check all ports first
echo "🔍 Checking port availability..."
ports=(8000 8001 8002 8003 8004 8005 8006)
services=("gateway" "profile-service" "playlist-service" "social-service" "media-service" "comment-service" "analytics-service")

for port in "${ports[@]}"; do
    if ! check_port $port; then
        echo "Please stop the service running on port $port and try again"
        exit 1
    fi
done

echo ""
echo "🏁 Starting all services..."

# Start each service
start_service "profile-service" 8001 "profile-service"
sleep 2

start_service "playlist-service" 8002 "playlist-service"
sleep 2

start_service "social-service" 8003 "social-service"
sleep 2

start_service "media-service" 8004 "media-service"
sleep 2

start_service "comment-service" 8005 "comment-service"
sleep 2

start_service "analytics-service" 8006 "analytics-service"
sleep 2

start_service "gateway" 8000 "gateway"
sleep 3

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📋 Service Status:"
echo "├── Gateway:          http://localhost:8000"
echo "├── Profile Service:  http://localhost:8001"
echo "├── Playlist Service: http://localhost:8002"
echo "├── Social Service:   http://localhost:8003"
echo "├── Media Service:    http://localhost:8004"
echo "├── Comment Service:  http://localhost:8005"
echo "└── Analytics Service: http://localhost:8006"
echo ""
echo "🔍 Health Check: curl http://localhost:8000/api/health"
echo "📚 API Docs: curl http://localhost:8000/api/docs"
echo ""
echo "📝 Logs are available in the 'logs' directory"
echo "🛑 To stop all services, run: ./stop-all-services.sh"
