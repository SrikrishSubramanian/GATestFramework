# Spec Refactoring Template

This document provides the exact patterns for refactoring ALL spec files to properly reuse framework utilities.

## Pattern 1: Proper Spec Header & Setup

### BEFORE ❌
```typescript
import { test, expect } from '@playwright/test';
import { ComponentPage } from '../../../pages/ga/components/componentPage';

test.beforeEach(async ({ page }) => {
  // ... login code ...
});
```

### AFTER ✅
```typescript
import { test, expect } from '@playwright/test';
import { ComponentPage } from '../../../pages/ga/components/componentPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';

let pom: ComponentPage;
let capture: ConsoleCapture;

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
  pom = new ComponentPage(page);
  capture = new ConsoleCapture(page);
  capture.start();
});

test.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});
```

---

## Pattern 2: Navigation & URLs

### BEFORE ❌
```typescript
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const STYLE_GUIDE_URL = () =>
  `${BASE()}/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled`;

test('test', async ({ page }) => {
  await page.goto(STYLE_GUIDE_URL());
});
```

### AFTER ✅
```typescript
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';

test('test', async ({ page }) => {
  const url = resolveComponentUrl('button');
  await page.goto(url);
  
  // OR via POM (preferred):
  await pom.navigate('button');
});
```

---

## Pattern 3: Click/Fill Operations

### BEFORE ❌
```typescript
const BUTTON_SELECTOR = '.cmp-button';

test('test', async ({ page }) => {
  const button = page.locator(BUTTON_SELECTOR);
  await button.click();
  
  const input = page.locator('input[name="email"]');
  await input.fill('test@example.com');
  await input.press('Enter');
});
```

### AFTER ✅
```typescript
import { clickElement, fill, fillAndEnter } from '../../../../src/utils/action-utils';
import { getLocator } from '../../../../src/utils/locator-utils';

test('test', async ({ page }) => {
  // Via POM (preferred):
  const button = await pom.primaryButton;
  await clickElement(button);
  
  // Direct usage (if no POM):
  const input = getLocator('input[name="email"]');
  await fillAndEnter(input, 'test@example.com');
});
```

---

## Pattern 4: Assertions

### BEFORE ❌
```typescript
test('test', async ({ page }) => {
  const button = page.locator('.cmp-button');
  await expect(button).toBeVisible();
  await expect(button).toHaveText('Click Me');
  
  const count = await button.count();
  expect(count).toBeGreaterThan(0);
  
  const classes = await button.getAttribute('class');
  expect(classes).toContain('cmp-button');
});
```

### AFTER ✅
```typescript
import { isVisible, expectElementToHaveText, expectElementToHaveClass } from '../../../../src/utils/assert-utils';

test('test', async ({ page }) => {
  const button = await pom.primaryButton;
  
  // Using assert-utils:
  await isVisible(button);
  await expectElementToHaveText(button, 'Click Me');
  await expectElementToHaveClass(button, 'cmp-button');
  
  // Or raw expect (when assert-utils doesn't cover):
  const count = await button.count();
  expect(count).toBeGreaterThan(0);
});
```

---

## Pattern 5: Style Assertions

### BEFORE ❌
```typescript
test('test', async ({ page }) => {
  const button = page.locator('.cmp-button');
  const bg = await button.evaluate(el => 
    window.getComputedStyle(el).backgroundColor
  );
  expect(bg).toBe('rgb(0, 0, 0)');
  
  const padding = await button.evaluate(el =>
    window.getComputedStyle(el).padding
  );
  expect(padding).toMatch(/\d+px/);
});
```

### AFTER ✅
```typescript
import { assertBackground, assertSpacing } from '../../../../utils/infra/component-assertions';

test('test', async ({ page }) => {
  const button = await pom.primaryButton;
  
  // Using component-assertions:
  await assertBackground(button, 'rgb(0, 0, 0)');
  await assertSpacing(button, { paddingTop: '16px' });
});
```

---

## Pattern 6: Element Text/Attribute Extraction

### BEFORE ❌
```typescript
test('test', async ({ page }) => {
  const link = page.locator('a').first();
  const text = await link.innerText();
  const href = await link.getAttribute('href');
  
  expect(text).toBe('Click Here');
  expect(href).toContain('/page');
});
```

