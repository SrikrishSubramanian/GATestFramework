#!/bin/bash
# Sprint 17 Safe Test Generation from Jira
# Fetches complete requirements for all 54 tickets and generates comprehensive tests
# Ensures NO test cases are missed

set -o pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
JIRA_URL="${JIRA_URL:-https://bounteous.jira.com}"
BATCH_SIZE="${BATCH_SIZE:-1}"  # Process one ticket at a time for easy debugging
MAX_RETRIES="${MAX_RETRIES:-2}"
TIMEOUT="${TIMEOUT:-600}"      # 10 minutes per ticket

# All 54 Sprint 17 tickets
TICKETS=(
    GAAM-1190 GAAM-1189 GAAM-1176 GAAM-1146 GAAM-1108 GAAM-1107 GAAM-1105 GAAM-1050 GAAM-1044 GAAM-1043
    GAAM-1041 GAAM-1029 GAAM-1014 GAAM-1007 GAAM-1006 GAAM-1005 GAAM-1004 GAAM-1003 GAAM-1002 GAAM-1001
    GAAM-1000 GAAM-992 GAAM-990 GAAM-986 GAAM-985 GAAM-980 GAAM-979 GAAM-977 GAAM-958 GAAM-951
    GAAM-933 GAAM-906 GAAM-904 GAAM-899 GAAM-898 GAAM-897 GAAM-873 GAAM-872 GAAM-869 GAAM-866
    GAAM-865 GAAM-862 GAAM-855 GAAM-853 GAAM-824 GAAM-823 GAAM-821 GAAM-815 GAAM-794 GAAM-753
    GAAM-573 GAAM-469 GAAM-404 GAAM-338
)

# Setup logging
LOG_DIR=".claude/sprint-17-jira-generation"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
MAIN_LOG="$LOG_DIR/generation-$TIMESTAMP.log"
ERROR_LOG="$LOG_DIR/errors-$TIMESTAMP.log"
SUMMARY_LOG="$LOG_DIR/summary-$TIMESTAMP.txt"

mkdir -p "$LOG_DIR"

# Initialize logs
{
    echo "Sprint 17 Comprehensive Test Generation from Jira"
    echo "=================================================="
    echo "Started: $(date)"
    echo "Total tickets: ${#TICKETS[@]}"
    echo "Jira URL: $JIRA_URL"
    echo ""
} | tee "$MAIN_LOG"

# Print status helper
print_status() {
    local status=$1
    local ticket=$2
    local message=$3

    case $status in
        "SUCCESS")
            echo -e "${GREEN}[OK]${NC} $ticket: $message"
            ;;
        "FAILED")
            echo -e "${RED}[FAIL]${NC} $ticket: $message"
            ;;
        "RETRY")
            echo -e "${YELLOW}[RETRY]${NC} $ticket: $message"
            ;;
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    echo ""
    print_status "INFO" "" "Checking prerequisites..."

    # Check Jira credentials
    if [ -z "$JIRA_EMAIL" ] || [ -z "$JIRA_API_TOKEN" ]; then
        echo ""
        echo -e "${RED}ERROR: Jira credentials not set${NC}"
        echo ""
        echo "To generate tests from Jira, set environment variables:"
        echo "  export JIRA_EMAIL=your-email@bounteous.com"
        echo "  export JIRA_API_TOKEN=your-api-token (from Jira settings)"
        echo "  export JIRA_URL=https://bounteous.jira.com"
        echo ""
        echo "Then run: $0"
        return 1
    fi

    print_status "SUCCESS" "" "Jira credentials set"

    # Check Playwright
    if ! npx playwright --version > /dev/null 2>&1; then
        print_status "FAILED" "" "Playwright not installed"
        return 1
    fi

    print_status "SUCCESS" "" "Playwright installed"

    echo ""
    return 0
}

# Function to generate tests for a single ticket from Jira
generate_ticket() {
    local ticket=$1
    local attempt=$2

    # Run generation with Jira API
    local cmd="JIRA_TICKET=$ticket \
        JIRA_EMAIL='$JIRA_EMAIL' \
        JIRA_API_TOKEN='$JIRA_API_TOKEN' \
        JIRA_URL='$JIRA_URL' \
        env=local \
        timeout $TIMEOUT \
        npx playwright test generate-from-jira \
          --config playwright.generators.config.ts \
          --project chromium \
          --workers 1"

    # Run generation
    local ticket_log="$LOG_DIR/$ticket-attempt-$attempt.log"
    eval "$cmd" > "$ticket_log" 2>&1
    local exit_code=$?

    # Check for success
    if [ $exit_code -eq 0 ]; then
        return 0
    else
        if [ $exit_code -eq 124 ]; then
            echo "Timeout after ${TIMEOUT}s" >> "$ticket_log"
        fi
        return 1
    fi
}

