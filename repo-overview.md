# GATestFramework — Repository Overview

> **For agents:** Read this file first instead of scanning the repo. It contains the full project structure, patterns, and conventions.

## Purpose

A **Playwright-based E2E test automation framework** for testing Global Atlantic (GA) web applications on AEM (Adobe Experience Manager). Covers UI testing, visual regression, broken link/image detection, accessibility (WCAG 2.2), responsive design validation, and component interaction testing across multiple browsers and devices.

## Tech Stack

- **Playwright** v1.51.1 + **TypeScript** (strict mode, ES2016 target)
- **CI/CD**: Bitbucket Pipelines (parallel mobile + desktop steps)
- **Reporting**: Playwright HTML/JSON + Microsoft Teams webhook notifications
- **Accessibility**: `@axe-core/playwright` for automated WCAG 2.2 AA scanning
- **Data**: CSV (csv-parser/csv-writer/json2csv), JSON, dotenv for env config
- **Package Manager**: npm

## Project Structure

```
GATestFramework/
├── src/                                    # FRAMEWORK CORE — Playwright API wrappers
│   ├── setup/
│   │   ├── optional-parameter-types.ts     # TS type defs for Playwright options
│   │   └── page-setup.ts                  # Custom test base config (custom test exports)
│   └── utils/                             # Low-level Playwright API wrappers (singleton page pattern)
│       ├── action-utils.ts                # click, fill, hover, navigation, alerts, drag-and-drop
│       ├── assert-utils.ts                # visibility, text, attribute, class, count assertions
│       ├── element-utils.ts               # text/attribute extraction helpers
│       ├── locator-utils.ts               # locator resolution (string | Locator), counting, iteration
│       ├── page-utils.ts                  # singleton page state (getPage/setPage/switchPage)
│       ├── request-utils.ts               # HTTP request helpers
│       └── timeout-constants.ts           # INSTANT(1s), SMALL(5s), STANDARD(90s), BIG(30s), etc.
│
├── tests/                                  # TEST LAYER — specs, pages, data, infrastructure
│   ├── specs/                             # Test specification files (Playwright testDir)
│   │   ├── login.spec.ts                  # Manual/hand-written test specs
│   │   ├── unit/                          # Unit tests for framework utilities
│   │   │   ├── locator-registry.unit.spec.ts
│   │   │   ├── test-data-factory.unit.spec.ts
│   │   │   ├── console-capture.unit.spec.ts
│   │   │   ├── screenshot-compare.unit.spec.ts
│   │   │   ├── test-logger.unit.spec.ts
│   │   │   └── phase2-7.unit.spec.ts
│   │   ├── ga/                            # Auto-generated GA component specs
│   │   │   ├── button/                    # Button component test suite
│   │   │   │   ├── button.author.spec.ts      # Core tests (happy-path, negative, responsive, a11y)
│   │   │   │   ├── button.interaction.spec.ts # Parent-child context adaptation tests
│   │   │   │   ├── button.matrix.spec.ts      # State matrix (variant x theme x bg x viewport)
│   │   │   │   ├── button.visual.spec.ts      # Visual regression / Figma verification
│   │   │   │   └── button.images.spec.ts      # Broken image detection
│   │   │   ├── feature-banner/            # Feature Banner component test suite
│   │   │   │   └── ... (same pattern)
│   │   │   ├── statistic/                 # Statistic component test suite
│   │   │   │   └── ... (same pattern)
│   │   │   ├── api-mock.spec.ts           # Cross-component API error/empty state tests
│   │   │   └── content-driven.spec.ts     # Cross-component JCR content XML validation
│   │   ├── generate-components.spec.ts    # Orchestrator: DOM scan → POM + spec generation
│   │   ├── generate-from-csv.spec.ts      # Orchestrator: CSV → POM + spec generation
│   │   ├── generate-from-jira.spec.ts     # Orchestrator: Jira/Figma → POM + spec generation
│   │   └── generate-advanced.spec.ts      # Orchestrator: interaction, matrix, visual, images, content
│   │
│   ├── pages/                             # Page Object Models (POMs)
│   │   ├── loginPage.ts                   # Hand-written POM (function-export pattern)
│   │   └── ga/
│   │       ├── components/                # Auto-generated component POMs (class pattern)
│   │       │   ├── buttonPage.ts              # Class-based POM with constructor Page injection
│   │       │   ├── buttonPage.locators.json   # Locator sidecar (multi-strategy per element)
│   │       │   ├── featureBannerPage.ts
│   │       │   ├── featureBannerPage.locators.json
│   │       │   ├── statisticPage.ts
│   │       │   └── statisticPage.locators.json
│   │       └── pages/                     # Auto-generated full-page POMs (future)
│   │
│   ├── data/                              # Test data and artifacts
│   │   ├── coverage-matrix.json           # Component test coverage tracker (auto-updated)
│   │   ├── sample-jira-requirements.json  # Sample Jira requirements-reader output
│   │   ├── figma/                         # Figma design specs for visual assertions
│   │   │   └── button.json
│   │   ├── baselines/                     # Visual regression golden screenshots
│   │   └── mocks/                         # API mock data per component
│   │       └── <component>/{success,empty,error}.json
│   │
│   ├── environments/                      # Environment configuration
│   │   ├── .env.local                     # Local AEM instance (localhost:4502)
│   │   ├── .env.dev / .env.qa / .env.uat / .env.prod
│   │   └── urls.json                      # Centralized URL config for test pages
│   │
│   └── utils/                             # Test infrastructure and generation utilities
│       │
│       │ ── Pre-existing infrastructure ──
│       ├── globalSetup.ts                 # Global setup — loads .env.<env> via dotenv
│       ├── env.ts                         # ENV class (BASE_URL, AEM_AUTHOR_URL, credentials)
│       ├── brokenLinksUtils.ts            # Link validation (extract <a href>, check HTTP status)
│       ├── csvUtls.ts                     # CSV handling utilities
│       ├── reportAttach.ts                # Artifact attachment to Playwright HTML report
│       ├── typography-master.ts           # Master baseline extraction
│       ├── typography-compare.ts          # Visual comparison against baseline
│       ├── typography-*-execute.ts        # Typography execution wrappers
│       │
│       │ ── Generation pipeline ──
│       ├── dom-scanner.ts                 # Live DOM extraction (BEM, semantic naming)
│       ├── source-scanner.ts              # Source-based POM generation (HTL/dialog/LESS)
│       ├── pom-writer.ts                  # POM class + locator sidecar generation
│       ├── spec-writer.ts                 # Category-based spec file generation
│       ├── csv-test-parser.ts             # CSV → structured test cases
│       ├── requirements-merger.ts         # Jira requirements-reader bridge + Figma merge
│       ├── visual-assertion-generator.ts  # Figma design spec → visual assertion spec
│       │
│       │ ── Advanced test generators ──
│       ├── interaction-detector.ts        # Parent-child nesting + theme adaptation detection
│       ├── state-matrix-generator.ts      # Combinatorial variant x theme x bg x viewport
│       ├── broken-image-detector.ts       # Image health (broken, missing alt, oversized, CLS)
│       ├── baseline-manager.ts            # Visual baseline capture + responsive screenshots
│       ├── content-driven-generator.ts    # JCR content XML analysis
│       ├── dispatcher-tester.ts           # Cache header verification (deployed envs)
│       ├── api-mock-helper.ts             # Playwright page.route() mocking
│       │
│       │ ── Test infrastructure ──
│       ├── locator-registry.ts            # Multi-locator strategy (testid/id/aria/text/css/xpath)
│       ├── test-tagger.ts                 # Smart tag assignment (@smoke, @regression, @a11y, etc.)
│       ├── test-data-factory.ts           # Realistic test data generator (no external deps)
│       ├── console-capture.ts             # Browser JS error + failed request capture
│       ├── screenshot-compare.ts          # Pixel diff utility for visual tests
│       ├── auth-fixture.ts                # AEM authentication fixture
│       │
│       │ ── Reporting ──
│       ├── test-logger.ts                 # Per-run JSON logging to logs/
│       ├── report-enhancer.ts             # HTML report annotations (console errors, locator fallbacks)
│       └── coverage-matrix-reporter.ts    # Coverage tracking + formatted report
│
├── logs/                                   # Test run logs (JSON, cleaned weekly)
│   └── YYYY-MM-DD/run-<timestamp>.json
├── scripts/
│   └── cleanup-logs.ts                    # Delete logs older than 7 days
│
├── playwright.config.ts                   # 5+ browser projects, 15min timeout, fullyParallel
├── tsconfig.json                          # TypeScript compiler options (strict mode)
├── package.json                           # Dependencies & npm scripts
├── bitbucket-pipelines.yml                # Parallel mobile/desktop CI pipelines
├── send-report.js                         # Teams notification script
└── .gitignore
```

