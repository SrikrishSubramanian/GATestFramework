# Failed Tests Extraction to Excel

Automatically extract failed test cases from Playwright HTML reports and generate Excel files with detailed failure information.

## Setup

### 1. Install ExcelJS dependency
```bash
npm install
```

## Usage

### Step 1: Run Your Tests
Run tests with Playwright reporter enabled (this is the default):

```bash
# Run all GA tests
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 6

# Or run specific component
env=local npx playwright test tests/specFiles/ga/button/ --project chromium

# Or run by tag
npx playwright test --grep @smoke

# Or run entire suite
npx playwright test
```

This generates a Playwright HTML report in `playwright-report/` directory.

### Step 2: Extract Failed Tests to Excel
After tests complete, run the extraction script:

```bash
node scripts/extract-failed-tests.js
```

## Output

The script generates:

### 1. **Playwright HTML Report** (unchanged)
- Location: `playwright-report/index.html`
- Standard Playwright interactive report
- Can view detailed test logs, screenshots, traces

### 2. **Excel Report** (new)
- Location: `reports/failed-tests-<timestamp>.xlsx`
- Two sheets:
  - **Failed Tests**: Detailed list of all failed tests
  - **Summary**: Statistics and breakdown by component/browser

## Excel Report Details

### Failed Tests Sheet
Each row contains comprehensive failure information:

| Column | Description |
|--------|-------------|
| **Test ID** | Auto-generated ID (FT-0001, FT-0002, etc.) |
| **Test Name** | Full test name |
| **Component** | Component being tested (button, feature-banner, etc.) |
| **Test Path** | Full path in test hierarchy (file > suite > test name) |
| **Status** | failed (red) or timedOut (orange) |
| **Primary Error** | Main error message that caused failure |
| **Assertion Failed** | What assertion/check failed (e.g., "Element Not Found", "Timeout") |
| **Expected Value** | What the test expected (for assertion failures) |
| **Actual Value** | What actually happened in the test |
| **Failure Location** | Exact file location and line number where test failed |
| **Error Stack Trace** | Full stack trace for debugging |
| **Remediation Steps** | Suggested steps to fix the issue |
| **Duration (ms)** | How long the test ran before failing |
| **Browser** | Which browser (chromium, firefox, webkit, Mobile-Chrome, Mobile-Safari) |
| **Retries** | How many times the test was retried |
| **Screenshot** | Whether a screenshot was captured for this failure |
| **Report Link** | Clickable link to view test details in Playwright HTML report |

### Summary Sheet
Quick overview with:
- Total failed test count
- Breakdown by status
- Breakdown by component (most to least failures)
- Breakdown by browser project

## Example Workflow

```bash
# 1. Run all tests with 6 workers for faster execution
env=local npx playwright test tests/specFiles/ga/ --project chromium --workers 6

# 2. Open Playwright report for initial review
# Opens: playwright-report/index.html

# 3. Extract failed tests to Excel
node scripts/extract-failed-tests.js

# 4. Now you have two reports:
# - playwright-report/index.html (interactive, full details)
# - reports/failed-tests-*.xlsx (Excel, easy filtering/sorting)
```

## Tips

### Filter & Sort in Excel
- Use Excel's AutoFilter to filter by:
  - Component (which feature has most failures)
  - Status (failed vs timedOut)
  - Browser Project (which browser is problematic)
  - Duration (slow tests)

### Analyze Patterns
- **By Component**: Which component has the most failures?
- **By Browser**: Does it fail only on mobile? Only Firefox?
- **By Error Message**: Are there repeated errors?
- **By Duration**: Did tests timeout?

### Quick Stats
- The Summary sheet gives you counts by:
  - Component affected
  - Browser project
  - Failure status

## Integration with CI/CD

You can add to your CI/CD pipeline:

```bash
# After tests
node scripts/extract-failed-tests.js

# Then upload reports
# Both to Slack, Teams, email, etc.
```

## Troubleshooting

### "No playwright-report directory found"
- Make sure tests actually ran: `npx playwright test`
- Reports are only generated if tests run

### "No index.json found in playwright-report"
- Playwright report structure changed
- Run tests again to regenerate report

### Excel file is empty
- Tests passed (no failures)
- Check Playwright HTML report to verify

## Understanding Failure Descriptions

### Common Failure Patterns

#### 1. **Element Not Found**
- **Assertion Failed**: Element Not Found
- **Primary Cause**: Locator strategy failed to find the element
- **Suggested Steps**:
  1. Verify locator CSS/XPath is correct
  2. Check if element is in DOM (open DevTools in test)
  3. Wait for dynamic content to load
  4. Check for visibility issues (hidden/off-screen)

#### 2. **Timeout Errors**
- **Assertion Failed**: Timeout - Element or action did not complete
- **Primary Cause**: Action took longer than allowed timeout
- **Suggested Steps**:
  1. Check network speed/latency
  2. Increase timeout value in playwright.config.ts
  3. Verify element/resource exists on page
  4. Check browser console for JavaScript errors
  5. Check AEM author/publish for availability

#### 3. **Value Assertion Failed**
- **Expected Value**: "Press here"
- **Actual Value**: "Click here"
- **Primary Cause**: Element has different text/value than expected
- **Suggested Steps**:
  1. Verify test data in UI matches expectations
  2. Check API response data
  3. Validate test expectations are correct
  4. Look for data formatting/internationalization issues

#### 4. **Cannot Click Element**
- **Assertion Failed**: Interaction Failed - Cannot Click
- **Primary Cause**: Element exists but cannot be clicked
- **Suggested Steps**:
  1. Check if element is enabled (disabled attribute)
  2. Look for overlays/modals blocking the element
  3. Verify page is fully loaded
  4. Scroll element into view
  5. Check CSS pointer-events property

#### 5. **Navigation Failed**
- **Assertion Failed**: Navigation Failed
- **Primary Cause**: Unable to navigate to target URL
- **Suggested Steps**:
  1. Verify target URL is accessible
  2. Check network connectivity
  3. Verify redirect chains work
  4. Check authentication/session status
  5. Verify BASE_URL in .env file is correct

### Using Failure Location

The **Failure Location** column shows:
```
tests/specFiles/ga/button/button.author.spec.ts:45 - test.expect
```

This tells you:
- **File**: `tests/specFiles/ga/button/button.author.spec.ts`
- **Line**: 45
- **Function**: `test.expect`

Use this to:
1. Open the exact line in your editor
2. Review what the test expected
3. Check if the assertion is correct

### Filtering & Analysis Tips

**In Excel, use AutoFilter to:**

1. **Find Most Common Failures**
   - Filter "Assertion Failed" column
   - Count duplicates
   - Fix the most common issue first

2. **Group by Browser**
   - Filter by Browser column
   - Does failure happen only on mobile? Only Firefox?
   - Check browser-specific CSS/JavaScript

3. **Find Timeout Issues**
   - Filter Status for "timedOut"
   - Review "Duration (ms)" - are they all ~30s?
   - Increase timeout or improve page load

4. **Check Remediation Steps**
   - Copy remediation steps into a task list
   - Prioritize by frequency
   - Delegate to team members

## Notes

- Script reads the Playwright JSON report (`playwright-report/index.json`)
- Failed tests include both `failed` and `timedOut` statuses
- Component name is extracted from test file path
- Error analysis is automatic - suggests fixes based on error type
- Links in Excel point to test in Playwright HTML report
- Excel file is created in `reports/` directory with timestamp
- Screenshots are captured automatically for failures (check HTML report)
