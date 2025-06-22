#!/bin/bash

echo "==================================="
echo "  HAI SMART LIFE - FRONTEND DEPLOY"
echo "==================================="

# Kiểm tra PM2
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2 globally..."
    npm install -g pm2
fi

# Tạo folder logs
mkdir -p logs

# Cài đặt dependencies
echo "Installing dependencies..."
npm install

# Build application
echo "Building application..."
npm run build

# Dừng app cũ nếu có
echo "Stopping old application..."
pm2 stop haismartlife-frontend 2>/dev/null || true
pm2 delete haismartlife-frontend 2>/dev/null || true

# Khởi động với PM2
echo "Starting with PM2..."
pm2 start ecosystem.config.js

# Lưu PM2 config
pm2 save

# Tự động khởi động khi restart hệ thống
pm2 startup

echo ""
echo "==================================="
echo "    DEPLOY THÀNH CÔNG!"
echo "==================================="
echo ""
echo "🌐 Truy cập: http://localhost:5173"
echo ""
echo "📋 Lệnh quản lý:"
echo "   pm2 status          - Xem trạng thái"
echo "   pm2 logs            - Xem logs"
echo "   pm2 monit           - Monitor thời gian thực"
echo "   pm2 restart app     - Restart app"
echo "   pm2 stop app        - Dừng app"
echo ""

# Hiển thị trạng thái
pm2 status 