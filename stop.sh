#!/bin/bash

echo "Stopping haismartlife-frontend..."
pm2 stop haismartlife-frontend

echo "Application stopped!"
pm2 status 