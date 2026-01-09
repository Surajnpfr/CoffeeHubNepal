# VPS Deployment Instructions

This guide will walk you through deploying CoffeeHubNepal to your VPS server.

## Prerequisites

- Ubuntu 22.04 VPS with root/sudo access
- Domain name with DNS management access
- MongoDB Atlas account with connection string ready
- Email service credentials (Gmail App Password or Azure Communication Services)
- SSH access to your VPS

## Step 1: Build Application (Already Completed)

The application has been built locally. The deployment files are in `deploy/vps-ubuntu/`:
- `backend/` - Compiled backend application
- `frontend/` - Built React frontend
- `scripts/` - Deployment scripts
- `nginx/` - Nginx configuration files
- `pm2/` - PM2 process manager configuration

## Step 2: Set Up SSH Access

### Generate SSH Key (if you don't have one)

On your local Windows machine (PowerShell):

```powershell
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# This creates:
# - C:\Users\YourUsername\.ssh\id_rsa (private key)
# - C:\Users\YourUsername\.ssh\id_rsa.pub (public key)
```

### Copy Public Key to VPS

**Note:** `ssh-copy-id` is not available on Windows PowerShell. Use the manual method below.

**Manual Copy (Windows Method):**

1. Display your public key:
   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"
   ```

2. SSH into your VPS (you'll need to enter password this first time):
   ```powershell
   ssh user@your-vps-ip
   ```

3. On the VPS, create `.ssh` directory and add your key:
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   nano ~/.ssh/authorized_keys
   # Paste your entire public key (the ssh-rsa line), save and exit (Ctrl+X, Y, Enter)
   chmod 600 ~/.ssh/authorized_keys
   exit
   ```

4. Test SSH connection (should not ask for password now):
   ```powershell
   ssh user@your-vps-ip
   ```

**Alternative One-Line Method:**

If you're already connected to the VPS, you can run this command on the VPS:

```bash
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
```

Replace `YOUR_PUBLIC_KEY_HERE` with the output from step 1.

## Step 3: Upload Deployment Files

Upload the entire `deploy/vps-ubuntu/` folder to your VPS.

### Option A: Using SCP (Recommended)

From your local machine (PowerShell):

```powershell
# Navigate to project root
cd "C:\Users\suraj\OneDrive - Yuva Samaj Sewa Rautahat\Desktop\CHN\CoffeeHubNepal"

# Upload the deployment folder
scp -r deploy/vps-ubuntu user@your-vps-ip:/tmp/
```

### Option B: Using SFTP

```powershell
# Connect via SFTP
sftp user@your-vps-ip

# Navigate to remote directory
cd /tmp

# Upload directory
put -r deploy/vps-ubuntu

# Exit
exit
```

### Option C: Using Git (if your VPS has git)

On VPS:
```bash
cd /tmp
git clone your-repo-url
# Or upload via other method
```

## Step 4: Initial Server Setup

SSH into your VPS and run the setup script:

```bash
# SSH into VPS
ssh user@your-vps-ip

# Run setup script (as root or with sudo)
sudo bash /tmp/vps-ubuntu/scripts/setup-server.sh
```

This script will:
- Update system packages
- Install Node.js 20.x
- Install PM2 process manager
- Install Nginx web server
- Install Certbot for SSL certificates
- Configure firewall (UFW)
- Create deployment user (`coffeehub`)
- Set up directory structure at `/var/www/coffeehubnepal`

**Note:** The script will prompt you to set a password for the `coffeehub` user.

## Step 5: Move Files to Deployment Location

After setup, move the deployment files to the proper location:

```bash
# Copy files to deployment directory
sudo cp -r /tmp/vps-ubuntu/* /var/www/coffeehubnepal/

# Set proper ownership
sudo chown -R coffeehub:coffeehub /var/www/coffeehubnepal
```

## Step 6: Configure Environment Variables

Create and configure the `.env` file:

```bash
# Navigate to backend directory
cd /var/www/coffeehubnepal/backend

# Copy template to .env
sudo cp .env.template .env

# Edit the .env file
sudo nano .env
```

Fill in the following required values:

```bash
# Server Configuration
PORT=4000
NODE_ENV=production

# Database Configuration
MONGO_URI=your_mongodb_atlas_connection_string

# Security - Generate with: openssl rand -base64 32
JWT_SECRET=your_generated_jwt_secret_here

# Client Configuration
CLIENT_ORIGIN=https://yourdomain.com

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@yourdomain.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
LOCKOUT_THRESHOLD=5
LOCKOUT_WINDOW_MINUTES=15

# Password Reset
RESET_TOKEN_EXPIRY_HOURS=1
```

