# Git Push Script for Second Commit
# Run this script after Git is installed

Write-Host "Checking Git installation..." -ForegroundColor Yellow

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nChecking repository status..." -ForegroundColor Yellow

# Check if .git exists
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check remote
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/HussainNaqash/art-to-online-spark.git
} else {
    Write-Host "Remote already exists: $remoteExists" -ForegroundColor Green
    # Update remote URL in case it changed
    git remote set-url origin https://github.com/HussainNaqash/art-to-online-spark.git
}

Write-Host "`nStaging all changes..." -ForegroundColor Yellow
git add .

Write-Host "`nCreating second commit..." -ForegroundColor Yellow
git commit -m "Add complete profile form system with all sections

- Added Personal Information form with passport photo upload
- Added Address Information with permanent/current address and domicile/PRC-D fields
- Added Educational Information with dynamic entries (higher/middle) and attachments
- Added Certifications/Diploma section with dynamic entries
- Added Experience Information section with dynamic entries
- Created Profile view page to display all form data
- Integrated localStorage for data persistence
- Updated navigation flow between all form sections
- Added file upload functionality with previews for all attachments"

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`nPush failed. You may need to:" -ForegroundColor Red
    Write-Host "1. Pull first: git pull origin main --allow-unrelated-histories" -ForegroundColor Yellow
    Write-Host "2. Resolve any conflicts" -ForegroundColor Yellow
    Write-Host "3. Push again: git push -u origin main" -ForegroundColor Yellow
}

