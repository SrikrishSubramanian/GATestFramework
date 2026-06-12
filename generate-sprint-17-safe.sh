#!/bin/bash
# Sprint 17 Safe Test Generation Script
# Generates tests for 54 Jira tickets with individual error handling and debugging

set -o pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
JIRA_URL="${JIRA_URL:-https://bounteous.jira.com}"
BATCH_SIZE="${BATCH_SIZE:-1}"  # Process one ticket at a time for easy debugging
MAX_RETRIES="${MAX_RETRIES:-2}"
TIMEOUT="${TIMEOUT:-600}"      # 10 minutes per ticket

# Tickets (54 total, grouped for easy reference)
TICKETS=(
    # Group 1: GAAM-1190 to GAAM-1043
    GAAM-1190 GAAM-1189 GAAM-1176 GAAM-1146 GAAM-1108
    GAAM-1107 GAAM-1105 GAAM-1050 GAAM-1044 GAAM-1043

    # Group 2: GAAM-1041 to GAAM-1000
    GAAM-1041 GAAM-1029 GAAM-1014 GAAM-1007 GAAM-1006
    GAAM-1005 GAAM-1004 GAAM-1003 GAAM-1002 GAAM-1001
    GAAM-1000

    # Group 3: GAAM-992 to GAAM-853
    GAAM-992 GAAM-990 GAAM-986 GAAM-985 GAAM-980
    GAAM-979 GAAM-977 GAAM-958 GAAM-951 GAAM-933
    GAAM-906 GAAM-904 GAAM-899 GAAM-898 GAAM-897
    GAAM-873 GAAM-872 GAAM-869 GAAM-866 GAAM-865
    GAAM-862 GAAM-855 GAAM-853

    # Group 4: GAAM-824 to GAAM-338
    GAAM-824 GAAM-823 GAAM-821 GAAM-815 GAAM-794
    GAAM-753 GAAM-573 GAAM-469 GAAM-404 GAAM-338
)

# Setup logging
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_DIR=".claude/sprint-17-generation"
MAIN_LOG="$LOG_DIR/sprint-17-$TIMESTAMP.log"
ERROR_LOG="$LOG_DIR/sprint-17-errors-$TIMESTAMP.log"
SUMMARY_LOG="$LOG_DIR/sprint-17-summary-$TIMESTAMP.txt"

mkdir -p "$LOG_DIR"

# Initialize logs
{
    echo "Sprint 17 Test Generation - Started: $(date)"
    echo "Total tickets: ${#TICKETS[@]}"
    echo "Jira URL: $JIRA_URL"
    echo "Log directory: $LOG_DIR"
    echo ""
} | tee "$MAIN_LOG"

# Counters
TOTAL_TICKETS=${#TICKETS[@]}
GENERATED_COUNT=0
FAILED_COUNT=0
FAILED_TICKETS=()
RETRY_TICKETS=()

# Function to print status
print_status() {
    local status=$1
    local ticket=$2
    local message=$3

    case $status in
        "SUCCESS")
            echo -e "${GREEN}✓${NC} $ticket: $message"
            ;;
        "FAILED")
            echo -e "${RED}✗${NC} $ticket: $message"
            ;;
        "RETRY")
            echo -e "${YELLOW}⟳${NC} $ticket: $message (retry)"
            ;;
        "SKIP")
            echo -e "${CYAN}⊘${NC} $ticket: $message (skipped)"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ${NC} $message"
            ;;
    esac
}

# Function to check prerequisites
check_prerequisites() {
    echo ""
    print_status "INFO" "" "Checking prerequisites..."

    # Check Jira credentials
    if [ -z "$JIRA_EMAIL" ] || [ -z "$JIRA_API_TOKEN" ]; then
        echo ""
        echo -e "${RED}ERROR: Jira credentials not set${NC}"
        echo "Please set environment variables:"
        echo "  export JIRA_EMAIL=your-email@bounteous.com"
        echo "  export JIRA_API_TOKEN=your-api-token"
        echo ""
        return 1
    fi

    # Check AEM connection
    echo -n "  • Checking AEM on localhost:4502... "
    if timeout 5 curl -s http://localhost:4502 > /dev/null 2>&1; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${YELLOW}WARNING${NC} (AEM not responding - generation will fail)"
        echo "    Start AEM and try again: cd ~/AEM && ./start.sh"
        return 1
    fi

    # Check Playwright
    echo -n "  • Checking Playwright... "
    if npx playwright --version > /dev/null 2>&1; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}FAILED${NC}"
        echo "    Run: npm install"
        return 1
    fi

    echo ""
    return 0
}

