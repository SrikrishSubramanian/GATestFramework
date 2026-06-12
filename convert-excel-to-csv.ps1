# PowerShell script to convert Excel files to CSV
# No external dependencies needed (uses Windows COM)

param(
    [string]$InputDir = "C:/Users/PuneethAM/GA_testcases/GA_testcases",
    [string]$OutputDir = "./.temp/sprint-17-csv"
)

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Get all Excel files
$excelFiles = Get-ChildItem -Path $InputDir -Filter "*.xlsx" -File
Write-Host "Found $($excelFiles.Count) Excel files"
Write-Host ""

# Create Excel COM object
try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    Write-Host "[OK] Excel COM object created"
} catch {
    Write-Host "[ERROR] Could not create Excel COM object"
    Write-Host "  Reason: $_"
    Write-Host ""
    Write-Host "Alternative: Use LibreOffice or install proper Python environment"
    exit 1
}

# Convert each file
$convertedCount = 0
$failedCount = 0

foreach ($file in $excelFiles) {
    $ticket = $file.BaseName.Split('_')[0]
    $outputFile = Join-Path $OutputDir "$ticket-testcases.csv"

    try {
        # Open workbook
        $workbook = $excel.Workbooks.Open($file.FullName, $null, $true)
        $worksheet = $workbook.Sheets(1)

        # Convert to CSV
        $csv = Join-Path ([System.IO.Path]::GetTempPath()) "$ticket-temp.csv"
        $workbook.SaveAs($csv, 6)  # 6 = CSV format
        $workbook.Close($false)

        # Move to output directory
        Move-Item $csv $outputFile -Force

        Write-Host "[OK] $ticket"
        $convertedCount++

    } catch {
        Write-Host "[FAILED] $ticket - Error: $_"
        $failedCount++
    }
}

# Close Excel
$excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null

# Summary
Write-Host ""
Write-Host "Conversion Complete"
Write-Host "==================="
Write-Host "Total: $($excelFiles.Count)"
Write-Host "Converted: $convertedCount"
Write-Host "Failed: $failedCount"
Write-Host "Output: $OutputDir"
Write-Host ""

if ($failedCount -eq 0) {
    Write-Host "[SUCCESS] All files converted successfully"
    exit 0
} else {
    Write-Host "[WARNING] Some files failed - see above"
    exit 1
}
