# Quick Deployment Checklist

## ✅ Completed Locally

- [x] Application built (backend and frontend)
- [x] Environment template prepared
- [x] Deployment files ready in `deploy/vps-ubuntu/`
- [x] Deployment instructions created

## 📋 Next Steps (Manual Actions Required)

### 1. SSH Setup
- [ ] Generate SSH key pair (if needed)
- [ ] Copy public key to VPS
- [ ] Test SSH connection

**Command:**
```powershell
ssh-keygen -t rsa -b 4096
ssh-copy-id user@your-vps-ip
```

### 2. Upload Files
- [ ] Upload `deploy/vps-ubuntu/` folder to VPS

**Option A - Using helper script:**
```powershell
.\deploy\vps-ubuntu\scripts\upload-to-vps.ps1 -VpsIp "your-vps-ip" -VpsUser "username"
```

**Option B - Using SCP manually:**
```powershell
scp -r deploy/vps-ubuntu user@your-vps-ip:/tmp/
```

### 3. Server Setup
- [ ] SSH into VPS
- [ ] Run setup script
- [ ] Move files to deployment location

**Commands:**
```bash
ssh user@your-vps-ip
sudo bash /tmp/vps-ubuntu/scripts/setup-server.sh
sudo cp -r /tmp/vps-ubuntu/* /var/www/coffeehubnepal/
sudo chown -R coffeehub:coffeehub /var/www/coffeehubnepal
```

### 4. Configure Environment
- [ ] Create `.env` file from template
- [ ] Fill in MongoDB URI
- [ ] Generate JWT_SECRET
- [ ] Configure email credentials
- [ ] Set domain name

**Commands:**
```bash
cd /var/www/coffeehubnepal/backend
sudo cp .env.template .env
sudo nano .env
# Fill in all values, then:
sudo chmod 600 .env
sudo chown coffeehub:coffeehub .env
```

### 5. Configure DNS
- [ ] Add A record: `yourdomain.com` → VPS IP
- [ ] Add A record: `www.yourdomain.com` → VPS IP
- [ ] Add A record: `api.yourdomain.com` → VPS IP
- [ ] Wait for DNS propagation (1-24 hours)

### 6. Deploy Application
- [ ] Run deployment script
- [ ] Verify PM2 status
- [ ] Check logs
- [ ] Test API endpoint

**Commands:**
```bash
sudo bash /var/www/coffeehubnepal/scripts/deploy.sh --domain=yourdomain.com
sudo -u coffeehub pm2 status
sudo -u coffeehub pm2 logs coffeehubnepal-api
curl http://localhost:4000/health
```

### 7. SSL Setup (After DNS Propagation)
- [ ] Run SSL setup script
- [ ] Enable HTTPS in Nginx config
- [ ] Update CLIENT_ORIGIN to HTTPS
- [ ] Restart API

**Commands:**
```bash
sudo bash /var/www/coffeehubnepal/nginx/ssl-setup.sh yourdomain.com
sudo nano /etc/nginx/sites-available/coffeehubnepal
# Uncomment HTTPS blocks (lines 74-126 and 171-217)
sudo nginx -t
sudo systemctl reload nginx
sudo nano /var/www/coffeehubnepal/backend/.env
# Update CLIENT_ORIGIN=https://yourdomain.com
sudo -u coffeehub pm2 restart coffeehubnepal-api
```

### 8. Verify Deployment
- [ ] Test frontend: `https://yourdomain.com`
- [ ] Test API: `https://api.yourdomain.com/health`
- [ ] Check all functionality
- [ ] Monitor logs

## 📚 Documentation

- **Full Instructions:** See `DEPLOYMENT_INSTRUCTIONS.md`
- **Quick Start:** See `QUICK_START.md`
- **Troubleshooting:** See `README.md`

## 🔧 Useful Commands

### PM2 Management
```bash
sudo -u coffeehub pm2 status
sudo -u coffeehub pm2 logs coffeehubnepal-api
sudo -u coffeehub pm2 restart coffeehubnepal-api
sudo -u coffeehub pm2 stop coffeehubnepal-api
```

### Nginx Management
```bash
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Updates
```bash
# On local machine: Build and upload new files
# On VPS:
sudo bash /var/www/coffeehubnepal/scripts/update.sh
```

### Backups
```bash
sudo bash /var/www/coffeehubnepal/scripts/backup.sh
```

## ⚠️ Important Notes

1. **DNS Propagation:** Can take 1-24 hours. Don't proceed with SSL until DNS is propagated.
2. **MongoDB Atlas:** Ensure your VPS IP is whitelisted in Network Access.
3. **Firewall:** UFW is configured during setup. Ports 22, 80, and 443 should be open.
4. **Environment Variables:** Never commit `.env` file. Keep it secure with 600 permissions.
5. **SSL Certificates:** Auto-renewal is configured. Certificates expire every 90 days.

## 🆘 Need Help?

1. Check `DEPLOYMENT_INSTRUCTIONS.md` for detailed steps
2. Review logs: `sudo -u coffeehub pm2 logs coffeehubnepal-api`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Verify environment: `sudo cat /var/www/coffeehubnepal/backend/.env`

