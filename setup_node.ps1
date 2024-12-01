# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator! Right-click PowerShell and select 'Run as Administrator'"
    exit
}

Write-Host "Starting Node.js installation..." -ForegroundColor Green

# Download Node.js installer
$nodeVersion = "v20.11.1"
$nodeUrl = "https://nodejs.org/dist/$nodeVersion/node-$nodeVersion-x64.msi"
$installerPath = "$PWD\node_installer.msi"

Write-Host "Downloading Node.js installer..." -ForegroundColor Yellow
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath

# Install Node.js
Write-Host "Installing Node.js..." -ForegroundColor Yellow
Start-Process msiexec.exe -Wait -ArgumentList "/i `"$installerPath`" /quiet /norestart ADDLOCAL=ALL"

# Clean up installer
Remove-Item $installerPath -Force

# Refresh environment variables
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify installation
Write-Host "Verifying Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
$npmVersion = npm --version

if ($nodeVersion -and $npmVersion) {
    Write-Host "Node.js installation successful!" -ForegroundColor Green
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
    
    # Set up frontend
    Write-Host "Setting up frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    npm run build
    Set-Location ..
    
    Write-Host "Frontend setup completed!" -ForegroundColor Green
} else {
    Write-Host "Node.js installation failed. Please try installing manually from https://nodejs.org/" -ForegroundColor Red
}
