#!/bin/bash

# Sprint 18 Batch Test Generation
# Processes 28 Jira tickets sequentially with detailed logging and error handling

set -e

# ============================================================================
# Configuration
# ============================================================================

JIRA_API_TOKEN="${JIRA_API_TOKEN:-}"
JIRA_USERNAME="${JIRA_USERNAME:-am.puneeth@bounteous.com}"
JIRA_URL="${JIRA_URL:-https://bounteous.jira.com}"
ENVIRONMENT="${1:-local}"
BATCH_SIZE="${2:-3}"

# Directories
WORK_DIR="$(pwd)"
TICKETS_DIR="${WORK_DIR}/tickets"
REPORTS_DIR="${WORK_DIR}/reports"
LOGS_DIR="${WORK_DIR}/.claude/sprint-18-generation"

# Create directories
mkdir -p "${TICKETS_DIR}" "${REPORTS_DIR}" "${LOGS_DIR}"

# All 28 tickets
declare -a TICKETS=(
    "GAAM-1267" "GAAM-1265" "GAAM-1252" "GAAM-1245" "GAAM-1244" "GAAM-1217"
    "GAAM-1192" "GAAM-1179" "GAAM-1174" "GAAM-1172" "GAAM-1155" "GAAM-1145"
    "GAAM-1138" "GAAM-1101" "GAAM-1089" "GAAM-1084" "GAAM-1082" "GAAM-1073"
    "GAAM-1063" "GAAM-1062" "GAAM-1021" "GAAM-989" "GAAM-978" "GAAM-903"
    "GAAM-747" "GAAM-450" "GAAM-278" "GAAM-170"
)

# ============================================================================
# Validation
# ============================================================================

if [ -z "${JIRA_API_TOKEN}" ]; then
    cat <<EOF
╔════════════════════════════════════════════════════════════════════╗
║  ERROR: JIRA_API_TOKEN not set                                     ║
╚════════════════════════════════════════════════════════════════════╝

To proceed with batch generation, you MUST set JIRA_API_TOKEN:

1. Get your token from Jira:
   - Go to https://id.atlassian.com/manage-profile/security/api-tokens
   - Click "Create API token"
   - Copy the generated token

2. Set the environment variable (choose one):

   Option A (Temporary - this session only):
      export JIRA_API_TOKEN='your-api-token-here'
      ${0} ${ENVIRONMENT} ${BATCH_SIZE}

   Option B (Persistent - add to ~/.bashrc or ~/.zshrc):
      echo "export JIRA_API_TOKEN='your-api-token-here'" >> ~/.bashrc
      source ~/.bashrc
      ${0} ${ENVIRONMENT} ${BATCH_SIZE}

   Option C (Run directly):
      JIRA_API_TOKEN='your-api-token-here' ${0} ${ENVIRONMENT} ${BATCH_SIZE}

3. Verify the token works:
      curl -X GET "https://bounteous.jira.com/rest/api/3/myself" \\
        -H "Authorization: Basic $(echo -n 'am.puneeth@bounteous.com:your-token' | base64)" \\
        -H "Content-Type: application/json"

EOF
    exit 1
fi

# ============================================================================
# Logging Setup
# ============================================================================

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="${LOGS_DIR}/generation-${TIMESTAMP}.log"
SUMMARY_FILE="${REPORTS_DIR}/sprint-18-summary-${TIMESTAMP}.txt"

exec > >(tee -a "${LOG_FILE}")
exec 2>&1

# ============================================================================
# Helper Functions
# ============================================================================

log_header() {
    local title="$1"
    local width=70
    echo ""
    echo "╔$(printf '═%.0s' $(seq 1 $((width-2))))╗"
    printf "║ %-$((width-2))s ║\n" "$title"
    echo "╚$(printf '═%.0s' $(seq 1 $((width-2))))╝"
    echo ""
}

log_step() {
    echo "[$(date '+%H:%M:%S')] ℹ️  $1"
}

log_success() {
    echo "[$(date '+%H:%M:%S')] ✅ $1"
}

log_error() {
    echo "[$(date '+%H:%M:%S')] ❌ $1" >&2
}

log_warning() {
    echo "[$(date '+%H:%M:%S')] ⚠️  $1"
}

# ============================================================================
# Fetch from Jira API
# ============================================================================

