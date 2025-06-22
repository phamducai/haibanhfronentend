#!/bin/bash

echo "=== Setup Frontend với PM2 ==="

# Kiểm tra PM2
if ! command -v pm2 &> /dev/null; then
    echo "PM2 chưa được cài đặt. Đang cài PM2..."
    npm install -g pm2
else
    echo "PM2 đã được cài đặt: $(pm2 --version)"
fi

# Cấp quyền thực thi cho tất cả scripts
echo "Cấp quyền thực thi cho scripts..."
chmod +x *.sh

# Tạo folder logs
mkdir -p logs

# Cài đặt dependencies
if [ ! -d "node_modules" ]; then
    echo "Cài đặt dependencies..."
    npm install
else
    echo "Dependencies đã được cài đặt"
fi

# Build ứng dụng
echo "Building ứng dụng..."
npm run build

# Dừng app cũ nếu có
echo "Dừng app cũ (nếu có)..."
pm2 stop haismartlife-frontend 2>/dev/null || true
pm2 delete haismartlife-frontend 2>/dev/null || true

# Khởi động với PM2
echo "Khởi động với PM2..."
pm2 start ecosystem.config.mjs

# Lưu PM2 config
pm2 save
pm2 startup

echo ""
echo "🎉 Setup hoàn tất!"
echo ""
echo "📱 Truy cập: http://localhost:5173"
echo ""
echo "🛠️  Quản lý:"
echo "   ./status.sh   - Xem trạng thái"
echo "   ./restart.sh  - Restart app"
echo "   ./stop.sh     - Dừng app"
echo "   pm2 monit     - Monitor real-time"
echo ""

./status.sh 