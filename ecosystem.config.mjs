// PM2 Configuration with ES Modules syntax
export default {
  apps: [
    {
      name: 'haismartlife-frontend',
      script: './node_modules/.bin/vite',
      args: 'preview --host 0.0.0.0 --port 5173',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
}; 