# Sprint 18 - Batch Test Generation Guide

This guide explains how to generate Playwright tests for all 28 Sprint 18 Jira tickets (GAAM-1267 through GAAM-170).

## Quick Start

### Option 1: PowerShell Script (Recommended for Windows)

```powershell
# Dry run first (preview what will be generated)
.\scripts\batch-generate-sprint-18.ps1 -DryRun

# Actual generation with 6 workers
.\scripts\batch-generate-sprint-18.ps1 -Workers 6 -Environment local
```

### Option 2: Node.js Script (Cross-platform)

```bash
# Set Jira credentials (one-time)
$env:JIRA_API_TOKEN = "your-jira-token"

# Run batch generation
node scripts/batch-generate-sprint-18.js
```

### Option 3: Manual per-ticket with `/automate` command

For each ticket individually:
```
/automate jira GAAM-1267
/automate jira GAAM-1265
... (28 tickets total)
```

## 28 Sprint 18 Tickets

```
GAAM-1267  GAAM-1265  GAAM-1252  GAAM-1245  GAAM-1244  GAAM-1217
GAAM-1192  GAAM-1179  GAAM-1174  GAAM-1172  GAAM-1155  GAAM-1145
GAAM-1138  GAAM-1101  GAAM-1089  GAAM-1084  GAAM-1082  GAAM-1073
GAAM-1063  GAAM-1062  GAAM-1021  GAAM-989   GAAM-978   GAAM-903
GAAM-747   GAAM-450   GAAM-278   GAAM-170
```

## What Gets Generated

For each ticket, the system will generate:

### POMs (Page Object Models)
- `tests/pages/ga/components/<component>Page.ts`
- `tests/pages/ga/components/<component>Page.locators.json` (locator strategies)

### Spec Files (by category)
- **Author** — Basic functionality, happy-path, negative, responsive
- **Interaction** — Parent-child context, nesting behaviors
- **Matrix** — Combinatorial: variant × theme × background × viewport
- **Visual** — Figma design verification (if Figma link in ticket)
- **Images** — Broken images, alt text, oversized, CLS

### Fixtures (if needed)
- `tests/specFiles/ga/<component>/content-fixtures/<component>-fixtures.xml`
- JCR content for missing test scenarios

### Coverage
- Updated `tests/data/coverage-matrix.json` with new test counts

## Expected Output

After running batch generation, you'll have:

```
📊 Generation Summary
├─ 28 tickets processed
├─ ~15-25 unique components generated
├─ ~500+ spec files (depending on components)
├─ ~25 POMs created
├─ Coverage matrix updated
└─ Report: reports/sprint-18-generation-report.json
```

## Running the Generated Tests

After generation completes:

```bash
# Run all generated GA tests with 6 workers
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 6

# Run specific component
env=local npx playwright test tests/specFiles/ga/button/ --project chromium

# Run by tag (smoke tests only)
npx playwright test --grep @smoke --workers 6

# Run with specific environment
env=qa npx playwright test tests/specFiles/ga/ --project chromium
```

## Extract Failed Tests to Excel

After tests run and produce a Playwright HTML report:

```bash
# Extract all failures to Excel with detailed descriptions
node scripts/extract-failed-tests.js

# Output:
# - playwright-report/index.html (Playwright's interactive report)
# - reports/failed-tests-<timestamp>.xlsx (Excel with all failures + remediation steps)
```

## Workflow

```
1. Generate Tests (batch script or /automate)
   ↓
2. Review Generated Specs & POMs
   ↓
3. Run Tests with Playwright
   ↓
4. Extract Failures to Excel
   ↓
5. Fix Issues & Re-run
   ↓
6. Commit Changes
```

## File Structure After Generation

```
GATestFramework/
├── tests/
│   ├── pages/ga/components/
│   │   ├── buttonPage.ts
│   │   ├── buttonPage.locators.json
│   │   ├── formContainerPage.ts
│   │   └── ... (25 POMs)
│   │
│   ├── specFiles/ga/
│   │   ├── button/
│   │   │   ├── button.author.spec.ts
│   │   │   ├── button.interaction.spec.ts
│   │   │   ├── button.matrix.spec.ts
│   │   │   ├── button.visual.spec.ts
│   │   │   ├── button.images.spec.ts
│   │   │   └── button-test-summary.html
│   │   ├── form-container/
│   │   │   └── ... (5 spec categories)
│   │   └── ... (15-25 components)
│   │
│   └── data/
│       └── coverage-matrix.json (updated)
│
├── reports/
│   └── sprint-18-generation-report.json
│
├── playwright-report/
│   ├── index.html (after running tests)
│   └── ... (traces, screenshots)
│
└── tickets/
    ├── GAAM-1267-requirements.json
    ├── GAAM-1265-requirements.json
    └── ... (28 requirement files)
```

## Troubleshooting

### "AEM is not running"
```bash
# Solution: Start AEM author instance on localhost:4502
# OR use different environment:
env=qa npx playwright test ... # if AEM is running on QA
```

### "Locators not working"
```bash
# Check the locators in generated .locators.json file
# Or use Playwright Inspector to debug:
env=local npx playwright test <file> --debug
```

### "Tests taking too long"
```bash
# Reduce workers if CPU is maxed:
env=local npx playwright test tests/specFiles/ga/ --workers 4

# OR run only smoke tests:
npx playwright test --grep @smoke --workers 6
```

### "Excel extraction says no failures found"
```bash
# Check if tests actually ran and produced report:
ls -la playwright-report/

# If no report, run tests first:
env=local npx playwright test tests/specFiles/ga/ --workers 6
```

## Performance Tips

1. **Batch Size**: Process 3-5 tickets in parallel (default)
2. **Workers**: Use 6 workers for 6-core machines, adjust as needed
3. **Smoke Tests**: Use `@smoke` tag for quick feedback (~2 min)
4. **Full Suite**: Use `@regression` for complete coverage (~30 min)

## AEM Requirements

For local test generation and execution, you need:

- **AEM Author**: http://localhost:4502 (admin login)
- **Network**: Stable connection to Jira API
- **Storage**: ~500MB for generated specs, POMs, and test artifacts
- **RAM**: 4GB+ recommended for parallel test workers

## Jira Credentials

For bulk generation via Jira API:

```bash
# Set environment variable before running
$env:JIRA_API_TOKEN = "your-api-token"

# Get token from: https://bounteous.jira.com/secure/ViewProfile.jspa?tab=security
```

## Next Steps

1. **Generate**: Run batch generation script
2. **Test**: Execute generated tests
3. **Analyze**: Extract failures to Excel
4. **Fix**: Update components/tests as needed
5. **Commit**: Push changes to repo
6. **Report**: Share results with team

---

## Manual Individual Ticket Generation

If you prefer to process tickets one at a time:

```
/automate jira GAAM-1267
/automate jira GAAM-1265
... repeat for all 28
```

Each invocation will:
1. Fetch Jira ticket details
2. Check for Figma designs
3. Generate POM + spec files
4. Create content fixtures if needed
5. Update coverage matrix

## Advanced: Custom Filtering

To generate only specific categories:

```bash
# Only visual tests (skips author, interaction, matrix, images)
CATEGORIES=visual npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium

# Only accessibility tests
CATEGORIES=a11y npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium

# Multiple categories
CATEGORIES=author,interaction npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium
```

## Questions?

- Check `FAILED_TESTS_EXTRACTION.md` for failure analysis
- Check `EXCEL_EXAMPLE.md` for Excel report examples
- Check `repo-overview.md` for project architecture
- See `CLAUDE.md` for development conventions
