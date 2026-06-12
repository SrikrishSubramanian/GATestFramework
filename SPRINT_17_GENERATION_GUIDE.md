# Sprint 17 Test Generation Guide

## Overview

This guide walks through generating Playwright tests for all 54 Sprint 17 Jira tickets.

**Tickets**: 54 total  
**Expected output**: 40-50+ new test specs across 15-20 components  
**Estimated time**: 2-3 hours (automated)

---

## Sprint 17 Ticket List

### Group 1: Core Components (Tickets 1190-1043)
```
GAAM-1190  GAAM-1189  GAAM-1176  GAAM-1146  GAAM-1108
GAAM-1107  GAAM-1105  GAAM-1050  GAAM-1044  GAAM-1043
```

### Group 2: Interactive Components (Tickets 1041-1000)
```
GAAM-1041  GAAM-1029  GAAM-1014  GAAM-1007  GAAM-1006
GAAM-1005  GAAM-1004  GAAM-1003  GAAM-1002  GAAM-1001
GAAM-1000
```

### Group 3: Advanced Features (Tickets 992-853)
```
GAAM-992   GAAM-990   GAAM-986   GAAM-985   GAAM-980
GAAM-979   GAAM-977   GAAM-958   GAAM-951   GAAM-933
GAAM-906   GAAM-904   GAAM-899   GAAM-898   GAAM-897
GAAM-873   GAAM-872   GAAM-869   GAAM-866   GAAM-865
GAAM-862   GAAM-855   GAAM-853
```

### Group 4: Legacy & Edge Cases (Tickets 824-338)
```
GAAM-824   GAAM-823   GAAM-821   GAAM-815   GAAM-794
GAAM-753   GAAM-573   GAAM-469   GAAM-404   GAAM-338
```

---

## Generation Workflow

### Prerequisites

1. **Jira Access** (one of the following):
   - Jira API token (recommended for automation)
   - Jira username + password (less secure)
   - Use your email and a personal access token from Jira settings

2. **AEM Running** (required for POM generation)
   ```bash
   # Start AEM if not running
   # Expected: http://localhost:4502 (author instance)
   ```

3. **Environment Setup**
   ```bash
   # Set Jira credentials (choose one method)
   
   # Option A: API Token (recommended)
   export JIRA_EMAIL=your-email@bounteous.com
   export JIRA_API_TOKEN=your-token-from-jira-settings
   export JIRA_URL=https://bounteous.jira.com
   
   # Option B: Username + Password (less secure)
   export JIRA_USERNAME=your-email@bounteous.com
   export JIRA_PASSWORD=your-password
   export JIRA_URL=https://bounteous.jira.com
   ```

---

## Generation Method 1: Individual Ticket Processing (Safe, Recommended)

Process tickets one-by-one for better error handling and flexibility.

```bash
# For each ticket:
JIRA_TICKET=GAAM-1190 \
  JIRA_EMAIL=your-email@bounteous.com \
  JIRA_API_TOKEN=your-api-token \
  JIRA_URL=https://bounteous.jira.com \
  env=local npx playwright test generate-from-jira \
    --config playwright.generators.config.ts \
    --project chromium \
    --workers 1
```

**Advantages:**
- Can review and test each component independently
- Easy to identify which ticket caused issues
- Can pause/resume between tickets

**Workflow:**
```bash
#!/bin/bash
TICKETS=(GAAM-1190 GAAM-1189 GAAM-1176 ... GAAM-338)

for TICKET in "${TICKETS[@]}"; do
  echo "Processing $TICKET..."
  
  JIRA_TICKET=$TICKET \
    JIRA_EMAIL=your-email \
    JIRA_API_TOKEN=your-token \
    JIRA_URL=https://bounteous.jira.com \
    env=local npx playwright test generate-from-jira \
      --config playwright.generators.config.ts \
      --project chromium \
      --workers 1
  
  if [ $? -eq 0 ]; then
    echo "✓ $TICKET generated successfully"
  else
    echo "✗ $TICKET failed - check logs"
  fi
done
```

