# CoffeeHubNepal - VPS Deployment Checklist

Use this checklist to ensure a successful deployment to your Ubuntu 22 VPS.

## Pre-Deployment

### Server Requirements
- [ ] Ubuntu 22.04 LTS VPS provisioned
- [ ] Minimum 2GB RAM (4GB recommended)
- [ ] Minimum 20GB storage
- [ ] Root or sudo access confirmed
- [ ] SSH access tested

### Domain & DNS
- [ ] Domain name registered
- [ ] DNS management access available
- [ ] VPS IP address noted
- [ ] DNS records prepared:
  - [ ] A record: `yourdomain.com` → VPS IP
  - [ ] A record: `www.yourdomain.com` → VPS IP
  - [ ] A record: `api.yourdomain.com` → VPS IP

### Services & Accounts
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created
- [ ] MongoDB connection string obtained
- [ ] MongoDB IP whitelist configured (VPS IP added)
- [ ] Email service configured:
  - [ ] Gmail App Password created, OR
  - [ ] Azure Communication Services configured

### Local Development
- [ ] Node.js 18+ installed locally
- [ ] Project code up to date
- [ ] All tests passing
- [ ] Build tested locally

## Build Phase

### Local Build
- [ ] Navigated to project root
- [ ] Run: `bash deploy/vps-ubuntu/scripts/build.sh --api-url=https://api.yourdomain.com`
- [ ] Build completed without errors
- [ ] `deploy/vps-ubuntu/backend/` contains `dist/` folder
- [ ] `deploy/vps-ubuntu/frontend/` contains built files

### File Upload
- [ ] Entire `deploy/vps-ubuntu/` folder uploaded to VPS
- [ ] Files uploaded to `/var/www/coffeehubnepal/` (or target directory)
- [ ] File permissions verified

## Server Setup

### Initial Server Configuration
- [ ] Connected to VPS via SSH
- [ ] Run: `sudo bash deploy/vps-ubuntu/scripts/setup-server.sh`
- [ ] Node.js 20.x installed and verified
- [ ] PM2 installed and verified
- [ ] Nginx installed and running
- [ ] Certbot installed
- [ ] Firewall (UFW) configured
- [ ] Deployment user `coffeehub` created

### Environment Configuration
- [ ] Copied `.env.template` to `.env`
- [ ] `MONGO_URI` configured with MongoDB Atlas connection string
- [ ] `JWT_SECRET` generated (32+ characters)
- [ ] `CLIENT_ORIGIN` set to `https://yourdomain.com`
- [ ] `SMTP_*` variables configured
- [ ] `.env` file permissions set to 600
- [ ] `.env` file ownership set to `coffeehub:coffeehub`

## Deployment

### Application Deployment
- [ ] Run: `sudo bash deploy/vps-ubuntu/scripts/deploy.sh --domain=yourdomain.com`
- [ ] Backend dependencies installed
- [ ] PM2 process started successfully
- [ ] PM2 process shows as "online"
- [ ] PM2 startup script configured
- [ ] Nginx configuration copied and enabled
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] Nginx reloaded successfully
- [ ] Default nginx site removed

### DNS Configuration
- [ ] DNS records added in domain registrar
- [ ] DNS propagation checked (can take 1-24 hours)
- [ ] Domain resolves to VPS IP:
  - [ ] `yourdomain.com` → VPS IP
  - [ ] `www.yourdomain.com` → VPS IP
  - [ ] `api.yourdomain.com` → VPS IP

### SSL Certificate Setup
- [ ] DNS fully propagated (verified with `dig` or `nslookup`)
- [ ] Run: `sudo bash deploy/vps-ubuntu/nginx/ssl-setup.sh yourdomain.com`
- [ ] SSL certificates obtained for:
  - [ ] `yourdomain.com`
  - [ ] `www.yourdomain.com`
  - [ ] `api.yourdomain.com`
- [ ] Certbot auto-renewal configured
- [ ] HTTPS server blocks uncommented in nginx config
- [ ] Nginx configuration updated with SSL paths
- [ ] Nginx reloaded after SSL setup

## Verification

### Service Status
- [ ] PM2 process running: `sudo -u coffeehub pm2 status`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] API responding: `curl http://localhost:4000/health`
- [ ] Frontend accessible: `curl http://localhost/`

### Domain Access
- [ ] Frontend accessible: `https://yourdomain.com`
- [ ] Frontend redirects HTTP to HTTPS
- [ ] API accessible: `https://api.yourdomain.com/health`
- [ ] API redirects HTTP to HTTPS
- [ ] SSL certificates valid (no browser warnings)

### Application Functionality
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] User registration works
- [ ] User login works
- [ ] Password reset email received (if configured)
- [ ] Database connection working
- [ ] No errors in browser console
- [ ] No errors in server logs

### Security
- [ ] Firewall enabled and configured
- [ ] Only necessary ports open (22, 80, 443)
- [ ] `.env` file not accessible via web
- [ ] HTTPS enforced
- [ ] Security headers present (check with browser dev tools)
- [ ] Rate limiting working

## Post-Deployment

### Monitoring Setup
- [ ] Health check script tested: `bash deploy/vps-ubuntu/scripts/monitor.sh`
- [ ] PM2 monitoring configured (optional)
- [ ] Log rotation configured
- [ ] Backup script tested: `sudo bash deploy/vps-ubuntu/scripts/backup.sh`

### Documentation
- [ ] Deployment notes documented
- [ ] Environment variables documented (securely)
- [ ] Access credentials stored securely
- [ ] Team members notified of deployment

### Maintenance Plan
- [ ] Update procedure documented
- [ ] Backup schedule established
- [ ] Monitoring alerts configured (optional)
- [ ] Regular update schedule planned

## Troubleshooting Checklist

If issues occur, check:

### Application Not Starting
- [ ] PM2 logs: `sudo -u coffeehub pm2 logs coffeehubnepal-api`
- [ ] Environment variables correct
- [ ] MongoDB connection working
- [ ] Port 4000 not in use by another process
- [ ] File permissions correct

### Nginx Issues
- [ ] Configuration test: `sudo nginx -t`
- [ ] Error logs: `sudo tail -f /var/log/nginx/error.log`
- [ ] Nginx service status: `sudo systemctl status nginx`
- [ ] Site enabled: `ls -la /etc/nginx/sites-enabled/`

### SSL Issues
- [ ] Certificates exist: `sudo certbot certificates`
- [ ] DNS records correct
- [ ] Port 80 accessible from internet
- [ ] Certbot renewal test: `sudo certbot renew --dry-run`

### Database Issues
- [ ] MongoDB Atlas cluster status
- [ ] IP whitelist includes VPS IP
- [ ] Connection string correct
- [ ] Database user permissions correct

## Quick Reference Commands

```bash
# PM2
sudo -u coffeehub pm2 status
sudo -u coffeehub pm2 logs coffeehubnepal-api
sudo -u coffeehub pm2 restart coffeehubnepal-api

# Nginx
sudo nginx -t
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/error.log

# SSL
sudo certbot certificates
sudo certbot renew

# Monitoring
bash deploy/vps-ubuntu/scripts/monitor.sh
bash deploy/vps-ubuntu/scripts/monitor.sh --verbose

# Backup
sudo bash deploy/vps-ubuntu/scripts/backup.sh
sudo bash deploy/vps-ubuntu/scripts/backup.sh --full
```

## Notes

- Keep this checklist updated with any custom configurations
- Document any deviations from standard setup
- Note any issues encountered and their solutions
- Update team on deployment status

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Domain:** _______________
**VPS IP:** _______________
**MongoDB Cluster:** _______________

