# GATestFramework — Repository Overview

> **For agents:** Read this file first instead of scanning the repo. It contains the full project structure, patterns, and conventions.

## Purpose

A **Playwright-based E2E test automation framework** for testing Global Atlantic (GA) web applications. It covers UI testing, visual regression, broken link detection, and responsive design validation across multiple browsers and devices.

## Tech Stack

- **Playwright** v1.51.1 + **TypeScript** (strict mode, ES2016 target)
- **CI/CD**: Bitbucket Pipelines (parallel mobile + desktop steps)
- **Reporting**: Playwright HTML/JSON + Microsoft Teams webhook notifications
- **Data**: CSV (csv-parser/csv-writer/json2csv), JSON, dotenv for env config
- **Package Manager**: npm

## Project Structure

```
GATestFramework/
├── src/
│   ├── setup/
│   │   ├── optional-parameter-types.ts   # TS type defs for Playwright options
│   │   └── page-setup.ts                 # Custom test base config (custom test exports)
│   └── utils/
│       ├── action-utils.ts               # click, fill, hover, navigation, alerts, drag-and-drop
│       ├── assert-utils.ts               # visibility, text, attribute, class, count assertions + soft assertions
│       ├── element-utils.ts              # text/attribute extraction helpers
│       ├── locator-utils.ts              # locator resolution (string | Locator), counting, iteration
│       ├── page-utils.ts                 # singleton page state management (getPage/setPage/switchPage)
│       ├── request-utils.ts              # HTTP request helpers (placeholder)
│       └── timeout-constants.ts          # INSTANT(1s), SMALL(5s), STANDARD(90s), BIG(30s), MAX(60s), TEST(120s)
├── tests/
│   ├── specFiles/
│   │   └── login.spec.ts                 # Test specifications (add new specs here)
│   ├── pages/
│   │   └── loginPage.ts                  # Page Object Models (add new POMs here)
│   ├── environments/
│   │   └── urls.json                     # Centralized URL config for test pages
│   └── utils/
│       ├── globalSetup.ts                # Global setup hook — loads .env.<env> files via dotenv
│       ├── env.ts                        # ENV class accessor (BASE_URL, AEM_AUTHOR_URL, credentials, etc.)
│       ├── brokenLinksUtils.ts           # Link validation — extracts <a href>, checks HTTP status
│       ├── csvUtls.ts                    # CSV handling utilities
│       ├── reportAttach.ts               # Attaches artifacts to Playwright HTML report
│       ├── typography-master.ts          # Master baseline extraction (font, padding, images, classes)
│       ├── typography-master-execute.ts  # Master extraction execution wrapper
│       ├── typography-compare.ts         # Visual comparison against master baseline
│       ├── typography-compare-execute.ts # Comparison execution wrapper
│       └── typography-execute.ts         # Main typography testing orchestrator
├── playwright.config.ts                  # 5 browser projects, 15min test timeout, fullyParallel
├── tsconfig.json                         # TypeScript compiler options (strict mode)
├── package.json                          # Dependencies & npm scripts
├── bitbucket-pipelines.yml               # Parallel mobile/desktop CI pipelines
├── send-report.js                        # Teams notification script (parses results.json)
└── .gitignore
```

## Test Types

| Type                   | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| **UI/E2E**             | Page interactions, form submission, cross-browser validation                |
| **Visual Regression**  | Typography/styling baseline capture → comparison (font, padding, images)    |
| **Link Validation**    | Automated broken link detection with HTTP status checks                     |
| **Responsive**         | Multi-viewport: Desktop (1440×900, 3660×1560), Tablet (1024×1366), Mobile (390×844) |

## Browser Projects (playwright.config.ts)

| Project        | Device/Engine | Notes            |
|----------------|---------------|------------------|
| chromium       | Desktop       | Default          |
| firefox        | Desktop       | 1s slowMo        |
| webkit         | Desktop       | 1s slowMo        |
| Mobile-Chrome  | Pixel 5       | Mobile viewport  |
| Mobile-WebKit  | iPhone 13     | 1s slowMo        |

## Key Design Patterns

### Page Object Model (POM)
- Pages in `tests/pages/` encapsulate locators and actions (e.g., `loginPage.ts`)
- URL management centralized in `tests/environments/urls.json`
- Functions exposed for test consumption in spec files

### Utility Wrapper Pattern
All Playwright APIs are wrapped in custom utility functions with error handling:
- **action-utils.ts** — `gotoURL()`, `clickElement()`, `fill()`, `hover()`, `dragAndDrop()`, `wait()`, `acceptAlert()`, etc.
- **assert-utils.ts** — `isVisible()`, `expectElementToHaveText()`, `expectElementToHaveCount()`, `expectElementToHaveAttribute()`, `expectElementToHaveClass()`, etc. (supports soft assertions)
- **element-utils.ts** — `getAttributeOfElement()`, `getTextOfElement()`, `getAllElementText()`
- **locator-utils.ts** — `getLocator()`, `getAllLocators()`, `getCountOfLocators()`, `iterateLocator()`

### Singleton Page
- Global `page` instance managed via `getPage()` and `setPage()` in `page-utils.ts`
- Multi-window support via `switchPage()`

