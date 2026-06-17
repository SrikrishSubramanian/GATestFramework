# Sprint 18 Batch Test Generation
# Generates tests for all 28 Jira tickets

param(
    [string]$JiraToken,
    [int]$Workers = 6,
    [string]$Environment = "local"
)

if (-not $JiraToken) {
    $JiraToken = $env:JIRA_API_TOKEN
}

if (-not $JiraToken) {
    Write-Host "ERROR: JIRA_API_TOKEN not provided" -ForegroundColor Red
    exit 1
}

$Tickets = @(
    "GAAM-1267", "GAAM-1265", "GAAM-1252", "GAAM-1245", "GAAM-1244", "GAAM-1217",
    "GAAM-1192", "GAAM-1179", "GAAM-1174", "GAAM-1172", "GAAM-1155", "GAAM-1145",
    "GAAM-1138", "GAAM-1101", "GAAM-1089", "GAAM-1084", "GAAM-1082", "GAAM-1073",
    "GAAM-1063", "GAAM-1062", "GAAM-1021", "GAAM-989", "GAAM-978", "GAAM-903",
    "GAAM-747", "GAAM-450", "GAAM-278", "GAAM-170"
)

$Successful = @()
$Failed = @()
$StartTime = Get-Date

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Sprint 18 - Test Generation" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Tickets: $($Tickets.Count)" -ForegroundColor Yellow
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "Workers: $Workers" -ForegroundColor Yellow
Write-Host ""

# Create directories
@("tickets", "reports") | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

Write-Host "Processing $($Tickets.Count) tickets..." -ForegroundColor Cyan
Write-Host ""

$Counter = 0
$Tickets | ForEach-Object {
    $Ticket = $_
    $Counter++
    Write-Host "[$Counter/$($Tickets.Count)] Processing $Ticket"

    try {
        # Fetch from Jira
        $JiraUrl = "https://bounteous.jira.com/rest/api/3/issues/$Ticket"
        $Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("am.puneeth@bounteous.com:$JiraToken"))

        Write-Host "   - Fetching from Jira..." -ForegroundColor Gray

        $Response = Invoke-RestMethod -Uri $JiraUrl -Headers @{"Authorization" = "Basic $Auth"} -ErrorAction Stop

        if ($Response.fields) {
            $Summary = $Response.fields.summary
            Write-Host "   - Summary: $Summary" -ForegroundColor Gray

            # Save requirement JSON
            $RequirementFile = "tickets/$Ticket-requirements.json"
            $RequirementData = @{
                ticket = $Ticket
                summary = $Summary
                description = if ($Response.fields.description.content[0].content[0]) { $Response.fields.description.content[0].content[0].text } else { "" }
                status = $Response.fields.status.name
            } | ConvertTo-Json

            Set-Content -Path $RequirementFile -Value $RequirementData

            Write-Host "   - Generating tests..." -ForegroundColor Gray

            # Run generator
            $env:JIRA_JSON = (Resolve-Path $RequirementFile).Path
            $env:env = $Environment

            $Output = & npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium --workers 1 2>&1

            Write-Host "   - DONE" -ForegroundColor Green
            $Successful += $Ticket
        }
    } catch {
        Write-Host "   - ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $Failed += @{ Ticket = $Ticket; Error = $_.Exception.Message }
    }

    Write-Host ""
}

# Report
$Duration = ((Get-Date) - $StartTime).TotalSeconds
$SuccessRate = if ($Tickets.Count -gt 0) { [math]::Round(($Successful.Count / $Tickets.Count) * 100) } else { 0 }

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Generation Report" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Successful: $($Successful.Count) / $($Tickets.Count)" -ForegroundColor Green
Write-Host "Failed: $($Failed.Count) / $($Tickets.Count)" -ForegroundColor $(if ($Failed.Count -eq 0) { "Green" } else { "Red" })
Write-Host "Duration: $([math]::Round($Duration))s" -ForegroundColor Yellow
Write-Host "Success Rate: $SuccessRate%" -ForegroundColor Yellow
Write-Host ""

# Save report
$ReportData = @{
    StartTime = $StartTime
    Duration = $Duration
    Successful = $Successful
    Failed = $Failed
    SuccessRate = $SuccessRate
    TotalTickets = $Tickets.Count
}

$ReportData | ConvertTo-Json | Set-Content -Path "reports/sprint-18-generation-report.json"

Write-Host "Report saved: reports/sprint-18-generation-report.json" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run tests: env=$Environment npx playwright test tests/specFiles/ga/ --workers $Workers" -ForegroundColor Gray
Write-Host "2. Extract failures: node scripts/extract-failed-tests.js" -ForegroundColor Gray
Write-Host ""
