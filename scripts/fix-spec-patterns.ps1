# Framework Refactoring Script - PowerShell Version
# Applies proper console-capture + report-enhancer pattern to all spec files

param(
    [string]$SpecDir = "./tests/specFiles/ga",
    [switch]$DryRun = $false
)

$fixed = 0
$skipped = 0
$errors = 0

Write-Host "🔧 Framework Refactoring Script`n" -ForegroundColor Cyan
Write-Host "Scanning: $SpecDir`n"

# Find all .author.spec.ts files
$authorSpecs = @(Get-ChildItem -Path $SpecDir -Recurse -Filter "*.author.spec.ts" -File)

Write-Host "Found $($authorSpecs.Count) author specs`n"

foreach ($file in $authorSpecs) {
    try {
        $content = Get-Content $file.FullName -Raw
        $originalContent = $content
        $changed = $false

        # 1. Add report-enhancer import if missing
        if ($content -notmatch 'attachConsoleCapture') {
            # Find the last import and add after it
            $lastImportMatch = [regex]::Matches($content, '^import .* from [''"].*[''"];?$', 'Multiline')
            if ($lastImportMatch.Count -gt 0) {
                $lastImport = $lastImportMatch[$lastImportMatch.Count - 1]
                $insertPos = $lastImport.Index + $lastImport.Length

                # Determine import depth
                $depth = if ($file.FullName -match '/ga/[^/]+/') { '../../' } else { '../../../' }
                $importLine = "import { attachConsoleCapture, annotateEnvironment } from '${depth}utils/infra/report-enhancer';"

                if ($content -notmatch [regex]::Escape($importLine)) {
                    $content = $content.Insert($insertPos, "`n$importLine")
                    $changed = $true
                }
            }
        }

        # 2. Add capture variable declaration
        if ($content -notmatch 'let capture: ConsoleCapture;') {
            # Find insertion point (after imports, before first const or test)
            $match = [regex]::Match($content, '\nconst [A-Z_]+ = |^test\.', 'Multiline')
            if ($match.Success) {
                $insertPos = $match.Index
                $content = $content.Insert($insertPos, "let capture: ConsoleCapture;`n`n")
                $changed = $true
            }
        }

        # 3. Add capture initialization to beforeEach
        if ($content -match 'test\.beforeEach\s*\(\s*async\s*\(\s*{\s*page\s*}\s*\)\s*=>\s*{') {
            if ($content -notmatch 'capture = new ConsoleCapture\(page\)') {
                # Find the closing brace of beforeEach
                $beforeEachStart = $content.IndexOf('test.beforeEach')
                $beforeEachBody = $content.Substring($beforeEachStart)
                $closingBrace = $beforeEachBody.IndexOf('});')

                if ($closingBrace -gt 0) {
                    $insertPos = $beforeEachStart + $closingBrace - 2
                    $captureInit = "  capture = new ConsoleCapture(page);`n  capture.start();`n"
                    $content = $content.Insert($insertPos, $captureInit)
                    $changed = $true
                }
            }
        }

        # 4. Add afterEach hook if missing
        if ($content -notmatch 'test\.afterEach') {
            $beforeEachStart = $content.IndexOf('test.beforeEach')
            $closingPos = $content.IndexOf('});', $beforeEachStart)

            if ($closingPos -gt 0) {
                $insertPos = $closingPos + 3
                $afterEachBlock = @"

test.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});
"@
                $content = $content.Insert($insertPos, $afterEachBlock)
                $changed = $true
            }
        }

        if ($changed) {
            if ($DryRun) {
                Write-Host "  [DRY RUN] Would fix: $($file.Name)" -ForegroundColor Yellow
            } else {
                Set-Content -Path $file.FullName -Value $content -Encoding UTF8
                Write-Host "  ✓ Fixed: $($file.Name)" -ForegroundColor Green
            }
            $fixed++
        } else {
            $skipped++
        }
    } catch {
        Write-Host "  ✗ Error in $($file.Name): $_" -ForegroundColor Red
        $errors++
    }
}

# Print summary
Write-Host "`n$('=' * 60)"
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   Total scanned:  $($authorSpecs.Count)"
Write-Host "   Fixed:          $fixed"
Write-Host "   Skipped:        $skipped"
Write-Host "   Errors:         $errors"
Write-Host "$('=' * 60)"
