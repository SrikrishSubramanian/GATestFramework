#!/bin/bash
# Sprint 17 Test Generation from Excel Test Cases
# Converts Excel files to CSV and generates Playwright tests

set -o pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
TESTCASES_DIR="${TESTCASES_DIR:-C:/Users/PuneethAM/GA_testcases/GA_testcases}"
CSV_OUTPUT_DIR="./.temp/sprint-17-csv"
LOG_DIR=".claude/sprint-17-testcase-generation"
BATCH_SIZE="${BATCH_SIZE:-5}"
MAX_RETRIES="${MAX_RETRIES:-2}"

# Create directories
mkdir -p "$CSV_OUTPUT_DIR"
mkdir -p "$LOG_DIR"

# Setup logging
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
MAIN_LOG="$LOG_DIR/generation-$TIMESTAMP.log"
ERROR_LOG="$LOG_DIR/errors-$TIMESTAMP.log"

{
    echo "Sprint 17 Test Generation from Excel Test Cases"
    echo "=============================================="
    echo "Started: $(date)"
    echo "Source: $TESTCASES_DIR"
    echo "Output: $CSV_OUTPUT_DIR"
    echo ""
} | tee "$MAIN_LOG"

# Check prerequisites
print_status() {
    local status=$1
    local message=$2

    case $status in
        "SUCCESS")
            echo -e "${GREEN}✓${NC} $message"
            ;;
        "FAILED")
            echo -e "${RED}✗${NC} $message"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}⚠${NC} $message"
            ;;
    esac
}

print_status "INFO" "Checking prerequisites..."

# Check if testcases directory exists
if [ ! -d "$TESTCASES_DIR" ]; then
    print_status "FAILED" "Test cases directory not found: $TESTCASES_DIR"
    exit 1
fi

# Check for Excel files
EXCEL_FILES=$(find "$TESTCASES_DIR" -name "*.xlsx" -type f | wc -l)
if [ "$EXCEL_FILES" -eq 0 ]; then
    print_status "FAILED" "No Excel files found in $TESTCASES_DIR"
    exit 1
fi

print_status "SUCCESS" "Found $EXCEL_FILES test case files"
print_status "INFO" "Converting Excel to CSV..."

# Function to convert Excel to CSV using Python
convert_excel_to_csv() {
    local excel_file=$1
    local csv_file=$2

    python3 << 'PYTHON_EOF'
import sys
import openpyxl
import csv
import os

excel_file = sys.argv[1]
csv_file = sys.argv[2]

try:
    # Load Excel workbook
    wb = openpyxl.load_workbook(excel_file, data_only=True)
    ws = wb.active

    # Write to CSV
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        for row in ws.iter_rows(values_only=True):
            writer.writerow(row)

    print(f"✓ Converted: {os.path.basename(csv_file)}")

except Exception as e:
    print(f"✗ Error converting {excel_file}: {str(e)}", file=sys.stderr)
    sys.exit(1)

PYTHON_EOF
}

# Convert all Excel files to CSV
CONVERTED_COUNT=0
FAILED_CONVERSION=0

