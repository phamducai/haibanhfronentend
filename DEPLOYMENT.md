# 🚀 Production Deployment Guide

## 📦 Files Created

1. **Dockerfile** - Multi-stage build cho React app
2. **docker-compose.yml** - Chỉ frontend để kết nối với backend existing
3. **docker-compose.full.yml** - Full stack (DB + Backend + Frontend)
4. **.dockerignore** - Optimize build performance

## 🏃‍♂️ Deployment Options

### Option 1: Deploy Frontend Only (kết nối với backend đã chạy)

```bash
# Đảm bảo backend network đã tồn tại
docker network create app-network

# Chạy frontend
docker-compose up -d
```

Frontend sẽ chạy ở: `http://localhost:5173`

### Option 2: Deploy Full Stack

```bash
# Chạy tất cả services
docker-compose -f docker-compose.full.yml up -d
```

Services:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`
- **Database**: `localhost:5432`

## 🔧 Configuration

### Environment Variables
```bash
# Frontend container
NODE_ENV=production

# Backend proxy trong container
/api/v1 -> http://backend:3000
```

### Nginx Mapping (như bạn đã config)
```
localhost:80 -> localhost:5173 (Frontend container)
```

## 📋 Build Details

1. **Stage 1**: Build React app với `npm run build`
2. **Stage 2**: Serve với `vite preview` ở port 5173
3. **Network**: Kết nối với backend qua `app-network`
4. **Proxy**: API calls được proxy từ frontend container đến backend container

## 🔄 Commands

```bash
# Build chỉ frontend
docker-compose build

# Chạy backend trước (nếu chưa có)
cd ../backend && docker-compose up -d

# Chạy frontend
docker-compose up -d

# Xem logs
docker-compose logs -f frontend

# Stop
docker-compose down
```

## 🌐 Production URLs

- **Frontend**: `http://your-domain.com` (nginx proxy từ port 80 -> 5173)
- **API**: `http://your-domain.com/api/v1` (nginx proxy -> backend:3000)

## 🐛 Troubleshooting

1. **Network issues**: 
   ```bash
   docker network ls
   docker network create app-network
   ```

2. **Backend connection**:
   ```bash
   docker exec -it course_platform_frontend ping backend
   ```

3. **Logs**:
   ```bash
   docker logs course_platform_frontend
   ``` 