---

## Generation Method 2: Batch Processing (Fast)

Process all 54 tickets in one run (requires stable Jira connection).

```bash
# Comma-separated ticket list
JIRA_TICKETS="GAAM-1190,GAAM-1189,GAAM-1176,...,GAAM-338" \
  JIRA_EMAIL=your-email@bounteous.com \
  JIRA_API_TOKEN=your-api-token \
  JIRA_URL=https://bounteous.jira.com \
  env=local npx playwright test generate-from-jira \
    --config playwright.generators.config.ts \
    --project chromium \
    --workers 2
```

**Advantages:**
- Faster overall (2-3 hours vs 5+ hours sequential)
- Parallel processing across components
- Single test run output

**Disadvantages:**
- Harder to debug if something fails
- Can't easily resume if interrupted

---

## Generation Method 3: Using Requirements Reader (Most Robust)

Use the dev-agents-shared requirements-reader for batch Jira fetching.

```bash
# Step 1: Fetch all requirements in one go
# (Requires access to dev-agents-shared requirements-reader)
JIRA_TICKETS="GAAM-1190,GAAM-1189,...,GAAM-338" \
  node dev-agents-shared/fetch-requirements.js \
    --output .aem-developer/artifacts/sprint-17-requirements.json

# Step 2: Generate tests from the cached requirements
JIRA_JSON=.aem-developer/artifacts/sprint-17-requirements.json \
  env=local npx playwright test generate-from-jira \
    --config playwright.generators.config.ts \
    --project chromium \
    --workers 2
```

**Advantages:**
- Decouples Jira fetching from test generation
- Can reuse requirements JSON for multiple test runs
- Faster re-generation if something goes wrong

---

## Expected Output

### Generated Files

```
tests/specFiles/ga/
├── component-1/
│   ├── component-1.author.spec.ts       (CSV + category tests)
│   ├── component-1.interaction.spec.ts
│   ├── component-1.matrix.spec.ts
│   ├── component-1.visual.spec.ts
│   ├── component-1.images.spec.ts
│   ├── component-1-test-summary.html    (Self-contained HTML report)
│   └── content-fixtures/
│       └── component-1-fixtures.xml     (AEM content for testing)
├── component-2/
│   └── ... (same pattern)
└── ... (repeat for 15-20 components)

tests/pages/ga/components/
├── component-1Page.ts
├── component-1Page.locators.json
├── component-2Page.ts
├── component-2Page.locators.json
└── ... (POMs for each component)
```

### Test Counts

**Expected breakdown:**
- 40-50+ new spec files generated
- 2,000-3,000+ new test cases
- 15-20 new/updated components
- 10-15 content fixtures (for components needing specific states)

---

## Post-Generation Steps

### 1. Run Generated Tests

```bash
# Fast: chromium only (15-20 minutes with AEM)
./quick-test.sh chromium

# Full: all browsers (2-3 hours with AEM)
env=local npx playwright test tests/specFiles/ga/ --workers 2
```

### 2. Review Test Summary Pages

Each component gets a self-contained HTML summary:
```
tests/specFiles/ga/component-name/component-name-test-summary.html
```

Open in browser to review:
- Component metadata (Jira links, sources)
- Test count by category
- All test scenarios with IDs and tags
- Acceptance criteria coverage

### 3. Deploy Content Fixtures

For any component with `content-fixtures/<component>-fixtures.xml`:

1. Review the fixture file (check comments for what was added)
2. Merge into kkr-aem repo under `/style-guide/` or test-fixtures
3. Deploy to AEM
4. Re-run tests to verify all pass

```bash
# Example: Check if fixtures were generated
find tests/specFiles/ga -name "*-fixtures.xml" | wc -l
# Expected: 10-15 files
```

### 4. Update Documentation

1. Add Sprint 17 components to CLAUDE.md `AVAILABLE_COMPONENTS` list
2. Update team wiki with new component test coverage
3. Link Jira tickets to generated specs

---

## Troubleshooting

