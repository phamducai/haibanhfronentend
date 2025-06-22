@echo off
echo ===================================
echo    HAI SMART LIFE - FRONTEND DEPLOY
echo ===================================

REM Tạo folder logs
if not exist "logs" mkdir logs

REM Kiểm tra PM2
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo Installing PM2 globally...
    npm install -g pm2
)

REM Cài đặt dependencies
echo Installing dependencies...
npm install

REM Build application
echo Building application...
npm run build

REM Dừng app cũ nếu có
echo Stopping old application...
pm2 stop haismartlife-frontend >nul 2>&1
pm2 delete haismartlife-frontend >nul 2>&1

REM Khởi động với PM2
echo Starting with PM2...
pm2 start ecosystem.config.js

REM Lưu PM2 config
pm2 save

echo.
echo ===================================
echo    DEPLOY THÀNH CÔNG!
echo ===================================
echo.
echo Truy cập: http://localhost:5173
echo.
echo Lệnh quản lý:
echo   pm2 status          - Xem trạng thái
echo   pm2 logs            - Xem logs
echo   pm2 monit           - Monitor thời gian thực
echo   pm2 restart app     - Restart app
echo   pm2 stop app        - Dừng app
echo.

pause 