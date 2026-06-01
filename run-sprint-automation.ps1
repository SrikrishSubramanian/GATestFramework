# ============================================================================
# SPRINT-WISE AUTOMATION TEST RUNNER
#
# Features:
# ✅ Run tests for specific sprint (1-16)
# ✅ Run tests for all sprints at once
# ✅ Choose test type: smoke, regression, sanity, all
# ✅ Filter by Jira ticket numbers
# ✅ Generate detailed reports per sprint
# ✅ Both sprint-wise and all-sprint approaches
#
# Usage:
# 1. Right-click this file
# 2. Select "Run with PowerShell"
# 3. Follow the interactive menu
#
# ============================================================================

Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Colors
$Green = [System.ConsoleColor]::Green
$Red = [System.ConsoleColor]::Red
$Yellow = [System.ConsoleColor]::Yellow
$Cyan = [System.ConsoleColor]::Cyan
$Magenta = [System.ConsoleColor]::Magenta

Clear-Host

# Get project root
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommandPath
Set-Location $ProjectRoot

# Load configuration
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Cyan
Write-Host "║      SPRINT-WISE AUTOMATION TEST RUNNER                   ║" -ForegroundColor $Cyan
Write-Host "║            Regression • Smoke • Sanity Testing            ║" -ForegroundColor $Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Cyan
Write-Host ""

# Read sprint configuration
$SprintConfig = Get-Content "sprint-config.json" | ConvertFrom-Json
Write-Host "✅ Configuration loaded from sprint-config.json" -ForegroundColor $Green
Write-Host ""

# ============================================================================
# MENU 1: SELECT SPRINT OR ALL
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Magenta
Write-Host "║ STEP 1: SELECT SPRINT                                     ║" -ForegroundColor $Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Magenta
Write-Host ""
Write-Host "Choose one of the following:" -ForegroundColor $Yellow
Write-Host ""

# Display sprint options
$SprintNumber = 1
foreach ($sprint in $SprintConfig.sprints.PSObject.Properties) {
    $sprintKey = $sprint.Name
    $sprintData = $sprint.Value
    $ticketCount = $sprintData.tickets.Count
    Write-Host "  $SprintNumber. $($sprintData.name) - $ticketCount tickets" -ForegroundColor $Cyan
    $SprintNumber++
}

Write-Host "  17. All Sprints (1-16) - Comprehensive Testing" -ForegroundColor $Magenta
Write-Host ""

$SprintChoice = Read-Host "Enter your choice (1-17)"

# Map choice to sprint
if ($SprintChoice -eq "17") {
    $SelectedSprintKey = "all"
    $SelectedSprint = "All Sprints (1-16)"
    $IsAllSprints = $true
} else {
    $SprintIndex = [int]$SprintChoice - 1
    $SelectedSprintKey = $SprintConfig.sprints.PSObject.Properties[$SprintIndex].Name
    $SelectedSprint = $SprintConfig.sprints.PSObject.Properties[$SprintIndex].Value.name
    $IsAllSprints = $false
}

Write-Host ""
Write-Host "✅ Selected: $SelectedSprint" -ForegroundColor $Green
Write-Host ""

# ============================================================================
# MENU 2: SELECT TEST TYPE
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Magenta
Write-Host "║ STEP 2: SELECT TEST TYPE                                  ║" -ForegroundColor $Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Magenta
Write-Host ""
Write-Host "Choose test type:" -ForegroundColor $Yellow
Write-Host ""

$TestTypeOptions = @("smoke", "regression", "sanity", "all")
$TestNumber = 1
foreach ($testType in $TestTypeOptions) {
    $desc = $SprintConfig.testTypes.$testType.description
    Write-Host "  $TestNumber. $($testType.ToUpper()) - $desc" -ForegroundColor $Cyan
    $TestNumber++
}

Write-Host ""
$TestChoice = Read-Host "Enter your choice (1-4)"
$SelectedTestType = $TestTypeOptions[[int]$TestChoice - 1]
$TestDescription = $SprintConfig.testTypes.$SelectedTestType.description
$TestTag = $SprintConfig.testTypes.$SelectedTestType.tag

Write-Host ""
Write-Host "✅ Selected: $($SelectedTestType.ToUpper()) - $TestDescription" -ForegroundColor $Green
Write-Host ""

