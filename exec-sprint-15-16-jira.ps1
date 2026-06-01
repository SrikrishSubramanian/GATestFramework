#Requires -Version 5.0
# Sprint 15 & 16 Batch Generation (User-Provided Tickets)

# Deduplicated list of Sprint 15 & 16 tickets (removed duplicates)
$sprint1516Tickets = @(
    'GAAM-1098','GAAM-1091','GAAM-1080','GAAM-1068','GAAM-1024','GAAM-993','GAAM-983','GAAM-982','GAAM-969','GAAM-968',
    'GAAM-964','GAAM-940','GAAM-898','GAAM-859','GAAM-839','GAAM-838','GAAM-837','GAAM-836','GAAM-835','GAAM-834',
    'GAAM-833','GAAM-827','GAAM-821','GAAM-819','GAAM-814','GAAM-801','GAAM-800','GAAM-799','GAAM-798','GAAM-797',
    'GAAM-796','GAAM-795','GAAM-794','GAAM-792','GAAM-791','GAAM-790','GAAM-788','GAAM-764','GAAM-763','GAAM-756',
    'GAAM-728','GAAM-684','GAAM-575','GAAM-397','GAAM-394','GAAM-393','GAAM-69','GAAM-48','GAAM-63','GAAM-524',
    'GAAM-820','GAAM-566','GAAM-787','GAAM-678','GAAM-920','GAAM-704','GAAM-706','GAAM-711','GAAM-712','GAAM-727',
    'GAAM-737','GAAM-738','GAAM-739','GAAM-741','GAAM-784','GAAM-806','GAAM-831','GAAM-808','GAAM-811','GAAM-812',
    'GAAM-816','GAAM-817','GAAM-860','GAAM-876','GAAM-749','GAAM-929','GAAM-915','GAAM-917','GAAM-918','GAAM-921',
    'GAAM-922','GAAM-924','GAAM-925','GAAM-927','GAAM-928','GAAM-930','GAAM-959','GAAM-965','GAAM-935'
)

# Remove duplicates and sort
$uniqueTickets = $sprint1516Tickets | Sort-Object -Unique
$totalTickets = $uniqueTickets.Count
$startTime = Get-Date

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗"
Write-Host "║   SPRINT 15 & 16 JIRA GENERATION                       ║"
Write-Host "║   Total: $totalTickets tickets (deduplicated)                   ║"
Write-Host "╚════════════════════════════════════════════════════════╝"
Write-Host ""
Write-Host "Starting: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failureCount = 0
$successTickets = @()
$failedTickets = @()

# Process sequentially for stability
foreach ($ticket in $uniqueTickets) {
    $index = $uniqueTickets.IndexOf($ticket) + 1
    Write-Host "[$index/$totalTickets] Generating $ticket..." -ForegroundColor Cyan

    try {
        $env:env = "dev"
        $env:JIRA_TICKET = $ticket

        # Run Jira generator
        & npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium 2>&1 | Out-Null

        $successCount++
        $successTickets += $ticket
        Write-Host "[$index/$totalTickets] ✓ $ticket" -ForegroundColor Green
    }
    catch {
        $failureCount++
        $failedTickets += $ticket
        Write-Host "[$index/$totalTickets] ✗ $ticket - Error" -ForegroundColor Red
    }

    Start-Sleep -Milliseconds 500
}

$duration = (Get-Date) - $startTime

Write-Host ""
Write-Host "════════════════════════════════════════════════════════"
Write-Host "SPRINT 15 & 16 GENERATION COMPLETE" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════"
Write-Host ""
Write-Host "RESULTS:" -ForegroundColor Yellow
Write-Host "  ✓ Generated: $successCount tests" -ForegroundColor Green
Write-Host "  ✗ Failed: $failureCount tickets" -ForegroundColor Red
Write-Host "  ⏱ Duration: $([math]::Round($duration.TotalMinutes, 1)) minutes" -ForegroundColor Cyan
Write-Host "  Speed: $([math]::Round($totalTickets / $duration.TotalMinutes, 1)) tickets/min" -ForegroundColor Cyan
Write-Host ""

Write-Host "GENERATED FILES:" -ForegroundColor Green
Write-Host "  • Spec files: tests/specFiles/ga/*/*.spec.ts" -ForegroundColor White
Write-Host "  • POMs: tests/pages/ga/components/*Page.ts" -ForegroundColor White
Write-Host "  • Locators: tests/pages/ga/components/*.locators.json" -ForegroundColor White
Write-Host "  • Summaries: tests/specFiles/ga/**/*-test-summary.html" -ForegroundColor White
Write-Host ""

if ($failedTickets.Count -gt 0) {
    Write-Host "FAILED TICKETS (retry needed):" -ForegroundColor Yellow
    $failedTickets | ForEach-Object {
        Write-Host "  • $_" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. Verify count: ls tests/specFiles/ga/*/**.spec.ts | wc -l" -ForegroundColor White
Write-Host "  2. Run tests: env=dev npx playwright test tests/specFiles/ga/ --grep @smoke" -ForegroundColor White
Write-Host "  3. Check reports: start playwright-report/index.html" -ForegroundColor White
Write-Host ""

Write-Host "Sprint 1-14 Progress:" -ForegroundColor Yellow
Write-Host "  Task ID: bg7a0jy0y (running in parallel)" -ForegroundColor Cyan
Write-Host ""

exit 0
