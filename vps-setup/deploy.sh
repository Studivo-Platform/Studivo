#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Studivo — VPS Deployment Script
# ─────────────────────────────────────────────────────────────
#
# Prerequisites:
#   - Ubuntu 22.04+ / Debian 12+
#   - Root or sudo access
#   - Git installed
#
# Usage:
#   chmod +x deploy.sh
#   sudo ./deploy.sh
#
# What this script does:
#   1. Installs Node.js 20, MongoDB 7, Redis 7, Nginx, PM2
#   2. Creates app directory structure
#   3. Configures MongoDB and Redis for low-memory VPS
#   4. Sets up Nginx reverse proxy
#   5. Configures PM2 for auto-start on boot
#   6. Creates swap file (essential for 1GB VPS)
# ─────────────────────────────────────────────────────────────

set -e  # Exit on error

echo "═══════════════════════════════════════════════════"
echo "  Studivo Platform — VPS Deployment Script"
echo "═══════════════════════════════════════════════════"
echo ""

# ── 0. Create Swap File (critical for 1GB RAM) ──────────
echo "📦 [0/7] Creating swap file..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile swap swap defaults 0 0' >> /etc/fstab
    # Tune swappiness — use swap only when necessary
    sysctl vm.swappiness=10
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
    echo "   ✅ 2GB swap file created"
else
    echo "   ⚠️  Swap file already exists"
fi

# ── 1. System Update ────────────────────────────────────
echo ""
echo "📦 [1/7] Updating system..."
apt update -y && apt upgrade -y
apt install -y curl wget gnupg2 software-properties-common build-essential git ufw

# ── 2. Install Node.js 20 LTS ──────────────────────────
echo ""
echo "📦 [2/7] Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    echo "   ✅ Node.js $(node -v) installed"
else
    echo "   ⚠️  Node.js $(node -v) already installed"
fi

# Install PM2 globally
npm install -g pm2

# ── 3. Install MongoDB 7 ───────────────────────────────
echo ""
echo "📦 [3/7] Installing MongoDB 7..."
if ! command -v mongod &> /dev/null; then
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
        tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt update -y
    apt install -y mongodb-org
    
    # Optimize MongoDB for 1GB VPS
    cat > /etc/mongod.conf.d/low-memory.conf << 'MONGOCFG'
# Low-memory optimization for 1GB VPS
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.25
MONGOCFG
    
    systemctl start mongod
    systemctl enable mongod
    echo "   ✅ MongoDB installed & configured for low memory"
else
    echo "   ⚠️  MongoDB already installed"
fi

# ── 4. Install Redis 7 ─────────────────────────────────
echo ""
echo "📦 [4/7] Installing Redis..."
if ! command -v redis-server &> /dev/null; then
    apt install -y redis-server
    
    # Optimize Redis for 1GB VPS
    sed -i 's/^# maxmemory .*/maxmemory 64mb/' /etc/redis/redis.conf
    sed -i 's/^# maxmemory-policy .*/maxmemory-policy allkeys-lru/' /etc/redis/redis.conf
    
    systemctl restart redis-server
    systemctl enable redis-server
    echo "   ✅ Redis installed & configured (64MB limit)"
else
    echo "   ⚠️  Redis already installed"
fi

# ── 5. Setup Application Directory ─────────────────────
echo ""
echo "📦 [5/7] Setting up application directory..."
APP_DIR="/var/www/studivo"
mkdir -p $APP_DIR/logs

echo ""
echo "═══════════════════════════════════════════════════"
echo "  📂 Now clone your repos into $APP_DIR:"
echo ""
echo "  cd $APP_DIR"
echo "  git clone <your-server-repo> studivo-server"
echo "  git clone <your-ui-repo> studivo-ui"
echo ""
echo "  Or copy from local:"
echo "  scp -r ./studivo-server user@VPS_IP:$APP_DIR/"
echo "  scp -r ./studivo-ui user@VPS_IP:$APP_DIR/"
echo "═══════════════════════════════════════════════════"

# ── 6. Setup SSL & Nginx ──────────────────────────────────
echo ""
echo "📦 [6/7] Generating Self-Signed SSL Certificate & Configuring Nginx..."
apt install -y nginx openssl

# Generate self-signed SSL certificate if not exists
if [ ! -f /etc/ssl/certs/studivo-selfsigned.crt ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/studivo-selfsigned.key \
        -out /etc/ssl/certs/studivo-selfsigned.crt \
        -subj "/CN=studivo-vps/O=Studivo/OU=Engineering/C=EG"
    echo "   ✅ Self-signed SSL certificate created"
fi

# Copy our Nginx config
if [ -f "./nginx/studivo.conf" ]; then
    cp ./nginx/studivo.conf /etc/nginx/sites-available/studivo
    ln -sf /etc/nginx/sites-available/studivo /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default  # Remove default site
    nginx -t && systemctl reload nginx
    echo "   ✅ Nginx configured with HTTPS"
else
    echo "   ⚠️  nginx/studivo.conf not found — copy it manually"
fi

# ── 7. Firewall ─────────────────────────────────────────
echo ""
echo "📦 [7/7] Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
echo "   ✅ Firewall configured (SSH + HTTP + HTTPS)"

# ── Done ────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo "  🎉 VPS Setup Complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  Next steps:"
echo ""
echo "  1. Clone/copy your repos to $APP_DIR/"
echo ""
echo "  2. Setup Backend:"
echo "     cd $APP_DIR/studivo-server"
echo "     npm install --production"
echo "     cp .env.example .env"
echo "     nano .env  # Fill in real values"
echo ""
echo "  3. Setup Frontend:"
echo "     cd $APP_DIR/studivo-ui"
echo "     npm install"
echo "     nano .env.local  # Add API URL"
echo "     npm run build"
echo ""
echo "  4. Start with PM2:"
echo "     cd $APP_DIR"
echo "     cp ecosystem.config.js ."
echo "     pm2 start ecosystem.config.js"
echo "     pm2 save"
echo "     pm2 startup"
echo ""
echo "  5. (Optional) Add SSL:"
echo "     apt install -y certbot python3-certbot-nginx"
echo "     certbot --nginx -d yourdomain.com"
echo ""
echo "  6. Seed the database:"
echo "     cd $APP_DIR/studivo-server"
echo "     npm run seed"
echo ""
echo "  📊 Monitor:"
echo "     pm2 logs"
echo "     pm2 monit"
echo "     pm2 status"
echo ""
echo "  🔗 Test:"
echo "     curl http://20.203.249.209/health"
echo "     Open http://20.203.249.209 in browser"
echo ""
