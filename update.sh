#!/bin/bash

echo "🔄 UPDATING APPLICATION..."

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install new dependencies (if any)
echo "📦 Installing dependencies..."
npm install

# Build
echo "🔨 Building..."
npm run build

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart haismartlife-frontend

echo ""
echo "✅ UPDATE COMPLETE!"
echo "🌐 URL: http://localhost:5173"

# Show status
pm2 status 