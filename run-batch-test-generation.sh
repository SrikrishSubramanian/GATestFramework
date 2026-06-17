#!/bin/bash

# Batch test generation for 29 Jira tickets
# Generates POMs, specs, and HTML summaries for all components

set -e

TICKETS=(
  "GAAM-1267" "GAAM-1265" "GAAM-1252" "GAAM-1245" "GAAM-1244" "GAAM-1217"
  "GAAM-1192" "GAAM-1179" "GAAM-1174" "GAAM-1172" "GAAM-1155" "GAAM-1145"
  "GAAM-1138" "GAAM-1101" "GAAM-1089" "GAAM-1084" "GAAM-1082" "GAAM-1073"
  "GAAM-1063" "GAAM-1062" "GAAM-1021" "GAAM-989"  "GAAM-978"  "GAAM-903"
  "GAAM-747"  "GAAM-450"  "GAAM-278"  "GAAM-170"
)

JIRA_URL="https://bounteous.jira.com"
JIRA_USERNAME="am.puneeth@bounteous.com"
if [ -z "$JIRA_API_TOKEN" ]; then
  echo "❌ Error: JIRA_API_TOKEN environment variable not set"
  exit 1
fi

# Use dev environment for now since local AEM is not fully initialized
ENV="${1:-dev}"

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║          Batch Test Generation — ${#TICKETS[@]} Jira Tickets              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Configuration:"
echo "   Environment: $ENV"
echo "   Jira URL: $JIRA_URL"
echo "   Tickets: ${#TICKETS[@]}"
echo ""

PASSED=0
FAILED=0
FAILED_TICKETS=()
COMPONENTS_GENERATED=()

for i in "${!TICKETS[@]}"; do
  TICKET="${TICKETS[$i]}"
  TICKET_NUM=$((i + 1))
  TOTAL=${#TICKETS[@]}

  echo ""
  echo "[${TICKET_NUM}/${TOTAL}] Generating tests for $TICKET..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if env=$ENV \
    JIRA_TICKET="$TICKET" \
    JIRA_URL="$JIRA_URL" \
    JIRA_USERNAME="$JIRA_USERNAME" \
    JIRA_API_TOKEN="$JIRA_API_TOKEN" \
    npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium --workers 1 2>&1 | tee -a batch-generation.log; then
    echo "✅ SUCCESS: $TICKET"
    ((PASSED++))
  else
    echo "❌ FAILED: $TICKET"
    ((FAILED++))
    FAILED_TICKETS+=("$TICKET")
  fi

  # Brief pause between requests
  sleep 2
done

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                      BATCH GENERATION SUMMARY                      ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Results:"
echo "   ✅ Passed: $PASSED/${#TICKETS[@]}"
echo "   ❌ Failed: $FAILED/${#TICKETS[@]}"

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "Failed tickets:"
  for ticket in "${FAILED_TICKETS[@]}"; do
    echo "   - $ticket"
  done
fi

echo ""
echo "📁 Generated files:"
find tests/specFiles/ga -name "*.spec.ts" -newer run-batch-test-generation.sh 2>/dev/null | wc -l | xargs echo "   Spec files:"
find tests/pages/ga/components -name "*.ts" -newer run-batch-test-generation.sh 2>/dev/null | wc -l | xargs echo "   POM files:"
find tests/specFiles/ga -name "*-test-summary.html" -newer run-batch-test-generation.sh 2>/dev/null | wc -l | xargs echo "   HTML summaries:"

echo ""
echo "📄 Full log: batch-generation.log"
echo ""

if [ $FAILED -gt 0 ]; then
  exit 1
else
  exit 0
fi
