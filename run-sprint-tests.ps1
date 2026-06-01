#Requires -Version 5.0
<#
.SYNOPSIS
Sprint-wise Playwright test automation for GA Testing Framework
Allows running individual sprints or all sprints

.DESCRIPTION
This script allows you to:
- Run a single sprint's tests (Sprint 1-16)
- Run all sprints at once
- Choose test type (smoke, regression, a11y, quality, performance, all)
- View test results and reports

.EXAMPLE
.\run-sprint-tests.ps1 -Sprint 16 -TestType smoke -Environment dev
.\run-sprint-tests.ps1 -Sprint all -TestType regression -Environment dev
.\run-sprint-tests.ps1 -Sprint 1,2,3 -TestType all -Environment dev
#>

param(
    [Parameter(ValueFromPipeline = $true)]
    [string]$Sprint = "",

    [Parameter(ValueFromPipeline = $true)]
    [ValidateSet("smoke", "regression", "a11y", "quality", "batch", "performance", "all")]
    [string]$TestType = "all",

    [Parameter(ValueFromPipeline = $true)]
    [ValidateSet("local", "dev", "qa", "uat", "prod")]
    [string]$Environment = "dev",

    [switch]$OpenReport,
    [switch]$Headed,
    [int]$Workers = 2
)

# Color codes for output
$Colors = @{
    Success = "Green"
    Error   = "Red"
    Warning = "Yellow"
    Info    = "Cyan"
    Header  = "Magenta"
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Get-SprintTickets {
    param([string]$SprintNumber)

    $config = Get-Content "sprint-config.json" | ConvertFrom-Json

    if ($SprintNumber -eq "all") {
        $allTickets = @()
        foreach ($sprint in $config.sprints.PSObject.Properties) {
            $allTickets += $sprint.Value.tickets
        }
        return $allTickets
    }

    $sprintKey = "sprint-$SprintNumber"
    if ($config.sprints.PSObject.Properties.Name -contains $sprintKey) {
        return $config.sprints.$sprintKey.tickets
    }

    return $null
}

function Get-TestGrep {
    param([string]$TestType)

    switch ($TestType) {
        "smoke"       { return "@smoke" }
        "regression"  { return "@regression" }
        "a11y"        { return "@a11y" }
        "quality"     { return "@quality" }
        "batch"       { return "@batch" }
        "performance" { return "@performance" }
        "all"         { return "" }
        default       { return "" }
    }
}

function Show-Menu {
    Write-ColorOutput "`n╔════════════════════════════════════════════════╗" $Colors.Header
    Write-ColorOutput "║   SPRINT-WISE PLAYWRIGHT TEST AUTOMATION      ║" $Colors.Header
    Write-ColorOutput "╚════════════════════════════════════════════════╝" $Colors.Header

    Write-Host ""
    Write-ColorOutput "Select Sprint:" $Colors.Header
    Write-Host "  1) Sprint 1      (2 tickets)"
    Write-Host "  2) Sprint 2      (3 tickets)"
    Write-Host "  ...  "
    Write-Host "  16) Sprint 16    (50 tickets) - CURRENT"
    Write-Host "  A) All Sprints   (Run all at once)"
    Write-Host "  M) Multiple      (e.g., 1,2,3)"
    Write-Host "  Q) Quit"
    Write-Host ""

    $sprintChoice = Read-Host "Enter choice (1-16, A, M, or Q)"

    if ($sprintChoice -eq "Q") { exit }
    if ($sprintChoice -eq "A") { return "all" }
    if ($sprintChoice -eq "M") {
        $multiple = Read-Host "Enter sprint numbers (comma-separated, e.g. 1,2,3)"
        return $multiple
    }

    if ([int]::TryParse($sprintChoice, [ref]$null) -and [int]$sprintChoice -ge 1 -and [int]$sprintChoice -le 16) {
        return $sprintChoice
    }

    Write-ColorOutput "Invalid choice. Exiting." $Colors.Error
    exit
}

function Show-TestTypeMenu {
    Write-ColorOutput "`nSelect Test Type:" $Colors.Header
    Write-Host "  1) Smoke       (5-10 min)   - Quick validation"
    Write-Host "  2) Regression  (20-30 min)  - Comprehensive tests"
    Write-Host "  3) A11y        (10-15 min)  - Accessibility tests"
    Write-Host "  4) Quality     (10 min)     - Code quality checks"
    Write-Host "  5) Batch       (15 min)     - All tickets at once"
    Write-Host "  6) Performance (5 min)      - Performance tests"
    Write-Host "  7) All         (60-70 min)  - All test types"
    Write-Host ""

    $choice = Read-Host "Enter choice (1-7)"

    switch ($choice) {
        "1" { return "smoke" }
        "2" { return "regression" }
        "3" { return "a11y" }
        "4" { return "quality" }
        "5" { return "batch" }
        "6" { return "performance" }
        "7" { return "all" }
        default { return "all" }
    }
}

function Show-EnvironmentMenu {
    Write-ColorOutput "`nSelect Environment:" $Colors.Header
    Write-Host "  1) Local  (localhost:4502)"
    Write-Host "  2) DEV    (Adobe AEM Cloud) - RECOMMENDED"
    Write-Host "  3) QA"
    Write-Host "  4) UAT"
    Write-Host "  5) PROD"
    Write-Host ""

    $choice = Read-Host "Enter choice (1-5)"

    switch ($choice) {
        "1" { return "local" }
        "2" { return "dev" }
        "3" { return "qa" }
        "4" { return "uat" }
        "5" { return "prod" }
        default { return "dev" }
    }
}

# ============================================================================
# INTERACTIVE MODE (if no parameters provided)
# ============================================================================

if (-not $Sprint) {
    $Sprint = Show-Menu
}

if (-not $TestType -or $TestType -eq "all") {
    $TestType = Show-TestTypeMenu
}

if (-not $Environment -or $Environment -eq "dev") {
    $Environment = Show-EnvironmentMenu
}

# ============================================================================
# VALIDATE AND PREPARE
# ============================================================================

Write-ColorOutput "`n╔════════════════════════════════════════════════╗" $Colors.Header
Write-ColorOutput "║          TEST EXECUTION CONFIGURATION          ║" $Colors.Header
Write-ColorOutput "╚════════════════════════════════════════════════╝" $Colors.Header

Write-Host ""
Write-ColorOutput "Sprint:       $Sprint" $Colors.Info
Write-ColorOutput "Test Type:    $TestType" $Colors.Info
Write-ColorOutput "Environment:  $Environment" $Colors.Info
Write-ColorOutput "Workers:      $Workers" $Colors.Info
Write-ColorOutput "Headed Mode:  $(if ($Headed) {'Yes'} else {'No'})" $Colors.Info

# Get tickets for the selected sprint(s)
$sprintNumbers = @()
if ($Sprint -eq "all") {
    $sprintNumbers = 1..16
} elseif ($Sprint -contains ",") {
    $sprintNumbers = $Sprint.Split(",") | ForEach-Object { $_.Trim() }
} else {
    $sprintNumbers = @($Sprint)
}

$allTickets = @()
foreach ($num in $sprintNumbers) {
    $tickets = Get-SprintTickets -SprintNumber $num
    if ($tickets) {
        $allTickets += $tickets
        Write-ColorOutput "  Sprint $num: $($tickets.Count) tickets" $Colors.Success
    }
}

Write-ColorOutput "`nTotal tickets to test: $($allTickets.Count)" $Colors.Success

$confirm = Read-Host "`nProceed with testing? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-ColorOutput "Cancelled." $Colors.Warning
    exit
}

