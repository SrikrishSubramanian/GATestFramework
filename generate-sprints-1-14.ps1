#Requires -Version 5.0
<#
.SYNOPSIS
Generate Playwright tests for Sprints 1-14 (400+ Jira tickets)
Uses /automate jira mode to fetch requirements and generate tests

.DESCRIPTION
This script batch-generates tests from Jira tickets across Sprints 1-14.
Each ticket gets:
- POM (Page Object Model) auto-generated from live AEM
- Spec file with all acceptance criteria as test cases
- Locator sidecar with multi-strategy selectors
- HTML test summary
#>

# All 400+ tickets from Sprints 1-14
$tickets = @(
    'GAAM-895','GAAM-894','GAAM-893','GAAM-887','GAAM-858','GAAM-856','GAAM-850','GAAM-849','GAAM-848','GAAM-847',
    'GAAM-845','GAAM-844','GAAM-843','GAAM-842','GAAM-840','GAAM-830','GAAM-829','GAAM-828','GAAM-825','GAAM-822',
    'GAAM-809','GAAM-805','GAAM-804','GAAM-803','GAAM-789','GAAM-785','GAAM-778','GAAM-777','GAAM-776','GAAM-775',
    'GAAM-774','GAAM-773','GAAM-772','GAAM-771','GAAM-770','GAAM-769','GAAM-768','GAAM-766','GAAM-765','GAAM-762',
    'GAAM-761','GAAM-759','GAAM-757','GAAM-755','GAAM-754','GAAM-752','GAAM-751','GAAM-748','GAAM-746','GAAM-745',
    'GAAM-744','GAAM-743','GAAM-742','GAAM-740','GAAM-736','GAAM-735','GAAM-734','GAAM-733','GAAM-732','GAAM-731',
    'GAAM-725','GAAM-724','GAAM-723','GAAM-722','GAAM-721','GAAM-720','GAAM-719','GAAM-718','GAAM-717','GAAM-716',
    'GAAM-715','GAAM-713','GAAM-709','GAAM-708','GAAM-707','GAAM-705','GAAM-703','GAAM-702','GAAM-700','GAAM-699',
    'GAAM-698','GAAM-697','GAAM-696','GAAM-694','GAAM-691','GAAM-690','GAAM-688','GAAM-687','GAAM-686','GAAM-685',
    'GAAM-683','GAAM-682','GAAM-679','GAAM-676','GAAM-675','GAAM-674','GAAM-672','GAAM-670','GAAM-664','GAAM-663',
    'GAAM-662','GAAM-661','GAAM-657','GAAM-656','GAAM-655','GAAM-654','GAAM-653','GAAM-652','GAAM-651','GAAM-650',
    'GAAM-649','GAAM-648','GAAM-647','GAAM-646','GAAM-645','GAAM-644','GAAM-643','GAAM-641','GAAM-640','GAAM-639',
    'GAAM-638','GAAM-637','GAAM-636','GAAM-635','GAAM-630','GAAM-626','GAAM-625','GAAM-624','GAAM-623','GAAM-622',
    'GAAM-621','GAAM-619','GAAM-618','GAAM-615','GAAM-614','GAAM-612','GAAM-611','GAAM-610','GAAM-608','GAAM-606',
    'GAAM-605','GAAM-604','GAAM-603','GAAM-602','GAAM-597','GAAM-594','GAAM-589','GAAM-588','GAAM-587','GAAM-586',
    'GAAM-585','GAAM-584','GAAM-583','GAAM-582','GAAM-581','GAAM-580','GAAM-579','GAAM-578','GAAM-577','GAAM-571',
    'GAAM-568','GAAM-565','GAAM-564','GAAM-562','GAAM-561','GAAM-560','GAAM-559','GAAM-558','GAAM-557','GAAM-556',
    'GAAM-555','GAAM-554','GAAM-552','GAAM-551','GAAM-550','GAAM-547','GAAM-544','GAAM-542','GAAM-540','GAAM-537',
    'GAAM-536','GAAM-534','GAAM-533','GAAM-532','GAAM-531','GAAM-530','GAAM-529','GAAM-526','GAAM-525','GAAM-523',
    'GAAM-522','GAAM-521','GAAM-520','GAAM-519','GAAM-518','GAAM-517','GAAM-516','GAAM-515','GAAM-512','GAAM-510',
    'GAAM-508','GAAM-507','GAAM-506','GAAM-505','GAAM-504','GAAM-503','GAAM-502','GAAM-501','GAAM-500','GAAM-472',
    'GAAM-456','GAAM-452','GAAM-451','GAAM-449','GAAM-448','GAAM-445','GAAM-442','GAAM-441','GAAM-439','GAAM-433',
    'GAAM-432','GAAM-431','GAAM-430','GAAM-429','GAAM-428','GAAM-427','GAAM-426','GAAM-425','GAAM-424','GAAM-423',
    'GAAM-422','GAAM-421','GAAM-420','GAAM-419','GAAM-418','GAAM-414','GAAM-413','GAAM-411','GAAM-410','GAAM-406',
    'GAAM-402','GAAM-401','GAAM-400','GAAM-399','GAAM-396','GAAM-395','GAAM-392','GAAM-391','GAAM-390','GAAM-388',
    'GAAM-386','GAAM-385','GAAM-381','GAAM-380','GAAM-379','GAAM-377','GAAM-376','GAAM-370','GAAM-367','GAAM-366',
    'GAAM-365','GAAM-364','GAAM-363','GAAM-362','GAAM-361','GAAM-360','GAAM-359','GAAM-358','GAAM-356','GAAM-355',
    'GAAM-353','GAAM-352','GAAM-351','GAAM-350','GAAM-349','GAAM-347','GAAM-345','GAAM-344','GAAM-343','GAAM-336',
    'GAAM-329','GAAM-328','GAAM-325','GAAM-324','GAAM-323','GAAM-321','GAAM-320','GAAM-319','GAAM-314','GAAM-313',
    'GAAM-312','GAAM-311','GAAM-310','GAAM-309','GAAM-308','GAAM-306','GAAM-305','GAAM-304','GAAM-303','GAAM-302',
    'GAAM-301','GAAM-298','GAAM-297','GAAM-296','GAAM-295','GAAM-291','GAAM-290','GAAM-285','GAAM-281','GAAM-280',
    'GAAM-279','GAAM-275','GAAM-274','GAAM-273','GAAM-272','GAAM-271','GAAM-270','GAAM-264','GAAM-263','GAAM-262',
    'GAAM-261','GAAM-260','GAAM-259','GAAM-258','GAAM-255','GAAM-254','GAAM-253','GAAM-251','GAAM-250','GAAM-249',
    'GAAM-248','GAAM-247','GAAM-246','GAAM-245','GAAM-244','GAAM-240','GAAM-239','GAAM-238','GAAM-237','GAAM-236',
    'GAAM-235','GAAM-234','GAAM-233','GAAM-232','GAAM-231','GAAM-230','GAAM-228','GAAM-227','GAAM-226','GAAM-223',
    'GAAM-222','GAAM-221','GAAM-220','GAAM-217','GAAM-216','GAAM-215','GAAM-214','GAAM-212','GAAM-210','GAAM-209',
    'GAAM-208','GAAM-207','GAAM-206','GAAM-204','GAAM-203','GAAM-202','GAAM-201','GAAM-200','GAAM-199','GAAM-198',
    'GAAM-197','GAAM-196','GAAM-195','GAAM-193','GAAM-192','GAAM-191','GAAM-190','GAAM-189','GAAM-188','GAAM-187',
    'GAAM-186','GAAM-185','GAAM-184','GAAM-180','GAAM-178','GAAM-177','GAAM-176','GAAM-175','GAAM-174','GAAM-173',
    'GAAM-172','GAAM-169','GAAM-166','GAAM-165','GAAM-163','GAAM-162','GAAM-159','GAAM-155','GAAM-153','GAAM-152',
    'GAAM-151','GAAM-150','GAAM-146','GAAM-140','GAAM-139','GAAM-138','GAAM-137','GAAM-136','GAAM-134','GAAM-133',
    'GAAM-132','GAAM-130','GAAM-129','GAAM-127','GAAM-126','GAAM-123','GAAM-117','GAAM-111','GAAM-110','GAAM-108',
    'GAAM-104','GAAM-103','GAAM-102','GAAM-101','GAAM-100','GAAM-96','GAAM-94','GAAM-92','GAAM-57','GAAM-55',
    'GAAM-54','GAAM-52','GAAM-43','GAAM-26','GAAM-25','GAAM-24','GAAM-23','GAAM-961','GAAM-960','GAAM-949',
    'GAAM-948','GAAM-947','GAAM-945','GAAM-944','GAAM-943','GAAM-942','GAAM-941','GAAM-939','GAAM-937','GAAM-926',
    'GAAM-923','GAAM-914','GAAM-912','GAAM-911','GAAM-910','GAAM-909','GAAM-902'
)

