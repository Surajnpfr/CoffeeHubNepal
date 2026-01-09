#!/bin/bash

# Monitoring Script for CoffeeHubNepal
# This script checks the health of the application and services
#
# Usage:
#   bash monitor.sh [--verbose]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

VERBOSE=false
DEPLOY_DIR="/var/www/coffeehubnepal"
DEPLOY_USER="coffeehub"

# Parse arguments
for arg in "$@"; do
    case $arg in
        --verbose)
            VERBOSE=true
            shift
            ;;
        *)
            ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CoffeeHubNepal Health Check${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check PM2 process
echo -e "${YELLOW}Checking PM2 process...${NC}"
if sudo -u $DEPLOY_USER pm2 list | grep -q "coffeehubnepal-api.*online"; then
    echo -e "${GREEN}✅ PM2 process is running${NC}"
    if [ "$VERBOSE" = true ]; then
        sudo -u $DEPLOY_USER pm2 status
    fi
else
    echo -e "${RED}❌ PM2 process is not running${NC}"
    if [ "$VERBOSE" = true ]; then
        sudo -u $DEPLOY_USER pm2 status
    fi
fi

# Check API health endpoint
echo -e "\n${YELLOW}Checking API health...${NC}"
if command -v curl &> /dev/null; then
    if curl -f -s http://localhost:4000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ API is responding${NC}"
        if [ "$VERBOSE" = true ]; then
            curl -s http://localhost:4000/health | head -n 5
        fi
    else
        echo -e "${RED}❌ API is not responding${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  curl not found. Skipping API health check.${NC}"
fi

# Check Nginx
echo -e "\n${YELLOW}Checking Nginx...${NC}"
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
    if [ "$VERBOSE" = true ]; then
        systemctl status nginx --no-pager -l | head -n 5
    fi
else
    echo -e "${RED}❌ Nginx is not running${NC}"
fi

# Check disk space
echo -e "\n${YELLOW}Checking disk space...${NC}"
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✅ Disk usage: ${DISK_USAGE}%${NC}"
elif [ "$DISK_USAGE" -lt 90 ]; then
    echo -e "${YELLOW}⚠️  Disk usage: ${DISK_USAGE}% (getting high)${NC}"
else
    echo -e "${RED}❌ Disk usage: ${DISK_USAGE}% (critical)${NC}"
fi

# Check memory
echo -e "\n${YELLOW}Checking memory...${NC}"
if command -v free &> /dev/null; then
    MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [ "$MEM_USAGE" -lt 80 ]; then
        echo -e "${GREEN}✅ Memory usage: ${MEM_USAGE}%${NC}"
    elif [ "$MEM_USAGE" -lt 90 ]; then
        echo -e "${YELLOW}⚠️  Memory usage: ${MEM_USAGE}% (getting high)${NC}"
    else
        echo -e "${RED}❌ Memory usage: ${MEM_USAGE}% (critical)${NC}"
    fi
fi

# Check logs for errors
echo -e "\n${YELLOW}Checking recent errors...${NC}"
ERROR_COUNT=$(sudo -u $DEPLOY_USER pm2 logs coffeehubnepal-api --lines 100 --nostream 2>/dev/null | grep -i error | wc -l || echo "0")
if [ "$ERROR_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No recent errors in logs${NC}"
else
    echo -e "${YELLOW}⚠️  Found $ERROR_COUNT error(s) in recent logs${NC}"
    if [ "$VERBOSE" = true ]; then
        echo -e "${YELLOW}Recent errors:${NC}"
        sudo -u $DEPLOY_USER pm2 logs coffeehubnepal-api --lines 50 --nostream 2>/dev/null | grep -i error | tail -n 5
    fi
fi

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Health Check Complete${NC}"
echo -e "${BLUE}========================================${NC}"