### Error Resilience
- Page closure detection before interactions
- Automatic reload on DOM detachment
- Retry logic for page title retrieval
- Graceful fallbacks for closed pages

## Visual Regression Workflow

### 1. Master Extraction (`typography-master.ts`)
1. Navigate to URL (or use current page)
2. Wait for network idle
3. Extract all text elements' typography properties (font family, size, style, weight, padding, line-height)
4. Extract all image properties (width, height)
5. Deduplicate by class + tag
6. Take full-page screenshot
7. Save as `results/master/<sanitized-url>/master_<timestamp>.json`

### 2. Comparison (`typography-compare.ts`)
1. Re-extract current page typography
2. Load master baseline JSON
3. Compare using normalized class names
4. Identify matched vs mismatched elements
5. Check all links on page (broken link detection)
6. Generate `compare.json` with differences
7. Generate `validated_links.csv` link report
8. Annotate screenshot: green = match, red = mismatch
9. Save all artifacts in `results/compare/<url>_<timestamp>/`
10. Attach all files to Playwright report

### Tolerances
- **Images**: 5px width/height difference allowed
- **Padding**: 5px numeric difference allowed
- **Typography**: Exact match required

## CI/CD (Bitbucket Pipelines)

Two parallel steps in `bitbucket-pipelines.yml`:

| Step       | Filter                      | Projects                              | Workers |
|------------|-----------------------------|---------------------------------------|---------|
| **Mobile** | `--grep @mobile`            | Mobile-Chrome, Mobile-WebKit          | 4       |
| **Desktop**| (all non-mobile)            | chromium, firefox, webkit             | 4       |

Both steps post results to Microsoft Teams via `send-report.js` (pass/fail/skipped/flaky counts, build link, color-coded green/red).

**Artifacts preserved**: `playwright-report/**`, `test-results/**`

## Environment Configuration

### `.env.<env>` files (loaded by `globalSetup.ts`)
Key variables:
- `BASE_URL` — Target application base URL
- `AEM_AUTHOR_URL` — AEM author instance URL
- `AEM_AUTHOR_USERNAME` / `AEM_AUTHOR_PASSWORD` — AEM credentials
- Component-specific URLs: `BIO`, `EXPANDABLE_TEASER`, `PORTFOLIO`, `INSIGHTSFILTER`, `PREFILTER`, `LINKLIST`, `BLOGRELATEDINSIGHTS`, `SIDEBYSIDEINSIGHTS`

### `tests/environments/urls.json`
Centralized URL definitions for page objects (e.g., `{ "login": "https://the-internet.herokuapp.com/login" }`)

## Running Tests

```bash
# Stage environment with chromium
npm run env:stage

# All tests
npx playwright test

# Mobile-tagged tests only
npx playwright test --grep @mobile

# Specific browser
npx playwright test --project chromium

# Specific file
npx playwright test login.spec.ts

# With parallel workers
npx playwright test --workers 4

# Install browsers (runs automatically via postinstall)
npx playwright install
```

## Timeout Constants Reference

| Constant              | Value     |
|-----------------------|-----------|
| `INSTANT_TIMEOUT`     | 1,000ms   |
| `SMALL_TIMEOUT`       | 5,000ms   |
| `STANDARD_TIMEOUT`    | 90,000ms  |
| `BIG_TIMEOUT`         | 30,000ms  |
| `MAX_TIMEOUT`         | 60,000ms  |
| `EXPECT_TIMEOUT`      | 5,000ms   |
| `ACTION_TIMEOUT`      | 5,000ms   |
| `NAVIGATION_TIMEOUT`  | 30,000ms  |
| `TEST_TIMEOUT`        | 120,000ms |

## Adding New Tests

1. **Create a Page Object** in `tests/pages/<pageName>.ts` — encapsulate locators and actions
2. **Add URLs** to `tests/environments/urls.json` if needed
3. **Create a Spec File** in `tests/specFiles/<feature>.spec.ts` — import from page objects and `src/utils/`
4. **Tag mobile tests** with `@mobile` in the test title for CI filtering
5. **Use framework utilities** (`action-utils`, `assert-utils`, etc.) instead of raw Playwright APIs

## Broken Links Detection

- Extracts all `<a href>` elements from page
- Removes `target="_blank"` to allow HEAD requests
- Filters for HTTP/HTTPS links only
- Excludes `https://undefined/` pattern
- Valid status: 200–399 or 403
- Logs errors for 4xx/5xx responses
- Results saved as CSV

## Output & Artifacts

| Artifact                        | Location                                          |
|---------------------------------|---------------------------------------------------|
| HTML report                     | `playwright-report/index.html`                    |
| JSON results                    | `playwright-report/results.json`                  |
| Test results (screenshots/video)| `test-results/`                                   |
| Master baselines                | `results/master/<sanitized-url>/master_*.json`    |
| Comparison results              | `results/compare/<url>_<timestamp>/compare.json`  |
| Link validation CSV             | `results/compare/<url>_<timestamp>/validated_links.csv` |
| Annotated screenshots           | `results/compare/<url>_<timestamp>/screenshot.png`|