## Two Utils Directories — Why?

| Directory | Purpose | Pattern | Used by |
|-----------|---------|---------|---------|
| **`src/utils/`** | Playwright API wrappers | Singleton `getPage()` pattern, function exports | Hand-written specs (e.g., `login.spec.ts`) |
| **`tests/utils/`** | Test infrastructure + generation | Class-based, constructor-injected `Page` | Auto-generated specs, orchestrators |

`src/utils/` is the **original framework layer** — thin wrappers around Playwright APIs (`clickElement()`, `getLocator()`, `isVisible()`) using a singleton page. These are used by manually written tests.

`tests/utils/` is the **generation + infrastructure layer** — DOM scanning, POM/spec generation, environment config, accessibility, coverage tracking. These are used by the auto-generation orchestrators and the generated test specs.

The two don't overlap: `src/utils/` wraps Playwright APIs for manual test authoring; `tests/utils/` provides the machinery to auto-generate and run tests at scale.

## Test Generation Pipeline

### Orchestrators (run these to generate tests)

| Orchestrator | Purpose | Command |
|-------------|---------|---------|
| `generate-components.spec.ts` | DOM scan → POM + spec | `env=local npx playwright test generate-components.spec --project chromium --workers 1` |
| `generate-from-csv.spec.ts` | CSV → POM + spec | `CSV_PATH=file.csv env=local npx playwright test generate-from-csv.spec --project chromium` |
| `generate-from-jira.spec.ts` | Jira ticket → POM + spec | `JIRA_JSON=req.json env=local npx playwright test generate-from-jira.spec --project chromium` |
| `generate-advanced.spec.ts` | Interaction, matrix, visual, images, content, mocks | `env=local npx playwright test generate-advanced.spec --project chromium --workers 1` |

