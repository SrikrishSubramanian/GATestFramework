# Framework Structure & Code Reuse Guide

After restructuring, the framework now has three clean utility layers. This guide shows how to reuse them correctly.

## Directory Structure (Clean)

```
GATestFramework/
├── src/utils/                   ← Playwright API wrappers (LOW-LEVEL)
│   ├── action-utils.ts          • click, fill, hover, navigation, drag-drop
│   ├── assert-utils.ts          • visibility, text, attribute, count assertions
│   ├── element-utils.ts         • getTextOfElement, getAttributeOfElement
│   ├── locator-utils.ts         • getLocator, getAllLocators, iterateLocator
│   ├── page-utils.ts            • singleton getPage/setPage/switchPage
│   └── request-utils.ts         • (placeholder for future HTTP helpers)
│
├── tests/utils/
│   ├── generation/              ← Test CODE GENERATION (for orchestrators only)
│   │   ├── dom-scanner.ts       • Scan live AEM DOM
│   │   ├── pom-writer.ts        • Write POM classes + locator sidecars
│   │   ├── spec-writer.ts       • Write .spec.ts files
│   │   ├── csv-test-parser.ts   • Parse CSV test cases
│   │   ├── state-matrix-generator.ts
│   │   └── ... (12 more generators)
│   │
│   └── infra/                   ← Test INFRASTRUCTURE (used by all specs)
│       ├── auth-fixture.ts      • AEM login (local form + cloud IMS/MFA)
│       ├── env.ts               • Environment config (BASE_URL, credentials)
│       ├── locator-registry.ts  • Multi-strategy locator resolution
│       ├── api-mock-helper.ts   • Setup/teardown Playwright mocks
│       ├── console-capture.ts   • Capture JS errors + failed requests
│       ├── component-assertions.ts  • Reusable layout/spacing/typography checks
│       ├── report-enhancer.ts   • Attach console/env/locator data to HTML report
│       ├── test-data-factory.ts • Generate realistic test data
│       ├── screenshot-compare.ts    • Visual regression baselines
│       ├── fixture-sync-checker.ts  • Validate fixture freshness
│       ├── content-fixture-deployer.ts  • Deploy fixtures to AEM
│       └── ... (10 more utilities)
│
├── tests/specFiles/             ← ONLY .spec.ts + visual snapshots (CLEAN!)
│   ├── unit/                    • Framework utility unit tests
│   ├── ga/
│   │   ├── accordion/
│   │   │   ├── accordion.author.spec.ts
│   │   │   ├── accordion.interaction.spec.ts
│   │   │   ├── accordion.matrix.spec.ts
│   │   │   ├── accordion.visual.spec.ts
│   │   │   ├── accordion.images.spec.ts
│   │   │   └── accordion.visual.spec.ts-snapshots/  (Playwright convention)
│   │   ├── button/
│   │   └── ... (20+ components)
│   │
├── tests/pages/                 ← Page Object Models (CLEAN!)
│   ├── loginPage.ts
│   └── ga/components/
│       ├── accordionPage.ts
│       ├── buttonPage.ts
│       └── ... (20+ POMs)
│
├── tests/locators/              ← Locator Registries (CLEAN!)
│   ├── accordion.locators.json
│   ├── button.locators.json
│   └── ... (20+ locator sidecars)
│
├── tests/data/
│   ├── content-fixtures/        ← AEM test fixture XML
│   │   ├── accordion/
│   │   ├── button/
│   │   └── ... (15 components)
│   ├── mocks/                   ← API mock responses
│   │   ├── button/
│   │   │   ├── success.json
│   │   │   ├── error.json
│   │   │   └── empty.json
│   │   └── ... (per-component mocks)
│   └── baselines/               ← Visual regression golden screenshots
│
├── tests/generators/            ← Test generation orchestrators
│   ├── generate-components.ts
│   ├── generate-advanced.ts
│   ├── generate-from-csv.ts
│   └── generate-from-jira.ts
│
└── tests/environments/          ← Environment configs
    ├── .env.local
    ├── .env.dev
    ├── .env.qa
    └── .env.prod
```

---

## Three Layers of Code Reuse

### Layer 1: `src/utils/` — Playwright API Wrappers (FOUNDATIONAL)

