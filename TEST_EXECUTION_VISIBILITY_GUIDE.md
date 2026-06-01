# Test Execution Visibility Guide

## 🎯 Overview

This guide shows you how to see **exactly what tests are running, what they're testing, and detailed step-by-step execution**.

## 📊 Three Levels of Visibility

### Level 1: Console Output (Real-Time)
See tests running in real-time as they execute

### Level 2: Detailed Logs
Save detailed execution logs to file

### Level 3: Visual Report
Interactive HTML report with all test details

---

## 🚀 Quick Start

### Run Tests with Visible Execution

```bash
cd C:\Users\PuneethAM\GATestFramework-main

# Run tests - you'll see detailed execution output
env=local npx playwright test tests/specFiles/ga/button/ --project chromium
```

**Console Output (Real-Time):**
```
════════════════════════════════════════════════════════════════════════════════
🧪 TEST START [BTN-001] - Button should render with correct text
📦 Component button
📋 Category happy-path
🏷️  Tags @smoke, @regression
🌐 Browser chromium desktop
⏱️  Started 14:30:45

⏳ STEP: Navigate to button page
   Action Navigate to http://localhost:4503/button.html

✅ STEP: Button visible
   Action Wait for element .button.primary to be visible
   Assertion Element should be in viewport

✅ ASSERTION: Text content
   Expected: "Click me"
   Actual: "Click me"

✅ STEP: Button clickable
   Action Check if button is enabled
   Assertion Button should be enabled

🧪 TEST END ✅ PASSED
⏱️  Duration 1245ms
📊 Steps Executed 3
📝 Assertions 2

════════════════════════════════════════════════════════════════════════════════
```

---

## 📝 Using Verbose Logger in Tests

### Example 1: Simple Test with Logging

```typescript
import { test } from '@playwright/test';
import { VerboseTestLogger } from '../utils/infra/verbose-test-logger';
import { ButtonPage } from '../pages/ga/components/buttonPage';

test('[BTN-001] Button should render with text', async ({ page, browserName }, testInfo) => {
  // Initialize logger
  const logger = new VerboseTestLogger();
  logger.startTest(testInfo, browserName, '1440x900');

  try {
    // Create POM
    const button = new ButtonPage(page);

    // Step 1: Navigate
    logger.logStep('Navigate to button page', 'Go to button.html');
    await button.navigate('http://localhost:4503');
    logger.logStep('Navigate to button page', 'Go to button.html', undefined, 'passed');

    // Step 2: Check visibility
    logger.logStep(
      'Button visible',
      'Wait for .button.primary to be visible'
    );
    await expect(button.primaryButton).toBeVisible();
    logger.logAssertion(
      'Button is visible',
      'Element in viewport',
      'Element found and visible',
      true
    );
    logger.logStep('Button visible', 'Wait for element', undefined, 'passed');

    // Step 3: Check text
    logger.logStep(
      'Button text',
      'Get button text content',
      'Should be "Click me"'
    );
    const text = await button.primaryButton.then(b => b.textContent());
    logger.logAssertion(
      'Text content',
      '"Click me"',
      `"${text}"`,
      text === 'Click me'
    );
    logger.logStep('Button text', 'Get button text', undefined, 'passed');

    // Step 4: Check clickable
    logger.logStep(
      'Button clickable',
      'Check if button is enabled',
      'Button should be enabled'
    );
    const isEnabled = await button.primaryButton.then(b => b.isEnabled());
    logger.logAssertion(
      'Button enabled',
      'true',
      isEnabled ? 'true' : 'false',
      isEnabled
    );
    logger.logStep('Button clickable', 'Check if enabled', undefined, 'passed');

    // Test passed
    logger.endTest(true);
  } catch (error) {
    logger.endTest(false, error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    logger.saveToFile();
  }
});
```

**Output:**
```
════════════════════════════════════════════════════════════════════════════════
🧪 TEST START [BTN-001] - Button should render with text
📦 Component button
📋 Category happy-path
🏷️  Tags @smoke, @regression
🌐 Browser chromium desktop
⏱️  Started 14:30:45

⏳ STEP: Navigate to button page
   Action Go to button.html

✅ STEP: Navigate to button page
   Action Go to button.html
   Assertion undefined

✅ ASSERTION: Button is visible
   Expected: Element in viewport
   Actual: Element found and visible

✅ STEP: Button text
   Action Get button text content
   Assertion Should be "Click me"

✅ ASSERTION: Text content
   Expected: "Click me"
   Actual: "Click me"

✅ STEP: Button clickable
   Action Check if button is enabled
   Assertion Button should be enabled

✅ ASSERTION: Button enabled
   Expected: true
   Actual: true

🧪 TEST END ✅ PASSED
⏱️  Duration 1245ms
📊 Steps Executed 4
📝 Assertions 3

════════════════════════════════════════════════════════════════════════════════
```

