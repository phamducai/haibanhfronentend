#!/bin/bash

echo "Restarting haismartlife-frontend..."
pm2 restart haismartlife-frontend

echo "Application restarted!"
pm2 status 