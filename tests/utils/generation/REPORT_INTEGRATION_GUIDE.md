# Test Execution Report Integration Guide

## Overview

The reporting system captures detailed test execution data and generates comprehensive HTML reports with both summary and detailed views.

## Components

### 1. **ExecutionTracker** (`test-execution-tracker.ts`)
Captures real-time test execution data during Playwright runs.

**Usage:**
```typescript
import { ExecutionTracker, TestCaseExecution } from './test-execution-tracker';

const tracker = new ExecutionTracker('local', ['chromium']);

// Record each test execution
tracker.recordTestExecution({
  testId: 'BTN-001',
  testName: 'Button should render with correct text',
  component: 'button',
  category: 'happy-path',
  tags: ['@smoke', '@regression', '@a11y'],
  status: 'passed',
  duration: 1234,
  startTime: new Date().toISOString(),
  endTime: new Date().toISOString(),
  browser: 'chromium',
  viewport: '1440x900'
});

// Save report as JSON
const reportPath = tracker.saveReport('tests/data/reports');

// Or generate report object
const report = tracker.generateReport();
```

### 2. **DetailedReportGenerator** (`detailed-report-generator.ts`)
Generates beautiful HTML reports from test execution data.

**Usage:**
```typescript
import { ExecutionTracker } from './test-execution-tracker';
import { DetailedReportGenerator } from './detailed-report-generator';

const tracker = new ExecutionTracker('local', ['chromium']);
// ... record tests ...

const report = tracker.generateReport();
const generator = new DetailedReportGenerator(report);
const htmlReportPath = generator.saveReport('tests/data/reports');
```

## Integration with Playwright Tests

### Option 1: Custom Reporter Hook

Create a custom Playwright reporter:

```typescript
// tests/utils/infra/custom-execution-reporter.ts
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { ExecutionTracker } from '../generation/test-execution-tracker';
import { DetailedReportGenerator } from '../generation/detailed-report-generator';

export class ExecutionReporter implements Reporter {
  private tracker: ExecutionTracker;

  constructor(options: { env?: string; browsers?: string[] } = {}) {
    this.tracker = new ExecutionTracker(options.env || 'local', options.browsers || ['chromium']);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const component = this.extractComponent(test.file);
    const category = this.extractCategory(test.title);

    this.tracker.recordTestExecution({
      testId: test.id,
      testName: test.title,
      component,
      category,
      tags: this.extractTags(test.title),
      status: result.status as any,
      duration: result.duration,
      startTime: new Date(result.startTime).toISOString(),
      endTime: new Date(result.startTime + result.duration).toISOString(),
      browser: test.parent?.project?.name || 'unknown',
      viewport: this.extractViewport(test),
      error: result.errors?.[0] ? {
        message: result.errors[0].message,
        stack: result.errors[0].stack,
        failureType: this.getFailureType(result),
        failedLine: this.extractFailedLine(result.errors[0].stack)
      } : undefined,
      screenshots: result.attachments
        ?.filter(a => a.mimeType.startsWith('image'))
        .map(a => a.path) || []
    });
  }

  onEnd() {
    // Save JSON report
    this.tracker.saveReport('tests/data/reports');

    // Generate HTML report
    const report = this.tracker.generateReport();
    const generator = new DetailedReportGenerator(report);
    const htmlPath = generator.saveReport('tests/data/reports');

    console.log(`\n✅ Test reports generated:`);
    console.log(`   📊 HTML Report: ${htmlPath}`);
    console.log(`   📈 JSON Report: tests/data/reports/test-run-${this.tracker.runId}.json`);
  }

  private extractComponent(filePath: string): string {
    const match = filePath.match(/\/ga\/([^/]+)\//);
    return match ? match[1] : 'unknown';
  }

  private extractCategory(title: string): string {
    if (title.includes('interaction')) return 'interaction';
    if (title.includes('matrix')) return 'state-matrix';
    if (title.includes('visual')) return 'visual';
    if (title.includes('image')) return 'broken-images';
    return 'happy-path';
  }

  private extractTags(title: string): string[] {
    const tags: string[] = [];
    if (title.includes('smoke')) tags.push('@smoke');
    if (title.includes('regression')) tags.push('@regression');
    if (title.includes('a11y') || title.includes('accessible')) tags.push('@a11y');
    if (title.includes('mobile')) tags.push('@mobile');
    if (title.includes('visual')) tags.push('@visual');
    return tags;
  }

  private extractViewport(test: TestCase): string {
    return test.parent?.project?.use?.viewport?.width + 'x' + test.parent?.project?.use?.viewport?.height;
  }

  private getFailureType(result: TestResult): 'assertion' | 'timeout' | 'error' | 'unknown' {
    if (result.status === 'timedOut') return 'timeout';
    if (result.errors?.[0]?.message.includes('expect')) return 'assertion';
    return 'error';
  }

  private extractFailedLine(stack?: string): string | undefined {
    if (!stack) return undefined;
    const lines = stack.split('\n');
    return lines.find(l => l.includes('test') || l.includes('spec'))?.trim();
  }
}
```

