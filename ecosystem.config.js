/**
 * Studivo — PM2 Ecosystem Configuration
 * 
 * Optimized for 1GB RAM VPS:
 *   - Single instance per app (no cluster mode)
 *   - Memory limits to prevent OOM
 *   - Auto-restart on crash
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 stop all
 *   pm2 restart all
 *   pm2 logs
 */

module.exports = {
  apps: [
    // ── Backend API ─────────────────────────────────────
    {
      name: 'studivo-api',
      cwd: './studivo-server',
      script: 'server.js',
      instances: 1,                    // Single instance for 1GB VPS
      exec_mode: 'fork',              // Fork mode (cluster needs more RAM)
      max_memory_restart: '300M',     // Restart if exceeds 300MB
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // Logging
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      // Auto-restart
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
    },

    // ── Frontend (Next.js) ──────────────────────────────
    {
      name: 'studivo-ui',
      cwd: './studivo-ui',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '250M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/ui-error.log',
      out_file: './logs/ui-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
    },

    // ── Scraper Worker (BullMQ) ─────────────────────────
    {
      name: 'studivo-worker',
      cwd: './studivo-server',
      script: 'src/workers/scrape.worker.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '200M',     // Playwright can be memory-heavy
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/worker-error.log',
      out_file: './logs/worker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      watch: false,
      autorestart: true,
      max_restarts: 5,
      min_uptime: '10s',
      restart_delay: 5000,
      // Worker is optional — disable by default on small VPS
      // To enable: pm2 start ecosystem.config.js --only studivo-worker
      // autorestart: false,
    },
  ],
};