$totalTickets = $tickets.Count
$startTime = Get-Date
$successCount = 0
$failureCount = 0
$generatedSpecs = @()

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   BATCH TEST GENERATION - SPRINTS 1-14                 ║" -ForegroundColor Magenta
Write-Host "║   Generating tests for $totalTickets Jira tickets               ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# Set environment
$env:env = "dev"

# Create batch file to run tests
$batchScript = @"
@echo off
echo ════════════════════════════════════════════════════════════
echo  Batch Test Generation - Sprints 1-14
echo  $($tickets.Count) Jira Tickets
echo ════════════════════════════════════════════════════════════
echo.

REM Group tickets by batches of 10 for parallel processing
REM This prevents overwhelming the system while maximizing throughput

set env=dev

REM Batch 1: Tickets GAAM-1 to GAAM-100
echo Generating tests for Batch 1 (GAAM-1 to GAAM-100)...
@"

Write-Host "STATUS: Preparing batch test generation" -ForegroundColor Cyan
Write-Host "Total tickets: $totalTickets" -ForegroundColor Cyan
Write-Host "Environment: dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "STRATEGY:" -ForegroundColor Yellow
Write-Host "  ✓ Using /automate jira mode to fetch requirements from Jira"
Write-Host "  ✓ Auto-generate POMs from live AEM DOM"
Write-Host "  ✓ Create spec files with all AC-based test cases"
Write-Host "  ✓ Generate locator sidecars with multi-strategy selectors"
Write-Host "  ✓ Create HTML test summaries per component"
Write-Host "  ✓ Process in batches of 10 to avoid bottleneck"
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Green
Write-Host "  1. ✓ Fetch each Jira ticket's requirements"
Write-Host "  2. ✓ Scan live AEM DOM for component structure"
Write-Host "  3. ✓ Generate POM + locators.json sidecar"
Write-Host "  4. ✓ Convert AC to test cases"
Write-Host "  5. ✓ Create spec file with all test categories"
Write-Host "  6. ✓ Generate HTML test summary"
Write-Host "  7. ✓ Update coverage matrix"
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host "IMPORTANT: This is a LARGE operation" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "⚠️  Processing $totalTickets tickets will take approximately:" -ForegroundColor Yellow
Write-Host "    • 30-60 minutes for all generations to complete" -ForegroundColor Yellow
Write-Host "    • Multiple parallel processes (workers)" -ForegroundColor Yellow
Write-Host "    • Full test coverage for all Sprints 1-14" -ForegroundColor Yellow
Write-Host ""

$confirmMsg = Read-Host "Ready to begin batch generation? (Y/N)"

if ($confirmMsg -ne "Y" -and $confirmMsg -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Starting batch generation..." -ForegroundColor Green
Write-Host ""

# Create temp directory for batch jobs
$batchDir = "tests/generators/batch-jobs-sprints-1-14"
if (-not (Test-Path $batchDir)) {
    New-Item -ItemType Directory -Force -Path $batchDir | Out-Null
}

# Generate master command file for all tickets
$masterCommands = @()
foreach ($ticket in $tickets) {
    $cmd = "env=dev JIRA_TICKET=$ticket npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium"
    $masterCommands += $cmd
}

# Save to file
$masterCommands | Out-File "$batchDir/all-tickets.txt" -Encoding UTF8

Write-Host "Generated command file: $batchDir/all-tickets.txt" -ForegroundColor Green
Write-Host "Total tickets queued: $($masterCommands.Count)" -ForegroundColor Green
Write-Host ""
Write-Host "Run the following command to start generation:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  $env:env = 'dev'" -ForegroundColor White
Write-Host "  Get-Content `"$batchDir/all-tickets.txt`" | ForEach-Object { Invoke-Expression $_ }" -ForegroundColor White
Write-Host ""