# ============================================================================
# MENU 3: SELECT ENVIRONMENT
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Magenta
Write-Host "║ STEP 3: SELECT ENVIRONMENT                                ║" -ForegroundColor $Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Magenta
Write-Host ""
Write-Host "Choose environment:" -ForegroundColor $Yellow
Write-Host ""

$EnvOptions = @("local", "dev", "qa", "uat", "prod")
$EnvNumber = 1
foreach ($env in $EnvOptions) {
    $desc = $SprintConfig.environments.$env
    Write-Host "  $EnvNumber. $($env.ToUpper()) - $desc" -ForegroundColor $Cyan
    $EnvNumber++
}

Write-Host ""
$EnvChoice = Read-Host "Enter your choice (1-5)"
$SelectedEnv = $EnvOptions[[int]$EnvChoice - 1]

Write-Host ""
Write-Host "✅ Selected: $($SelectedEnv.ToUpper())" -ForegroundColor $Green
Write-Host ""

# ============================================================================
# BUILD GREP PATTERN
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Magenta
Write-Host "║ STEP 4: BUILDING TEST COMMAND                             ║" -ForegroundColor $Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Magenta
Write-Host ""

if ($IsAllSprints) {
    # All sprints - get all tickets
    $AllTickets = @()
    foreach ($sprint in $SprintConfig.sprints.PSObject.Properties) {
        $AllTickets += $sprint.Value.tickets
    }
    $GrepPattern = "(" + ($AllTickets -join "|") + ")"
    $TicketCount = $AllTickets.Count
} else {
    # Specific sprint
    $SprintTickets = $SprintConfig.sprints.$SelectedSprintKey.tickets
    $GrepPattern = "(" + ($SprintTickets -join "|") + ")"
    $TicketCount = $SprintTickets.Count
}

Write-Host "📊 Test Configuration:" -ForegroundColor $Cyan
Write-Host "   Sprint(s): $SelectedSprint" -ForegroundColor $Cyan
Write-Host "   Test Type: $($SelectedTestType.ToUpper())" -ForegroundColor $Cyan
Write-Host "   Environment: $($SelectedEnv.ToUpper())" -ForegroundColor $Cyan
Write-Host "   Tickets: $TicketCount" -ForegroundColor $Cyan
Write-Host ""

# Build the test command
$TestCommand = "npx playwright test tests/specFiles/ga/ --grep `"$GrepPattern"
if ($TestTag) {
    $TestCommand += " AND $TestTag"
}
$TestCommand += "`" --project chromium --workers 2"

Write-Host "🔧 Command to run:" -ForegroundColor $Yellow
Write-Host "   $TestCommand" -ForegroundColor $Cyan
Write-Host ""

# ============================================================================
# CONFIRMATION
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Magenta
Write-Host "║ CONFIRMATION                                              ║" -ForegroundColor $Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Magenta
Write-Host ""

Write-Host "Ready to run tests?" -ForegroundColor $Yellow
Write-Host ""
Write-Host "  Sprint: $SelectedSprint" -ForegroundColor $Cyan
Write-Host "  Test Type: $($SelectedTestType.ToUpper())" -ForegroundColor $Cyan
Write-Host "  Environment: $($SelectedEnv.ToUpper())" -ForegroundColor $Cyan
Write-Host "  Tickets: $TicketCount" -ForegroundColor $Cyan
Write-Host "  Duration: Approximately 10-30 minutes" -ForegroundColor $Cyan
Write-Host ""

