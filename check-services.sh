#!/bin/bash

echo "🔍 Checking TuneTrail Services Status..."
echo ""

services=(
    "Gateway:8000"
    "Profile:8001" 
    "Playlist:8002"
    "Social:8003"
    "Media:8004"
    "Comment:8005"
    "Analytics:8006"
)

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -s "http://localhost:$port/api/health" > /dev/null; then
        echo "✅ $name Service (Port $port): Running"
    else
        echo "❌ $name Service (Port $port): Not responding"
    fi
done

echo ""
echo "🌐 Gateway Health Check:"
curl -s http://localhost:8000/api/health | jq '.' 2>/dev/null || curl -s http://localhost:8000/api/health