# ============================================================================
# BUILD PLAYWRIGHT COMMAND
# ============================================================================

$env:env = $Environment

$testFile = "tests/specFiles/ga/sprint-16-comprehensive.spec.ts"

# Build ticket grep pattern
$ticketPattern = "(" + ($allTickets -join "|") + ")"

# Build grep filter
$grepFilter = ""
if ($TestType -ne "all") {
    $grepFilter = Get-TestGrep -TestType $TestType
}

# Build command
$command = "npx playwright test $testFile"
if ($grepFilter) {
    $command += " --grep ""$grepFilter"""
}
$command += " --grep ""$ticketPattern"""
$command += " --project chromium"
$command += " --workers $Workers"

if ($Headed) {
    $command += " --headed"
}

Write-Host ""
Write-ColorOutput "═══════════════════════════════════════════════" $Colors.Header
Write-ColorOutput "EXECUTING TESTS" $Colors.Header
Write-ColorOutput "═══════════════════════════════════════════════" $Colors.Header
Write-Host ""
Write-ColorOutput "Command: $command" $Colors.Info
Write-Host ""

# ============================================================================
# RUN TESTS
# ============================================================================

$startTime = Get-Date
Write-ColorOutput "Test started at: $startTime" $Colors.Info

Invoke-Expression $command
$testExitCode = $LASTEXITCODE

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-ColorOutput "═══════════════════════════════════════════════" $Colors.Header
Write-ColorOutput "TEST EXECUTION COMPLETED" $Colors.Header
Write-ColorOutput "═══════════════════════════════════════════════" $Colors.Header
Write-Host ""
Write-ColorOutput "Test Duration: $($duration.TotalMinutes.ToString('F1')) minutes" $Colors.Info
Write-ColorOutput "Exit Code: $testExitCode" $(if ($testExitCode -eq 0) { $Colors.Success } else { $Colors.Error })

# ============================================================================
# VIEW REPORTS
# ============================================================================

Write-Host ""
$viewReport = Read-Host "View test reports? (Y/N)"

if ($viewReport -eq "Y" -or $viewReport -eq "y") {
    Write-Host ""
    Write-ColorOutput "Opening reports..." $Colors.Info

    if (Test-Path "playwright-report/index.html") {
        Write-ColorOutput "✓ Playwright Report" $Colors.Success
        Start-Process "playwright-report/index.html"
    }

    if (Test-Path "test-results/code-quality-report.html") {
        Write-ColorOutput "✓ Quality Report" $Colors.Success
        Start-Process "test-results/code-quality-report.html"
    }

    if (Test-Path "test-results/sprint-summary-report.html") {
        Write-ColorOutput "✓ Sprint Summary" $Colors.Success
        Start-Process "test-results/sprint-summary-report.html"
    }
}

Write-Host ""
Write-ColorOutput "Done!" $Colors.Success
exit $testExitCode
