# CoffeeHubNepal - VPS Ubuntu 22 Deployment Guide

Complete guide for deploying CoffeeHubNepal to an Ubuntu 22.04 VPS server.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Domain Configuration](#domain-configuration)
- [SSL Certificate Setup](#ssl-certificate-setup)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:

1. **VPS Server**
   - Ubuntu 22.04 LTS
   - Minimum 2GB RAM (4GB recommended)
   - Minimum 20GB storage
   - Root or sudo access

2. **Domain Name**
   - A registered domain name
   - Access to DNS management

3. **MongoDB Atlas Account**
   - Free tier account is sufficient
   - Database cluster created
   - Connection string ready

4. **Email Service** (for password reset)
   - Gmail with App Password, or
   - Azure Communication Services

5. **Local Development Machine**
   - Node.js 18+ installed
   - Git installed
   - SSH access to VPS

## Quick Start

### Step 1: Build Deployment Package

On your local machine:

**Windows (PowerShell):**
```powershell
# Navigate to project root
cd CoffeeHubNepal

# Build for deployment
.\deploy\vps-ubuntu\scripts\build.ps1 -ApiUrl "https://api.yourdomain.com"
```

**Windows/Linux/Mac (Node.js - recommended):**
```bash
# Navigate to project root
cd CoffeeHubNepal

# Build for deployment
node deploy/vps-ubuntu/scripts/build.js --api-url=https://api.yourdomain.com
```

**Linux/Mac (Bash):**
```bash
# Navigate to project root
cd CoffeeHubNepal

# Build for deployment
bash deploy/vps-ubuntu/scripts/build.sh --api-url=https://api.yourdomain.com
```

This creates:
- `deploy/vps-ubuntu/backend/` - Compiled backend
- `deploy/vps-ubuntu/frontend/` - Built frontend

### Step 2: Initial Server Setup

On your VPS (as root):

```bash
# Upload the entire deploy/vps-ubuntu folder to your VPS
# Then run:
sudo bash deploy/vps-ubuntu/scripts/setup-server.sh
```

This installs:
- Node.js 20.x
- PM2 process manager
- Nginx web server
- Certbot for SSL
- Firewall configuration

### Step 3: Configure Environment

```bash
# Copy environment template
cd /var/www/coffeehubnepal/backend
cp .env.template .env

# Edit with your values
nano .env
```

Required values:
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `CLIENT_ORIGIN` - Your frontend domain (e.g., `https://yourdomain.com`)
- `SMTP_*` - Email service credentials

### Step 4: Deploy Application

```bash
# Run deployment script
sudo bash deploy/vps-ubuntu/scripts/deploy.sh --domain=yourdomain.com
```

### Step 5: Configure DNS

Add these DNS records (A records):
- `yourdomain.com` → Your VPS IP
- `api.yourdomain.com` → Your VPS IP

Wait for DNS propagation (can take up to 24 hours, usually 1-2 hours).

### Step 6: Setup SSL Certificates

```bash
sudo bash deploy/vps-ubuntu/nginx/ssl-setup.sh yourdomain.com
```

### Step 7: Enable HTTPS in Nginx

Edit nginx config:
```bash
sudo nano /etc/nginx/sites-available/coffeehubnepal
```

Uncomment the HTTPS server blocks, then:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Detailed Setup

### Server Architecture

```
┌─────────────────┐
│   Internet      │
└────────┬────────┘
         │
    ┌────▼────┐
    │  Nginx  │ (Port 80, 443)
    └────┬────┘
         │
    ┌────▼──────────────┐
    │  Frontend (Static)│
    │  /var/www/.../    │
    │  frontend/        │
    └───────────────────┘
         │
    ┌────▼──────────────┐
    │  API (Node.js)     │
    │  PM2 Process      │
    │  Port 4000        │
    └───────────────────┘
```

### Directory Structure

```
/var/www/coffeehubnepal/
├── backend/
│   ├── dist/           # Compiled TypeScript
│   ├── node_modules/   # Production dependencies
│   ├── .env            # Environment variables
│   └── package.json
├── frontend/           # Built React app
│   ├── index.html
│   └── assets/
└── pm2/
    └── ecosystem.config.js
```

### Environment Variables

Create `/var/www/coffeehubnepal/backend/.env`:

```bash
# Server
PORT=4000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority

# Security
JWT_SECRET=your_32_character_secret_here

# Client
CLIENT_ORIGIN=https://yourdomain.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@yourdomain.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
LOCKOUT_THRESHOLD=5
LOCKOUT_WINDOW_MINUTES=15
```

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist your VPS IP (or `0.0.0.0/0` for testing)
5. Get connection string
6. Add to `.env` as `MONGO_URI`

### PM2 Process Management

```bash
# View status
sudo -u coffeehub pm2 status

# View logs
sudo -u coffeehub pm2 logs coffeehubnepal-api

# Restart
sudo -u coffeehub pm2 restart coffeehubnepal-api

# Stop
sudo -u coffeehub pm2 stop coffeehubnepal-api

# Monitor
sudo -u coffeehub pm2 monit
```

## Domain Configuration

### DNS Records

Configure these A records in your domain registrar:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | Your VPS IP | 3600 |
| A | www | Your VPS IP | 3600 |
| A | api | Your VPS IP | 3600 |

### Nginx Configuration

The nginx configuration file is located at:
- `/etc/nginx/sites-available/coffeehubnepal`
- Symlinked to `/etc/nginx/sites-enabled/coffeehubnepal`

Key settings:
- Frontend served from `/var/www/coffeehubnepal/frontend`
- API proxied to `http://localhost:4000`
- Rate limiting enabled
- Security headers configured

## SSL Certificate Setup

### Automatic Setup (Recommended)

```bash
sudo bash deploy/vps-ubuntu/nginx/ssl-setup.sh yourdomain.com
```

This:
- Installs Certbot
- Obtains Let's Encrypt certificates
- Configures auto-renewal
- Sets up HTTPS redirects

### Manual Setup

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Test renewal
sudo certbot renew --dry-run
```

### Auto-Renewal

Certbot automatically sets up renewal. Verify:
```bash
sudo systemctl status certbot.timer
```

## Maintenance

### Updating the Application

```bash
# On your local machine
git pull
bash deploy/vps-ubuntu/scripts/build.sh --api-url=https://api.yourdomain.com

# Upload new files to VPS, then:
sudo bash deploy/vps-ubuntu/scripts/update.sh
```

### Creating Backups

```bash
# Application files only
sudo bash deploy/vps-ubuntu/scripts/backup.sh

# Include database
sudo bash deploy/vps-ubuntu/scripts/backup.sh --full
```

Backups are stored in `/var/backups/coffeehubnepal/`

### Monitoring

```bash
# Health check
bash deploy/vps-ubuntu/scripts/monitor.sh

# Verbose output
bash deploy/vps-ubuntu/scripts/monitor.sh --verbose
```

### Logs

```bash
# PM2 logs
sudo -u coffeehub pm2 logs coffeehubnepal-api

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## Troubleshooting

### Application Not Starting

1. Check PM2 status:
   ```bash
   sudo -u coffeehub pm2 status
   ```

2. Check logs:
   ```bash
   sudo -u coffeehub pm2 logs coffeehubnepal-api
   ```

3. Verify environment variables:
   ```bash
   sudo cat /var/www/coffeehubnepal/backend/.env
   ```

4. Test API directly:
   ```bash
   curl http://localhost:4000/health
   ```

### Nginx Errors

1. Test configuration:
   ```bash
   sudo nginx -t
   ```

2. Check error logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. Verify nginx is running:
   ```bash
   sudo systemctl status nginx
   ```

### SSL Certificate Issues

1. Check certificate status:
   ```bash
   sudo certbot certificates
   ```

2. Test renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

3. Manually renew:
   ```bash
   sudo certbot renew
   ```

### Database Connection Issues

1. Verify MongoDB Atlas:
   - Check cluster status
   - Verify IP whitelist includes your VPS IP
   - Test connection string

2. Test connection from VPS:
   ```bash
   # Install MongoDB shell
   sudo apt-get install mongodb-clients
   
   # Test connection (replace with your URI)
   mongo "mongodb+srv://..."
   ```

### Port Already in Use

If port 4000 is in use:

```bash
# Find process using port
sudo lsof -i :4000

# Kill process or change PORT in .env
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R coffeehub:coffeehub /var/www/coffeehubnepal

# Fix permissions
sudo chmod 600 /var/www/coffeehubnepal/backend/.env
```

## Security Best Practices

1. **Firewall**: UFW is configured to only allow necessary ports
2. **SSL/TLS**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env` files
4. **Updates**: Keep system and dependencies updated
5. **Backups**: Regular backups of application and database
6. **Monitoring**: Set up monitoring and alerts
7. **Rate Limiting**: Already configured in nginx and application

## Support

For issues or questions:
1. Check logs first
2. Review troubleshooting section
3. Check GitHub issues
4. Contact support

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

