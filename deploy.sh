#!/bin/bash
echo "🚀 Starting Studivo Rebuild & Reload..."

# Build Frontend
echo "📦 Building Frontend (studivo-ui)..."
pkill -f "next build" 2>/dev/null || true
cd /var/www/studivo/studivo-ui
npm run build

# Restart PM2
echo "🔄 Restarting PM2 Services..."
cd /var/www/studivo
pm2 restart all --update-env

echo "✅ Studivo project updated successfully!"
pm2 status
