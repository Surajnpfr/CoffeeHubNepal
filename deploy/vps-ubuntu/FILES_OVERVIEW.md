# VPS Ubuntu Deployment - Files Overview

This document provides an overview of all files in the `deploy/vps-ubuntu/` directory.

## Directory Structure

```
deploy/vps-ubuntu/
├── backend/
│   ├── .env.template          # Environment variables template
│   ├── package.json           # Production package.json
│   └── tsconfig.json          # TypeScript configuration
│
├── nginx/
│   ├── coffeehubnepal.conf   # Nginx configuration for frontend & API
│   └── ssl-setup.sh          # SSL certificate setup script
│
├── pm2/
│   └── ecosystem.config.js    # PM2 process manager configuration
│
├── scripts/
│   ├── build.sh              # Build script (run locally)
│   ├── setup-server.sh       # Initial server setup (one-time)
│   ├── deploy.sh             # Main deployment script
│   ├── update.sh             # Zero-downtime update script
│   ├── backup.sh             # Backup script
│   └── monitor.sh            # Health check script
│
├── systemd/
│   └── coffeehubnepal-api.service  # Systemd service file (optional)
│
├── README.md                  # Complete deployment guide
├── QUICK_START.md             # Quick reference guide
├── DEPLOYMENT_CHECKLIST.md    # Deployment checklist
└── FILES_OVERVIEW.md          # This file
```

## File Descriptions

### Backend Files

**`backend/.env.template`**
- Template for production environment variables
- Copy to `.env` and fill in actual values
- Contains MongoDB, JWT, SMTP, and other configuration

**`backend/package.json`**
- Production dependencies only
- Used for `npm install --production` on server

**`backend/tsconfig.json`**
- TypeScript compiler configuration
- Used if TypeScript compilation is needed on server

### Nginx Files

**`nginx/coffeehubnepal.conf`**
- Complete nginx configuration
- Frontend on main domain
- API on `api` subdomain
- HTTP and HTTPS configurations (HTTPS commented initially)
- Security headers, rate limiting, gzip compression

**`nginx/ssl-setup.sh`**
- Automated SSL certificate setup using Certbot
- Installs Let's Encrypt certificates
- Configures auto-renewal

### PM2 Files

**`pm2/ecosystem.config.js`**
- PM2 process manager configuration
- Auto-restart, logging, memory limits
- Process name: `coffeehubnepal-api`

### Scripts

**`scripts/build.sh`** (Linux/Mac)
- **Run on local machine**
- Builds frontend and backend
- Copies files to deployment structure
- Accepts `--api-url` parameter

**`scripts/build.js`** (Windows/Linux/Mac - Recommended)
- **Run on local machine**
- Node.js version, works on all platforms
- Same functionality as build.sh
- Usage: `node deploy/vps-ubuntu/scripts/build.js --api-url=https://api.yourdomain.com`

**`scripts/build.ps1`** (Windows PowerShell)
- **Run on local machine**
- PowerShell version for Windows
- Usage: `.\deploy\vps-ubuntu\scripts\build.ps1 -ApiUrl "https://api.yourdomain.com"`

**`scripts/setup-server.sh`**
- **Run once on VPS as root**
- Installs Node.js, PM2, Nginx, Certbot
- Configures firewall
- Creates deployment user
- Sets up directory structure

**`scripts/deploy.sh`**
- **Run on VPS as root**
- Main deployment script
- Installs dependencies
- Configures PM2
- Sets up Nginx
- Starts services
- Accepts `--domain` parameter

**`scripts/update.sh`**
- **Run on VPS as root**
- Updates existing deployment
- Zero-downtime updates
- Creates backups
- Health checks
- Automatic rollback on failure

**`scripts/backup.sh`**
- **Run on VPS as root**
- Creates backups of application files
- Optional database backup with `--full` flag
- Stores backups in `/var/backups/coffeehubnepal/`

**`scripts/monitor.sh`**
- **Run on VPS (any user)**
- Health check script
- Checks PM2, API, Nginx, disk, memory
- Use `--verbose` for detailed output

### Systemd Files

**`systemd/coffeehubnepal-api.service`**
- Optional systemd service file
- Alternative to PM2 (if preferred)
- Not used by default (PM2 is recommended)

### Documentation

**`README.md`**
- Complete deployment guide
- Step-by-step instructions
- Troubleshooting section
- Security best practices

**`QUICK_START.md`**
- Condensed guide for experienced users
- Quick reference commands
- Essential steps only

**`DEPLOYMENT_CHECKLIST.md`**
- Comprehensive checklist
- Pre-deployment, deployment, and post-deployment tasks
- Verification steps
- Troubleshooting checklist

## Usage Flow

### First-Time Deployment

1. **Local**: Run `scripts/build.js` (or `build.sh` on Linux/Mac, or `build.ps1` on Windows)
2. **Upload**: Upload entire `deploy/vps-ubuntu/` to VPS
3. **VPS**: Run `scripts/setup-server.sh` (one-time)
4. **VPS**: Configure `backend/.env`
5. **VPS**: Run `scripts/deploy.sh --domain=yourdomain.com`
6. **DNS**: Configure DNS records
7. **VPS**: Run `nginx/ssl-setup.sh yourdomain.com`
8. **VPS**: Enable HTTPS in nginx config

### Updates

1. **Local**: Run `scripts/build.sh`
2. **Upload**: Upload new files to VPS
3. **VPS**: Run `scripts/update.sh`

### Maintenance

- **Backup**: `scripts/backup.sh`
- **Monitor**: `scripts/monitor.sh`
- **Logs**: `sudo -u coffeehub pm2 logs coffeehubnepal-api`

## Important Notes

1. **Environment Variables**: Never commit `.env` files. Only `.env.template` is in version control.

2. **File Permissions**: 
   - `.env` should be `600` (read/write owner only)
   - Application files should be owned by `coffeehub:coffeehub`

3. **Build Output**: The `frontend/` and `backend/dist/` directories are generated by `build.sh` and should not be committed.

4. **Domain Configuration**: Update `yourdomain.com` in nginx config and scripts with your actual domain.

5. **SSL Certificates**: HTTPS blocks in nginx config are commented initially. Uncomment after SSL setup.

## Support

For issues or questions:
- Check `README.md` for detailed instructions
- Review `DEPLOYMENT_CHECKLIST.md` for verification steps
- Check logs: PM2 logs, Nginx logs, system logs

