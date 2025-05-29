#!/bin/bash

echo "🛑 Stopping TuneTrail Microservices..."

services=("gateway" "profile-service" "playlist-service" "social-service" "media-service" "comment-service" "analytics-service")

for service in "${services[@]}"; do
    if [ -f "pids/${service}.pid" ]; then
        pid=$(cat "pids/${service}.pid")
        if ps -p $pid > /dev/null; then
            echo "Stopping $service (PID: $pid)..."
            kill $pid
            rm "pids/${service}.pid"
            echo "✅ $service stopped"
        else
            echo "⚠️  $service was not running"
            rm "pids/${service}.pid"
        fi
    else
        echo "⚠️  No PID file found for $service"
    fi
done

echo ""
echo "🎉 All services stopped!"
