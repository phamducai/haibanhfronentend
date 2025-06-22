#!/bin/bash

# Quick Deploy Script cho Linux
echo "🚀 QUICK DEPLOY - HAI SMART LIFE"

# Cài PM2 nếu chưa có
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  Cài đặt PM2..."
    sudo npm install -g pm2
fi

# Tạo logs folder
mkdir -p logs

# Install + Build + Deploy trong 1 lần
echo "📦 Installing dependencies..."
npm install &

echo "🔨 Building application..."
npm run build &

wait # Đợi cả 2 lệnh hoàn thành

# Deploy
echo "🎯 Deploying with PM2..."
pm2 stop haismartlife-frontend 2>/dev/null || true
pm2 delete haismartlife-frontend 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ DEPLOY HOÀN TẤT!"
echo "🌐 URL: http://localhost:5173"
echo "📊 Monitor: pm2 monit" 