---

## 🎯 Example 2: Multiple Tests in Suite

```typescript
import { test } from '@playwright/test';
import { VerboseTestLogger } from '../utils/infra/verbose-test-logger';

let globalLogger: VerboseTestLogger;

test.beforeAll(() => {
  globalLogger = new VerboseTestLogger();
});

test.afterAll(() => {
  globalLogger.saveToFile();
  const summary = globalLogger.getSummary();
  console.log('\n📊 TEST SUMMARY:');
  console.log(`   Total: ${summary.total}`);
  console.log(`   Passed: ${summary.passed}`);
  console.log(`   Failed: ${summary.failed}`);
  console.log(`   Duration: ${summary.duration}ms`);
  console.log(`\n   By Component:`);
  Object.entries(summary.byComponent).forEach(([comp, stats]) => {
    console.log(
      `   ${comp}: ${stats.passed} passed, ${stats.failed} failed`
    );
  });
});

test('[BTN-001] Button renders', async ({ page, browserName }, testInfo) => {
  globalLogger.startTest(testInfo, browserName);

  logger.logStep('Render test', 'Navigate to page');
  await page.goto('http://localhost:4503/button.html');
  logger.logStep('Render test', 'Navigate to page', undefined, 'passed');

  logger.logStep('Check element', 'Find button element');
  const button = page.locator('.button.primary');
  await expect(button).toBeVisible();
  logger.logAssertion('Button visible', 'true', 'true', true);
  logger.logStep('Check element', 'Find button element', undefined, 'passed');

  globalLogger.endTest(true);
});

test('[BTN-002] Button click handler', async ({ page, browserName }, testInfo) => {
  globalLogger.startTest(testInfo, browserName);

  logger.logStep('Setup', 'Navigate and wait for button');
  await page.goto('http://localhost:4503/button.html');
  const button = page.locator('.button.primary');
  logger.logStep('Setup', 'Navigate and wait for button', undefined, 'passed');

  logger.logStep('Click action', 'Click button and verify handler');
  let clicked = false;
  page.on('popup', () => {
    clicked = true;
  });
  await button.click();
  logger.logAssertion('Handler fired', 'true', 'true', clicked);
  logger.logStep('Click action', 'Click button', undefined, 'passed');

  globalLogger.endTest(true);
});
```

**Output:**
```
════════════════════════════════════════════════════════════════════════════════
🧪 TEST START [BTN-001] - Button renders
📦 Component button
📋 Category happy-path
🏷️  Tags @smoke
🌐 Browser chromium desktop
⏱️  Started 14:30:45

⏳ STEP: Render test
   Action Navigate to page

✅ STEP: Render test
   Action Navigate to page

✅ ASSERTION: Button visible
   Expected: true
   Actual: true

🧪 TEST END ✅ PASSED
⏱️  Duration 523ms
📊 Steps Executed 2
📝 Assertions 1

════════════════════════════════════════════════════════════════════════════════

════════════════════════════════════════════════════════════════════════════════
🧪 TEST START [BTN-002] - Button click handler
📦 Component button
📋 Category interaction
🏷️  Tags @regression
🌐 Browser chromium desktop
⏱️  Started 14:30:46

⏳ STEP: Setup
   Action Navigate and wait for button

✅ STEP: Setup
   Action Navigate and wait for button

⏳ STEP: Click action
   Action Click button and verify handler

✅ ASSERTION: Handler fired
   Expected: true
   Actual: true

✅ STEP: Click action
   Action Click button

🧪 TEST END ✅ PASSED
⏱️  Duration 412ms
📊 Steps Executed 2
📝 Assertions 1

════════════════════════════════════════════════════════════════════════════════

📊 TEST SUMMARY:
   Total: 2
   Passed: 2
   Failed: 0
   Duration: 935ms

   By Component:
   button: 2 passed, 0 failed

✅ Test logs saved to: tests/data/test-execution-logs/test-execution-2026-06-01T14-30-45.log
✅ JSON logs saved to: tests/data/test-execution-logs/test-execution-2026-06-01T14-30-45.json
```

