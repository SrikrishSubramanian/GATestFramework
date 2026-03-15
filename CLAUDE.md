# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Start here:** Read `repo-overview.md` first — it has the full project structure, utility index, generation pipeline details, and conventions. Skip repo scanning.

## Project Overview

Playwright-based E2E test automation framework for Global Atlantic (GA) web applications on AEM. Combines manual test authoring with a 7-phase auto-generation pipeline producing POM classes, locator sidecars, and categorized spec files across 5+ browser projects.

## Build & Run Commands

```bash
# Run all generated GA tests
env=local npx playwright test tests/specFiles/ga/ --project chromium

# Run a specific component's tests
env=local npx playwright test tests/specFiles/ga/button/ --project chromium

# Run by tag
npx playwright test --grep @mobile
npx playwright test --grep @a11y
npx playwright test --grep @smoke

# Generate tests from live DOM (requires AEM on localhost:4502)
env=local npx playwright test tests/generators/generate-components.ts --project chromium --workers 1

# Generate advanced tests (interaction, matrix, visual, images, content, mocks)
env=local npx playwright test tests/generators/generate-advanced.ts --project chromium --workers 1

# Generate from CSV
CSV_PATH=file.csv env=local npx playwright test tests/generators/generate-from-csv.ts --project chromium

# Generate from Jira/Figma
JIRA_JSON=req.json env=local npx playwright test tests/generators/generate-from-jira.ts --project chromium

# Environment-specific runs (local, dev, qa, uat, prod)
env=qa npx playwright test tests/specFiles/ga/ --project chromium

# Clean up old logs
npm run cleanup:logs

# Install (also runs playwright install via postinstall)
npm install
```

## Architecture

### Three Utils Layers (do not conflate)

| Layer | Location | Pattern | Used By |
|-------|----------|---------|---------|
| **Framework core** | `src/utils/` | Singleton `getPage()`, function exports | Hand-written specs (`login.spec.ts`) |
| **Generation pipeline** | `tests/utils/generation/` | Class-based, code-producing | Orchestrators in `tests/generators/` |
| **Test infrastructure** | `tests/utils/infra/` | Class-based, constructor `Page` injection | Auto-generated + hand-written specs |

`src/utils/` wraps Playwright APIs for manual authoring. `tests/utils/generation/` produces test code (POMs, specs). `tests/utils/infra/` provides runtime utilities consumed by specs.

### Auto-Generated POM Pattern

Each component gets a class-based POM (`tests/pages/ga/components/<name>Page.ts`) plus a locator sidecar (`<name>Page.locators.json`) with multi-strategy confidence-scored locators. The `locator-registry.ts` resolves locators by trying strategies in confidence order with fallback.

### Generated Spec Categories

Each component produces 5 spec files in `tests/specFiles/ga/<component>/`:

| Suffix | Tags | Content |
|--------|------|---------|
| `.author.spec.ts` | `@smoke @regression @a11y` | Happy-path, negative, responsive, accessibility |
| `.interaction.spec.ts` | `@interaction @regression` | Parent-child context adaptation |
| `.matrix.spec.ts` | `@matrix @regression` | Combinatorial: variant x theme x background x viewport |
| `.visual.spec.ts` | `@visual` | Figma/baseline visual comparison |
| `.images.spec.ts` | `@regression` | Broken images, alt text, oversized, CLS |

Plus cross-component specs: `api-mock.spec.ts` and `content-driven.spec.ts`.

### Test Generation Pipeline

Orchestrators live in `tests/generators/generate-*.ts`. They drive utilities in `tests/utils/` through 7 phases: DOM scanning → POM generation → CSV import → Jira/Figma merge → advanced tests (interaction, matrix, visual) → quality/reporting → content/API/dispatcher testing.

### Adding New Components

1. Add to `AVAILABLE_COMPONENTS` in `tests/generators/generate-components.ts` and `tests/generators/generate-advanced.ts`
2. Add `KNOWN_VARIANTS` entry in `state-matrix-generator.ts`
3. Run both generators with `COMPONENTS=new-component`

## Playwright Agent (Test Generation)

Automated test case generation is handled by a separate Claude Code agent at `../playwright-agent/`. It writes generated code into this repo — never edit the agent's own files from here.

**Commands** (run from the playwright-agent directory):
- `/automate excel <path>` — Generate tests from CSV/Excel test cases
- `/automate jira <ticket-key>` — Generate tests from Jira tickets (+ optional Figma)
- `/automate component <name>` — Generate tests by scanning live DOM or source code

**Sub-agents**: `test-generator` (specs, sonnet), `page-object-generator` (POMs, haiku), `figma-verifier` (visual specs, sonnet)

**Output locations in this repo**:
- POMs → `tests/pages/ga/components/` or `tests/pages/ga/pages/`
- Specs → `tests/specFiles/ga/`
- Locator sidecars → `*.locators.json` alongside POMs

See `../playwright-agent/CLAUDE.md` for full agent documentation.

## Environment Configuration

Environment selected via `env=<name>` prefix. Config loaded from `tests/environments/.env.<env>` by `globalSetup.ts`. Key vars: `BASE_URL`, `AEM_AUTHOR_URL`, `AEM_AUTHOR_USERNAME`, `AEM_AUTHOR_PASSWORD`.

## Playwright Config

- 5 browser projects: chromium, webkit, Mobile-Chrome (Pixel 5), Mobile-WebKit (iPhone 13)
- Timeout: 15 minutes
- Fully parallel
- Screenshot: on-failure; Video: on; Trace: on-first-retry
- Test directory: `./tests/specFiles`

## CI/CD (Bitbucket Pipelines)

Two parallel steps: **Mobile** (`--grep @mobile`, Mobile-Chrome + Mobile-WebKit) and **Desktop** (chromium, firefox, webkit), 4 workers each. Results posted to Microsoft Teams via `send-report.js`.

## Permissions & Shell

- **All file reads and writes are allowed** — do not ask for permission before reading or writing files.
- **Do not `cd` into this repo directory** — the working directory is already `GATestFramework/`. Use relative or absolute paths directly.
- **Windows 11**, bash shell
- **Python**: Use `py -3` (not `python` or `python3`)
- **Temp paths**: Use `${TMPDIR:-${TEMP:-${TMP:-/tmp}}}` fallback chain
