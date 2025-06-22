#!/bin/bash

echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Recent Logs ==="
pm2 logs haismartlife-frontend --lines 20

echo ""
echo "Commands:"
echo "  Monitor:  pm2 monit"
echo "  Logs:     pm2 logs haismartlife-frontend"
echo "  Restart:  ./restart.sh"
echo "  Stop:     ./stop.sh" 