---

## 📊 Log Files Generated

### Text Log (Human-Readable)
```
tests/data/test-execution-logs/test-execution-2026-06-01T14-30-45.log

Shows:
✓ Test names and IDs
✓ Components and categories
✓ Steps executed
✓ Assertions passed
✓ Durations
✓ Pass/fail status
✓ Errors (if any)
```

### JSON Log (Machine-Readable)
```
tests/data/test-execution-logs/test-execution-2026-06-01T14-30-45.json

Structure:
[
  {
    "testId": "[BTN-001]",
    "testName": "Button should render with text",
    "component": "button",
    "category": "happy-path",
    "tags": ["@smoke", "@regression"],
    "status": "passed",
    "duration": 1245,
    "steps": [
      {
        "stepName": "Navigate to button page",
        "action": "Go to button.html",
        "status": "passed",
        "timestamp": "2026-06-01T14:30:45.000Z"
      }
    ],
    "assertions": [
      "Button is visible | Expected: Element in viewport | Actual: Element found and visible"
    ]
  }
]
```

---

## 🎯 What You Can See

### In Real-Time Console:

```
✅ Test name and ID
✅ Component being tested
✅ Test category
✅ Tags (@smoke, @regression, etc.)
✅ Browser and viewport
✅ Each step executed
✅ Each assertion result
✅ Duration
✅ Pass/fail status
✅ Error messages (if failed)
```

### In Log Files:

```
✅ Complete test execution history
✅ All steps and assertions
✅ Timestamps for each action
✅ Duration per step
✅ Status of each test
✅ Summary statistics
✅ Component-by-component breakdown
```

---

## 🔍 Example: Seeing a Failed Test

**When a test fails, you see:**

```
════════════════════════════════════════════════════════════════════════════════
🧪 TEST START [BTN-042] - Button should change color on hover
📦 Component button
📋 Category state-matrix
🏷️  Tags @matrix, @regression
🌐 Browser chromium 1440x900
⏱️  Started 14:31:20

⏳ STEP: Hover over button
   Action Move mouse to button element
   Assertion Hover state should activate

✅ STEP: Hover over button
   Action Move mouse to button element
   Assertion Hover state should activate

⏳ STEP: Check color changed
   Action Get computed background color
   Assertion Color should be different from default

❌ ASSERTION: Color changed
   Expected: "rgb(255, 100, 100)" (hover color)
   Actual: "rgb(0, 0, 0)" (original color)

🧪 TEST END ❌ FAILED
⏱️  Duration 2145ms
📊 Steps Executed 2
📝 Assertions 2
❌ Error: Color did not change on hover - hover CSS not applied

════════════════════════════════════════════════════════════════════════════════
```

From this, you immediately see:
- What was being tested (hover state)
- What step failed (color check)
- What was expected vs actual
- Exact error message

---

## 📈 Running Tests and Seeing Execution

### Command:
```bash
env=local npx playwright test tests/specFiles/ga/button/ --project chromium
```

### What You See:

**Console Output:**
```
✓ Test names as they run
✓ Steps being executed
✓ Assertions being checked
✓ Real-time pass/fail
✓ Duration for each test
```

**After Tests Complete:**
```
✓ Summary statistics
✓ Pass/fail count
✓ Total duration
✓ Component breakdown
✓ Log file locations
```

### Log Files Created:
```
tests/data/test-execution-logs/
├── test-execution-2026-06-01T14-30-45.log    (text log)
└── test-execution-2026-06-01T14-30-45.json   (JSON log)
```

---

## 🎓 Summary

You now have **complete visibility** into test execution:

| Level | What You See | Where |
|-------|------------|-------|
| **Real-Time** | Live console output as tests run | Terminal/Console |
| **Detailed** | Step-by-step execution details | Log files (text) |
| **Machine-Readable** | Structured data for analysis | JSON logs |
| **Summary** | Statistics and aggregates | Console output |

**Run tests and watch the execution unfold!** 🚀

```bash
env=local npx playwright test tests/specFiles/ga/button/ --project chromium
```

The console will show you exactly what's being tested, what assertions are being checked, and whether each test passes or fails in real-time!
