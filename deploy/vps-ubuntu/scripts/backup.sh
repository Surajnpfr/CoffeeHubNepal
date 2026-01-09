#!/bin/bash

# Backup Script for CoffeeHubNepal
# This script creates backups of the application and database
#
# Usage:
#   sudo bash backup.sh [--full]
#
# Options:
#   --full: Include database backup (requires mongodump)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/var/www/coffeehubnepal"
BACKUP_DIR="/var/backups/coffeehubnepal"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"
FULL_BACKUP=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --full)
            FULL_BACKUP=true
            shift
            ;;
        *)
            echo -e "${YELLOW}Unknown option: $arg${NC}"
            ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CoffeeHubNepal Backup Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_PATH"

# Backup application files
echo -e "${YELLOW}Backing up application files...${NC}"
if [ -d "$DEPLOY_DIR/backend" ]; then
    cp -r "$DEPLOY_DIR/backend" "$BACKUP_PATH/" 2>/dev/null || true
    echo -e "${GREEN}✅ Backend files backed up${NC}"
fi

if [ -d "$DEPLOY_DIR/frontend" ]; then
    cp -r "$DEPLOY_DIR/frontend" "$BACKUP_PATH/" 2>/dev/null || true
    echo -e "${GREEN}✅ Frontend files backed up${NC}"
fi

# Backup environment file
if [ -f "$DEPLOY_DIR/backend/.env" ]; then
    cp "$DEPLOY_DIR/backend/.env" "$BACKUP_PATH/.env" 2>/dev/null || true
    echo -e "${GREEN}✅ Environment file backed up${NC}"
fi

# Backup PM2 configuration
if [ -f "$DEPLOY_DIR/backend/ecosystem.config.js" ]; then
    cp "$DEPLOY_DIR/backend/ecosystem.config.js" "$BACKUP_PATH/" 2>/dev/null || true
    echo -e "${GREEN}✅ PM2 configuration backed up${NC}"
fi

# Database backup (if --full and mongodump available)
if [ "$FULL_BACKUP" = true ]; then
    if command -v mongodump &> /dev/null; then
        echo -e "${YELLOW}Backing up database...${NC}"
        
        # Try to get MongoDB URI from .env
        if [ -f "$DEPLOY_DIR/backend/.env" ]; then
            MONGO_URI=$(grep MONGO_URI "$DEPLOY_DIR/backend/.env" | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs)
            if [ -n "$MONGO_URI" ]; then
                mongodump --uri="$MONGO_URI" --out="$BACKUP_PATH/database" 2>/dev/null && \
                    echo -e "${GREEN}✅ Database backed up${NC}" || \
                    echo -e "${YELLOW}⚠️  Database backup failed (may need authentication)${NC}"
            else
                echo -e "${YELLOW}⚠️  MONGO_URI not found in .env${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  .env file not found${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  mongodump not found. Install MongoDB tools for database backup.${NC}"
    fi
fi

# Create archive
echo -e "${YELLOW}Creating archive...${NC}"
cd "$BACKUP_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"
echo -e "${GREEN}✅ Archive created: ${BACKUP_NAME}.tar.gz${NC}"

# Get backup size
BACKUP_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
echo -e "${GREEN}Backup size: $BACKUP_SIZE${NC}"

# Cleanup old backups (keep last 10)
echo -e "${YELLOW}Cleaning up old backups...${NC}"
cd "$BACKUP_DIR"
ls -t *.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Backup Complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${GREEN}Backup Location:${NC}"
echo -e "  $BACKUP_DIR/${BACKUP_NAME}.tar.gz"

echo -e "\n${YELLOW}To restore from backup:${NC}"
echo -e "  cd $BACKUP_DIR"
echo -e "  tar -xzf ${BACKUP_NAME}.tar.gz"
echo -e "  # Then copy files back to $DEPLOY_DIR"

