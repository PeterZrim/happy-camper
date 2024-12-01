# Run this script as administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Please run this script as Administrator!"
    break
}

# Function to check if command exists
function Test-Command($CommandName) {
    return $null -ne (Get-Command $CommandName -ErrorAction SilentlyContinue)
}

# Check if Node.js is installed
if (-not (Test-Command "node")) {
    Write-Host "Installing Node.js..."
    
    # Download Node.js LTS installer
    $nodeUrl = "https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi"
    $installerPath = "node_installer.msi"

    # Download installer if it doesn't exist
    if (-not (Test-Path $installerPath)) {
        Write-Host "Downloading Node.js installer..."
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath
    }

    # Install Node.js
    Write-Host "Running Node.js installer..."
    Start-Process msiexec.exe -Wait -ArgumentList "/i `"$installerPath`" /quiet /norestart ADDLOCAL=ALL"

    # Clean up
    Remove-Item $installerPath -ErrorAction SilentlyContinue

    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "Node.js is already installed"
}

# Set up Python virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..."
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..."
.\venv\Scripts\Activate

# Install Python dependencies
Write-Host "Installing Python dependencies..."
pip install -r requirements.txt

# Install frontend dependencies
Write-Host "Installing frontend dependencies..."
Set-Location frontend
npm install

# Build frontend
Write-Host "Building frontend..."
npm run build
Set-Location ..

# Collect static files
Write-Host "Collecting static files..."
python manage.py collectstatic --noinput

# Create necessary directories
Write-Host "Creating necessary directories..."
python manage.py makemigrations
python manage.py migrate

Write-Host "Setup completed! You can now run the development server with:"
Write-Host "python manage.py runserver"
