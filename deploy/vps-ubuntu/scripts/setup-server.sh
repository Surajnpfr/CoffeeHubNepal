#!/bin/bash

# Initial Server Setup Script for CoffeeHubNepal
# This script prepares a fresh Ubuntu 22.04 VPS for deployment
#
# Usage:
#   sudo bash setup-server.sh
#
# What it does:
#   - Updates system packages
#   - Installs Node.js 20.x
#   - Installs PM2
#   - Installs Nginx
#   - Configures firewall (UFW)
#   - Creates deployment user
#   - Sets up directory structure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CoffeeHubNepal Server Setup${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Update system
echo -e "${YELLOW}Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

# Install essential packages
echo -e "${YELLOW}Installing essential packages...${NC}"
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Installing Node.js 20.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}Node.js is already installed: $NODE_VERSION${NC}"
fi

# Verify Node.js installation
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Installing PM2...${NC}"
    npm install -g pm2
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 10M
    pm2 set pm2-logrotate:retain 10
else
    echo -e "${GREEN}PM2 is already installed${NC}"
fi

# Install Nginx
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Installing Nginx...${NC}"
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
else
    echo -e "${GREEN}Nginx is already installed${NC}"
fi

# Configure Firewall (UFW)
echo -e "${YELLOW}Configuring firewall...${NC}"
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 4000/tcp  # API port (if needed for direct access)
echo -e "${GREEN}✅ Firewall configured${NC}"

# Create deployment user
DEPLOY_USER="coffeehub"
if id "$DEPLOY_USER" &>/dev/null; then
    echo -e "${GREEN}User $DEPLOY_USER already exists${NC}"
else
    echo -e "${YELLOW}Creating deployment user: $DEPLOY_USER...${NC}"
    useradd -m -s /bin/bash $DEPLOY_USER
    usermod -aG sudo $DEPLOY_USER
    echo -e "${GREEN}✅ User created${NC}"
    echo -e "${YELLOW}Please set password for $DEPLOY_USER:${NC}"
    passwd $DEPLOY_USER
fi

# Create deployment directory structure
echo -e "${YELLOW}Creating deployment directories...${NC}"
DEPLOY_DIR="/var/www/coffeehubnepal"
mkdir -p $DEPLOY_DIR/{backend,frontend}
mkdir -p /var/log/pm2
chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR
chown -R $DEPLOY_USER:$DEPLOY_USER /var/log/pm2
echo -e "${GREEN}✅ Directories created${NC}"

# Setup log rotation for PM2
echo -e "${YELLOW}Configuring PM2 log rotation...${NC}"
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 10
pm2 set pm2-logrotate:compress true

# Setup PM2 startup script
echo -e "${YELLOW}Setting up PM2 startup script...${NC}"
pm2 startup systemd -u $DEPLOY_USER --hp /home/$DEPLOY_USER
echo -e "${GREEN}✅ PM2 startup configured${NC}"

# Install Certbot for SSL (optional, can be done later)
echo -e "${YELLOW}Installing Certbot for SSL certificates...${NC}"
apt-get install -y certbot python3-certbot-nginx

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Server Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Installed:${NC}"
echo -e "  ✅ Node.js $(node -v)"
echo -e "  ✅ npm $(npm -v)"
echo -e "  ✅ PM2 $(pm2 -v)"
echo -e "  ✅ Nginx $(nginx -v 2>&1 | cut -d'/' -f2)"
echo -e "  ✅ Certbot"
echo -e "  ✅ UFW Firewall"
echo -e "\n${GREEN}Created:${NC}"
echo -e "  ✅ User: $DEPLOY_USER"
echo -e "  ✅ Directory: $DEPLOY_DIR"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Switch to deployment user: sudo su - $DEPLOY_USER"
echo -e "2. Upload your deployment files to $DEPLOY_DIR"
echo -e "3. Configure environment variables in $DEPLOY_DIR/backend/.env"
echo -e "4. Run deploy.sh script"
echo -e "5. Configure domain DNS records"
echo -e "6. Setup SSL certificates with ssl-setup.sh"