echo ""
for excel_file in "$TESTCASES_DIR"/*.xlsx; do
    [ -e "$excel_file" ] || continue

    # Extract ticket number from filename
    filename=$(basename "$excel_file")
    ticket_num=$(echo "$filename" | grep -o "GAAM-[0-9]*")

    # Define CSV output path
    csv_file="$CSV_OUTPUT_DIR/$ticket_num-testcases.csv"

    # Convert Excel to CSV
    if python3 << PYTHON_SCRIPT
import openpyxl
import csv

excel_file = r'$excel_file'
csv_file = r'$csv_file'

try:
    wb = openpyxl.load_workbook(excel_file, data_only=True)
    ws = wb.active

    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        for row in ws.iter_rows(values_only=True):
            writer.writerow(row)

    exit(0)
except:
    exit(1)
PYTHON_SCRIPT
    then
        ((CONVERTED_COUNT++))
        echo -e "${GREEN}✓${NC} $ticket_num"
    else
        ((FAILED_CONVERSION++))
        echo -e "${RED}✗${NC} $ticket_num"
        echo "  Failed to convert: $filename" >> "$ERROR_LOG"
    fi
done

echo ""
print_status "SUCCESS" "Conversion complete: $CONVERTED_COUNT/$EXCEL_FILES files"

if [ "$FAILED_CONVERSION" -gt 0 ]; then
    print_status "WARN" "$FAILED_CONVERSION files failed conversion"
fi

# Now generate tests from CSV files
echo ""
print_status "INFO" "Generating tests from CSV files..."
echo ""

CSV_FILES=$(find "$CSV_OUTPUT_DIR" -name "*.csv" -type f)
CSV_COUNT=$(echo "$CSV_FILES" | wc -l)

if [ "$CSV_COUNT" -eq 0 ]; then
    print_status "FAILED" "No CSV files found for test generation"
    exit 1
fi

# Process CSV files in batches
GENERATED_COUNT=0
FAILED_COUNT=0
CURRENT=0
TOTAL=$CSV_COUNT

for csv_file in "$CSV_OUTPUT_DIR"/*.csv; do
    [ -e "$csv_file" ] || continue

    ((CURRENT++))
    filename=$(basename "$csv_file" .csv)
    ticket=$(echo "$filename" | grep -o "GAAM-[0-9]*")

    echo -n "[$CURRENT/$TOTAL] Generating for $ticket... "

    # Run test generation
    if CSV_PATH="$csv_file" env=local timeout 600 npx playwright test generate-from-csv \
        --config playwright.generators.config.ts \
        --project chromium \
        --workers 1 > "$LOG_DIR/$ticket-generation.log" 2>&1; then

        echo -e "${GREEN}✓${NC}"
        ((GENERATED_COUNT++))
    else
        echo -e "${RED}✗${NC}"
        ((FAILED_COUNT++))
        {
            echo "FAILED: $ticket"
            echo "CSV: $csv_file"
            echo "Log: $LOG_DIR/$ticket-generation.log"
        } >> "$ERROR_LOG"
    fi
done

# Final summary
echo ""
echo -e "${BLUE}=== Generation Complete ===${NC}"
echo ""
{
    echo "Sprint 17 Test Generation Summary"
    echo "=================================="
    echo "Completed: $(date)"
    echo ""
    echo "Conversions:"
    echo "  Total: $EXCEL_FILES"
    echo "  Converted: $CONVERTED_COUNT"
    echo "  Failed: $FAILED_CONVERSION"
    echo ""
    echo "Test Generation:"
    echo "  Total CSVs: $CSV_COUNT"
    echo "  Generated: $GENERATED_COUNT"
    echo "  Failed: $FAILED_COUNT"
    echo "  Success rate: $((GENERATED_COUNT * 100 / CSV_COUNT))%"
    echo ""

    if [ "$FAILED_COUNT" -gt 0 ]; then
        echo "Failed tickets:"
        grep "^FAILED:" "$ERROR_LOG" | cut -d: -f2 | sort | uniq
        echo ""
    fi

    echo "Next steps:"
    echo "  1. Verify generated tests:"
    echo "     npx playwright test --grep '@smoke' --project chromium"
    echo ""
    echo "  2. Run full test suite:"
    echo "     env=local npx playwright test tests/specFiles/ga/ --project chromium"
    echo ""
    echo "  3. Review HTML summaries:"
    echo "     ls tests/specFiles/ga/*/\*-test-summary.html"
    echo ""
    echo "Logs: $LOG_DIR/"
    echo ""
} | tee -a "$MAIN_LOG"

print_status "SUCCESS" "Generation summary saved to $MAIN_LOG"

# Cleanup
echo ""
print_status "INFO" "Cleaning up temporary files..."
# Keep CSV files for reference: rm -rf "$CSV_OUTPUT_DIR"
print_status "SUCCESS" "CSV files kept at: $CSV_OUTPUT_DIR (for reference)"

if [ "$FAILED_COUNT" -eq 0 ]; then
    print_status "SUCCESS" "All tests generated successfully!"
    exit 0
else
    print_status "WARN" "$FAILED_COUNT tests failed - review error log"
    exit 1
fi
