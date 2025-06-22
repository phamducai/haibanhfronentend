#!/bin/bash

echo "🚀 HAI SMART LIFE - FINAL DEPLOY"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check PM2
print_status "Checking PM2 installation..."
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 not found. Installing..."
    npm install -g pm2 || sudo npm install -g pm2
    if [ $? -eq 0 ]; then
        print_status "PM2 installed successfully"
    else
        print_error "Failed to install PM2"
        exit 1
    fi
else
    print_status "PM2 is already installed: $(pm2 --version)"
fi

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Install dependencies
print_status "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

# Build application
print_status "Building application..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build application"
    exit 1
fi

# Stop existing application
print_status "Stopping existing application..."
pm2 stop haismartlife-frontend 2>/dev/null || true
pm2 delete haismartlife-frontend 2>/dev/null || true

# Try different PM2 config files
print_status "Starting application with PM2..."

if [ -f "ecosystem.config.mjs" ]; then
    print_status "Using ecosystem.config.mjs (ES Modules)"
    pm2 start ecosystem.config.mjs
elif [ -f "ecosystem.config.cjs" ]; then
    print_status "Using ecosystem.config.cjs (CommonJS)"
    pm2 start ecosystem.config.cjs
elif [ -f "pm2.config.js" ]; then
    print_status "Using pm2.config.js"
    pm2 start pm2.config.js
else
    print_warning "No PM2 config file found. Starting directly..."
    pm2 start "npm run preview" --name haismartlife-frontend --log-date-format 'YYYY-MM-DD HH:mm:ss' --error ./logs/err.log --output ./logs/out.log
fi

if [ $? -eq 0 ]; then
    print_status "Application started successfully!"
else
    print_error "Failed to start application"
    exit 1
fi

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

# Setup startup script (optional)
print_status "Setting up PM2 startup script..."
pm2 startup | grep -E '^sudo' | bash 2>/dev/null || print_warning "Could not setup startup script (may require manual setup)"

echo ""
echo "🎉 DEPLOY COMPLETED SUCCESSFULLY!"
echo "=================================="
echo "🌐 URL: http://localhost:5173"
echo "📊 Monitor: pm2 monit"
echo "📋 Status: pm2 status"
echo "📝 Logs: pm2 logs haismartlife-frontend"
echo ""

# Show current status
print_status "Current PM2 status:"
pm2 status 