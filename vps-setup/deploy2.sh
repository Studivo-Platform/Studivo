#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Studivo — VPS Deployment Continuation Script (Step 2)
# ─────────────────────────────────────────────────────────────

set -e

echo "═══════════════════════════════════════════════════"
echo "  Studivo Platform — VPS Setup Continuation"
echo "═══════════════════════════════════════════════════"
echo ""

# ── 1. Fix MongoDB Low-Memory Config ────────────────────
echo "📦 [1/4] Configuring MongoDB memory limit..."
mkdir -p /etc/mongod.conf.d
cat > /etc/mongod.conf.d/low-memory.conf << 'MONGOCFG'
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.25
MONGOCFG
systemctl restart mongod || true
echo "   ✅ MongoDB configured"

# ── 2. Install Redis 7 ─────────────────────────────────
echo ""
echo "📦 [2/4] Installing Redis..."
if ! command -v redis-server &> /dev/null; then
    apt install -y redis-server
    
    sed -i 's/^# maxmemory .*/maxmemory 64mb/' /etc/redis/redis.conf
    sed -i 's/^# maxmemory-policy .*/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf
    
    systemctl restart redis-server
    systemctl enable redis-server
    echo "   ✅ Redis installed & configured"
else
    echo "   ⚠️  Redis already installed"
fi

# ── 3. Create App Folder & SSL ─────────────────────────
echo ""
echo "📦 [3/4] Creating application directories and SSL Certificate..."
APP_DIR="/var/www/studivo"
mkdir -p $APP_DIR/logs

apt install -y nginx openssl

if [ ! -f /etc/ssl/certs/studivo-selfsigned.crt ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/studivo-selfsigned.key \
        -out /etc/ssl/certs/studivo-selfsigned.crt \
        -subj "/CN=20.203.249.209/O=Studivo/OU=Engineering/C=EG"
    echo "   ✅ Self-signed SSL certificate created for HTTPS"
fi

if [ -f "./nginx/studivo.conf" ]; then
    cp ./nginx/studivo.conf /etc/nginx/sites-available/studivo
    ln -sf /etc/nginx/sites-available/studivo /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    echo "   ✅ Nginx configured with HTTPS"
fi

# ── 4. Firewall ─────────────────────────────────────────
echo ""
echo "📦 [4/4] Configuring Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
echo "   ✅ Firewall updated"

echo ""
echo "═══════════════════════════════════════════════════"
echo "  🎉 Server Environment Ready!"
echo "═══════════════════════════════════════════════════"
echo ""
