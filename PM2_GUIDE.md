# Hướng dẫn chạy với PM2

## 🚀 Quick Start (Linux/Mac)

```bash
# Setup và chạy trong 1 lệnh
chmod +x setup.sh && ./setup.sh
```

## Cài đặt PM2

### Cài đặt PM2 global
```bash
npm install -g pm2
```

### Kiểm tra PM2 đã cài
```bash
pm2 --version
```

## Khởi động ứng dụng

### Cách 1: Dùng shell script (Linux/Mac)
```bash
# Cấp quyền thực thi cho tất cả scripts
chmod +x *.sh

# Khởi động ứng dụng
./start.sh

# Hoặc chạy từng bước:
# chmod +x start.sh
# ./start.sh
```

### Cách 1b: Dùng batch file (Windows)
```cmd
start.bat
```

### Cách 2: Chạy từng bước
```bash
# Cài đặt dependencies
npm install

# Build ứng dụng
npm run build

# Khởi động với PM2
npm run pm2:start
```

### Cách 3: Trực tiếp với PM2
```bash
pm2 start ecosystem.config.js
```

## Quản lý ứng dụng

### Scripts quản lý (Linux/Mac)
```bash
# Xem trạng thái và logs
./status.sh

# Restart ứng dụng
./restart.sh

# Dừng ứng dụng
./stop.sh
```

### Xem trạng thái
```bash
pm2 status
# hoặc
pm2 list
```

### Xem logs
```bash
npm run pm2:logs
# hoặc
pm2 logs haismartlife-frontend
```

### Monitor real-time
```bash
npm run pm2:monit
# hoặc
pm2 monit
```

### Restart ứng dụng
```bash
npm run pm2:restart
# hoặc
pm2 restart haismartlife-frontend
```

### Dừng ứng dụng
```bash
npm run pm2:stop
# hoặc
pm2 stop haismartlife-frontend
```

### Xóa ứng dụng khỏi PM2
```bash
npm run pm2:delete
# hoặc
pm2 delete haismartlife-frontend
```

## Truy cập ứng dụng

- **URL**: http://localhost:5173
- **Port**: 5173
- **Environment**: Production

## Logs

Logs sẽ được lưu trong folder `logs/`:
- `logs/out.log` - Output logs
- `logs/err.log` - Error logs  
- `logs/combined.log` - Combined logs

## Các tính năng PM2

- ✅ Auto restart khi crash
- ✅ Memory monitoring (restart nếu > 1GB)
- ✅ Log rotation
- ✅ Process monitoring
- ✅ Cluster mode (có thể scale)

## Troubleshooting

### Port đã bị sử dụng
```bash
# Tìm process đang dùng port 5173
netstat -ano | findstr :5173

# Kill process theo PID
taskkill /PID <PID> /F
```

### App không start
```bash
# Xem log chi tiết
pm2 logs haismartlife-frontend --lines 100

# Restart PM2 daemon
pm2 kill
pm2 resurrect
```

### Reset hoàn toàn
```bash
pm2 kill
pm2 flush
pm2 start ecosystem.config.js
``` 