### Issue: "No JIRA_JSON or JIRA_TICKET provided"
**Cause**: Environment variables not set  
**Fix**: Set JIRA_TICKET and JIRA_* auth vars, or provide JIRA_JSON file path

### Issue: "Connection refused" to Jira
**Cause**: Invalid Jira URL or expired API token  
**Fix**: 
- Verify JIRA_URL is correct (https://bounteous.jira.com)
- Generate new API token from Jira settings
- Check network/firewall access to Jira

### Issue: "AEM auth failed" / "Connection refused" to localhost:4502
**Cause**: AEM not running  
**Fix**:
- Start AEM: `cd ~/AEM && ./start.sh`
- Wait 30-60 seconds for AEM to boot
- Verify: `curl http://localhost:4502` should return 302 redirect

### Issue: "Timeout waiting for element"
**Cause**: POM generation failed (selector mismatch)  
**Fix**:
- Verify AEM is fully loaded (check browser console)
- Run single component to isolate: `./quick-test.sh component my-component`
- Check component exists on style guide page

### Issue: Tests fail with "Playwright timeout"
**Cause**: Each test has 30-second timeout (we reduced it for performance)  
**Fix**:
- For failing tests, increase timeout: `--timeout 60000`
- Check CI environment has sufficient resources
- Consider running fewer workers: `--workers 1`

---

## Monitoring & Validation

### Check Generation Progress

```bash
# Count generated specs
find tests/specFiles/ga -name "*.spec.ts" -newer tests/specFiles/ga/button/ | wc -l

# Count new components
ls -d tests/specFiles/ga/*/  | wc -l

# Check coverage matrix updated
cat tests/data/coverage-matrix.json | jq '.components | length'
```

### Validate POMs

```bash
# Count generated POMs
ls tests/pages/ga/components/*Page.ts | wc -l

# Verify locator sidecars exist
ls tests/pages/ga/components/*.locators.json | wc -l
# Should be same count as POMs
```

### Test HTML Summaries

```bash
# List all generated summaries
find tests/specFiles/ga -name "*-test-summary.html"

# Open in browser (example)
open tests/specFiles/ga/component-name/component-name-test-summary.html
```

---

## Success Criteria

✅ Generation is successful when:
- [ ] All 54 tickets processed without critical errors
- [ ] 40-50+ new spec files generated
- [ ] 2,000-3,000+ new test cases added
- [ ] POMs generated for all referenced components
- [ ] HTML test summaries created for each component
- [ ] `npx playwright test --grep "@smoke" --project chromium` passes (5-10 min)
- [ ] Coverage matrix updated with new components
- [ ] All generated tests runnable (selectors match live AEM)

---

## Running Tests After Generation

### Quick Validation (Fast)
```bash
# Smoke tests only (5-10 minutes)
npx playwright test --grep "@smoke" --project chromium --workers 4
```

### Full Component Tests (Medium)
```bash
# All tests, one browser (20-30 minutes with AEM)
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 4
```

### CI-Ready (Slow, Comprehensive)
```bash
# All browsers, all tests (2-3 hours with AEM)
env=local npx playwright test tests/specFiles/ga/ --workers 2
```

---

## Next Steps

1. **Set up Jira credentials** (API token recommended)
2. **Verify AEM running** on localhost:4502
3. **Choose generation method** (individual, batch, or requirements-reader)
4. **Run generation** using one of the commands above
5. **Review generated specs** using HTML summaries
6. **Deploy content fixtures** to AEM as needed
7. **Run tests** to validate all selectors work
8. **Commit to git** and create PR for code review

---

## Estimated Timeline

| Step | Duration | Notes |
|------|----------|-------|
| Setup (Jira creds, AEM) | 5-10 min | One-time |
| Generate tests (batch) | 1-2 hours | With stable Jira connection |
| Verify generation | 10-15 min | Check logs for errors |
| Deploy fixtures | 30-60 min | Manual AEM merge |
| Run full test suite | 2-3 hours | First time (cache built) |
| Code review & merge | 30-60 min | Team review |
| **Total** | **4-7 hours** | Ready for CI/CD |

