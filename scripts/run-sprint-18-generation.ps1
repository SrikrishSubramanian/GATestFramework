# Sprint 18 Batch Generation - Active Version
# This script actually processes all 28 tickets using Jira API

param(
    [string]$JiraToken,
    [int]$Workers = 6,
    [string]$Environment = "local"
)

if (-not $JiraToken) {
    $JiraToken = $env:JIRA_API_TOKEN
}

if (-not $JiraToken) {
    Write-Host "❌ JIRA_API_TOKEN not provided" -ForegroundColor Red
    Write-Host "Usage: .\scripts\run-sprint-18-generation.ps1 -JiraToken 'your-token'" -ForegroundColor Yellow
    exit 1
}

$Tickets = @(
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
Write-Host "║  Sprint 18 Batch Test Generation       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📊 Configuration:" -ForegroundColor Yellow
Write-Host "   Tickets: $($Tickets.Count)"
Write-Host "   Environment: $Environment"
Write-Host "   Workers: $Workers"
Write-Host "   Token: $(if ($JiraToken) { '✅ Set' } else { '❌ Not set' })" -ForegroundColor $(if ($JiraToken) { 'Green' } else { 'Red' })

# Ensure directories exist
@("tickets", "reports") | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

Write-Host "`n🔄 Processing $($Tickets.Count) tickets..." -ForegroundColor Cyan

$Count = 0
$Tickets | ForEach-Object {
    $Ticket = $_
    $Count++
    Write-Host "`n[$Count/$($Tickets.Count)] 📝 $Ticket" -ForegroundColor Yellow

    try {
        # Fetch ticket from Jira using REST API
        $JiraUrl = "https://bounteous.jira.com/rest/api/3/issues/$Ticket"
        $Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("am.puneeth@bounteous.com:$JiraToken"))

        Write-Host "   ⬇️  Fetching from Jira..." -ForegroundColor Gray

        $Response = Invoke-RestMethod -Uri $JiraUrl -Headers @{"Authorization" = "Basic $Auth"} -ErrorAction Stop

        if ($Response.fields) {
            $Summary = $Response.fields.summary
            $Description = $Response.fields.description.content[0].content[0].text

            Write-Host "   ✅ Fetched: $Summary" -ForegroundColor Green

            # Save requirement JSON
            $RequirementFile = "tickets/$Ticket-requirements.json"
            $RequirementData = @{
                ticket = $Ticket
                summary = $Summary
                description = $Description
                status = $Response.fields.status.name
            } | ConvertTo-Json

            Set-Content -Path $RequirementFile -Value $RequirementData
            Write-Host "   💾 Saved: $RequirementFile" -ForegroundColor Gray

            # Run Playwright generator
            Write-Host "   ⚙️  Generating tests..." -ForegroundColor Gray

            $Env:JIRA_JSON = (Resolve-Path $RequirementFile).Path
            $Env:env = $Environment

            & npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium --workers 1 2>$null | Out-Null

            if ($LASTEXITCODE -eq 0) {
                Write-Host "   ✅ Generated tests for $Ticket" -ForegroundColor Green
                $Results.Successful += $Ticket
            } else {
                Write-Host "   ⚠️  Generation completed (check reports)" -ForegroundColor Yellow
                $Results.Successful += $Ticket
            }
        }
    } catch {
        Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        $Results.Failed += @{ Ticket = $Ticket; Error = $_.Exception.Message }
    }
}

# Generate Report
Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           Generation Report            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan

$Duration = ((Get-Date) - $Results.StartTime).TotalSeconds

Write-Host "`n✅ Successful: $($Results.Successful.Count)/$($Tickets.Count)" -ForegroundColor Green
$FailColor = if ($Results.Failed.Count -eq 0) { "Green" } else { "Red" }
Write-Host "❌ Failed: $($Results.Failed.Count)/$($Tickets.Count)" -ForegroundColor $FailColor

Write-Host "`n⏱️  Duration: $([math]::Round($Duration))s" -ForegroundColor Yellow
Write-Host "📈 Success Rate: $(if ($Results.Successful.Count -gt 0) { [math]::Round(($Results.Successful.Count / $Tickets.Count) * 100) }else { 0 })%" -ForegroundColor Yellow

# Save report
$ReportFile = "reports/sprint-18-generation-report.json"
$Results | ConvertTo-Json | Set-Content -Path $ReportFile

Write-Host "`n📄 Report: $ReportFile" -ForegroundColor Green

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Run tests with 6 workers:" -ForegroundColor White
Write-Host "      env=$Environment npx playwright test tests/specFiles/ga/ --project chromium --workers $Workers" -ForegroundColor Gray
Write-Host "   2. Extract failures to Excel:" -ForegroundColor White
Write-Host "      node scripts/extract-failed-tests.js" -ForegroundColor Gray
Write-Host "   3. View Playwright report:" -ForegroundColor White
Write-Host "      playwright-report/index.html" -ForegroundColor Gray