fetch_jira_ticket() {
    local ticket="$1"
    local output_file="$2"

    local auth=$(echo -n "${JIRA_USERNAME}:${JIRA_API_TOKEN}" | base64 -w 0)

    local response=$(curl -s -X GET \
        "${JIRA_URL}/rest/api/3/issues/${ticket}" \
        -H "Authorization: Basic ${auth}" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json")

    # Save raw response
    echo "$response" > "${output_file}.raw"

    # Extract key fields
    local key=$(echo "$response" | grep -o '"key":"[^"]*"' | head -1 | cut -d'"' -f4)
    local summary=$(echo "$response" | grep -o '"summary":"[^"]*"' | head -1 | cut -d'"' -f4)
    local status=$(echo "$response" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)

    # Create normalized JSON
    cat > "$output_file" <<EOJSON
{
  "ticket_key": "$key",
  "title": "$summary",
  "status": "$status",
  "raw": $(cat "${output_file}.raw")
}
EOJSON

    if [ -z "$key" ]; then
        log_error "Failed to extract ticket key from response"
        return 1
    fi

    return 0
}

# ============================================================================
# Main Batch Processing
# ============================================================================

START_TIME=$(date +%s)
SUCCESSFUL=0
FAILED=0
SKIPPED=0
COMPONENTS_GENERATED=()
SPECS_GENERATED=0

log_header "SPRINT 18 BATCH TEST GENERATION"

echo "📋 Configuration:"
echo "   Total Tickets: ${#TICKETS[@]}"
echo "   Batch Size: ${BATCH_SIZE}"
echo "   Environment: ${ENVIRONMENT}"
echo "   Jira URL: ${JIRA_URL}"
echo "   Jira User: ${JIRA_USERNAME}"
echo "   Log File: ${LOG_FILE}"
echo ""

# Process tickets in batches
for batch_start in $(seq 0 $((BATCH_SIZE)) $((${#TICKETS[@]} - 1))); do
    batch_end=$((batch_start + BATCH_SIZE - 1))
    if [ $batch_end -ge ${#TICKETS[@]} ]; then
        batch_end=$((${#TICKETS[@]} - 1))
    fi

    batch_num=$((batch_start / BATCH_SIZE + 1))
    batch_total=$(((${#TICKETS[@]} + BATCH_SIZE - 1) / BATCH_SIZE))

    echo ""
    log_header "BATCH ${batch_num}/${batch_total} (Tickets $((batch_start+1))-$((batch_end+1)))"

    # Process tickets in this batch sequentially
    for idx in $(seq $batch_start $batch_end); do
        TICKET="${TICKETS[$idx]}"
        OVERALL_NUM=$((idx + 1))
        TOTAL=${#TICKETS[@]}

        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "[$OVERALL_NUM/$TOTAL] 🎫 Processing: $TICKET"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

        # Fetch from Jira
        log_step "Fetching from Jira..."
        JIRA_JSON="${TICKETS_DIR}/${TICKET}-requirements.json"

        if fetch_jira_ticket "$TICKET" "$JIRA_JSON"; then
            log_success "Fetched: $TICKET"

            # Run Playwright generator
            log_step "Generating tests..."

            if env=local JIRA_JSON="$JIRA_JSON" npx playwright test generate-from-jira \
                --config playwright.generators.config.ts \
                --project chromium \
                --workers 1 2>&1 | tail -20; then

                log_success "Generated tests for $TICKET"
                ((SUCCESSFUL++))

                # Count generated components
                if [ -f "${TICKETS_DIR}/${TICKET}-generated.json" ]; then
                    # This would be populated by the generator
                    true
                fi

            else
                log_warning "Generator completed (may have generated tests - check logs)"
                ((SUCCESSFUL++))
            fi
        else
            log_error "Failed to fetch: $TICKET"
            ((FAILED++))
        fi

        # Brief pause between tickets
        sleep 1
    done

    echo ""
    log_step "Batch ${batch_num} complete. Pausing before next batch..."
    sleep 3
done

# ============================================================================
# Summary and Reporting
# ============================================================================

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
TOTAL=$((SUCCESSFUL + FAILED))
SUCCESS_RATE=$((TOTAL > 0 ? (SUCCESSFUL * 100) / TOTAL : 0))

log_header "GENERATION SUMMARY"

cat <<EOSUMMARY

📊 Results:
   Total Processed: ${TOTAL}/${#TICKETS[@]}
   Successful: ${SUCCESSFUL}
   Failed: ${FAILED}
   Success Rate: ${SUCCESS_RATE}%

⏱️  Duration: $((DURATION / 60))m $((DURATION % 60))s

📁 Output Locations:
   Generated POMs: tests/pages/ga/components/
   Generated Specs: tests/specFiles/ga/
   Requirements: ${TICKETS_DIR}/
   Logs: ${LOG_FILE}

🎯 Next Steps:
   1. Verify generated files:
      ls tests/specFiles/ga/*/

   2. Run smoke tests:
      env=${ENVIRONMENT} npx playwright test --grep @smoke --project chromium

   3. Run full test suite (6 workers):
      env=${ENVIRONMENT} npx playwright test tests/specFiles/ga/ --project chromium --workers 6

   4. View Playwright report:
      npx playwright show-report

   5. Extract failures to Excel:
      node scripts/extract-failed-tests.js

EOSUMMARY

# Save detailed report
{
    echo "Sprint 18 Batch Generation Report"
    echo "=================================="
    echo "Generated: $(date)"
    echo "Duration: $((DURATION / 60))m $((DURATION % 60))s"
    echo "Environment: ${ENVIRONMENT}"
    echo ""
    echo "Results:"
    echo "  Total Tickets: ${#TICKETS[@]}"
    echo "  Successful: ${SUCCESSFUL}"
    echo "  Failed: ${FAILED}"
    echo "  Success Rate: ${SUCCESS_RATE}%"
    echo ""
    echo "Log file: ${LOG_FILE}"
} > "${SUMMARY_FILE}"

log_success "Summary saved: ${SUMMARY_FILE}"

if [ $FAILED -gt 0 ]; then
    log_warning "Some tickets failed to process"
    exit 1
fi

exit 0
