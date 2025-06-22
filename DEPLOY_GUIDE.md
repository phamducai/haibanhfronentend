# 🚀 HƯỚNG DẪN DEPLOY SIÊU ĐƠN GIẢN

## ⚡ Deploy 1 lệnh duy nhất

### Windows:
```cmd
deploy.bat
```

### Linux/Mac:
```bash
./deploy.sh
```

## 🎯 Truy cập ứng dụng
- **URL**: http://localhost:5173
- **Port**: 5173

## 📋 Quản lý ứng dụng

### Xem trạng thái:
```bash
pm2 status
```

### Xem logs:
```bash
pm2 logs
```

### Monitor thời gian thực:
```bash
pm2 monit
```

### Restart:
```bash
pm2 restart haismartlife-frontend
```

### Dừng:
```bash
pm2 stop haismartlife-frontend
```

## 🔧 Tính năng PM2 đã cấu hình

✅ **Tự động restart** khi crash  
✅ **Giới hạn memory** (1GB)  
✅ **Log rotation** tự động  
✅ **Error handling** thông minh  
✅ **Auto startup** khi khởi động hệ thống  

## 📁 Logs được lưu tại:
- `logs/out.log` - Output logs
- `logs/err.log` - Error logs  
- `logs/combined.log` - Combined logs

## 🆘 Khắc phục sự cố

### Nếu port 5173 bị chiếm:
```cmd
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Reset hoàn toàn:
```bash
pm2 kill
pm2 start ecosystem.config.js --env production
```

---
🎉 **Chỉ cần chạy `deploy.bat` và tất cả sẽ hoạt động tự động!** 