### What gets generated

For each component (e.g., button), the pipeline produces:
- **POM**: `tests/pages/ga/components/buttonPage.ts` + `buttonPage.locators.json`
- **Specs**: `tests/specs/ga/button/button.{author,interaction,matrix,visual,images}.spec.ts`
- **Coverage**: Updated `tests/data/coverage-matrix.json`

## Test Categories & Tags

| Tag | Category | Description |
|-----|----------|-------------|
| `@smoke` | happy-path | Critical user flows (~2 min) |
| `@regression` | all | Full suite (~30 min) |
| `@a11y @wcag22` | accessibility | axe-core WCAG 2.2 AA + custom gap tests |
| `@visual` | visual | Figma/baseline comparison |
| `@negative` | negative | Boundary/error scenarios |
| `@mobile` | responsive | Mobile viewport |
| `@interaction` | interaction | Parent-child context adaptation |
| `@matrix` | state-matrix | Combinatorial state testing |

## Page Object Models

### Hand-written (original pattern)
```typescript
// tests/pages/loginPage.ts — function exports, singleton getPage()
import { getLocator } from '../../src/utils/locator-utils';
export const usernameInput = () => getLocator('#username');
export async function login(user: string, pass: string) { ... }
```

### Auto-generated (new pattern)
```typescript
// tests/pages/ga/components/buttonPage.ts — class-based, constructor Page
import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '../../../utils/locator-registry';
const registry = loadLocators(path.join(__dirname, 'buttonPage.locators.json'));

export class ButtonPage {
  constructor(private page: Page) {}
  async navigate(baseUrl: string) { ... }
  get primaryButton(): Promise<Locator> { return resolveLocator(this.page, registry.entries.primaryButton); }
}
```