# Process a single ticket with retries
process_ticket() {
    local ticket=$1
    local ticket_num=$2
    local attempt=1

    printf "[$ticket_num/${#TICKETS[@]}] $ticket: "

    while [ $attempt -le $MAX_RETRIES ]; do
        if generate_ticket "$ticket" $attempt; then
            print_status "SUCCESS" "$ticket" "Tests generated (attempt $attempt)"
            return 0
        else
            if [ $attempt -lt $MAX_RETRIES ]; then
                print_status "RETRY" "$ticket" "Attempt $attempt failed, retrying..."
                sleep 5
            else
                print_status "FAILED" "$ticket" "Failed after $MAX_RETRIES attempts"
                {
                    echo "FAILED: $ticket"
                    echo "Attempts: $MAX_RETRIES"
                    echo "Last log: $LOG_DIR/$ticket-attempt-$attempt.log"
                    echo ""
                } >> "$ERROR_LOG"
                return 1
            fi
        fi
        ((attempt++))
    done
}

# Main processing
echo ""
print_status "INFO" "" "Checking prerequisites..."

if ! check_prerequisites; then
    exit 1
fi

echo ""
echo -e "${BLUE}=== Starting Generation ===${NC}"
echo "Generating tests from Jira for ${#TICKETS[@]} tickets..."
echo "Processing one ticket at a time for easy debugging..."
echo ""

START_TIME=$(date +%s)
GENERATED_COUNT=0
FAILED_COUNT=0
FAILED_TICKETS=()
TICKETS_PROCESSED=0

for ticket in "${TICKETS[@]}"; do
    ((TICKETS_PROCESSED++))
    if ! process_ticket "$ticket" "$TICKETS_PROCESSED"; then
        FAILED_TICKETS+=("$ticket")
        ((FAILED_COUNT++))
    else
        ((GENERATED_COUNT++))
    fi
done

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

# Summary
echo ""
echo -e "${BLUE}=== Generation Complete ===${NC}"
echo ""
{
    echo "Sprint 17 Test Generation Summary"
    echo "=================================="
    echo "Completed: $(date)"
    echo ""
    echo "Results:"
    echo "  Total tickets: ${#TICKETS[@]}"
    echo "  Generated: $GENERATED_COUNT"
    echo "  Failed: $FAILED_COUNT"
    echo "  Success rate: $((GENERATED_COUNT * 100 / ${#TICKETS[@]}))%"
    echo "  Duration: ${DURATION_MIN}m ${DURATION_SEC}s"
    echo ""

    if [ $FAILED_COUNT -gt 0 ]; then
        echo "Failed tickets:"
        for ticket in "${FAILED_TICKETS[@]}"; do
            echo "  • $ticket"
        done
        echo ""
        echo "Debugging:"
        echo "  • Check error log: $ERROR_LOG"
        echo "  • View logs: $LOG_DIR/"
    fi

    echo ""
    echo "Generated Files:"
    SPEC_COUNT=$(find tests/specFiles/ga -name "*.spec.ts" -type f 2>/dev/null | wc -l)
    POM_COUNT=$(ls tests/pages/ga/components/*Page.ts 2>/dev/null | wc -l)
    HTML_COUNT=$(find tests/specFiles/ga -name "*-test-summary.html" -type f 2>/dev/null | wc -l)
    echo "  • Spec files: $SPEC_COUNT"
    echo "  • POMs: $POM_COUNT"
    echo "  • HTML summaries: $HTML_COUNT"
    echo ""

    echo "Next Steps:"
    echo "  1. Review generated tests:"
    echo "     find tests/specFiles/ga -name '*.spec.ts' -newer .claude -type f | head -20"
    echo ""
    echo "  2. Validate with smoke tests (5-10 min):"
    echo "     npx playwright test --grep '@smoke' --project chromium --workers 4"
    echo ""
    echo "  3. Commit changes:"
    echo "     git add tests/specFiles/ga/ tests/pages/ga/"
    echo "     git commit -m 'test: Generate Sprint 17 tests from Jira ($GENERATED_COUNT/54 successful)'"
    echo ""
    echo "Logs: $LOG_DIR/"
} | tee -a "$MAIN_LOG"

# Print summary to terminal
echo ""
print_status "INFO" "" "Summary"
echo "  Generated: $GENERATED_COUNT / ${#TICKETS[@]}"
echo "  Failed: $FAILED_COUNT / ${#TICKETS[@]}"
echo "  Success rate: $((GENERATED_COUNT * 100 / ${#TICKETS[@]}))%"
echo "  Duration: ${DURATION_MIN}m ${DURATION_SEC}s"
echo ""

if [ $FAILED_COUNT -eq 0 ]; then
    echo -e "${GREEN}All tickets generated successfully!${NC}"
    exit 0
else
    echo -e "${RED}$FAILED_COUNT tickets failed - see logs for details${NC}"
    exit 1
fi
