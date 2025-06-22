@echo off

REM Tạo folder logs nếu chưa có
if not exist "logs" mkdir logs

REM Cài đặt dependencies nếu chưa có
if not exist "node_modules" (
  echo Installing dependencies...
  npm install
)

REM Build app
echo Building application...
npm run build

REM Khởi động với PM2
echo Starting with PM2...
pm2 start ecosystem.config.js

REM Hiển thị status
pm2 status

echo.
echo Application started successfully!
echo Access: http://localhost:5173
echo Monitor: pm2 monit
echo Logs: pm2 logs haismartlife-frontend

pause 