### Option 2: Manual Integration in Test Setup

```typescript
// In your test file or global setup
import { ExecutionTracker } from '../utils/generation/test-execution-tracker';

let tracker: ExecutionTracker;

export async function globalSetup() {
  tracker = new ExecutionTracker(process.env.env || 'local', ['chromium']);
}

export async function globalTeardown() {
  tracker.saveReport('tests/data/reports');
  const report = tracker.generateReport();
  const generator = new DetailedReportGenerator(report);
  generator.saveReport('tests/data/reports');
}
```

## Report Output Structure

```
tests/data/reports/
├── test-run-<runId>.json          # Execution data (JSON)
└── test-report-<runId>.html       # Visual report (HTML with charts)
```

## Report Features

### Summary Tab
- **Overall Statistics**: Total, passed, failed, skipped counts
- **Pass Rate**: By component, category, and tag
- **Charts**: Status distribution, category breakdown
- **Metadata**: Run ID, environment, browsers, execution time

### Components Tab
- **Component Breakdown**: Individual performance per component
- **Failed Tests List**: Quick view of failures per component
- **Duration**: Total and average per component

### Failures Tab
- **Detailed Failure Info**: Error message, stack trace, expected vs actual
- **Failure Location**: Which test case failed, when, where in code
- **Browser/Viewport**: Context for failure reproduction

### Tag Analysis Tab
- **Tag Coverage**: How many tests per tag, pass rate
- **Cross-Component Analysis**: Which tags need work

### Test Details Tab
- **Complete Test List**: All 853+ tests with status, duration, tags
- **Filterable Table**: Search and sort capabilities

## Example Report JSON Structure

```json
{
  "runId": "run_1234567890_abc123",
  "timestamp": "2026-05-31T10:30:00.000Z",
  "environment": "local",
  "browsers": ["chromium"],
  "executionDuration": 180000,
  "summary": {
    "totalTests": 853,
    "passedTests": 820,
    "failedTests": 15,
    "skippedTests": 18,
    "passRate": "96.1%",
    "averageTestDuration": 211
  },
  "componentBreakdown": [
    {
      "component": "button",
      "status": "partial",
      "totalTests": 317,
      "passCount": 310,
      "failCount": 7,
      "skippedCount": 0,
      "passRate": "97.8%",
      "totalDuration": 67140,
      "tests": [...]
    }
  ],
  "failedTests": [
    {
      "testId": "BTN-045",
      "testName": "Button should show hover state on desktop",
      "component": "button",
      "category": "state-matrix",
      "status": "failed",
      "duration": 2134,
      "browser": "chromium",
      "error": {
        "message": "expect(locator).toBeVisible() timeout",
        "failureType": "timeout",
        "failedLine": "await expect(hoverState).toBeVisible();"
      }
    }
  ],
  "tagCoverage": {
    "@smoke": { "total": 120, "passed": 118, "failed": 2, "passRate": "98.3%" },
    "@regression": { "total": 680, "passed": 650, "failed": 30, "passRate": "95.6%" }
  }
}
```

## Configuration in playwright.config.ts

```typescript
const config: PlaywrightTestConfig = {
  // ... other config ...
  reporter: [
    ['html'],
    [
      require.resolve('./tests/utils/infra/custom-execution-reporter'),
      { env: process.env.env || 'local', browsers: ['chromium', 'webkit'] }
    ]
  ]
};
```

## Running Tests with Reports

```bash
# Run with execution tracking
env=local npx playwright test tests/specFiles/ga/ --project chromium

# Reports generated in: tests/data/reports/
# - test-run-<runId>.json (machine-readable)
# - test-report-<runId>.html (human-readable)
```

## Key Features

✅ **Detailed Test Tracking**
- Every test case captures: status, duration, error details, browser, viewport

✅ **Component Analysis**
- Pass rate per component
- Failed test list per component
- Total execution time per component

✅ **Failure Details**
- Error message and stack trace
- Expected vs actual values
- Failed code line
- Failure type (assertion, timeout, error)

✅ **Visual Charts**
- Status distribution (pie chart)
- Pass rate by category (bar chart)
- Tag coverage analysis
- Component health scores

✅ **Summary + Details**
- Executive summary for quick overview
- Drill-down into specific tests
- Single HTML file for easy sharing

## Accessing Reports

Reports are generated in `tests/data/reports/`:
- Open the `.html` file in any web browser
- JSON reports can be parsed for CI/CD integration
- Share with team via the HTML file

---

**Next Steps**: Integrate the `ExecutionReporter` into `playwright.config.ts` to automatically generate reports on every test run!
