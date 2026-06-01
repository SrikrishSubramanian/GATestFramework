# Code Quality & AEM Testing - 98-100% Standard

## 🎯 Mission: Zero Flaky Tests, 98-100% Quality

**Philosophy:** 
```
If a test fails once, 
  ↓
It should be a real bug in the code
  ↓
Developer should fix it immediately
  ↓
Test should NEVER flake again
```

---

## 📦 New Components Created

### **1. Test Reliability Manager** (test-reliability-manager.ts)
```
Purpose: Track test stability over time
Features:
  ✅ Detects flaky tests (> 5% failure rate)
  ✅ Identifies selector issues
  ✅ Finds timeout problems
  ✅ Calculates reliability scores
  ✅ Generates quality metrics
```

### **2. AEM Test Helper** (aem-test-helper.ts)
```
Purpose: Best practices for AEM component testing
Features:
  ✅ Stable selector patterns
  ✅ CSS class verification (BEM convention)
  ✅ Semantic HTML validation
  ✅ AEM author mode support
  ✅ Responsive design testing
  ✅ No inline CSS/JS validation
  ✅ No HTL comments verification
```

### **3. Code Quality Reporter** (code-quality-reporter.ts)
```
Purpose: Generate comprehensive quality reports
Features:
  ✅ 98-100% quality scoring
  ✅ Test reliability metrics
  ✅ Execution statistics
  ✅ Beautiful HTML reports
  ✅ Recommendations for improvement
```

---

## 🚀 How It Works

### **Automatic Quality Tracking**

```
Test Execution
    ↓
TestReliabilityManager records result
├─ Test name
├─ Pass/fail status
├─ Error details
├─ Selector issues
└─ Timeout issues
    ↓
After each test run:
├─ Calculate reliability scores (< 2% failure = reliable)
├─ Identify flaky tests (> 5% failure)
├─ Generate quality metrics
├─ Create HTML report
└─ Output recommendations
```

### **98-100% Quality Standard**

```
Overall Score = 
  TestReliability (35%) +
  CodeQuality (40%) +
  TestCoverage (15%) +
  Performance (10%)

Target Breakdown:
  🟢 98-100% = Production Ready ✅
  🟡 90-97%  = Needs Review
  🔴 < 90%   = Major Issues
```

---

## 🧪 AEM Testing Best Practices

### **Best Practice #1: Use Stable Selectors**

```typescript
// ❌ BAD - Flaky and fragile
locator('button:nth-child(2)')
locator('[id*="button-123"]')
locator('//button[contains(text(), "Click")]')

// ✅ GOOD - Stable and maintainable
locator('[data-testid="submit-button"]')
locator('.cmp-button')
locator('[role="button"]')
```

### **Best Practice #2: Follow AEM CSS Conventions**

```typescript
// ✅ All AEM components must follow BEM naming
.cmp-button                    // Component root
.cmp-button__text              // Element
.cmp-button--primary           // Modifier
.cmp-button--disabled          // State

// Verify in tests:
await helper.verifyCSSClasses(['.cmp-button', '.cmp-button--primary']);
```

### **Best Practice #3: Semantic HTML**

```typescript
// ❌ BAD - Not semantic
<div class="cmp-button" onclick="...">Click me</div>

// ✅ GOOD - Proper semantic element
<button class="cmp-button" type="button">Click me</button>

// Test it:
await helper.verifySemanticHTML('button');
```

### **Best Practice #4: No Inline CSS/JS**

```typescript
// ❌ BAD - Inline styles
<div style="color: red;">Text</div>
<button onclick="handleClick()">Click</button>

// ✅ GOOD - External CSS, event listeners
<div class="cmp-text--error">Text</div>
<button class="cmp-button" data-testid="submit">Click</button>

// Test it:
await helper.verifyNoInlineStyles();
```

### **Best Practice #5: Explicit Waits**

```typescript
// ❌ BAD - Implicit assumptions
await page.click('button');
const text = await page.locator('div').textContent();

// ✅ GOOD - Explicit waits
const button = page.locator('[data-testid="button"]');
await button.waitFor({ state: 'visible', timeout: 5000 });
await button.click();
await page.waitForLoadState('networkidle');
const text = await page.locator('[data-testid="result"]').textContent();
```

### **Best Practice #6: Realistic Delays (Not Sleep)**

