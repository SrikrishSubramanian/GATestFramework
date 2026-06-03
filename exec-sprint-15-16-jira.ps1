#Requires -Version 5.0
# Sprint 15 & 16 Batch Generation

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

$uniqueTickets = $sprint1516Tickets | Sort-Object -Unique
$totalTickets = $uniqueTickets.Count
$startTime = Get-Date

Write-Host ""
Write-Host "SPRINT 15 & 16 JIRA GENERATION"
Write-Host "Total: $totalTickets tickets (deduplicated)"
Write-Host "Starting: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

$successCount = 0
$failureCount = 0

foreach ($ticket in $uniqueTickets) {
    $index = $uniqueTickets.IndexOf($ticket) + 1
    Write-Host "[$index/$totalTickets] $ticket"

    try {
        # Explicitly pass env=dev to Playwright command (DEV ONLY - NOT LOCAL)
        & cmd /c "set env=dev && set JIRA_TICKET=$ticket && npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium" 2>&1 | Out-Null

        $successCount++
        Write-Host "[$index/$totalTickets] OK - $ticket"
    }
    catch {
        $failureCount++
        Write-Host "[$index/$totalTickets] FAIL - $ticket"
    }

    Start-Sleep -Milliseconds 500
}

$duration = (Get-Date) - $startTime

Write-Host ""
Write-Host "SPRINT 15 & 16 COMPLETE"
Write-Host "Success: $successCount | Failed: $failureCount"
Write-Host "Duration: $([math]::Round($duration.TotalMinutes, 1)) minutes"
Write-Host "Completed: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
