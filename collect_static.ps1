# Create necessary directories
Write-Host "Creating static directories..."
New-Item -ItemType Directory -Force -Path "static"
New-Item -ItemType Directory -Force -Path "staticfiles"
New-Item -ItemType Directory -Force -Path "media"

# Build frontend
Write-Host "Building frontend..."
Set-Location frontend
npm run build
Set-Location ..

# Copy frontend build to static directory
Write-Host "Copying frontend build files..."
Copy-Item -Path "frontend/dist/*" -Destination "static/" -Recurse -Force

# Collect static files
Write-Host "Collecting static files..."
python manage.py collectstatic --noinput

Write-Host "Static files setup complete!"