# Function to generate tests for a single ticket
generate_ticket() {
    local ticket=$1
    local attempt=$2

    # Build command
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
        # Check if it's a timeout
        if [ $exit_code -eq 124 ]; then
            echo "Timeout after ${TIMEOUT}s" >> "$ticket_log"
        fi
        return 1
    fi
}

# Function to process a ticket with retries
process_ticket() {
    local ticket=$1
    local ticket_num=$2
    local attempt=1

    echo ""
    echo -e "${CYAN}[$ticket_num/$TOTAL_TICKETS]${NC} Processing $ticket..."

    while [ $attempt -le $MAX_RETRIES ]; do
        if generate_ticket "$ticket" $attempt; then
            print_status "SUCCESS" "$ticket" "Tests generated"
            ((GENERATED_COUNT++))
            return 0
        else
            if [ $attempt -lt $MAX_RETRIES ]; then
                print_status "RETRY" "$ticket" "Attempt $attempt failed, retrying..."
                sleep 5  # Wait before retry
            else
                print_status "FAILED" "$ticket" "Failed after $MAX_RETRIES attempts"
                FAILED_TICKETS+=("$ticket")
                ((FAILED_COUNT++))

                # Log error details
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

# Main processing loop
echo ""
echo -e "${BLUE}=== Starting Generation ===${NC}"
echo "Processing $TOTAL_TICKETS tickets (individually, for easy debugging)..."
echo ""

START_TIME=$(date +%s)
TICKETS_PROCESSED=0

for ticket in "${TICKETS[@]}"; do
    ((TICKETS_PROCESSED++))
    process_ticket "$ticket" "$TICKETS_PROCESSED"
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
    echo "Sprint 17 Test Generation - Completed: $(date)"
    echo ""
    echo "Results:"
    echo "  Total tickets: $TOTAL_TICKETS"
    echo "  Generated: $GENERATED_COUNT"
    echo "  Failed: $FAILED_COUNT"
    echo "  Success rate: $((GENERATED_COUNT * 100 / TOTAL_TICKETS))%"
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
        echo "  • View full logs: $LOG_DIR/"
        echo ""
        echo "To retry failed tickets:"
        echo "  for ticket in ${FAILED_TICKETS[@]}; do"
        echo "    JIRA_TICKET=\$ticket JIRA_EMAIL=... JIRA_API_TOKEN=... env=local npx playwright test generate-from-jira ..."
        echo "  done"
    fi

    echo "Logs:"
    echo "  • Main: $MAIN_LOG"
    echo "  • Errors: $ERROR_LOG"
    echo "  • Summaries: $LOG_DIR/"
    echo ""
    echo "Next steps:"
    echo "  1. Review generated tests:"
    echo "     find tests/specFiles/ga -name '*.spec.ts' -newer .claude -type f | head -10"
    echo ""
    echo "  2. Run quick validation (5-10 min):"
    echo "     npx playwright test --grep '@smoke' --project chromium --workers 4"
    echo ""
    echo "  3. View HTML test summaries:"
    echo "     ls tests/specFiles/ga/*/\*-test-summary.html"
    echo ""
} | tee -a "$MAIN_LOG"

# Print summary to terminal
echo ""
print_status "INFO" "" "Summary Report"
echo "  Generated: $GENERATED_COUNT / $TOTAL_TICKETS"
echo "  Failed: $FAILED_COUNT / $TOTAL_TICKETS"
echo "  Success rate: $(printf "%.1f" $(echo "scale=1; $GENERATED_COUNT * 100 / $TOTAL_TICKETS" | bc))%"
echo "  Duration: ${DURATION_MIN}m ${DURATION_SEC}s"
echo ""

if [ $FAILED_COUNT -eq 0 ]; then
    echo -e "${GREEN}All tickets processed successfully!${NC}"
    exit 0
else
    echo -e "${RED}$FAILED_COUNT tickets failed - see $ERROR_LOG for details${NC}"
    exit 1
fi
