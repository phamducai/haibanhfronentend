# 🐧 DEPLOY TRÊN LINUX - SIÊU ĐƠN GIẢN

## 🚀 Deploy 1 lệnh duy nhất

```bash
chmod +x deploy.sh && ./deploy.sh
```

## 📋 Các script có sẵn cho Linux

### 1. **Deploy hoàn chỉnh**:
```bash
./deploy.sh
```
> Tự động: cài PM2 → cài dependencies → build → start

### 2. **Setup ban đầu**:
```bash
./setup.sh
```

### 3. **Quản lý nhanh**:
```bash
./status.sh    # Xem trạng thái + logs
./restart.sh   # Restart app
./stop.sh      # Dừng app
```

## 🔧 Cài đặt PM2 trên Linux

### Ubuntu/Debian:
```bash
# Cài Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài PM2
sudo npm install -g pm2
```

### CentOS/RHEL:
```bash
# Cài Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Cài PM2
sudo npm install -g pm2
```

### Arch Linux:
```bash
sudo pacman -S nodejs npm
sudo npm install -g pm2
```

## 🎯 Auto-start khi boot hệ thống

```bash
# Tạo startup script
pm2 startup

# Chạy lệnh mà PM2 hiển thị (sẽ có sudo)
# Ví dụ: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username

# Lưu cấu hình hiện tại
pm2 save
```

## 🐳 Deploy với Docker (Linux)

### Option 1: PM2 trong container
```bash
# Build và chạy
docker-compose up -d
```

### Option 2: PM2 trên host, serve container
```bash
# Build container
docker build -t frontend-app .

# Chạy với PM2
pm2 start ecosystem.config.js
```

## 📊 Monitor nâng cao trên Linux

### PM2 Web Dashboard:
```bash
# Cài PM2 Plus (free)
pm2 install pm2-server-monit

# Hoặc chạy web dashboard local
pm2 web
```

### System monitoring:
```bash
# Xem resource usage
pm2 monit

# Logs real-time
pm2 logs --lines 100 -f
```

## 🛠️ Scripts tự động cho production

### Backup logs:
```bash
#!/bin/bash
# backup-logs.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "logs_backup_$DATE.tar.gz" logs/
echo "Logs backed up to logs_backup_$DATE.tar.gz"
```

### Auto-update:
```bash
#!/bin/bash
# update.sh
git pull origin main
npm install
npm run build
pm2 restart haismartlife-frontend
```

## 🔥 Performance tuning cho Linux

### Tăng file descriptor limits:
```bash
# /etc/security/limits.conf
* soft nofile 65536
* hard nofile 65536
```

### PM2 cluster mode (multi-core):
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'haismartlife-frontend',
    script: 'npm',
    args: 'run preview',
    instances: 'max', // Sử dụng tất cả CPU cores
    exec_mode: 'cluster'
  }]
}
```

## 🆘 Troubleshooting Linux

### Port đã bị sử dụng:
```bash
sudo lsof -i :5173
sudo kill -9 <PID>
```

### Permission issues:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### Firewall (Ubuntu):
```bash
sudo ufw allow 5173
sudo ufw reload
```

---

## ⚡ TL;DR - Chỉ cần nhớ:

```bash
# Deploy một lần duy nhất
chmod +x deploy.sh && ./deploy.sh

# Truy cập
curl http://localhost:5173

# Quản lý
pm2 status
pm2 monit
```

🎉 **Linux deploy thậm chí còn đơn giản hơn Windows!** 