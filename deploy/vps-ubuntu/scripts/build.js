#!/usr/bin/env node

/**
 * Build Script for CoffeeHubNepal VPS Deployment (Windows/Linux compatible)
 * This script builds the frontend and backend for production deployment
 *
 * Usage:
 *   node deploy/vps-ubuntu/scripts/build.js [--api-url=https://api.yourdomain.com]
 *
 * Options:
 *   --api-url: Set the API URL for the frontend build (default: empty for relative URLs)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for output (Windows compatible)
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}`),
};

// Parse command line arguments
let API_URL = '';
const args = process.argv.slice(2);
args.forEach(arg => {
  if (arg.startsWith('--api-url=')) {
    API_URL = arg.split('=')[1];
  }
});

// Get paths
const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '../../..');
const VPS_DEPLOY_DIR = path.resolve(SCRIPT_DIR, '..');

console.log(`${colors.blue}========================================${colors.reset}`);
console.log(`${colors.blue}  CoffeeHubNepal Build Script${colors.reset}`);
console.log(`${colors.blue}========================================${colors.reset}\n`);

// Check if we're in the right directory
if (!fs.existsSync(path.join(PROJECT_ROOT, 'apps'))) {
  log.error('This script must be run from the project root');
  process.exit(1);
}

// Helper function to copy directory recursively
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Clean previous builds
log.step('Cleaning previous builds...');
const dirsToClean = [
  path.join(VPS_DEPLOY_DIR, 'frontend'),
  path.join(VPS_DEPLOY_DIR, 'backend', 'dist'),
  path.join(PROJECT_ROOT, 'apps', 'api', 'dist'),
  path.join(PROJECT_ROOT, 'apps', 'web', 'dist'),
];

dirsToClean.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Build Backend
log.step('Building Backend...');
const apiDir = path.join(PROJECT_ROOT, 'apps', 'api');

// Install dependencies if needed
if (!fs.existsSync(path.join(apiDir, 'node_modules'))) {
  log.warning('Installing backend dependencies...');
  execSync('npm install', { cwd: apiDir, stdio: 'inherit' });
}

// Build TypeScript
log.warning('Compiling TypeScript...');
execSync('npm run build', { cwd: apiDir, stdio: 'inherit' });

// Verify build
if (!fs.existsSync(path.join(apiDir, 'dist'))) {
  log.error('Backend build failed - dist directory not found');
  process.exit(1);
}

// Copy backend files to deployment directory
log.warning('Copying backend files...');
const deployBackendDir = path.join(VPS_DEPLOY_DIR, 'backend');
if (!fs.existsSync(deployBackendDir)) {
  fs.mkdirSync(deployBackendDir, { recursive: true });
}

// Copy dist, package.json, tsconfig.json
copyRecursiveSync(path.join(apiDir, 'dist'), path.join(deployBackendDir, 'dist'));
fs.copyFileSync(path.join(apiDir, 'package.json'), path.join(deployBackendDir, 'package.json'));
fs.copyFileSync(path.join(apiDir, 'tsconfig.json'), path.join(deployBackendDir, 'tsconfig.json'));

// Copy scripts if they exist
const apiScriptsDir = path.join(apiDir, 'scripts');
if (fs.existsSync(apiScriptsDir)) {
  const deployScriptsDir = path.join(deployBackendDir, 'scripts');
  if (!fs.existsSync(deployScriptsDir)) {
    fs.mkdirSync(deployScriptsDir, { recursive: true });
  }
  copyRecursiveSync(apiScriptsDir, deployScriptsDir);
}

// Copy environment template if it exists
const envTemplateSource = path.join(PROJECT_ROOT, 'deploy', 'backend', 'ENV_TEMPLATE.txt');
const envTemplateDest = path.join(deployBackendDir, '.env.template');
if (fs.existsSync(envTemplateSource)) {
  fs.copyFileSync(envTemplateSource, envTemplateDest);
  log.success('Environment template copied');
}

log.success('Backend build completed');

// Build Frontend
log.step('Building Frontend...');
const webDir = path.join(PROJECT_ROOT, 'apps', 'web');

// Install dependencies if needed
if (!fs.existsSync(path.join(webDir, 'node_modules'))) {
  log.warning('Installing frontend dependencies...');
  execSync('npm install --include=dev', { cwd: webDir, stdio: 'inherit' });
}

// Build React app
log.warning('Building React app...');
const env = { ...process.env };
if (API_URL) {
  log.warning(`Using API URL: ${API_URL}`);
  env.VITE_API_URL = API_URL;
} else {
  log.warning('Using relative API URLs (same domain)');
  env.VITE_API_URL = '';
}

execSync('npm run build', { cwd: webDir, stdio: 'inherit', env });

// Verify build
if (!fs.existsSync(path.join(webDir, 'dist'))) {
  log.error('Frontend build failed - dist directory not found');
  process.exit(1);
}

// Copy frontend files to deployment directory
log.warning('Copying frontend files...');
const deployFrontendDir = path.join(VPS_DEPLOY_DIR, 'frontend');
copyRecursiveSync(path.join(webDir, 'dist'), deployFrontendDir);

log.success('Frontend build completed');

// Summary
console.log(`\n${colors.blue}========================================${colors.reset}`);
console.log(`${colors.green}Build Summary${colors.reset}`);
console.log(`${colors.blue}========================================${colors.reset}`);
console.log(`Backend:  ${colors.green}✅${colors.reset} ${deployBackendDir}`);
console.log(`Frontend: ${colors.green}✅${colors.reset} ${deployFrontendDir}`);
console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
console.log('1. Review and update backend/.env.template');
console.log('2. Copy backend/.env.template to backend/.env and fill in values');
console.log('3. Upload deploy/vps-ubuntu/ to your VPS');
console.log('4. Run deploy.sh on the VPS server');

