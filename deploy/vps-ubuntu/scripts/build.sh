#!/bin/bash

# Build Script for CoffeeHubNepal VPS Deployment
# This script builds the frontend and backend for production deployment
#
# Usage:
#   bash build.sh [--api-url=https://api.yourdomain.com]
#
# Options:
#   --api-url: Set the API URL for the frontend build (default: empty for relative URLs)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
VPS_DEPLOY_DIR="$SCRIPT_DIR/.."

# Default API URL (empty for relative URLs)
API_URL=""

# Parse arguments
for arg in "$@"; do
    case $arg in
        --api-url=*)
            API_URL="${arg#*=}"
            shift
            ;;
        *)
            echo -e "${YELLOW}Unknown option: $arg${NC}"
            ;;
    esac
done

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CoffeeHubNepal Build Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if we're in the right directory
if [ ! -d "$PROJECT_ROOT/apps" ]; then
    echo -e "${RED}Error: This script must be run from the project root${NC}"
    exit 1
fi

# Clean previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
rm -rf "$VPS_DEPLOY_DIR/frontend"
rm -rf "$VPS_DEPLOY_DIR/backend/dist"
rm -rf "$PROJECT_ROOT/apps/api/dist"
rm -rf "$PROJECT_ROOT/apps/web/dist"

# Build Backend
echo -e "\n${BLUE}Building Backend...${NC}"
cd "$PROJECT_ROOT/apps/api"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi

echo -e "${YELLOW}Compiling TypeScript...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Backend build failed - dist directory not found${NC}"
    exit 1
fi

# Copy backend files to deployment directory
echo -e "${YELLOW}Copying backend files...${NC}"
mkdir -p "$VPS_DEPLOY_DIR/backend"
cp -r dist "$VPS_DEPLOY_DIR/backend/"
cp package.json "$VPS_DEPLOY_DIR/backend/"
cp tsconfig.json "$VPS_DEPLOY_DIR/backend/"

# Copy source files needed for setAdmin script
if [ -d "scripts" ]; then
    mkdir -p "$VPS_DEPLOY_DIR/backend/scripts"
    cp -r scripts/* "$VPS_DEPLOY_DIR/backend/scripts/"
fi

echo -e "${GREEN}✅ Backend build completed${NC}"

# Build Frontend
echo -e "\n${BLUE}Building Frontend...${NC}"
cd "$PROJECT_ROOT/apps/web"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install --include=dev
fi

echo -e "${YELLOW}Building React app...${NC}"
if [ -n "$API_URL" ]; then
    echo -e "${YELLOW}Using API URL: $API_URL${NC}"
    VITE_API_URL="$API_URL" npm run build
else
    echo -e "${YELLOW}Using relative API URLs (same domain)${NC}"
    VITE_API_URL="" npm run build
fi

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Frontend build failed - dist directory not found${NC}"
    exit 1
fi

# Copy frontend files to deployment directory
echo -e "${YELLOW}Copying frontend files...${NC}"
cp -r dist "$VPS_DEPLOY_DIR/frontend"

echo -e "${GREEN}✅ Frontend build completed${NC}"

# Create .gitkeep files to preserve directory structure
touch "$VPS_DEPLOY_DIR/frontend/.gitkeep"

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Build Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Backend:  ${GREEN}✅${NC} $VPS_DEPLOY_DIR/backend/"
echo -e "Frontend: ${GREEN}✅${NC} $VPS_DEPLOY_DIR/frontend/"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Review and update backend/.env.template"
echo -e "2. Copy backend/.env.template to backend/.env and fill in values"
echo -e "3. Upload deploy/vps-ubuntu/ to your VPS"
echo -e "4. Run deploy.sh on the VPS server"