**Use by:** Hand-written specs (like `login.spec.ts`)  
**Pattern:** Function exports + singleton `getPage()`  
**When to use:** Low-level DOM operations, navigation, clicking, filling forms

**Example: Instead of doing this**
```typescript
await page.locator('.button').click();
await page.locator('.button').waitFor({ state: 'visible' });
const text = await page.locator('.button').innerText();
```

**Reuse this from `action-utils.ts` + `assert-utils.ts`**
```typescript
import { clickElement, isVisible, getTextOfElement } from '../../src/utils/action-utils';
import { getLocator } from '../../src/utils/locator-utils';

const buttonLocator = getLocator('.button');
await clickElement(buttonLocator);
await isVisible(buttonLocator);
const text = await getTextOfElement(buttonLocator);
```

**Key files to reuse from src/utils/:**

| File | Exports | When to use |
|------|---------|------------|
| `action-utils.ts` | `clickElement`, `fill`, `fillAndEnter`, `hover`, `drag-drop`, `uploadFiles`, etc. | Navigation, form filling, interactions |
| `assert-utils.ts` | `isVisible`, `expectElementToHaveText`, `expectElementToHaveClass`, `expectElementToHaveAttribute`, etc. | Assertions without expect() syntax |
| `element-utils.ts` | `getTextOfElement`, `getAttributeOfElement`, `getAllElementText` | Extract text/attributes from DOM |
| `locator-utils.ts` | `getLocator`, `getAllLocators`, `getCountOfLocators`, `iterateLocator` | Locator resolution, iteration |
| `page-utils.ts` | `getPage`, `setPage`, `switchPage` | Page state management |

---

### Layer 2: `tests/utils/infra/` — Test Infrastructure (RUNTIME)

**Use by:** All specs (generated + hand-written)  
**Pattern:** Class-based, constructor-injected `Page`  
**When to use:** Test setup, data, reporting, authentication, mocking

**CRITICAL FILES YOU MUST USE:**

| File | Purpose | When to use |
|------|---------|------------|
| `auth-fixture.ts` | AEM login (handles local + cloud + MFA) | `beforeEach: await loginToAEMAuthor(page)` |
| `env.ts` | Environment config (BASE_URL, credentials) | `const url = ENV.BASE_URL` |
| `locator-registry.ts` | Multi-locator resolution + fallback | POM locator getters |
| `component-assertions.ts` | Layout, spacing, typography, alignment checks | Visual/styling assertions |
| `console-capture.ts` | Capture JS errors + failed requests | `const capture = new ConsoleCapture(page); capture.start();...` |
| `report-enhancer.ts` | Attach console/env data to HTML report | `afterEach: await attachConsoleCapture(page, testInfo)` |
| `test-data-factory.ts` | Generate realistic test data | `const data = new TestDataFactory()` |
| `api-mock-helper.ts` | Setup/teardown API mocks | `await setupMocks(page, mockConfigs)` |

---

### Layer 3: `tests/utils/generation/` — Code Generation Pipeline (ORCHESTRATORS ONLY)

**Use by:** `tests/generators/*.ts` (orchestrators that WRITE test code)  
**Pattern:** Class-based, writes files to disk  
**When to use:** Only during test generation phase (not at test runtime)

**Key generators:**

| File | Purpose |
|------|---------|
| `dom-scanner.ts` | Extract locators from live AEM DOM |
| `pom-writer.ts` | Write POM classes + locator sidecars |
| `spec-writer.ts` | Write .spec.ts files by category |
| `csv-test-parser.ts` | Parse CSV test cases |
| `state-matrix-generator.ts` | Generate combinatorial state matrix tests |

---

## How to Write a Proper Spec File