**Important:**
- Generate JWT_SECRET: `openssl rand -base64 32`
- For Gmail, you need to create an App Password: https://support.google.com/accounts/answer/185833
- MongoDB Atlas: Ensure your VPS IP is whitelisted in MongoDB Atlas Network Access

Set proper permissions:
```bash
sudo chmod 600 /var/www/coffeehubnepal/backend/.env
sudo chown coffeehub:coffeehub /var/www/coffeehubnepal/backend/.env
```

## Step 7: Configure DNS Records

At your domain registrar, add these A records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | Your VPS IP | 3600 |
| A | www | Your VPS IP | 3600 |
| A | api | Your VPS IP | 3600 |

**Note:** DNS propagation can take 1-24 hours (usually 1-2 hours). You can check propagation status at: https://www.whatsmydns.net/

## Step 8: Deploy Application

Run the deployment script:

```bash
sudo bash /var/www/coffeehubnepal/scripts/deploy.sh --domain=yourdomain.com
```

This script will:
- Install backend dependencies
- Set up PM2 process
- Configure Nginx
- Set proper file permissions

**Verify deployment:**

```bash
# Check PM2 status
sudo -u coffeehub pm2 status

# Check PM2 logs
sudo -u coffeehub pm2 logs coffeehubnepal-api

# Test API locally
curl http://localhost:4000/health

# Test frontend (replace with your VPS IP)
curl http://your-vps-ip
```

## Step 9: Set Up SSL Certificates

**Wait for DNS propagation before proceeding!**

Once DNS has propagated, set up SSL certificates:

```bash
sudo bash /var/www/coffeehubnepal/nginx/ssl-setup.sh yourdomain.com
```

This will:
- Obtain Let's Encrypt certificates for yourdomain.com and api.yourdomain.com
- Configure auto-renewal

## Step 10: Enable HTTPS in Nginx

Edit the Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/coffeehubnepal
```

Uncomment the HTTPS server blocks:
- Lines 74-126 (Frontend HTTPS)
- Lines 171-217 (API HTTPS)

Save and exit (Ctrl+X, Y, Enter).

Test and reload Nginx:

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 11: Update Environment Variables for HTTPS

Update the CLIENT_ORIGIN to use HTTPS:

```bash
sudo nano /var/www/coffeehubnepal/backend/.env
```

Change:
```bash
CLIENT_ORIGIN=https://yourdomain.com
```

Restart the API:

```bash
sudo -u coffeehub pm2 restart coffeehubnepal-api
```

## Step 12: Verify Deployment

1. **Test Frontend:** Visit `https://yourdomain.com` in your browser
2. **Test API:** Visit `https://api.yourdomain.com/health` in your browser
3. **Check Logs:**
   ```bash
   sudo -u coffeehub pm2 logs coffeehubnepal-api
   sudo tail -f /var/log/nginx/error.log
   ```

## Post-Deployment

### Monitoring

```bash
# PM2 status
sudo -u coffeehub pm2 status

# PM2 logs
sudo -u coffeehub pm2 logs coffeehubnepal-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Updating the Application

When you need to update:

1. Build locally: `node deploy/vps-ubuntu/scripts/build.js`
2. Upload new files to VPS
3. Run update script: `sudo bash /var/www/coffeehubnepal/scripts/update.sh`

### Creating Backups

```bash
# Application files only
sudo bash /var/www/coffeehubnepal/scripts/backup.sh

# Include database (if configured)
sudo bash /var/www/coffeehubnepal/scripts/backup.sh --full
```

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
sudo -u coffeehub pm2 logs coffeehubnepal-api

# Check environment variables
sudo cat /var/www/coffeehubnepal/backend/.env

# Test API directly
curl http://localhost:4000/health
```

### Nginx Errors

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check status
sudo systemctl status nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Manually renew
sudo certbot renew
```

### Database Connection Issues

1. Verify MongoDB Atlas cluster is running
2. Check IP whitelist includes your VPS IP
3. Verify connection string in `.env` file
4. Test connection from VPS:
   ```bash
   # Install MongoDB client
   sudo apt-get install mongodb-clients
   
   # Test connection (replace with your URI)
   mongo "your_mongodb_connection_string"
   ```

## Security Checklist

- [ ] Firewall configured (UFW enabled)
- [ ] SSL certificates installed and auto-renewal configured
- [ ] `.env` file has proper permissions (600)
- [ ] Strong JWT_SECRET generated
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Regular backups scheduled
- [ ] System updates applied

## Support

For issues or questions:
1. Check logs first
2. Review troubleshooting section
3. Check GitHub issues
4. Contact support

