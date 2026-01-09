# PowerShell Script to Upload Deployment Files to VPS
# 
# Usage:
#   .\upload-to-vps.ps1 -VpsIp "your-vps-ip" -VpsUser "username" [-VpsPath "/tmp"]
#
# Prerequisites:
#   - SSH access to VPS configured
#   - SCP available (usually comes with OpenSSH on Windows 10+)

param(
    [Parameter(Mandatory=$true)]
    [string]$VpsIp,
    
    [Parameter(Mandatory=$true)]
    [string]$VpsUser,
    
    [Parameter(Mandatory=$false)]
    [string]$VpsPath = "/tmp"
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

function Write-Error($message) {
    Write-ColorOutput Red "❌ $message"
}

function Write-Warning($message) {
    Write-ColorOutput Yellow "⚠️  $message"
}

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DeployDir = Split-Path -Parent $ScriptDir
$ProjectRoot = Resolve-Path (Join-Path $DeployDir "../..")

Write-ColorOutput Cyan "========================================"
Write-ColorOutput Cyan "  CoffeeHubNepal VPS Upload Script"
Write-ColorOutput Cyan "========================================"
Write-Output ""

# Check if deploy directory exists
if (-not (Test-Path $DeployDir)) {
    Write-Error "Deployment directory not found: $DeployDir"
    Write-Warning "Please run build script first: node deploy/vps-ubuntu/scripts/build.js"
    exit 1
}

# Check if backend and frontend exist
if (-not (Test-Path (Join-Path $DeployDir "backend"))) {
    Write-Error "Backend directory not found. Please run build script first."
    exit 1
}

if (-not (Test-Path (Join-Path $DeployDir "frontend"))) {
    Write-Error "Frontend directory not found. Please run build script first."
    exit 1
}

# Test SSH connection
Write-Step "Testing SSH connection..."
try {
    $sshTest = ssh -o ConnectTimeout=5 -o BatchMode=yes "${VpsUser}@${VpsIp}" "echo 'SSH connection successful'" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "SSH connection test failed. You may need to enter password."
        Write-Warning "Make sure SSH is configured: ssh-copy-id ${VpsUser}@${VpsIp}"
    } else {
        Write-Success "SSH connection successful"
    }
} catch {
    Write-Warning "SSH connection test inconclusive. Proceeding with upload..."
}

# Upload files
Write-Step "Uploading deployment files to ${VpsUser}@${VpsIp}:${VpsPath}..."

try {
    # Use SCP to upload
    $scpCommand = "scp -r `"$DeployDir`" ${VpsUser}@${VpsIp}:${VpsPath}/"
    Write-Output "Running: $scpCommand"
    
    Invoke-Expression $scpCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Files uploaded successfully!"
        Write-Output ""
        Write-ColorOutput Yellow "Next steps on your VPS:"
        Write-Output "1. SSH into VPS: ssh ${VpsUser}@${VpsIp}"
        Write-Output "2. Run setup: sudo bash ${VpsPath}/vps-ubuntu/scripts/setup-server.sh"
        Write-Output "3. Move files: sudo cp -r ${VpsPath}/vps-ubuntu/* /var/www/coffeehubnepal/"
        Write-Output "4. Configure .env: sudo nano /var/www/coffeehubnepal/backend/.env"
        Write-Output "5. Deploy: sudo bash /var/www/coffeehubnepal/scripts/deploy.sh --domain=yourdomain.com"
    } else {
        Write-Error "Upload failed with exit code: $LASTEXITCODE"
        Write-Warning "Make sure:"
        Write-Warning "  - SSH is configured"
        Write-Warning "  - SCP is available"
        Write-Warning "  - VPS path exists and is writable"
        exit 1
    }
} catch {
    Write-Error "Upload failed: $_"
    Write-Warning "Try uploading manually using:"
    Write-Warning "  scp -r deploy/vps-ubuntu ${VpsUser}@${VpsIp}:${VpsPath}/"
    exit 1
}

Write-Output ""
Write-Success "Upload complete!"