### BEFORE (❌ Duplicating code, not reusing utils)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    // ❌ WRONG: Hardcoding login instead of reusing auth-fixture
    await page.goto('http://localhost:4502/libs/granite/core/content/login.html');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  });

  test('button is clickable', async ({ page }) => {
    // ❌ WRONG: Hardcoding URL instead of using resolveComponentUrl
    await page.goto('http://localhost:4502/content/global-atlantic/style-guide/components/button.html');
    
    // ❌ WRONG: Not using POM locator getters
    const buttonLocator = page.locator('.cmp-button');
    await buttonLocator.click();
    
    // ❌ WRONG: Using page.waitForSelector (deprecated) instead of locator.waitFor()
    await page.waitForSelector('.cmp-button__label');
    
    // ❌ WRONG: Duplicating style assertions instead of using component-assertions
    const bg = await buttonLocator.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    expect(bg).toBe('rgb(0, 0, 0)');
    
    // ❌ WRONG: Not capturing console errors
    // (errors go unreported)
  });
});
```

### AFTER (✅ Proper code reuse)

```typescript
import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertBackground } from '../../../utils/infra/component-assertions';

test.describe('Button Component', () => {
  let pom: ButtonPage;
  let capture: ConsoleCapture;

  test.beforeEach(async ({ page }) => {
    // ✅ USE auth-fixture for login (handles local + cloud + MFA)
    await loginToAEMAuthor(page);
    
    // ✅ USE POM pattern with constructor injection
    pom = new ButtonPage(page);
    
    // ✅ Capture console errors automatically
    capture = new ConsoleCapture(page);
    capture.start();
  });

  test.afterEach(async ({ page }, testInfo) => {
    // ✅ Attach captured errors to HTML report
    const errors = capture.getErrors();
    await attachConsoleCapture(page, testInfo, errors);
    await annotateEnvironment(page, testInfo);
  });

  test('button is clickable', async ({ page }) => {
    // ✅ USE resolveComponentUrl for proper URL handling
    const url = resolveComponentUrl('button');
    await page.goto(url);
    
    // ✅ USE POM to navigate (handles auth + URL properly)
    await pom.navigate('button');
    
    // ✅ USE POM locator getters instead of hardcoding selectors
    const primaryButton = await pom.primaryButton;
    
    // ✅ USE locator.waitFor() instead of page.waitForSelector()
    await primaryButton.waitFor({ state: 'visible' });
    await primaryButton.click();
    
    // ✅ USE component-assertions for style checks
    await assertBackground(primaryButton, 'rgb(0, 0, 0)');
    
    // ✅ Capture + report console errors automatically
    const errors = capture.getErrors();
    expect(errors.length).toBe(0);
  });
});
```

---

## Import Paths Reference

**For specs in `tests/specFiles/ga/<component>/`:**
```typescript
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
```
(3 levels up: `<component>` → `ga` → `specFiles` → `tests`)

**For specs in `tests/specFiles/ga/`:**
```typescript
import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';
import { ButtonPage } from '../../pages/ga/components/buttonPage';
```
(2 levels up: `ga` → `specFiles` → `tests`)

**For specs in `tests/specFiles/unit/`:**
```typescript
import { ConsoleCapture } from '../../utils/infra/console-capture';
```
(2 levels up: `unit` → `specFiles` → `tests`)

---

## Checklist: Is Your Spec Properly Reusing Utils?

- [ ] Uses `loginToAEMAuthor()` from `auth-fixture.ts` (NOT inline form filling)
- [ ] Uses POM for navigation (`new ButtonPage(page).navigate()`)
- [ ] Uses POM locator getters (`pom.primaryButton`) — NOT hardcoded `.locator()`
- [ ] Uses `locator.waitFor()` — NOT deprecated `page.waitForSelector()`
- [ ] Uses `component-assertions.ts` for style checks — NOT manual `evaluate()` calls
- [ ] Uses `ConsoleCapture` to capture JS errors
- [ ] Uses `attachConsoleCapture()` in `afterEach` to report errors
- [ ] Uses `resolveComponentUrl()` for URLs — NOT hardcoded paths
- [ ] Uses `action-utils.ts` for clicks/fills/hovers — NOT raw `page.click()` / `page.fill()`
- [ ] Uses `assert-utils.ts` for visibility/text checks — NOT raw `expect()`
- [ ] No import from non-existent `src/utils/auth-utils` ✅ Fixed
- [ ] Proper relative import paths (count levels to `tests/`)

---

## Next Steps

1. **Verify this file is followed** — check a few new specs
2. **Audit existing specs** — apply checklist to identify non-reusing code
3. **Create refactoring tasks** — schedule updates to high-impact specs
4. **Code review** — use this as the standard for PR reviews

