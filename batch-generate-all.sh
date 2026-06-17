#!/bin/bash

# Batch test generation for all 28 Jira tickets
# Processes each ticket sequentially using Playwright generator

TICKETS=(
  "GAAM-1267" "GAAM-1265" "GAAM-1252" "GAAM-1245" "GAAM-1244" "GAAM-1217"
  "GAAM-1192" "GAAM-1179" "GAAM-1174" "GAAM-1172" "GAAM-1155" "GAAM-1145"
  "GAAM-1138" "GAAM-1101" "GAAM-1089" "GAAM-1084" "GAAM-1082" "GAAM-1073"
  "GAAM-1063" "GAAM-1062" "GAAM-1021" "GAAM-989"  "GAAM-978"  "GAAM-903"
  "GAAM-747"  "GAAM-450"  "GAAM-278"  "GAAM-170"
)

export JIRA_URL="https://bounteous.jira.com"
export JIRA_USERNAME="am.puneeth@bounteous.com"
export JIRA_API_TOKEN="${JIRA_API_TOKEN:-REDACTED}"

PASSED=0
FAILED=0
START_TIME=$(date +%s)

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║       Batch Test Generation — ${#TICKETS[@]} Jira Tickets              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

for i in "${!TICKETS[@]}"; do
  TICKET="${TICKETS[$i]}"
  NUM=$((i + 1))
  TOTAL=${#TICKETS[@]}

  echo "[${NUM}/${TOTAL}] $TICKET..."

  export JIRA_TICKET="$TICKET"

  if env=dev npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium --workers 1 > /dev/null 2>&1; then
    echo "  ✅ $TICKET"
    ((PASSED++))
  else
    echo "  ❌ $TICKET"
    ((FAILED++))
  fi

  # Brief pause between tickets
  sleep 1
done

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                    BATCH GENERATION COMPLETE                       ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Results:"
echo "   ✅ Passed: $PASSED/${#TICKETS[@]}"
echo "   ❌ Failed: $FAILED/${#TICKETS[@]}"
echo ""
echo "⏱️ Duration: ${MINUTES}m ${SECONDS}s"
echo ""

# Count generated files
SPEC_COUNT=$(find tests/specFiles/ga -name "*.author.spec.ts" -type f | wc -l)
POM_COUNT=$(find tests/pages/ga/components -name "*.ts" -type f | wc -l)
HTML_COUNT=$(find tests/specFiles/ga -name "*-test-summary.html" -type f | wc -l)

echo "📁 Files Generated:"
echo "   Specs: $SPEC_COUNT"
echo "   POMs: $POM_COUNT"
echo "   HTML Summaries: $HTML_COUNT"
echo ""

if [ $FAILED -gt 0 ]; then
  echo "⚠️ Some tickets failed. Check logs for details."
  exit 1
else
  echo "✅ All tickets processed successfully!"
  exit 0
fi
