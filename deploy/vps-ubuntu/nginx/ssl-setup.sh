#!/bin/bash

# SSL Certificate Setup Script for CoffeeHubNepal
# This script installs Let's Encrypt SSL certificates using Certbot
#
# Usage:
#   sudo bash ssl-setup.sh yourdomain.com
#
# Prerequisites:
#   - Domain must point to this server's IP
#   - Ports 80 and 443 must be open
#   - Nginx must be installed and configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Check if domain is provided
if [ -z "$1" ]; then
    echo -e "${RED}Usage: sudo bash ssl-setup.sh yourdomain.com${NC}"
    exit 1
fi

DOMAIN=$1
API_DOMAIN="api.${DOMAIN}"

echo -e "${GREEN}Setting up SSL certificates for ${DOMAIN} and ${API_DOMAIN}${NC}"

# Update package list
echo -e "${YELLOW}Updating package list...${NC}"
apt-get update

# Install certbot and nginx plugin
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    apt-get install -y certbot python3-certbot-nginx
else
    echo -e "${GREEN}Certbot is already installed${NC}"
fi

# Ensure nginx is running
if ! systemctl is-active --quiet nginx; then
    echo -e "${YELLOW}Starting nginx...${NC}"
    systemctl start nginx
fi

# Obtain certificates
echo -e "${YELLOW}Obtaining SSL certificate for ${DOMAIN}...${NC}"
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} --redirect

echo -e "${YELLOW}Obtaining SSL certificate for ${API_DOMAIN}...${NC}"
certbot --nginx -d ${API_DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} --redirect

# Test certificate renewal
echo -e "${YELLOW}Testing certificate renewal...${NC}"
certbot renew --dry-run

# Setup auto-renewal (usually already done by certbot)
echo -e "${GREEN}SSL certificates installed successfully!${NC}"
echo -e "${GREEN}Certificates will auto-renew via certbot timer${NC}"

# Show certificate info
echo -e "\n${YELLOW}Certificate information:${NC}"
certbot certificates

echo -e "\n${GREEN}Next steps:${NC}"
echo "1. Update nginx configuration to use HTTPS (uncomment HTTPS server blocks)"
echo "2. Test nginx configuration: sudo nginx -t"
echo "3. Reload nginx: sudo systemctl reload nginx"
echo "4. Update CLIENT_ORIGIN in backend/.env to use https://${DOMAIN}"