$Confirm = Read-Host "Continue? (Y/N)"
if ($Confirm -ne "Y" -and $Confirm -ne "y") {
    Write-Host ""
    Write-Host "❌ Cancelled" -ForegroundColor $Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host ""

# ============================================================================
# RUN TESTS
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Green
Write-Host "║ RUNNING TESTS                                             ║" -ForegroundColor $Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Green
Write-Host ""

Write-Host "⏳ Starting test execution..." -ForegroundColor $Yellow
Write-Host "   Sprint: $SelectedSprint" -ForegroundColor $Cyan
Write-Host "   Type: $($SelectedTestType.ToUpper())" -ForegroundColor $Cyan
Write-Host "   Environment: $($SelectedEnv.ToUpper())" -ForegroundColor $Cyan
Write-Host "   Tickets: $TicketCount" -ForegroundColor $Cyan
Write-Host ""
Write-Host "⏳ This will take 10-30 minutes depending on test type..." -ForegroundColor $Yellow
Write-Host ""

$StartTime = Get-Date

# Set environment variable
if ($SelectedEnv -ne "local") {
    $env:env = $SelectedEnv
} else {
    $env:env = "local"
}

# Run tests
Invoke-Expression $TestCommand
$TestExitCode = $LASTEXITCODE

$EndTime = Get-Date
$Duration = $EndTime - $StartTime

# ============================================================================
# RESULTS
# ============================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Green
Write-Host "║ TEST EXECUTION COMPLETE                                   ║" -ForegroundColor $Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Green
Write-Host ""

Write-Host "📊 RESULTS:" -ForegroundColor $Cyan
Write-Host "   Status: $(if ($TestExitCode -eq 0) { '✅ PASSED' } else { '⚠️  FAILED' })" -ForegroundColor $(if ($TestExitCode -eq 0) { $Green } else { $Yellow })
Write-Host "   Duration: $($Duration.TotalMinutes) minutes ($($Duration.TotalSeconds) seconds)" -ForegroundColor $Cyan
Write-Host "   Sprint: $SelectedSprint" -ForegroundColor $Cyan
Write-Host "   Test Type: $($SelectedTestType.ToUpper())" -ForegroundColor $Cyan
Write-Host "   Environment: $($SelectedEnv.ToUpper())" -ForegroundColor $Cyan
Write-Host "   Tickets Tested: $TicketCount" -ForegroundColor $Cyan
Write-Host ""

# Open report
Write-Host "📂 Opening report..." -ForegroundColor $Yellow
$ReportPath = "$ProjectRoot\test-results\hierarchical-report.html"

if (Test-Path $ReportPath) {
    Start-Process $ReportPath
    Write-Host "✅ Report opened in browser" -ForegroundColor $Green
    Write-Host ""
    Write-Host "📍 Report location: $ReportPath" -ForegroundColor $Cyan
} else {
    Write-Host "⚠️  Report not found at: $ReportPath" -ForegroundColor $Yellow
}

Write-Host ""

# ============================================================================
# SUMMARY
# ============================================================================

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor $Green
Write-Host "║ WHAT TO DO NOW                                            ║" -ForegroundColor $Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor $Green
Write-Host ""

Write-Host "1. 📊 Review the report in your browser" -ForegroundColor $Cyan
Write-Host "   - Summary stats (passed/failed)" -ForegroundColor $Cyan
Write-Host "   - Red headers = failures (auto-expanded)" -ForegroundColor $Cyan
Write-Host "   - Click any header to expand/collapse" -ForegroundColor $Cyan
Write-Host ""

Write-Host "2. 📸 Take screenshots if needed" -ForegroundColor $Cyan
Write-Host "   - Summary section" -ForegroundColor $Cyan
Write-Host "   - Failed tests (if any)" -ForegroundColor $Cyan
Write-Host "   - Error details" -ForegroundColor $Cyan
Write-Host ""

Write-Host "3. 🛠️  Fix any failures" -ForegroundColor $Cyan
Write-Host "   - Identify root cause from error message" -ForegroundColor $Cyan
Write-Host "   - Make code changes" -ForegroundColor $Cyan
Write-Host "   - Run this script again to verify" -ForegroundColor $Cyan
Write-Host ""

Write-Host "4. 📈 Track progress" -ForegroundColor $Cyan
Write-Host "   - Save reports for comparison" -ForegroundColor $Cyan
Write-Host "   - Monitor pass rate improvements" -ForegroundColor $Cyan
Write-Host ""

Write-Host "═════════════════════════════════════════════════════════════" -ForegroundColor $Cyan
Write-Host ""

# Save report metadata
$MetadataPath = "test-results\test-run-metadata.txt"
$Metadata = @"
SPRINT-WISE TEST EXECUTION REPORT
==================================

Sprint: $SelectedSprint
Test Type: $SelectedTestType
Environment: $SelectedEnv
Tickets: $TicketCount

Execution Details:
- Start Time: $StartTime
- End Time: $EndTime
- Duration: $($Duration.TotalMinutes) minutes
- Status: $(if ($TestExitCode -eq 0) { 'PASSED' } else { 'FAILED' })

Report: $ReportPath

"@

New-Item -Path "test-results" -ItemType Directory -Force | Out-Null
$Metadata | Out-File -FilePath $MetadataPath -Encoding UTF8 -Force

Write-Host "✅ Test metadata saved to: test-results\test-run-metadata.txt" -ForegroundColor $Green
Write-Host ""

Read-Host "Press Enter to close this window"
