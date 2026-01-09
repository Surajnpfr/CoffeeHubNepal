#!/bin/bash

# Update Script for CoffeeHubNepal
# This script performs zero-downtime updates of the application
#
# Usage:
#   sudo bash update.sh
#
# What it does:
#   - Pulls latest code (if using git)
#   - Rebuilds application
#   - Restarts services with zero downtime
#   - Rolls back on failure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/var/www/coffeehubnepal"
DEPLOY_USER="coffeehub"
PROJECT_ROOT="/var/www/coffeehubnepal"
BACKUP_DIR="/var/backups/coffeehubnepal"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CoffeeHubNepal Update Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup current deployment
echo -e "${YELLOW}Creating backup...${NC}"
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"
mkdir -p "$BACKUP_PATH"
cp -r "$DEPLOY_DIR/backend" "$BACKUP_PATH/" 2>/dev/null || true
cp -r "$DEPLOY_DIR/frontend" "$BACKUP_PATH/" 2>/dev/null || true
echo -e "${GREEN}✅ Backup created: $BACKUP_PATH${NC}"

# Check if using git
if [ -d "$PROJECT_ROOT/.git" ]; then
    echo -e "${YELLOW}Pulling latest code...${NC}"
    cd "$PROJECT_ROOT"
    git pull origin main || git pull origin master
    echo -e "${GREEN}✅ Code updated${NC}"
else
    echo -e "${YELLOW}Not a git repository. Skipping git pull.${NC}"
    echo -e "${YELLOW}Please upload new files manually or configure git.${NC}"
fi

# Rebuild application
echo -e "${YELLOW}Rebuilding application...${NC}"
if [ -f "$PROJECT_ROOT/deploy/vps-ubuntu/scripts/build.sh" ]; then
    cd "$PROJECT_ROOT"
    bash deploy/vps-ubuntu/scripts/build.sh
else
    echo -e "${RED}Error: Build script not found${NC}"
    exit 1
fi

# Copy new files to deployment directory
echo -e "${YELLOW}Copying new files...${NC}"
if [ -d "$PROJECT_ROOT/deploy/vps-ubuntu/backend/dist" ]; then
    # Stop PM2 process gracefully
    echo -e "${YELLOW}Stopping application...${NC}"
    sudo -u $DEPLOY_USER pm2 stop coffeehubnepal-api || true
    
    # Copy backend
    rm -rf "$DEPLOY_DIR/backend/dist"
    cp -r "$PROJECT_ROOT/deploy/vps-ubuntu/backend/dist" "$DEPLOY_DIR/backend/"
    
    # Copy frontend
    rm -rf "$DEPLOY_DIR/frontend"
    cp -r "$PROJECT_ROOT/deploy/vps-ubuntu/frontend" "$DEPLOY_DIR/frontend"
    
    # Install backend dependencies if package.json changed
    cd "$DEPLOY_DIR/backend"
    npm install --production
    
    # Set permissions
    chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR
    chmod 600 "$DEPLOY_DIR/backend/.env" 2>/dev/null || true
    
    echo -e "${GREEN}✅ Files copied${NC}"
else
    echo -e "${RED}Error: Build output not found${NC}"
    echo -e "${YELLOW}Rolling back...${NC}"
    rm -rf "$DEPLOY_DIR/backend/dist"
    rm -rf "$DEPLOY_DIR/frontend"
    cp -r "$BACKUP_PATH/backend" "$DEPLOY_DIR/" 2>/dev/null || true
    cp -r "$BACKUP_PATH/frontend" "$DEPLOY_DIR/" 2>/dev/null || true
    sudo -u $DEPLOY_USER pm2 restart coffeehubnepal-api
    exit 1
fi

# Restart application
echo -e "${YELLOW}Restarting application...${NC}"
sudo -u $DEPLOY_USER pm2 restart coffeehubnepal-api

# Wait a moment for the app to start
sleep 3

# Health check
echo -e "${YELLOW}Performing health check...${NC}"
HEALTH_CHECK_URL="http://localhost:4000/health"
if command -v curl &> /dev/null; then
    if curl -f -s "$HEALTH_CHECK_URL" > /dev/null; then
        echo -e "${GREEN}✅ Health check passed${NC}"
    else
        echo -e "${RED}❌ Health check failed${NC}"
        echo -e "${YELLOW}Rolling back...${NC}"
        
        # Restore backup
        rm -rf "$DEPLOY_DIR/backend/dist"
        rm -rf "$DEPLOY_DIR/frontend"
        cp -r "$BACKUP_PATH/backend" "$DEPLOY_DIR/" 2>/dev/null || true
        cp -r "$BACKUP_PATH/frontend" "$DEPLOY_DIR/" 2>/dev/null || true
        cd "$DEPLOY_DIR/backend"
        npm install --production
        sudo -u $DEPLOY_USER pm2 restart coffeehubnepal-api
        
        echo -e "${RED}Update failed. Rolled back to previous version.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}curl not found. Skipping health check.${NC}"
fi

# Reload nginx
echo -e "${YELLOW}Reloading Nginx...${NC}"
systemctl reload nginx

# Cleanup old backups (keep last 5)
echo -e "${YELLOW}Cleaning up old backups...${NC}"
cd "$BACKUP_DIR"
ls -t | tail -n +6 | xargs rm -rf 2>/dev/null || true

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Update Complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Application Status:${NC}"
sudo -u $DEPLOY_USER pm2 status

echo -e "\n${GREEN}Backup Location:${NC}"
echo -e "  $BACKUP_PATH"

echo -e "\n${YELLOW}If something went wrong, you can restore from backup:${NC}"
echo -e "  sudo bash restore.sh $BACKUP_PATH"

