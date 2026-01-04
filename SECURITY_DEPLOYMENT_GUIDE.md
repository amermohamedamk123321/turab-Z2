# 🔒 SECURITY DEPLOYMENT GUIDE

## Production Deployment Security Checklist

This guide covers security hardening for deploying the Turab Root application to a production VPS.

---

## TABLE OF CONTENTS

1. [Pre-Deployment Security](#pre-deployment-security)
2. [Server Setup & Hardening](#server-setup--hardening)
3. [Application Security Configuration](#application-security-configuration)
4. [Database Security](#database-security)
5. [File Upload Security](#file-upload-security)
6. [Monitoring & Logging](#monitoring--logging)
7. [Incident Response](#incident-response)
8. [Security Checklist](#security-checklist)

---

## PRE-DEPLOYMENT SECURITY

### 1. Code Review Checklist

Before deploying, verify:

- [ ] No hardcoded credentials in code
- [ ] No API keys or secrets in Git repository
- [ ] All user inputs are validated with Zod schemas
- [ ] Passwords are hashed with bcrypt (never stored plain-text)
- [ ] All API endpoints require authentication
- [ ] Admin routes protected by NextAuth middleware
- [ ] File uploads validated server-side
- [ ] SQL queries use Prisma ORM (not raw SQL)
- [ ] Rate limiting configured for sensitive endpoints
- [ ] CORS origins restricted (not "*" in production)
- [ ] Security headers configured in middleware
- [ ] Error messages don't leak sensitive information

### 2. Dependency Security

```bash
# Audit all dependencies for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check for outdated packages
npm outdated

# Update to latest versions (if safe)
npm update
```

### 3. Environment Variables Preparation

```bash
# 1. Copy the template
cp .env.example .env.local

# 2. Fill in all required values
nano .env.local

# Required variables:
NODE_ENV=production
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://yourdomain.com

# 3. Ensure .env.local is in .gitignore
echo ".env.local" >> .gitignore

# 4. Verify it's not committed
git status | grep ".env.local"  # Should not appear
```

---

## SERVER SETUP & HARDENING

### 1. Initial Server Hardening

```bash
# SSH as root
ssh root@YOUR_VPS_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable

# Disable root login
sudo sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Set up fail2ban for brute-force protection
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2. Create Non-Root Application User

```bash
# Create dedicated user for the app
sudo useradd -m -s /bin/bash appuser
sudo usermod -aG sudo appuser

# Set secure permissions
sudo mkdir -p /var/www/turab-root
sudo chown -R appuser:appuser /var/www/turab-root
sudo chmod 755 /var/www/turab-root

# Set restrictive umask
sudo su - appuser
echo "umask 0077" >> ~/.bashrc
```

### 3. Install Node.js (Non-Root)

```bash
# Switch to appuser
sudo su - appuser

# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js LTS
nvm install 20
nvm use 20

# Verify
node --version
npm --version
```

### 4. Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 config file
cat > ~/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'turab-root',
    script: './server.ts',
    exec_interpreter: 'node',
    exec_mode: 'fork',
    max_memory_restart: '500M',
    node_args: '--max-old-space-size=512',
    
    // User and group to run the app as
    user: 'appuser',
    group: 'appuser',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    
    // Logging
    out_file: '/var/www/turab-root/logs/app.log',
    error_file: '/var/www/turab-root/logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    
    // Auto-restart
    watch: false,  // Don't watch files in production
    ignore_watch: ['node_modules', 'logs', 'public/uploads'],
    
    // Restart policy
    max_restarts: 5,
    min_uptime: '10s',
    
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: false,
  }]
};
EOF

# Setup PM2 to start on boot
pm2 startup systemd -u appuser --hp /home/appuser
pm2 save
```

### 5. Install Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx

# Create Nginx config
sudo tee /etc/nginx/sites-available/turab-root > /dev/null << 'EOF'
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name turabroot.com www.turabroot.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name turabroot.com www.turabroot.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/turabroot.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/turabroot.com/privkey.pem;
    
    # SSL security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "accelerometer=(), camera=(), microphone=(), geolocation=()";
    
    # Rate limiting (optional)
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=10r/h;
    
    # Logging
    access_log /var/log/nginx/turab-root-access.log;
    error_log /var/log/nginx/turab-root-error.log;
    
    # Max upload size
    client_max_body_size 50M;
    
    # Static files (cache aggressively)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 30d;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # WebSocket upgrade for Socket.IO
    location /api/socketio {
        limit_req zone=general burst=20;
        
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
    
    # API endpoints (with rate limiting)
    location /api/upload {
        limit_req zone=upload burst=2;
        
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/auth/signin {
        limit_req zone=login burst=1 nodelay;
        
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # All other requests
    location / {
        limit_req zone=general burst=20;
        
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/turab-root /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Enable and start Nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 6. Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (before adding to Nginx config)
sudo certbot certonly --standalone -d turabroot.com -d www.turabroot.com

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## APPLICATION SECURITY CONFIGURATION

### 1. Build for Production

```bash
# As appuser
cd /var/www/turab-root

# Install dependencies
npm install --production

# Build the app
npm run build

# Verify build succeeded
ls -la .next  # Should have size > 1MB
```

### 2. Create Initial Admin User

```bash
# Create a setup script (temporary)
cat > ~/setup-admin.js << 'EOF'
import { setupAdminUser } from './src/lib/setup-admin';

const email = process.argv[2];
const password = process.argv[3];

setupAdminUser({ email, password, name: 'Admin' })
  .then(result => {
    console.log('✅ Admin created:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
EOF

# Run setup (ONLY on first deployment)
node setup-admin.js admin@yourdomain.com "SecurePassword123!@#"

# Delete setup script immediately
rm ~/setup-admin.js
```

### 3. Database Migration

```bash
# Apply database schema
npx prisma db push

# Verify database
npx prisma studio  # Access at http://localhost:5555
```

### 4. Start Application with PM2

```bash
# Start the app
pm2 start ecosystem.config.js

# Verify it's running
pm2 status

# View logs
pm2 logs turab-root
```

---

## DATABASE SECURITY

### 1. PostgreSQL Setup (Recommended for Production)

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE turab_root;
CREATE USER turab_user WITH PASSWORD 'YOUR_SECURE_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE turab_root TO turab_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO turab_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO turab_user;
\q
EOF

# Update .env.local
DATABASE_URL="postgresql://turab_user:YOUR_SECURE_PASSWORD@localhost:5432/turab_root"

# Enable SSL for database connections (optional but recommended)
sudo systemctl restart postgresql
```

### 2. Database Backup

```bash
# Create backup directory
sudo mkdir -p /backups/database
sudo chown -R appuser:appuser /backups/database

# Create automated backup script
cat > ~/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="turab_root"
DB_USER="turab_user"

pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Database backed up: $BACKUP_DIR/backup_$DATE.sql.gz"
EOF

chmod +x ~/backup-db.sh

# Schedule daily backup at 2 AM
echo "0 2 * * * /home/appuser/backup-db.sh" | crontab -
```

---

## FILE UPLOAD SECURITY

### 1. Upload Directory Setup

```bash
# Create upload directory outside web root
sudo mkdir -p /var/data/turab-uploads/{video,image,document}
sudo chown -R appuser:appuser /var/data/turab-uploads
sudo chmod 750 /var/data/turab-uploads

# Ensure uploads are not executable
sudo chmod 644 /var/data/turab-uploads/*/*
sudo find /var/data/turab-uploads -type d -exec chmod 755 {} \;

# Configure Nginx to serve uploads (but not execute)
# (Already included in Nginx config above)
```

### 2. File Type Validation

- Server-side validation in `/api/upload` route
- Allowed types: MP4, WebM, JPEG, PNG, GIF, PDF
- Blocked: .exe, .php, .sh, .bat, .zip (see `/src/app/api/upload/route.ts`)
- Max file size: 50MB

### 3. Virus Scanning (Optional)

```bash
# Install ClamAV for malware scanning
sudo apt install -y clamav clamav-daemon

# Update virus definitions
sudo freshclam

# Enable on-access scanning
sudo systemctl enable clamav-daemon
sudo systemctl start clamav-daemon
```

---

## MONITORING & LOGGING

### 1. Application Logging

```bash
# PM2 logs are saved to:
# - /var/www/turab-root/logs/app.log
# - /var/www/turab-root/logs/error.log

# View real-time logs
pm2 logs turab-root

# View with filtering
pm2 logs turab-root --err  # Errors only
```

### 2. Database Audit Logging

- All authentication attempts logged to `AuditLog` table
- File uploads logged with metadata
- Query timing and performance tracked
- Slow queries (>1s) logged to console

### 3. Nginx Access Logs

```bash
# Monitor for suspicious requests
tail -f /var/log/nginx/turab-root-access.log

# Check for attacks
grep "403\|404\|500" /var/log/nginx/turab-root-access.log
```

### 4. Security Monitoring

```bash
# Check system for rootkits
sudo apt install -y rkhunter
sudo rkhunter --check --skip-keypress

# File integrity checking
sudo apt install -y aide
sudo aideinit
sudo aide --config=/etc/aide/aide.conf --check
```

---

## INCIDENT RESPONSE

### 1. If Compromise is Suspected

```bash
# IMMEDIATE ACTIONS:

# 1. Change all passwords
echo 'appuser:NEW_PASSWORD' | sudo chpasswd

# 2. Rotate secrets
openssl rand -base64 32  # Generate new NEXTAUTH_SECRET
# Update .env.local

# 3. Restart application
pm2 restart turab-root

# 4. Check logs for suspicious activity
pm2 logs turab-root
grep -i "error\|failed\|unauthorized" /var/log/nginx/turab-root-access.log

# 5. Kill suspicious processes
ps aux | grep -E "php|perl|python|nc" | grep -v grep

# 6. Check cron jobs
crontab -l
sudo crontab -u appuser -l
sudo crontab -l
```

### 2. Security Audit

```bash
# Check file permissions
find /var/www/turab-root -type f -perm 777 -ls

# Check SUID binaries
find / -type f -perm -4000 -ls 2>/dev/null

# Check for backdoors
netstat -tulpn | grep LISTEN

# Review failed logins
grep "Failed password" /var/log/auth.log | tail -20
```

---

## SECURITY CHECKLIST

### Pre-Deployment

- [ ] All secrets removed from code
- [ ] Dependencies audited (`npm audit`)
- [ ] Environment variables configured
- [ ] SSL certificate obtained
- [ ] Database backed up
- [ ] .env.local in .gitignore

### Deployment Day

- [ ] Server hardening completed
- [ ] Firewall configured
- [ ] Non-root user created
- [ ] SSH hardened (no root login, key-based auth only)
- [ ] Nginx configured with security headers
- [ ] SSL certificate installed
- [ ] PM2 configured for auto-restart
- [ ] Application built for production
- [ ] Admin user created
- [ ] Database initialized
- [ ] Application started successfully
- [ ] Health check endpoint responding
- [ ] HTTPS working
- [ ] WebSocket connections working

### Post-Deployment

- [ ] Monitor logs for errors
- [ ] Test login functionality
- [ ] Test file upload
- [ ] Test rate limiting
- [ ] Backup scripts running
- [ ] Monitoring configured
- [ ] Team notified of credentials
- [ ] Documentation updated
- [ ] Incident response plan reviewed

### Weekly

- [ ] Review security logs
- [ ] Check for updates (`npm outdated`)
- [ ] Verify backups running
- [ ] Check disk usage
- [ ] Monitor CPU/memory usage

### Monthly

- [ ] Security audit (`sudo lynis audit system`)
- [ ] Dependency updates
- [ ] SSL certificate status check
- [ ] Database optimization
- [ ] Disaster recovery test

---

## HELPFUL COMMANDS

```bash
# Application management
pm2 status                    # Check app status
pm2 logs turab-root          # View logs
pm2 restart turab-root       # Restart app
pm2 stop turab-root          # Stop app
pm2 start turab-root         # Start app

# System monitoring
top                          # CPU/memory usage
df -h                        # Disk usage
netstat -tulpn               # Open ports
ss -tulpn                    # Socket statistics

# Security
sudo ufw status              # Firewall rules
sudo fail2ban-client status  # Brute-force protection
sudo systemctl status nginx  # Web server status

# Database
psql -U turab_user -d turab_root  # Connect to DB
pg_dump -U turab_user turab_root   # Backup DB

# SSL Certificate
sudo certbot certificates           # List certificates
sudo certbot renew --dry-run        # Test renewal
sudo certbot revoke /path/to/cert   # Revoke certificate

# Logs
tail -f /var/log/nginx/turab-root-access.log
tail -f /var/log/nginx/turab-root-error.log
tail -f ~/.pm2/logs/turab-root-out.log
```

---

## EMERGENCY CONTACTS

- Security Issues: security@yourdomain.com
- VPS Support: Your hosting provider
- Database Support: Your database provider

---

**Last Updated**: 2025
**Status**: Production Ready
