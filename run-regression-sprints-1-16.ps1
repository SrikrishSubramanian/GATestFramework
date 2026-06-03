#Requires -Version 5.0
# Regression Tests - Sprints 1-16 (All Components)

Write-Host ""
Write-Host "REGRESSION TESTS - SPRINTS 1-16"
Write-Host "All components + acceptance criteria"
Write-Host ""

Write-Host "TEST SCOPE:" -ForegroundColor Yellow
Write-Host "  - Sprints: 1-16 (All 546+ tickets)" -ForegroundColor White
Write-Host "  - Tests: All @regression tagged tests" -ForegroundColor White
Write-Host "  - Environment: DEV server only" -ForegroundColor White
Write-Host "  - Components: 150+ GA components" -ForegroundColor White
Write-Host "  - Expected time: 90-120 minutes" -ForegroundColor White
Write-Host ""

Write-Host "REGRESSION TEST CATEGORIES:" -ForegroundColor Yellow
Write-Host "  - CSS/BEM convention compliance" -ForegroundColor White
Write-Host "  - Semantic HTML validation" -ForegroundColor White
Write-Host "  - Responsive design (mobile/tablet/desktop)" -ForegroundColor White
Write-Host "  - Component registration" -ForegroundColor White
Write-Host "  - Dialog structure" -ForegroundColor White
Write-Host "  - State transitions" -ForegroundColor White
Write-Host "  - Accessibility (WCAG 2.2)" -ForegroundColor White
Write-Host ""

$startTime = Get-Date

Write-Host "Starting regression tests..." -ForegroundColor Green
Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host ""

try {
    # Run regression tests for Sprints 1-16
    & cmd /c "set env=dev && npx playwright test tests/specFiles/ga/ --grep @regression --project chromium --project webkit --reporter html --reporter list"

    $duration = (Get-Date) - $startTime

    Write-Host ""
    Write-Host "REGRESSION TEST RUN COMPLETE" -ForegroundColor Green
    Write-Host ""
    Write-Host "Duration: $([math]::Round($duration.TotalMinutes, 1)) minutes" -ForegroundColor Cyan
    Write-Host "Completed: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "REPORTS:" -ForegroundColor Green
    Write-Host "  - HTML Report: playwright-report/index.html" -ForegroundColor White
    Write-Host "  - Console Output: Check above" -ForegroundColor White
    Write-Host "  - Video Recordings: test-results/videos/" -ForegroundColor White
    Write-Host "  - Screenshots: test-results/screenshots/" -ForegroundColor White
    Write-Host ""

    Write-Host "NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "  1. Review failures: playwright-report/index.html" -ForegroundColor White
    Write-Host "  2. Check videos for any UI issues" -ForegroundColor White
    Write-Host "  3. Fix locators if needed" -ForegroundColor White
    Write-Host "  4. Commit passing tests" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host "Error running regression tests: $_" -ForegroundColor Red
    exit 1
}

exit 0
