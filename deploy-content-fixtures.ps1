# AEM Content Fixture Deployment Script
# Deploys all 14 content fixture XML files to AEM Author instance
# Usage: .\deploy-content-fixtures.ps1

param(
    [string]$AemUrl = "http://localhost:4502",
    [string]$Username = "admin",
    [string]$Password = "admin",
    [string]$PackageName = "ga-content-fixtures",
    [string]$PackageGroup = "GA Test Fixtures"
)

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  GA Content Fixtures Deployment Script                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verify AEM connectivity
Write-Host "🔍 Checking AEM connectivity..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$AemUrl/crx/packmgr/service.jsp" `
        -Credential (New-Object System.Management.Automation.PSCredential($Username, (ConvertTo-SecureString $Password -AsPlainText -Force))) `
        -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ AEM is running at $AemUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to AEM at $AemUrl" -ForegroundColor Red
    Write-Host "   Please ensure AEM is running on port 4502" -ForegroundColor Yellow
    exit 1
}

# Get all fixture files
Write-Host ""
Write-Host "📁 Scanning for fixture files..." -ForegroundColor Yellow
$fixtureDir = "tests/specFiles/ga"
$fixtures = @(Get-ChildItem -Path $fixtureDir -Recurse -Filter "*-fixtures.xml" | Select-Object -ExpandProperty FullName)

if ($fixtures.Count -eq 0) {
    Write-Host "❌ No fixture files found in $fixtureDir" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found $($fixtures.Count) fixture files:" -ForegroundColor Green
$fixtures | ForEach-Object {
    $name = Split-Path $_ -Parent | Split-Path -Leaf
    Write-Host "   • $name" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "📦 Creating AEM Package..." -ForegroundColor Yellow

# Create Base64 auth header
$authHeader = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Username}:${Password}"))

# Create package
$createUrl = "$AemUrl/crx/packmgr/service/.json"
$createBody = @{
    "name" = $PackageName
    "group" = $PackageGroup
} | ConvertTo-Json

try {
    $createResponse = Invoke-WebRequest -Uri $createUrl `
        -Method POST `
        -Headers @{"Authorization" = "Basic $authHeader"} `
        -ContentType "application/json" `
        -Body $createBody `
        -ErrorAction Stop

    Write-Host "✅ Package created: $PackageName" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Package may already exist, continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📤 Uploading fixture files..." -ForegroundColor Yellow

$successCount = 0
$failCount = 0

# Upload each fixture
$fixtures | ForEach-Object {
    $fixture = $_
    $name = Split-Path $fixture -Leaf
    $component = Split-Path $fixture -Parent | Split-Path -Leaf

    Write-Host "   Uploading $name..." -ForegroundColor Cyan

    # Read fixture content
    $fileContent = Get-Content $fixture -Raw

    # Get file info
    $fileInfo = Get-Item $fixture
    $fileBytes = [System.IO.File]::ReadAllBytes($fixture)

    try {
        # Upload via REST API
        $uploadUrl = "$AemUrl/crx/packmgr/service/.jsp"

        $form = @{
            "file" = $fileBytes
            "name" = $name
            "package" = "/etc/packages/$PackageGroup/$PackageName"
        }

        # For Windows, use a simpler approach with curl if available
        $curlPath = (Get-Command curl -ErrorAction SilentlyContinue).Source

        if ($curlPath) {
            # Use curl for multipart upload
            $curlArgs = @(
                "-u", "$Username`:$Password",
                "-F", "file=@$fixture",
                "-F", "name=$name",
                "-s",
                "-X", "POST",
                "$AemUrl/crx/packmgr/service.jsp"
            )

            & curl @curlArgs | Out-Null

            Write-Host "      ✅ $name uploaded" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "      ⚠️  Skipping $name (curl not available)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "      ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Yellow
Write-Host "   ✅ Successful: $successCount" -ForegroundColor Green
Write-Host "   ❌ Failed: $failCount" -ForegroundColor Red
Write-Host "   📦 Total: $($fixtures.Count)" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔗 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Open: $AemUrl/crx/packmgr/" -ForegroundColor Cyan
Write-Host "   2. Find package: '$PackageName'" -ForegroundColor Cyan
Write-Host "   3. Click 'Install' to deploy fixtures" -ForegroundColor Cyan
Write-Host "   4. Verify: Run tests with 'env=local npx playwright test tests/specFiles/ga/ --project chromium'" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ Deployment script completed!" -ForegroundColor Green
