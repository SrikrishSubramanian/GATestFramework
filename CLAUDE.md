# CLAUDE.md

## Hard Rules

- **No `cd`** — working directory is already `GATestFramework/`. Run commands directly.
- **No repo scanning** — read `repo-overview.md` for structure. No explore agents, no `ls`/`Glob` unless a file isn't in the summary.
- **No guessing selectors** — run the Playwright pipeline against live AEM DOM.
- **No modifying kkr-aem** from this repo.
- **No staging `.claude/`** — it's gitignored.

> **Start here:** Read `repo-overview.md` first — it has the full project structure, utility index, generation pipeline details, and conventions.

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
# NOTE: Generators use a separate config because they live outside testDir
env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium --workers 1

# Generate advanced tests (interaction, matrix, visual, images, content, mocks)
env=local npx playwright test generate-advanced --config playwright.generators.config.ts --project chromium --workers 1

# Generate from CSV
CSV_PATH=file.csv env=local npx playwright test generate-from-csv --config playwright.generators.config.ts --project chromium

# Generate from Jira/Figma
JIRA_JSON=req.json COMPONENT=text env=local npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium

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

## AEM Development Conventions (from kkr-aem docs/dev-conventions.md)

Tests must validate that AEM components follow these project conventions. Use these as the basis for convention-compliance test assertions.

### HTML / Accessibility (what tests should verify in rendered DOM)
- Semantic HTML5 elements: `<nav>`, `<section>`, `<header>`, `<button>`, `<ol>`, `<li>` — not generic `<div>`s
- Headings use `<h1>`–`<h6>` tags (not styled divs/spans)
- All `<img>` elements have `alt` attributes; decorative images use empty `alt=""`
- `<label>` elements associated with form controls via `for` attribute
- `aria-live` on dynamically updated regions; `required` on required form fields
- No inline CSS or JS in component markup
- All tags/attributes lowercase; double quotes on attribute values
- No trailing slashes on self-closing elements (HTML5)
- HTL comments (`<!--/* */-->`) must NOT appear in published HTML output

### CSS / BEM Naming (what tests should verify via computed styles and class names)
- Component root selector: `.cmp-<component>` (BEM block)
- Child elements: `.cmp-<component>__<element>` (BEM element)
- Modifiers: `.cmp-<component>--<modifier>` or style-system classes
- All CSS class names lowercase with hyphens
- No ID-based selectors used for styling
- Zero-value properties should have no units (`margin: 0` not `margin: 0px`)

### Interactive States (what tests should verify for interactive components)
- All 5 states render correctly: default, hover, focus, active, disabled
- Focus indicators visible on keyboard Tab navigation
- Both light-background and dark-background variants tested
- State transitions use CSS transitions (not instant changes)

### AEM Component Structure (what tests should verify in author mode)
- Components show placeholder when required authored fields are empty
- Dialog fields have `fieldDescription` for non-obvious inputs
- Components have visible `cq:icon` in the component browser

## Permissions & Shell

- **All file reads and writes are allowed** — do not ask for permission before reading or writing files.
- **Windows 11**, bash shell
- **Python**: Use `py -3` (not `python` or `python3`)
- **Temp paths**: Use `${TMPDIR:-${TEMP:-${TMP:-/tmp}}}` fallback chain
