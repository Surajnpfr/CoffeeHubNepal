/**
 * PM2 Ecosystem Configuration
 * 
 * This file configures PM2 to manage the CoffeeHubNepal API process
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'coffeehubnepal-api',
      script: './dist/server.js',
      cwd: '/var/www/coffeehubnepal/backend',
      instances: 1, // Set to 'max' for cluster mode (uses all CPU cores)
      exec_mode: 'fork', // Use 'cluster' for multi-core
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/var/log/pm2/coffeehubnepal-api-error.log',
      out_file: '/var/log/pm2/coffeehubnepal-api-out.log',
      log_file: '/var/log/pm2/coffeehubnepal-api.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Log rotation
      max_size: '10M',
      retain: 10,
      compress: true
    }
  ]
};