```typescript
// ❌ BAD - Fragile
await page.waitForTimeout(3000); // Magic number

// ✅ GOOD - Waiting for actual element
await page.locator('[data-testid="dialog"]').waitFor({ state: 'visible' });
```

---

## 📋 Using AEM Test Helper

### **Example 1: Basic Component Test**

```typescript
import { test } from '@playwright/test';
import { AEMTestHelper } from '../utils/infra/aem-test-helper';

test('[GAAM-1098] Button component renders correctly', async ({ page }) => {
  const helper = new AEMTestHelper(page, {
    componentPath: '/apps/company/components/button',
    componentName: 'button',
    cssClass: 'cmp-button'
  });

  // Run full component test
  const results = await helper.runFullComponentTest();
  console.log(helper.generateReport(results));

  // All results passed?
  const allPassed = results.every(r => r.passed);
  expect(allPassed).toBe(true);
});
```

### **Example 2: Detailed Property Testing**

```typescript
test('[GAAM-1098] Button with custom text', async ({ page }) => {
  const helper = new AEMTestHelper(page, {
    componentPath: '/apps/company/components/button',
    componentName: 'button',
    cssClass: 'cmp-button'
  });

  // Test 1: Component renders
  const renders = await helper.verifyComponentRenders();
  expect(renders.passed).toBe(true);

  // Test 2: Has correct CSS classes
  const classes = await helper.verifyCSSClasses([
    'cmp-button',
    'cmp-button--primary'
  ]);
  expect(classes.passed).toBe(true);

  // Test 3: Correct button element
  const semantic = await helper.verifySemanticHTML('button');
  expect(semantic.passed).toBe(true);

  // Test 4: No inline styles
  const inline = await helper.verifyNoInlineStyles();
  expect(inline.passed).toBe(true);

  // Test 5: Specific property
  const property = await helper.verifyComponentProperty(
    'text',
    'Click Me'
  );
  expect(property.passed).toBe(true);
});
```

### **Example 3: Responsive Design Testing**

```typescript
test('[GAAM-1098] Button responsive on all viewports', async ({ page }) => {
  const helper = new AEMTestHelper(page, {
    componentPath: '/apps/company/components/button',
    componentName: 'button',
    cssClass: 'cmp-button'
  });

  const viewports = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1440 }
  ];

  const results = await helper.verifyResponsiveDesign(viewports);

  // All viewports should pass
  results.forEach(result => {
    expect(result.passed).toBe(true);
  });
});
```

---

## 📊 Quality Metrics Explained

### **Test Reliability Score**

```
Reliability = (Success Count / Total Runs) × 100

< 90% = FLAKY (Developer must fix)
90-98% = ACCEPTABLE (Monitor)
98-100% = RELIABLE ✅ (Production-ready)
```

### **Code Quality Score**

```
Quality = Percentage of tests with:
  ✅ No selector issues
  ✅ No timeout problems
  ✅ No inconsistent results
  ✅ Following AEM conventions

Target: 98-100%
```

### **Overall Score Calculation**

```
Overall = (Reliability × 0.35) +
          (CodeQuality × 0.40) +
          (Coverage × 0.15) +
          (Performance × 0.10)

Result:
  🟢 98-100% = Production Ready
  🟡 90-97%  = Review Needed
  🔴 < 90%   = Major Issues
```

---

## 🔍 Detecting Flaky Tests

### **Automatic Detection**

The system automatically detects and reports:

```
✅ Selector Issues
   - Element not found
   - Locator changed
   - Dynamic IDs

✅ Timeout Issues
   - Waiting for element
   - Network delays
   - Slow component

✅ Inconsistent Results
   - Same test: sometimes pass, sometimes fail
   - Indicates real bug or test fragility

✅ Code Quality Issues
   - Inline styles found
   - No semantic HTML
   - HTL comments in output
```

### **Reliability Database**

```
After each test run:
{
  "testName": "[GAAM-1098] Button renders",
  "totalRuns": 15,
  "successCount": 14,
  "failureCount": 1,
  "flakiness": 6.7%,
  "isFlaky": true,
  "selectorIssues": [...],
  "timeoutIssues": [...],
  "inconsistentResults": true
}
```

---

## 🎯 Quality Reports

### **Report Types**

1. **code-quality.json** - Machine-readable metrics
2. **code-quality-report.html** - Beautiful dashboard
3. **reliability-db.json** - Historical tracking

### **Report Contents**

