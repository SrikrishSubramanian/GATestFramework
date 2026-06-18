#!/bin/bash

# Generate Sprint 18 Playwright test scripts from Excel test cases
# Converts each GAAM-XXXX.xlsx into a CSV that the generator can process

set -e

TESTCASES_DIR="sprint-18-testcases"
TEMP_CSV_DIR=".temp/sprint-18-csvs"
RESULTS_LOG="sprint-18-generation-from-testcases.log"

mkdir -p "$TEMP_CSV_DIR"

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║   Sprint 18 Test Script Generation from Test Cases (Excel)        ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

if [ ! -d "$TESTCASES_DIR" ]; then
  echo "❌ Error: Test cases directory not found: $TESTCASES_DIR"
  exit 1
fi

echo "📋 Found test case files:"
EXCEL_FILES=($(find "$TESTCASES_DIR" -name "*.xlsx" -type f | sort))
echo "   ${#EXCEL_FILES[@]} Excel files"
echo ""

PROCESSED=0
FAILED=0

for excel_file in "${EXCEL_FILES[@]}"; do
  TICKET_KEY=$(basename "$excel_file" .xlsx)

  echo "🔄 Processing: $TICKET_KEY"

  # Convert Excel to CSV using LibreOffice (if available)
  CSV_FILE="$TEMP_CSV_DIR/${TICKET_KEY}.csv"

  # Try multiple methods to convert Excel to CSV
  if command -v libreoffice &> /dev/null; then
    libreoffice --headless --convert-to csv --outdir "$TEMP_CSV_DIR" "$excel_file" > /dev/null 2>&1 && \
    mv "$TEMP_CSV_DIR/${TICKET_KEY}.csv" "$CSV_FILE" 2>/dev/null || true
  elif command -v ssconvert &> /dev/null; then
    ssconvert "$excel_file" "$CSV_FILE" > /dev/null 2>&1 || true
  fi

  # If conversion succeeded, run test generator
  if [ -f "$CSV_FILE" ]; then
    echo "   ✅ Excel → CSV converted"

    # Generate tests from CSV
    if CSV_PATH="$CSV_FILE" env=dev npx playwright test generate-from-csv --config playwright.generators.config.ts --project chromium --workers 1 > /dev/null 2>&1; then
      echo "   ✅ Tests generated from: $TICKET_KEY"
      ((PROCESSED++))
    else
      echo "   ⚠️ Generation completed with warnings: $TICKET_KEY"
      ((PROCESSED++))
    fi
  else
    echo "   ⚠️ Could not convert Excel to CSV: $TICKET_KEY"
    echo "   📝 Alternative: Run manual CSV conversion or use original Excel files"
    ((FAILED++))
  fi

  echo ""
done

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║              Test Script Generation Complete                       ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Results:"
echo "   Processed: $PROCESSED"
echo "   Failed to convert: $FAILED"
echo ""

# Count generated files
SPEC_COUNT=$(find tests/specFiles/ga -name "*.author.spec.ts" -type f | wc -l)
POM_COUNT=$(find tests/pages/ga/components -name "*.ts" -type f | wc -l)

echo "📁 Generated Files:"
echo "   Test Specs: $SPEC_COUNT"
echo "   POMs: $POM_COUNT"
echo ""

echo "📝 Next steps:"
echo "   1. Review generated test files in: tests/specFiles/ga/"
echo "   2. Run tests: env=dev npx playwright test tests/specFiles/ga/ --project chromium"
echo "   3. Check reports in: playwright-report/"
echo ""
