#!/bin/bash

# Main Deployment Script for CoffeeHubNepal
# This script deploys the application to the VPS
#
# Usage:
#   sudo bash deploy.sh [--domain=yourdomain.com]
#
# Prerequisites:
#   - Server must be set up with setup-server.sh
#   - Deployment files must be in /var/www/coffeehubnepal/
#   - Environment variables must be configured in backend/.env

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DOMAIN=""
DEPLOY_DIR="/var/www/coffeehubnepal"
DEPLOY_USER="coffeehub"
NGINX_SITE="coffeehubnepal"

# Parse arguments
for arg in "$@"; do
    case $arg in
        --domain=*)
            DOMAIN="${arg#*=}"
            shift
            ;;
        *)
            echo -e "${YELLOW}Unknown option: $arg${NC}"
            ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CoffeeHubNepal Deployment${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Check if deployment directory exists
if [ ! -d "$DEPLOY_DIR" ]; then
    echo -e "${RED}Error: Deployment directory not found: $DEPLOY_DIR${NC}"
    echo -e "${YELLOW}Please run setup-server.sh first or upload deployment files${NC}"
    exit 1
fi

# Check if backend dist exists
if [ ! -d "$DEPLOY_DIR/backend/dist" ]; then
    echo -e "${RED}Error: Backend dist directory not found${NC}"
    echo -e "${YELLOW}Please build the project first using build.sh${NC}"
    exit 1
fi

# Check if frontend exists
if [ ! -d "$DEPLOY_DIR/frontend" ]; then
    echo -e "${RED}Error: Frontend directory not found${NC}"
    echo -e "${YELLOW}Please build the project first using build.sh${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f "$DEPLOY_DIR/backend/.env" ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    echo -e "${YELLOW}Creating .env from template...${NC}"
    if [ -f "$DEPLOY_DIR/backend/.env.template" ]; then
        cp "$DEPLOY_DIR/backend/.env.template" "$DEPLOY_DIR/backend/.env"
        echo -e "${RED}Please edit $DEPLOY_DIR/backend/.env and fill in all values${NC}"
        exit 1
    else
        echo -e "${RED}Error: .env.template not found${NC}"
        exit 1
    fi
fi

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd "$DEPLOY_DIR/backend"
npm install --production

# Set proper permissions
echo -e "${YELLOW}Setting file permissions...${NC}"
chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR
chmod 600 "$DEPLOY_DIR/backend/.env"
chmod +x "$DEPLOY_DIR/backend/dist/server.js" 2>/dev/null || true

# Setup PM2
echo -e "${YELLOW}Setting up PM2...${NC}"
if [ -f "$DEPLOY_DIR/pm2/ecosystem.config.js" ]; then
    # Copy PM2 config to deployment directory
    cp "$DEPLOY_DIR/pm2/ecosystem.config.js" "$DEPLOY_DIR/backend/"
    
    # Update PM2 config path if needed
    sed -i "s|/var/www/coffeehubnepal/backend|$DEPLOY_DIR/backend|g" "$DEPLOY_DIR/backend/ecosystem.config.js"
    
    # Stop existing PM2 process if running
    sudo -u $DEPLOY_USER pm2 delete coffeehubnepal-api 2>/dev/null || true
    
    # Start with PM2 (use .cjs if exists, otherwise .js)
    cd "$DEPLOY_DIR/backend"
    if [ -f "$DEPLOY_DIR/backend/ecosystem.config.cjs" ]; then
        sudo -u $DEPLOY_USER pm2 start ecosystem.config.cjs
    else
        sudo -u $DEPLOY_USER pm2 start ecosystem.config.js
    fi
    sudo -u $DEPLOY_USER pm2 save
else
    echo -e "${YELLOW}PM2 config not found, starting manually...${NC}"
    cd "$DEPLOY_DIR/backend"
    sudo -u $DEPLOY_USER pm2 delete coffeehubnepal-api 2>/dev/null || true
    sudo -u $DEPLOY_USER pm2 start dist/server.js --name coffeehubnepal-api
    sudo -u $DEPLOY_USER pm2 save
fi

echo -e "${GREEN}✅ PM2 process started${NC}"

# Configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
if [ -f "$DEPLOY_DIR/nginx/coffeehubnepal.conf" ]; then
    # Copy nginx config
    cp "$DEPLOY_DIR/nginx/coffeehubnepal.conf" "/etc/nginx/sites-available/$NGINX_SITE"
    
    # Update domain in nginx config if provided
    if [ -n "$DOMAIN" ]; then
        sed -i "s/yourdomain.com/$DOMAIN/g" "/etc/nginx/sites-available/$NGINX_SITE"
        echo -e "${GREEN}✅ Updated domain to $DOMAIN in nginx config${NC}"
    else
        echo -e "${YELLOW}Warning: Domain not specified. Please update nginx config manually${NC}"
    fi
    
    # Enable site
    if [ ! -L "/etc/nginx/sites-enabled/$NGINX_SITE" ]; then
        ln -s "/etc/nginx/sites-available/$NGINX_SITE" "/etc/nginx/sites-enabled/$NGINX_SITE"
    fi
    
    # Remove default nginx site
    rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    if nginx -t; then
        systemctl reload nginx
        echo -e "${GREEN}✅ Nginx configured and reloaded${NC}"
    else
        echo -e "${RED}Error: Nginx configuration test failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}Error: Nginx configuration file not found${NC}"
    exit 1
fi

# Setup SSL if domain is provided
if [ -n "$DOMAIN" ]; then
    echo -e "\n${YELLOW}SSL Certificate Setup${NC}"
    read -p "Do you want to setup SSL certificates now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f "$DEPLOY_DIR/nginx/ssl-setup.sh" ]; then
            bash "$DEPLOY_DIR/nginx/ssl-setup.sh" "$DOMAIN"
        else
            echo -e "${YELLOW}SSL setup script not found. You can run it manually later.${NC}"
        fi
    else
        echo -e "${YELLOW}SSL setup skipped. You can run it later with:${NC}"
        echo -e "  sudo bash $DEPLOY_DIR/nginx/ssl-setup.sh $DOMAIN"
    fi
fi

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Services Status:${NC}"
sudo -u $DEPLOY_USER pm2 list
echo ""
systemctl status nginx --no-pager -l | head -n 3

echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Configure DNS records:"
echo -e "   - A record: yourdomain.com -> $(curl -s ifconfig.me)"
echo -e "   - A record: api.yourdomain.com -> $(curl -s ifconfig.me)"
echo -e "2. Wait for DNS propagation (can take up to 24 hours)"
echo -e "3. Setup SSL certificates:"
echo -e "   sudo bash $DEPLOY_DIR/nginx/ssl-setup.sh yourdomain.com"
echo -e "4. Update nginx config to enable HTTPS (uncomment HTTPS blocks)"
echo -e "5. Test your application:"
echo -e "   - Frontend: http://yourdomain.com"
echo -e "   - API: http://api.yourdomain.com/health"

echo -e "\n${GREEN}Useful commands:${NC}"
echo -e "  PM2 logs:     sudo -u $DEPLOY_USER pm2 logs coffeehubnepal-api"
echo -e "  PM2 status:   sudo -u $DEPLOY_USER pm2 status"
echo -e "  Nginx logs:   sudo tail -f /var/log/nginx/error.log"
echo -e "  Restart API:  sudo -u $DEPLOY_USER pm2 restart coffeehubnepal-api"

