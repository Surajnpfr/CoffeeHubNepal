# Build Script for CoffeeHubNepal VPS Deployment (PowerShell)
# This script builds the frontend and backend for production deployment
#
# Usage:
#   .\deploy\vps-ubuntu\scripts\build.ps1 [-ApiUrl "https://api.yourdomain.com"]
#
# Options:
#   -ApiUrl: Set the API URL for the frontend build (default: empty for relative URLs)

param(
    [string]$ApiUrl = ""
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Step($message) {
    Write-ColorOutput Cyan "`n$message"
}

function Write-Success($message) {
    Write-ColorOutput Green "✅ $message"
}

function Write-Warning($message) {
    Write-ColorOutput Yellow "⚠️  $message"
}

function Write-Error($message) {
    Write-ColorOutput Red "❌ $message"
}

# Get paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "../..")
$VpsDeployDir = Join-Path $ScriptDir ".."

Write-ColorOutput Cyan "========================================"
Write-ColorOutput Cyan "  CoffeeHubNepal Build Script"
Write-ColorOutput Cyan "========================================"
Write-Output ""

# Check if we're in the right directory
if (-not (Test-Path (Join-Path $ProjectRoot "apps"))) {
    Write-Error "This script must be run from the project root"
    exit 1
}

# Clean previous builds
Write-Step "Cleaning previous builds..."
$dirsToClean = @(
    (Join-Path $VpsDeployDir "frontend"),
    (Join-Path $VpsDeployDir "backend\dist"),
    (Join-Path $ProjectRoot "apps\api\dist"),
    (Join-Path $ProjectRoot "apps\web\dist")
)

foreach ($dir in $dirsToClean) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force
    }
}

# Build Backend
Write-Step "Building Backend..."
$apiDir = Join-Path $ProjectRoot "apps\api"

# Install dependencies if needed
if (-not (Test-Path (Join-Path $apiDir "node_modules"))) {
    Write-Warning "Installing backend dependencies..."
    Set-Location $apiDir
    npm install
    Set-Location $ProjectRoot
}

# Build TypeScript
Write-Warning "Compiling TypeScript..."
Set-Location $apiDir
npm run build
Set-Location $ProjectRoot

# Verify build
if (-not (Test-Path (Join-Path $apiDir "dist"))) {
    Write-Error "Backend build failed - dist directory not found"
    exit 1
}

# Copy backend files to deployment directory
Write-Warning "Copying backend files..."
$deployBackendDir = Join-Path $VpsDeployDir "backend"
if (-not (Test-Path $deployBackendDir)) {
    New-Item -ItemType Directory -Path $deployBackendDir -Force | Out-Null
}

Copy-Item -Path (Join-Path $apiDir "dist") -Destination (Join-Path $deployBackendDir "dist") -Recurse -Force
Copy-Item -Path (Join-Path $apiDir "package.json") -Destination (Join-Path $deployBackendDir "package.json") -Force
Copy-Item -Path (Join-Path $apiDir "tsconfig.json") -Destination (Join-Path $deployBackendDir "tsconfig.json") -Force

# Copy scripts if they exist
$apiScriptsDir = Join-Path $apiDir "scripts"
if (Test-Path $apiScriptsDir) {
    $deployScriptsDir = Join-Path $deployBackendDir "scripts"
    Copy-Item -Path $apiScriptsDir -Destination $deployScriptsDir -Recurse -Force
}

Write-Success "Backend build completed"

# Build Frontend
Write-Step "Building Frontend..."
$webDir = Join-Path $ProjectRoot "apps\web"

# Install dependencies if needed
if (-not (Test-Path (Join-Path $webDir "node_modules"))) {
    Write-Warning "Installing frontend dependencies..."
    Set-Location $webDir
    npm install --include=dev
    Set-Location $ProjectRoot
}

# Build React app
Write-Warning "Building React app..."
if ($ApiUrl) {
    Write-Warning "Using API URL: $ApiUrl"
    $env:VITE_API_URL = $ApiUrl
} else {
    Write-Warning "Using relative API URLs (same domain)"
    $env:VITE_API_URL = ""
}

Set-Location $webDir
npm run build
Set-Location $ProjectRoot

# Verify build
if (-not (Test-Path (Join-Path $webDir "dist"))) {
    Write-Error "Frontend build failed - dist directory not found"
    exit 1
}

# Copy frontend files to deployment directory
Write-Warning "Copying frontend files..."
$deployFrontendDir = Join-Path $VpsDeployDir "frontend"
Copy-Item -Path (Join-Path $webDir "dist") -Destination $deployFrontendDir -Recurse -Force

Write-Success "Frontend build completed"

# Summary
Write-Output ""
Write-ColorOutput Cyan "========================================"
Write-ColorOutput Green "Build Summary"
Write-ColorOutput Cyan "========================================"
Write-Output "Backend:  ✅ $deployBackendDir"
Write-Output "Frontend: ✅ $deployFrontendDir"
Write-Output ""
Write-ColorOutput Yellow "Next steps:"
Write-Output "1. Review and update backend/.env.template"
Write-Output "2. Copy backend/.env.template to backend/.env and fill in values"
Write-Output "3. Upload deploy/vps-ubuntu/ to your VPS"
Write-Output "4. Run deploy.sh on the VPS server"

