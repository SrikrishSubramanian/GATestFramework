# Test Generation Guide

## Quick Start

### Prerequisites
- AEM author running on `localhost:4502` (or set `AEM_AUTHOR_URL`)
- Node.js + npm installed
- `npm install` completed in GATestFramework root

### Generate tests for existing components (Phase 2)
```bash
env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium --workers 1
```
Scans live AEM DOM for button, feature-banner, statistic. Generates POMs + specs.

### Generate from CSV (Phase 3)
```bash
CSV_PATH=path/to/tests.csv env=local npx playwright test generate-from-csv --config playwright.generators.config.ts --project chromium
```
Optional env vars: `CSV_MAP`, `CATEGORIES`, `A11Y_LEVEL`, `MODE`.

### Generate from Jira ticket (Phase 4)
```bash
# Option A: Pre-fetch with dev-agents-shared (recommended)
# 1. In Claude Code: /read-jira GAAM-XXX
# 2. Then:
JIRA_JSON=.aem-developer/artifacts/requirements.json env=local npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium

# Option B: Direct Jira API
JIRA_TICKET=GAAM-123 JIRA_URL=https://bounteous.jira.com JIRA_USERNAME=you@email JIRA_API_TOKEN=token env=local npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium

# With Figma visual tests:
JIRA_JSON=path/to/req.json FIGMA_DATA=path/to/design.json env=local npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium
```
Auto-detects component from ticket, merges ACs + Figma, generates POMs + specs.

### Generate advanced tests (Phases 5-7)
```bash
env=local npx playwright test generate-advanced --config playwright.generators.config.ts --project chromium --workers 1
```
Generates interaction, state-matrix, visual, broken-image, content-driven, API mock, and dispatcher specs.

### Run generated tests
```bash
env=local npx playwright test tests/specFiles/ga/ --project chromium
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `env` | — | **Required.** Environment name (loads `.env.<env>`) |
| `COMPONENTS` | all | Comma-separated component filter |
| `PHASES` | all | Filter phases: interaction,matrix,visual,figma,mocks,images,content,dispatcher |
| `CSV_PATH` | — | Path to CSV file (Phase 3) |
| `CSV_MAP` | auto-detect | Column mapping overrides |
| `CATEGORIES` | all | Test category filter |
| `A11Y_LEVEL` | wcag22 | `none`, `wcag21`, or `wcag22` |
| `MODE` | author | `author` or `publish` |
| `UPDATE_BASELINE` | false | Capture visual baselines |
| `FIGMA_DATA` | — | Path to Figma JSON file |
| `KKR_AEM_ROOT` | ../kkr-aem | Path to kkr-aem repo (content-driven) |

## Generated File Structure

```
tests/
├── pages/ga/components/
│   ├── buttonPage.ts                    # POM class (class-based, constructor Page)
│   ├── buttonPage.locators.json         # Locator sidecar (multi-strategy per element)
│   ├── featureBannerPage.ts
│   ├── featureBannerPage.locators.json
│   ├── statisticPage.ts
│   └── statisticPage.locators.json
├── specFiles/ga/
│   ├── button/                          # One subfolder per component
│   │   ├── button.author.spec.ts            # Core tests (happy-path, negative, responsive, a11y)
│   │   ├── button.interaction.spec.ts       # Parent-child context tests
│   │   ├── button.matrix.spec.ts            # State matrix (variant x theme x bg x viewport)
│   │   ├── button.visual.spec.ts            # Visual regression / Figma verification
│   │   └── button.images.spec.ts            # Broken image detection
│   ├── feature-banner/                  # Same pattern per component
│   │   └── ...
│   ├── statistic/
│   │   └── ...
│   ├── content-driven.spec.ts           # Cross-component JCR content XML validation
│   ├── api-mock.spec.ts                 # Cross-component API error/empty state tests
│   └── dispatcher.spec.ts              # Cache/redirect testing (non-local only)
├── data/
│   ├── coverage-matrix.json             # Component coverage tracker
│   ├── figma/button.json                # Figma design data (for visual specs)
│   ├── baselines/                       # Visual regression golden screenshots
│   └── mocks/<component>/              # API mock data (success/empty/error)
└── utils/
    ├── generation/                      # Code-producing utilities (used by generators)
    │   ├── dom-scanner.ts               # Live DOM extraction
    │   ├── pom-writer.ts                # POM + sidecar generation
    │   ├── spec-writer.ts               # Category-based spec generation
    │   ├── csv-test-parser.ts           # CSV → test case parser
    │   ├── requirements-merger.ts       # Jira/Figma requirements bridge
    │   ├── interaction-detector.ts      # Parent-child nesting detection
    │   ├── state-matrix-generator.ts    # Combinatorial state testing
    │   ├── broken-image-detector.ts     # Image health scanning
    │   ├── baseline-manager.ts          # Visual baseline capture
    │   ├── visual-assertion-generator.ts # Figma → visual assertion spec
    │   ├── content-driven-generator.ts  # JCR XML analysis
    │   ├── dispatcher-tester.ts         # Cache header verification
    │   ├── coverage-matrix-reporter.ts  # Coverage tracking
    │   └── html-summary-writer.ts       # HTML test summary generation
    │
    └── infra/                           # Runtime utilities (used by specs)
        ├── env.ts                       # Environment config
        ├── auth-fixture.ts              # AEM authentication
        ├── locator-registry.ts          # Multi-locator strategy
        ├── test-tagger.ts               # Smart tag assignment
        ├── api-mock-helper.ts           # Route mocking utilities
        ├── console-capture.ts           # Browser error capture
        ├── report-enhancer.ts           # HTML report attachments
        ├── test-logger.ts               # JSON run logging
        └── screenshot-compare.ts        # Pixel diff utility

```

## Test Categories & Tags

| Tag | Category | Description |
|-----|----------|-------------|
| `@smoke` | happy-path | Critical user flows |
| `@regression` | all | Full suite |
| `@a11y @wcag22` | accessibility | axe-core + WCAG 2.2 custom tests |
| `@visual` | visual | Figma/baseline comparison |
| `@negative` | negative | Boundary/error scenarios |
| `@mobile` | responsive | Mobile viewport |
| `@interaction` | interaction | Parent-child context adaptation |
| `@matrix` | state-matrix | Combinatorial state testing |

## Adding a New Component

1. Add entry to `AVAILABLE_COMPONENTS` in `tests/generators/generate-advanced.ts`
2. Add `KNOWN_VARIANTS` entry in `state-matrix-generator.ts` (for matrix tests)
3. Run the generators:
   ```bash
   COMPONENTS=new-component env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium --workers 1
   COMPONENTS=new-component env=local npx playwright test generate-advanced --config playwright.generators.config.ts --project chromium --workers 1
   ```

## Logs

Run logs saved to `logs/YYYY-MM-DD/run-<timestamp>.json`. Clean up with:
```bash
npx ts-node scripts/cleanup-logs.ts
```