### Locator sidecar (*.locators.json)
Multi-strategy per element with confidence scoring:
```json
{
  "entries": {
    "Learn_More": {
      "name": "Learn_More",
      "strategies": [
        { "type": "text", "value": "Learn More", "confidence": 0.8 },
        { "type": "css", "value": ".button a", "confidence": 0.6 }
      ]
    }
  }
}
```

## Browser Projects (playwright.config.ts)

| Project | Device/Engine | Viewport |
|---------|---------------|----------|
| chromium | Desktop | 1440x900, 3660x1560, 1024x1366, 390x844 |
| webkit (Safari) | Desktop | Same viewports |
| Mobile-Chrome | Pixel 5 | Mobile |
| Mobile-WebKit | iPhone 13 | Mobile |

## Environment Configuration

### `.env.<env>` files (loaded by `globalSetup.ts` when `env=<name>` is set)

| Variable | Description |
|----------|-------------|
| `BASE_URL` | Target publish URL |
| `AEM_AUTHOR_URL` | AEM author instance (default: `http://localhost:4502`) |
| `AEM_AUTHOR_USERNAME` / `AEM_AUTHOR_PASSWORD` | AEM credentials |

Select with: `env=local npx playwright test` or `env=qa npx playwright test`

## Integration with dev-agents-shared

The Jira/Figma test generation (Phase 4) integrates with the `dev-agents-shared` plugin:

| Agent | Purpose | Output consumed by |
|-------|---------|-------------------|
| `requirements-reader` | Fetches Jira ticket → structured JSON | `generate-from-jira.spec.ts` via `JIRA_JSON` env var |
| `design-reader` | Extracts Figma design spec → JSON | `generate-advanced.spec.ts` via `FIGMA_DATA` env var |

The `requirements-merger.ts` utility bridges the requirements-reader JSON output into the test generation pipeline via `fromRequirementsReader()`.

## CI/CD (Bitbucket Pipelines)

| Step | Filter | Projects | Workers |
|------|--------|----------|---------|
| **Mobile** | `--grep @mobile` | Mobile-Chrome, Mobile-WebKit | 4 |
| **Desktop** | (all non-mobile) | chromium, firefox, webkit | 4 |

Results posted to Microsoft Teams via `send-report.js`.

## Running Tests

```bash
# Generate tests for components (requires AEM running on localhost:4502)
env=local npx playwright test generate-components.spec --project chromium --workers 1

# Run all generated GA tests
env=local npx playwright test tests/specFiles/ga/ --project chromium

# Run a specific component's tests
env=local npx playwright test tests/specFiles/ga/button/ --project chromium

# Run mobile-tagged tests only
npx playwright test --grep @mobile

# Run accessibility tests only
npx playwright test --grep @a11y
```

## Adding New Components

1. Add entry to `AVAILABLE_COMPONENTS` in `generate-components.spec.ts` and `generate-advanced.spec.ts`
2. Add `KNOWN_VARIANTS` entry in `state-matrix-generator.ts` (for matrix tests)
3. Run the generators:
   ```bash
   COMPONENTS=new-component env=local npx playwright test generate-components.spec --project chromium --workers 1
   COMPONENTS=new-component env=local npx playwright test generate-advanced.spec --project chromium --workers 1
   ```
4. Generated files appear in `tests/specs/ga/<component>/` and `tests/pages/ga/components/`
