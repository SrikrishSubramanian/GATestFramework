# Batch Generate Tests for All Components and Run Tests
# Usage: .\scripts\batch-generate-and-test.ps1

param(
    [string]$Env = "local",
    [switch]$DryRun = $false,
    [string]$A11yLevel = "wcag22"
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

# Define all test components
$components = @(
    "button",
    "feature-banner",
    "statistic",
    "form-options",
    "content-trail",
    "headline-block",
    "grid-container",
    "navigation",
    "nested-content-carousel",
    "image-with-nested-content",
    "tabs",
    "promo-banner",
    "image",
    "breadcrumb",
    "text",
    "section",
    "accordion",
    "form-container",
    "form-hidden",
    "form-recaptcha",
    "header",
    "role-selector",
    "ratings-card",
    "spacer",
    "separator",
    "video-external",
    "topnav",
    "homepage-hero",
    "brand-relationship",
    "disclaimers",
    "workbench"
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  BATCH TEST GENERATION & EXECUTION" -ForegroundColor Cyan
Write-Host "  Components: $($components.Count)" -ForegroundColor Cyan
Write-Host "  Environment: $Env" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date
$generatedCount = 0
$failedCount = 0
$failedComponents = @()

# Phase 1: Generate tests for each component
Write-Host "PHASE 1: GENERATING TESTS" -ForegroundColor Green
Write-Host "------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

foreach ($component in $components) {
    Write-Host "  Generating: $component" -ForegroundColor Yellow

    $env:COMPONENTS = $component
    $env:A11Y_LEVEL = $A11yLevel
    $env:env = $Env

    try {
        if ($DryRun) {
            Write-Host "    [DRY RUN] Would generate tests for $component" -ForegroundColor Gray
        } else {
            $output = & npx playwright test generate-components `
                --config playwright.generators.config.ts `
                --project chromium `
                --workers 1 2>&1

            if ($LASTEXITCODE -eq 0) {
                Write-Host "    OK - Generated" -ForegroundColor Green
                $generatedCount++
            } else {
                Write-Host "    FAIL - Failed to generate" -ForegroundColor Red
                $failedComponents += $component
                $failedCount++
            }
        }
    } catch {
        Write-Host "    ERROR: $_" -ForegroundColor Red
        $failedComponents += $component
        $failedCount++
    }
}

Write-Host ""
Write-Host "  Summary: $generatedCount generated, $failedCount failed" -ForegroundColor Yellow
if ($failedComponents.Count -gt 0) {
    Write-Host "  Failed: $($failedComponents -join ', ')" -ForegroundColor Red
}
Write-Host ""

if ($DryRun) {
    Write-Host "OK - DRY RUN COMPLETE" -ForegroundColor Green
    exit 0
}

# Phase 2: Run generated tests
Write-Host "PHASE 2: RUNNING TESTS" -ForegroundColor Green
Write-Host "------------------------------------------------------------" -ForegroundColor Gray
Write-Host ""

$env:env = $Env

Write-Host "  Running all GA component tests..." -ForegroundColor Yellow

try {
    $output = & npx playwright test tests/specFiles/ga/ `
        --project chromium `
        --reporter=html `
        --reporter=json `
        --reporter=list 2>&1

    $testExitCode = $LASTEXITCODE
} catch {
    Write-Host "  ERROR - Test execution failed: $_" -ForegroundColor Red
    $testExitCode = 1
}

Write-Host ""
Write-Host "TEST RESULTS" -ForegroundColor Green
Write-Host "------------------------------------------------------------" -ForegroundColor Gray

if (Test-Path "playwright-report/index.html") {
    Write-Host "  Report: playwright-report/index.html" -ForegroundColor Cyan
}

if (Test-Path "test-results/results.json") {
    $results = Get-Content test-results/results.json | ConvertFrom-Json
    $totalTests = $results.stats.expected
    $passed = $results.stats.expected - $results.stats.failures
    $failed = $results.stats.failures
    $skipped = $results.stats.skipped

    Write-Host "  Total Tests: $totalTests" -ForegroundColor White
    Write-Host "  Passed: $passed" -ForegroundColor Green
    Write-Host "  Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })
    Write-Host "  Skipped: $skipped" -ForegroundColor Yellow
}

Write-Host ""
$duration = (Get-Date) - $startTime
Write-Host "Duration: $($duration.TotalMinutes -as [int]) minutes" -ForegroundColor Cyan
Write-Host ""

# Summary
Write-Host "============================================================" -ForegroundColor Cyan
if ($testExitCode -eq 0) {
    Write-Host "  OK - ALL TESTS PASSED" -ForegroundColor Green
} else {
    Write-Host "  FAIL - SOME TESTS FAILED" -ForegroundColor Red
}
Write-Host "  Components Generated: $generatedCount / $($components.Count)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

exit $testExitCode
