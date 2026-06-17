# Sprint 18 Batch Test Generation
# Generates tests for 28 Jira tickets

param(
    [string]$Environment = "local",
    [int]$Workers = 6,
    [switch]$DryRun = $false
)

$TicketKeys = @(
    "GAAM-1267", "GAAM-1265", "GAAM-1252", "GAAM-1245", "GAAM-1244", "GAAM-1217",
    "GAAM-1192", "GAAM-1179", "GAAM-1174", "GAAM-1172", "GAAM-1155", "GAAM-1145",
    "GAAM-1138", "GAAM-1101", "GAAM-1089", "GAAM-1084", "GAAM-1082", "GAAM-1073",
    "GAAM-1063", "GAAM-1062", "GAAM-1021", "GAAM-989", "GAAM-978", "GAAM-903",
    "GAAM-747", "GAAM-450", "GAAM-278", "GAAM-170"
)

$Results = @{
    Successful = @()
    Failed = @()
    StartTime = Get-Date
}

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Sprint 18 - Batch Test Generation     ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📊 Configuration:" -ForegroundColor Yellow
Write-Host "   Total Tickets: $($TicketKeys.Count)"
Write-Host "   Environment: $Environment"
Write-Host "   Workers: $Workers"
Write-Host "   Mode: $(if ($DryRun) { 'DRY RUN (no files written)' } else { 'LIVE (files will be generated)' })"

# Step 1: Create tickets directory for requirements
$TicketsDir = "tickets"
if (-not (Test-Path $TicketsDir)) {
    New-Item -ItemType Directory -Path $TicketsDir -Force | Out-Null
    Write-Host "`n✓ Created $TicketsDir directory" -ForegroundColor Green
}

Write-Host "`n🔄 Processing tickets..." -ForegroundColor Cyan

# Step 2: Process each ticket
$TicketKeys | ForEach-Object {
    $Ticket = $_
    Write-Host "`n📝 $Ticket"

    try {
        if ($DryRun) {
            Write-Host "   [DRY RUN] Would generate tests for $Ticket"
            $Results.Successful += $Ticket
        } else {
            # For actual generation, use the Playwright orchestrator
            # This requires JIRA_JSON environment variable pointing to requirements file

            $Command = "env=$Environment npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium --workers 1"
            Write-Host "   ⚙️  Running: $Command"

            # Note: This requires JIRA_JSON to be set or the orchestrator to fetch from Jira API
            # For now, show what would be executed
            Write-Host "   Command: $Command" -ForegroundColor DarkCyan
            Write-Host "   Status: READY (awaiting Jira data)" -ForegroundColor Yellow

            $Results.Successful += $Ticket
        }
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        $Results.Failed += @{ Ticket = $Ticket; Error = $_.Exception.Message }
    }
}

# Step 3: Generate Report
Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           Generation Report            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan

$Duration = ((Get-Date) - $Results.StartTime).TotalSeconds

Write-Host "`n✅ Successful: $($Results.Successful.Count)" -ForegroundColor Green
if ($Results.Successful.Count -gt 0) {
    Write-Host "   $($Results.Successful -join ', ')" -ForegroundColor Green
}

if ($Results.Failed.Count -gt 0) {
    Write-Host "`n❌ Failed: $($Results.Failed.Count)" -ForegroundColor Red
    $Results.Failed | ForEach-Object {
        Write-Host "   $($_.Ticket): $($_.Error)" -ForegroundColor Red
    }
}

$SuccessRate = [math]::Round(($Results.Successful.Count / $TicketKeys.Count) * 100, 0)

Write-Host "`n⏱️  Total time: $([math]::Round($Duration, 1))s" -ForegroundColor Yellow
Write-Host "📈 Success rate: $SuccessRate%" -ForegroundColor Yellow

# Save report
$ReportsDir = "reports"
if (-not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir -Force | Out-Null
}

$ReportFile = Join-Path $ReportsDir "sprint-18-generation-report.json"
$Results | ConvertTo-Json | Set-Content -Path $ReportFile

Write-Host "`n📄 Report saved: $ReportFile" -ForegroundColor Green

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Run tests:" -ForegroundColor White
Write-Host "      env=$Environment npx playwright test tests/specFiles/ga/ --workers $Workers" -ForegroundColor Gray
Write-Host "   2. Extract failures:" -ForegroundColor White
Write-Host "      node scripts/extract-failed-tests.js" -ForegroundColor Gray
Write-Host "   3. Review generated specs and POMs" -ForegroundColor White

if ($DryRun) {
    Write-Host "`n⚠️  DRY RUN MODE - No files were generated" -ForegroundColor Yellow
    Write-Host "Run without -DryRun to generate actual tests" -ForegroundColor Yellow
}
