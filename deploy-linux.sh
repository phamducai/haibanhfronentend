#!/bin/bash

echo "🚀 DEPLOY HAI SMART LIFE - LINUX"
echo "================================"

# Kiểm tra PM2
if ! command -v pm2 &> /dev/null; then
    echo "⚠️ Installing PM2..."
    npm install -g pm2 || sudo npm install -g pm2
fi

# Tạo logs folder
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🔨 Building application..."
npm run build

# Dừng app cũ
echo "🛑 Stopping old application..."
pm2 stop haismartlife-frontend 2>/dev/null || true
pm2 delete haismartlife-frontend 2>/dev/null || true

# Thử các config file khác nhau
echo "🎯 Starting with PM2..."

# Thử file config theo thứ tự ưu tiên
if [ -f "ecosystem.config.cjs" ]; then
    echo "Using ecosystem.config.cjs..."
    pm2 start ecosystem.config.cjs
elif [ -f "pm2.config.js" ]; then
    echo "Using pm2.config.js..."
    pm2 start pm2.config.js
elif [ -f "ecosystem.config.js" ]; then
    echo "Using ecosystem.config.js..."
    pm2 start ecosystem.config.js
else
    echo "❌ No PM2 config file found!"
    exit 1
fi

# Lưu PM2 config
pm2 save

echo ""
echo "✅ DEPLOY THÀNH CÔNG!"
echo "🌐 URL: http://localhost:5173"
echo "📊 Monitor: pm2 monit"
echo ""

# Hiển thị status
pm2 status 