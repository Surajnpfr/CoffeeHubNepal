# Quick Start Guide - VPS Deployment

This is a condensed guide for experienced users. For detailed instructions, see [README.md](README.md).

## Prerequisites

- Ubuntu 22.04 VPS with root/sudo access
- Domain name with DNS access
- MongoDB Atlas account
- Email service (Gmail or Azure)

## 5-Minute Deployment

### 1. Build Locally

**On Windows (PowerShell):**
```powershell
cd CoffeeHubNepal
.\deploy\vps-ubuntu\scripts\build.ps1 -ApiUrl "https://api.yourdomain.com"
```

**On Windows (Node.js - works everywhere):**
```bash
cd CoffeeHubNepal
node deploy/vps-ubuntu/scripts/build.js --api-url=https://api.yourdomain.com
```

**On Linux/Mac (Bash):**
```bash
cd CoffeeHubNepal
bash deploy/vps-ubuntu/scripts/build.sh --api-url=https://api.yourdomain.com
```

### 2. Upload to VPS

Upload entire `deploy/vps-ubuntu/` folder to your VPS (use SCP, SFTP, or git).

### 3. Setup Server (One-time)

```bash
sudo bash deploy/vps-ubuntu/scripts/setup-server.sh
```

### 4. Configure Environment

```bash
cd /var/www/coffeehubnepal/backend
cp .env.template .env
nano .env  # Fill in all values
```

Required:
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Run: `openssl rand -base64 32`
- `CLIENT_ORIGIN` - `https://yourdomain.com`
- `SMTP_*` - Email credentials

### 5. Deploy

```bash
sudo bash deploy/vps-ubuntu/scripts/deploy.sh --domain=yourdomain.com
```

### 6. Configure DNS

Add A records:
- `yourdomain.com` → VPS IP
- `api.yourdomain.com` → VPS IP

Wait for DNS propagation (1-24 hours).

### 7. Setup SSL

```bash
sudo bash deploy/vps-ubuntu/nginx/ssl-setup.sh yourdomain.com
```

Then uncomment HTTPS blocks in `/etc/nginx/sites-available/coffeehubnepal` and reload nginx.

## Common Commands

```bash
# PM2
sudo -u coffeehub pm2 status
sudo -u coffeehub pm2 logs coffeehubnepal-api
sudo -u coffeehub pm2 restart coffeehubnepal-api

# Nginx
sudo nginx -t
sudo systemctl reload nginx

# Update
sudo bash deploy/vps-ubuntu/scripts/update.sh

# Backup
sudo bash deploy/vps-ubuntu/scripts/backup.sh

# Monitor
bash deploy/vps-ubuntu/scripts/monitor.sh
```

## Troubleshooting

- **App not starting**: Check `sudo -u coffeehub pm2 logs coffeehubnepal-api`
- **Nginx errors**: Check `sudo tail -f /var/log/nginx/error.log`
- **SSL issues**: Run `sudo certbot certificates`

For detailed troubleshooting, see [README.md](README.md#troubleshooting).