### AFTER ✅
```typescript
import { getTextOfElement, getAttributeOfElement } from '../../../../src/utils/element-utils';

test('test', async ({ page }) => {
  const link = page.locator('a').first();
  
  // Using element-utils:
  const text = await getTextOfElement(link);
  const href = await getAttributeOfElement(link, 'href');
  
  expect(text).toBe('Click Here');
  expect(href).toContain('/page');
});
```

---

## Pattern 7: API Mocking

### BEFORE ❌
```typescript
test('test', async ({ page }) => {
  // Manual route interception:
  await page.route('**/api/**', route => {
    route.abort('failed');
  });
  
  await page.goto('...');
  // Test error handling
});
```

### AFTER ✅
```typescript
import { setupMocks, clearMocks } from '../../../utils/infra/api-mock-helper';

test('test', async ({ page }) => {
  const mocks = [{
    urlPattern: '**/api/button',
    scenario: 'error',
    status: 500
  }];
  
  await setupMocks(page, mocks);
  await page.goto('...');
  
  // Test error handling
  
  // Cleanup in afterEach:
  await clearMocks(page);
});
```

---

## Pattern 8: Test Data Generation

### BEFORE ❌
```typescript
test('test', async ({ page }) => {
  // Hardcoded test data:
  const testEmail = `test${Math.random()}@example.com`;
  const testName = 'Test User';
  const testPhone = '555-0123';
  
  // Fill form...
});
```

### AFTER ✅
```typescript
import { TestDataFactory } from '../../../utils/infra/test-data-factory';

let testData: TestDataFactory;

test.beforeEach(() => {
  testData = new TestDataFactory();
});

test('test', async ({ page }) => {
  // Generated test data:
  const email = testData.email();
  const name = testData.name();
  const phone = testData.phone();
  
  // Fill form...
});
```

---

## Pattern 9: Waiting for Elements

### BEFORE ❌
```typescript
test('test', async ({ page }) => {
  await page.waitForSelector('.cmp-button');
  await page.waitForLoadState('networkidle');
  
  const button = page.locator('.cmp-button');
  await expect(button).toBeVisible();
});
```

### AFTER ✅
```typescript
test('test', async ({ page }) => {
  // Locator.waitFor() is preferred:
  await page.locator('.cmp-button').waitFor({ state: 'visible', timeout: 5000 });
  
  // Or via expect (more idiomatic):
  const button = page.locator('.cmp-button');
  await expect(button).toBeVisible();
});
```

---

## Pattern 10: Locator Iteration

### BEFORE ❌
```typescript
test('test', async ({ page }) => {
  const items = page.locator('.cmp-accordion__item');
  const count = await items.count();
  
  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    console.log(await item.innerText());
  }
});
```

### AFTER ✅
```typescript
import { iterateLocator } from '../../../../src/utils/locator-utils';

test('test', async ({ page }) => {
  const items = page.locator('.cmp-accordion__item');
  
  // Using locator-utils:
  await iterateLocator(items, async (item, index) => {
    console.log(await item.innerText());
  });
});
```

---

## Import Path Cheat Sheet

| Spec Location | Import Pattern |
|---|---|
| `tests/specFiles/ga/button/` (3 levels down) | `../../../utils/infra/...` or `../../../src/utils/...` |
| `tests/specFiles/ga/` (2 levels down) | `../../utils/infra/...` or `../../src/utils/...` |
| `tests/specFiles/unit/` (2 levels down) | `../../utils/infra/...` or `../../src/utils/...` |

---

## Refactoring Checklist for Each Spec

- [ ] Remove hardcoded login (use `loginToAEMAuthor()`)
- [ ] Remove hardcoded URLs (use `resolveComponentUrl()` or POM)
- [ ] Add `ConsoleCapture` in `beforeEach`
- [ ] Add `afterEach` with `attachConsoleCapture()` + `annotateEnvironment()`
- [ ] Replace `page.waitForSelector()` with `locator.waitFor()`
- [ ] Replace hardcoded CSS selectors with POM getters
- [ ] Replace `page.click()` with `clickElement()` from action-utils
- [ ] Replace `page.fill()` with `fill()` from action-utils
- [ ] Replace manual style checks with `component-assertions`
- [ ] Replace hardcoded test data with `TestDataFactory`
- [ ] Replace manual `page.route()` with `setupMocks()` + `clearMocks()`
- [ ] Import paths are correct (right number of `../` levels)