```
📊 Overall Score: 98%+ 🟢

Scores:
├─ Test Reliability: 98%
├─ Code Quality: 99%
├─ Test Coverage: 85%
└─ Performance: 95%

Execution Stats:
├─ Total Tests: 150
├─ Passed: 147
├─ Failed: 3
├─ Pass Rate: 98%
└─ Duration: 5m 23s

Recommendations:
├─ ✅ All quality metrics excellent
└─ Ready for production!
```

---

## 🛠️ Integration in Playwright Config

```typescript
// playwright.config.ts
import TestReliabilityManager from './test-reliability-manager';
import CodeQualityReporter from './code-quality-reporter';

export default defineConfig({
  reporter: [
    // ... other reporters
    [CodeQualityReporter],
    [TestReliabilityManager]
  ]
});
```

---

## 📈 Improvement Workflow

### **If Test Fails**

```
Test Fails
  ↓
System Records:
├─ Test name
├─ Error message
├─ Selector issues (if any)
├─ Timeout issues (if any)
└─ Duration
  ↓
Analysis:
  Is it a REAL bug?
  ├─ YES → Developer fixes code
  └─ NO → Developer fixes test (selector, wait, etc.)
  ↓
Re-run Test
  ↓
Test Must Pass
  ↓
System Tracks: +1 success
  ↓
Reliability Score Improves
```

### **If Test is Flaky**

```
Flakiness Detected (> 5% failure rate)
  ↓
System Reports:
├─ Selector issues
├─ Timeout issues
└─ Inconsistency pattern
  ↓
Developer Actions:
├─ Use stable selectors ([data-testid] or role)
├─ Add explicit waits
├─ Check for race conditions
└─ Fix root cause
  ↓
Test Reliability Improves
```

---

## ✅ Quality Checklist

### **Before Production Deployment**

- [ ] Overall quality score ≥ 98%
- [ ] All tests: reliability ≥ 98%
- [ ] No flaky tests (< 5% failure)
- [ ] Test coverage ≥ 80%
- [ ] All AEM best practices followed
- [ ] No selector issues
- [ ] No timeout issues
- [ ] Code quality report generated
- [ ] All recommendations addressed

---

## 📚 Example Quality Report Output

```
╔════════════════════════════════════════════════════════════╗
║         CODE QUALITY & TEST RELIABILITY                     ║
╚════════════════════════════════════════════════════════════╝

📊 QUALITY METRICS:
   Overall Score: 98% 🟢 A+ (Excellent)
   Test Coverage: 85%
   Code Quality: 99%
   Test Reliability: 98%
   Performance Score: 95%

✅ RELIABLE TESTS:
   142 tests with < 1% failure rate

⚠️  NO FLAKY TESTS DETECTED

📋 RECOMMENDATIONS:
   ✅ All quality metrics excellent
   ✅ Ready for production!

Generated: 2026-06-01T14:30:00Z
```

---

## 🎯 Key Principles

1. **One Test Run = One Pass or One Real Bug**
   - No false positives
   - No flaky tests
   - Reliable always

2. **98-100% Quality Standard**
   - Not 90%, not 95%
   - 98% minimum for production

3. **AEM Best Practices**
   - Semantic HTML
   - BEM CSS naming
   - No inline styles
   - Proper element structure

4. **Automatic Quality Tracking**
   - Every test tracked
   - Flakiness detected
   - Recommendations generated

5. **Developer Accountability**
   - If test fails → fix code or test
   - If test flakes → find root cause
   - If test passes → stays reliable

---

## 🚀 Getting Started

### **Enable Quality Tracking**

1. Reporters auto-enabled in playwright.config.ts
2. Use AEMTestHelper in your tests
3. Reports auto-generate after each run
4. Check code-quality-report.html

### **Check Your Quality Score**

```bash
# After running tests:
open test-results/code-quality-report.html
```

### **Fix Flaky Tests**

```bash
# Check reliability database:
cat test-results/reliability-db.json

# See which tests are flaky:
# "flakiness": 6.7% → Flaky!
# "selectorIssues": [...] → Check selectors
# "timeoutIssues": [...] → Add waits
```

---

## 🎉 The Goal

**Tests that pass the first time, every time.**

```
One test run
  ↓
Pass or fail?
  ↓
If PASS → Test is reliable ✅
If FAIL → Code has a real bug → Fix it → Test passes forever
```

No flakes. No guesswork. 98-100% quality always.

---

**This is the new standard: Enterprise-grade testing with zero tolerance for flakiness.** 🚀
