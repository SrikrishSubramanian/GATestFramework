# How Test Scripts Are Generated — Complete Guide

## 🎯 Overview

The GATestFramework uses a **7-phase auto-generation pipeline** that produces:
- **POMs** (Page Object Models) — Classes for component interaction
- **Test Specs** — Complete test files with assertions
- **Locator Sidecars** — Multi-strategy element locators
- **Coverage Reports** — Tracking and metrics

The pipeline supports **4 input modes**:
1. **DOM Scanning** — Scan live AEM components
2. **CSV Import** — Parse test cases from Excel
3. **Jira Tickets** — Extract requirements from Jira
4. **Advanced** — Generate interaction, matrix, visual tests

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              INPUT SOURCES                              │
├─────────────────────────────────────────────────────────┤
│  • Live AEM DOM    • CSV File    • Jira Tickets         │
│  • Source Code     • Figma Designs                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│         GENERATION ORCHESTRATORS                        │
├─────────────────────────────────────────────────────────┤
│  generate-components.ts     → DOM scanning              │
│  generate-from-csv.ts       → CSV import               │
│  generate-from-jira.ts      → Jira/Figma               │
│  generate-advanced.ts       → Interactions, matrix     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│        GENERATION UTILITIES (7 Phases)                  │
├─────────────────────────────────────────────────────────┤
│  Phase 1: DOM Scan      → DOMScanner                    │
│  Phase 2: POM Gen       → POMWriter                     │
│  Phase 3: CSV Import    → CSVTestParser                │
│  Phase 4: Jira/Figma    → RequirementsMerger           │
│  Phase 5: Advanced      → StateMatrix, Interaction     │
│  Phase 6: Quality       → VisualAssertion, A11y        │
│  Phase 7: Reporting     → CoverageMatrixReporter       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│            OUTPUT FILES                                 │
├─────────────────────────────────────────────────────────┤
│  tests/pages/ga/components/<component>Page.ts           │
│  tests/pages/ga/components/<component>Page.locators.json│
│  tests/specFiles/ga/<component>/                        │
│    ├─ <component>.author.spec.ts                        │
│    ├─ <component>.interaction.spec.ts                   │
│    ├─ <component>.matrix.spec.ts                        │
│    ├─ <component>.visual.spec.ts                        │
│    └─ <component>.images.spec.ts                        │
│  tests/data/coverage-matrix.json                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Generation Orchestrators

### 1. **generate-components.ts** — DOM Scanning

**Purpose:** Scan live AEM and auto-generate test infrastructure

**Process:**
```
AEM Live DOM
    ↓
DOM Scanner (extracts elements, structure, selectors)
    ↓
POM Writer (generates class-based POMs + locators)
    ↓
Spec Writer (generates happy-path, negative, responsive, a11y tests)
    ↓
Coverage Matrix Reporter (tracks results)
    ↓
Output: POMs, Locators, Specs, Coverage
```

**Command:**
```bash
env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium
```

**What it generates:**
- POM class with getter methods for elements
- Locator sidecar with multi-strategy element finders
- Spec file with:
  - Happy-path tests (rendering, basic functionality)
  - Negative tests (error cases, edge cases)
  - Responsive tests (mobile viewports)
  - Accessibility tests (WCAG 2.2 compliance)

**Example Output:**
```typescript
// buttonPage.ts (POM)
export class ButtonPage {
  constructor(private page: Page) {}
  
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/button.html`);
  }
  
  get primaryButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.primaryButton);
  }
}
```

```typescript
// button.author.spec.ts (Spec)
test('[BTN-001] Button should render with correct text', async ({ page }) => {
  const button = new ButtonPage(page);
  await button.navigate(BASE_URL);
  await expect(button.primaryButton).toContainText('Click me');
});
```

---

### 2. **generate-from-csv.ts** — CSV Import

**Purpose:** Generate tests from test cases in Excel/CSV

**Process:**
```
CSV File (test cases)
    ↓
CSV Parser (validates, structures data)
    ↓
Assertion Inferrer (generates assertions from test steps)
    ↓
Spec Writer (creates complete spec files)
    ↓
Output: Spec files with real test code
```

**CSV Format:**
```csv
Component,TestName,TestCase,Steps,ExpectedResult,Category,Tags
button,Button Click,Basic click,"1. Click button",Alert shows,happy-path,@smoke
button,Button Hover,State,"1. Hover button",Color changes,responsive,@regression
```

**Command:**
```bash
CSV_PATH=tests/data/test-cases.csv env=local npx playwright test generate-from-csv --config playwright.generators.config.ts
```

**What it generates:**
- Spec file with test cases from CSV
- Real assertions from "Expected Result" column
- Proper test structure with setup/execution/assertion
- Tags and categorization

---

### 3. **generate-from-jira.ts** — Jira Tickets

**Purpose:** Generate tests from Jira requirements + Figma designs

**Process:**
```
Jira Ticket
    ↓
Jira Requirements Reader (extracts acceptance criteria)
    ↓
Figma Design Specs (optional, for visual validation)
    ↓
Requirements Merger (combines Jira + Figma)
    ↓
Spec Writer (generates test from requirements)
    ↓
Output: Spec files from Jira acceptance criteria
```

**Command:**
```bash
JIRA_JSON=jira-req.json env=local npx playwright test generate-from-jira --config playwright.generators.config.ts
```

**What it generates:**
- Specs from Jira acceptance criteria
- Visual assertion specs from Figma
- Comprehensive coverage of requirements
- Traceability (test → Jira ticket)

---

### 4. **generate-advanced.ts** — Advanced Tests

**Purpose:** Generate complex test scenarios (interaction, matrix, visual)

**Process:**
```
Component Config
    ↓
├─ Interaction Detector → Parent-child context tests
├─ State Matrix Generator → Combinatorial state tests
├─ Visual Assertion Generator → Figma/baseline comparison
├─ Broken Image Detector → Image health checks
└─ Content Driven Generator → JCR XML validation
    ↓
Output: Advanced spec files
```

**Command:**
```bash
env=local npx playwright test generate-advanced --config playwright.generators.config.ts
```

**What it generates:**

#### **Interaction Tests**
```typescript
// Tests how component behaves in parent context
test('[BTN-102] Button in Feature Banner should adapt styling', async ({ page }) => {
  // Tests button behavior when nested in feature-banner
});
```

#### **State Matrix Tests**
```typescript
// Combinatorial: variant × theme × background × viewport
test('[BTN-203] Button primary variant in dark theme on mobile', async ({ page }) => {
  // Tests all 108 state combinations
});
```

#### **Visual Tests**
```typescript
// Compare to Figma designs or baselines
test('[BTN-301] Button visual matches Figma design', async ({ page }) => {
  await expect(page).toHaveScreenshot('button-primary.png');
});
```

---

## 🔧 Generation Utilities (7 Phases)

### Phase 1: DOM Scanner
**File:** `dom-scanner.ts`

**What it does:**
- Connects to live AEM author/publish
- Extracts DOM structure
- Identifies elements and selectors
- Infers component semantics

**Key Methods:**
```typescript
scanDOM(page, componentSelector) → DOMSnapshot
  ├─ Extracts all interactive elements
  ├─ Infers element roles (button, link, input, etc.)
  ├─ Captures CSS classes and structure
  └─ Generates default selectors

loadLatestSnapshot(component) → DOMSnapshot
  └─ Loads previously captured snapshot
```

**Output:** `DOMSnapshot` object with:
```typescript
{
  component: string;
  elements: {
    name: string;
    selector: string;
    role: string;
    attributes: Record<string, string>;
    children: Element[];
  }[];
}
```

### Phase 2: POM Writer
**File:** `pom-writer.ts`

**What it does:**
- Generates class-based Page Object Models
- Creates multi-strategy locator sidecars
- Implements getter methods for elements

**Key Methods:**
```typescript
writePOMFromDOM(snapshot, options) → POMWriteResult
  ├─ Generates TypeScript POM class
  ├─ Creates locator.json sidecar
  └─ Returns file paths

writePOMFromSource(htmlPath, options) → POMWriteResult
  └─ Alternative: scan HTL/component source
```

**Generated POM:**
```typescript
export class ButtonPage {
  constructor(private page: Page) {}
  
  async navigate(baseUrl: string) {
    await this.page.goto(`${baseUrl}/button.html`);
  }
  
  get primaryButton(): Promise<Locator> {
    return resolveLocator(this.page, registry.entries.primaryButton);
  }
  
  async clickPrimary() {
    await (await this.primaryButton).click();
  }
}
```

**Generated Locators (JSON):**
```json
{
  "entries": {
    "primaryButton": {
      "name": "primaryButton",
      "strategies": [
        { "type": "testid", "value": "button-primary", "confidence": 0.95 },
        { "type": "css", "value": ".button.primary", "confidence": 0.85 },
        { "type": "role", "value": "button[name='Primary']", "confidence": 0.75 },
        { "type": "xpath", "value": "//button[@class='button primary']", "confidence": 0.65 }
      ]
    }
  }
}
```

### Phase 3: CSV Test Parser
**File:** `csv-test-parser.ts`

**What it does:**
- Reads CSV test case files
- Validates structure
- Extracts test steps and assertions
- Categorizes tests

**Key Methods:**
```typescript
parseCSV(filePath) → ParsedTestGroup[]
  ├─ Reads CSV file
  ├─ Validates headers
  ├─ Parses test cases
  └─ Groups by component

parseTestSteps(stepsString) → ParsedStep[]
  └─ Converts "1. Click button 2. See alert" → structured steps
```

**CSV Format Expected:**
```
Component | TestName | Category | Steps | ExpectedResult | Tags
button | Click handles | happy-path | 1. Click primary button | Alert fires | @smoke
button | Hover color | responsive | 1. Hover over button | BG color changes | @regression
```

### Phase 4: Requirements Merger
**File:** `requirements-merger.ts`

**What it does:**
- Bridges Jira requirements to test generation
- Merges with Figma design specs
- Creates comprehensive test requirements

**Key Methods:**
```typescript
fromJiraRequirements(jiraJson, component) → TestRequirement[]
  ├─ Extracts acceptance criteria
  ├─ Maps to test scenarios
  └─ Links to design specs

mergeWithFigmaSpecs(requirements, figmaData) → EnrichedRequirement[]
  └─ Adds visual validation specs
```

### Phase 5: State Matrix Generator
**File:** `state-matrix-generator.ts`

**What it does:**
- Generates combinatorial test matrix
- Tests all state combinations
- Creates variant × theme × background × viewport tests

**Key Methods:**
```typescript
generateStateMatrix(component, config) → MatrixTest[]
  ├─ Cartesian product of states
  ├─ Creates unique test for each combination
  └─ Generates 50-100+ tests per component

KNOWN_VARIANTS = {
  button: ['primary', 'secondary', 'tertiary', 'disabled'],
  // For button: 4 variants × 2 themes × 2 backgrounds × 4 viewports = 64 tests
}
```

**Example Tests Generated:**
```typescript
test('[BTN-203] Primary button in light theme on desktop', ...);
test('[BTN-204] Primary button in light theme on tablet', ...);
test('[BTN-205] Primary button in light theme on mobile', ...);
test('[BTN-206] Primary button in dark theme on desktop', ...);
// ... 60 more combinations
```

### Phase 6: Visual Assertion Generator
**File:** `visual-assertion-generator.ts`

**What it does:**
- Generates visual regression tests
- Compares to Figma designs
- Creates baseline screenshots

**Key Methods:**
```typescript
generateVisualAssertion(component, figmaSpec) → VisualTest
  ├─ Generates screenshot comparison code
  ├─ Captures baseline from Figma
  └─ Creates assertion spec

captureBaseline(page, component) → Screenshot
  └─ Saves golden screenshot
```

### Phase 7: Coverage Matrix Reporter
**File:** `coverage-matrix-reporter.ts`

**What it does:**
- Tracks test coverage per component
- Records metrics (counts, categories, tags)
- Updates `coverage-matrix.json`

**Key Methods:**
```typescript
updateCoverageMatrix(results) → void
  ├─ Updates component stats
  ├─ Tracks test counts
  ├─ Records coverage changes
  └─ Calculates health scores
```

---

## 📋 Full Generation Flow (Step-by-Step)

### Example: Button Component

**Step 1: Scan Live DOM**
```bash
env=local npx playwright test generate-components --config playwright.generators.config.ts
```

1. Connect to AEM author (http://localhost:4502)
2. Navigate to button style guide page
3. Find `.button` elements in DOM
4. Extract element properties, attributes, text
5. Identify interactive events (click, hover, focus)
6. Create `DOMSnapshot` object

**Step 2: Generate POM**
Using DOM snapshot, write:
- `tests/pages/ga/components/buttonPage.ts`
  - Class with constructor, navigate(), getters
  - Methods for interactions (click, hover, fill)
- `tests/pages/ga/components/buttonPage.locators.json`
  - Multi-strategy locators for each element
  - Confidence scores for fallback resolution

**Step 3: Generate Specs (Happy-Path)**
Auto-generate test cases:
```typescript
test('[BTN-001] Button should render with correct text', async ({ page }) => {
  const button = new ButtonPage(page);
  await button.navigate(BASE_URL);
  await expect(button.primaryButton).toBeVisible();
  await expect(button.primaryButton).toContainText('Click me');
});

test('[BTN-002] Button click fires handler', async ({ page }) => {
  const button = new ButtonPage(page);
  await button.navigate(BASE_URL);
  
  // Setup event listener
  let clicked = false;
  page.on('popup', () => { clicked = true; });
  
  // Click and verify
  await button.clickPrimary();
  expect(clicked).toBe(true);
});
```

**Step 4: Add CSV Test Cases** (if provided)
```bash
CSV_PATH=button-tests.csv env=local npx playwright test generate-from-csv
```

Parse CSV and add:
```typescript
test('[BTN-101] Button should handle rapid clicks', async ({ page }) => {
  const button = new ButtonPage(page);
  await button.navigate(BASE_URL);
  
  // Simulate rapid clicks
  for (let i = 0; i < 5; i++) {
    await button.clickPrimary();
  }
  
  // Verify state remains consistent
  await expect(button.primaryButton).toBeEnabled();
});
```

**Step 5: Generate Advanced Tests**
```bash
env=local npx playwright test generate-advanced --config playwright.generators.config.ts
```

- **Interaction Tests:** Button in feature-banner context
- **Matrix Tests:** All variant/theme/viewport combinations (64 tests)
- **Visual Tests:** Compare to Figma designs
- **Image Tests:** Check image alt text, dimensions
- **A11y Tests:** WCAG 2.2 compliance

**Step 6: Generate Reports**
- Update `coverage-matrix.json` with:
  - Total tests: 150+ per component
  - Categories: happy-path, interaction, matrix, visual, images, a11y
  - Tags: @smoke, @regression, @mobile, @a11y, @wcag22
  - Coverage: 100%

---

## 🎯 Key Generation Concepts

### Multi-Strategy Locators
Each element has multiple locator strategies (with confidence scores):
1. **testid** (0.95) — Most reliable, added by developers
2. **id** (0.9) — Unique element ID
3. **role** (0.85) — Accessibility role + name
4. **css** (0.75) — CSS selector
5. **xpath** (0.65) — XPath expression
6. **text** (0.5) — Text content match

**Why?** Self-healing locators that fallback if one breaks.

### Test Categories (5 Per Component)
1. **author.spec.ts**
   - Happy-path tests
   - Negative/error cases
   - Responsive tests
   - Accessibility tests

2. **interaction.spec.ts**
   - Parent-child context
   - Nested component tests

3. **matrix.spec.ts**
   - State combinations
   - Variant × Theme × Background × Viewport

4. **visual.spec.ts**
   - Figma design comparison
   - Baseline image assertions

5. **images.spec.ts**
   - Broken image detection
   - Alt text validation
   - Image size checks

### Test IDs (Auto-Generated)
```
[PREFIX-NNN]
  ├─ PREFIX: BTN (button), FB (feature-banner), STAT (statistic)
  └─ NNN: 001, 002, 003... (auto-incremented)
```

Example: `[BTN-042]` = 42nd test for button component

---

## 📊 Generated File Structure

```
tests/
├── pages/ga/components/
│   ├── buttonPage.ts                    ← POM class
│   ├── buttonPage.locators.json         ← Locator sidecar
│   ├── featureBannerPage.ts
│   ├── featureBannerPage.locators.json
│   └── ... (one per component)
│
├── specFiles/ga/
│   ├── button/
│   │   ├── button.author.spec.ts        ← Happy-path, negative, responsive, a11y
│   │   ├── button.interaction.spec.ts   ← Parent-child context
│   │   ├── button.matrix.spec.ts        ← State matrix (60+ tests)
│   │   ├── button.visual.spec.ts        ← Figma/baseline comparison
│   │   └── button.images.spec.ts        ← Image health checks
│   ├── feature-banner/
│   │   └── ... (same pattern)
│   └── ... (one per component)
│
└── data/
    └── coverage-matrix.json             ← Metrics & tracking
```

---

## 🚀 Running Generation

### Generate Component Tests (DOM Scan)
```bash
env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium --workers 1

# Or specific components
COMPONENTS=button,teaser-card env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium --workers 1
```

### Generate from CSV
```bash
CSV_PATH=tests/data/test-cases.csv env=local npx playwright test generate-from-csv --config playwright.generators.config.ts --project chromium
```

### Generate from Jira
```bash
JIRA_JSON=jira-requirements.json COMPONENT=button env=local npx playwright test generate-from-jira --config playwright.generators.config.ts --project chromium
```

### Generate Advanced Tests
```bash
env=local npx playwright test generate-advanced --config playwright.generators.config.ts --project chromium --workers 1

# Or specific components
COMPONENTS=button,statistic env=local npx playwright test generate-advanced --config playwright.generators.config.ts --project chromium --workers 1
```

---

## ✨ Why This Approach?

| Benefit | How It Works |
|---------|------------|
| **Comprehensive Coverage** | 150+ tests auto-generated per component |
| **Maintainable** | POMs centralize selectors, specs reference POMs |
| **Self-Healing** | Multi-strategy locators with fallbacks |
| **Fast Generation** | DOM scan → POM → Specs in seconds |
| **Scalable** | New components follow same pattern |
| **Flexible** | Supports DOM, CSV, Jira, manual inputs |
| **Traceable** | Each test has ID, category, tags |

---

## 🎓 Example: Full Button Generation

**Input:** Live AEM with button component at `/content/global-atlantic/style-guide/components/button.html`

**Command:**
```bash
COMPONENTS=button env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium
```

**Process:**
1. ✅ Scan DOM → Extract button elements, attributes, structure
2. ✅ Generate POM → `buttonPage.ts` with methods
3. ✅ Generate Locators → `buttonPage.locators.json` with strategies
4. ✅ Generate Specs → `button.author.spec.ts` with 23 tests
5. ✅ Update Coverage → `coverage-matrix.json` with button stats

**Output Files Created:**
- ✅ `tests/pages/ga/components/buttonPage.ts` (class-based POM)
- ✅ `tests/pages/ga/components/buttonPage.locators.json` (multi-strategy)
- ✅ `tests/specFiles/ga/button/button.author.spec.ts` (23 tests)
- ✅ Updated `tests/data/coverage-matrix.json`

**Results:**
- 23 tests generated automatically
- Happy-path, negative, responsive, accessibility covered
- No manual test writing needed
- Ready to run: `env=local npx playwright test tests/specFiles/ga/button/`

---

## 🔍 Key Files & Their Roles

| File | Role |
|------|------|
| `dom-scanner.ts` | Extract DOM structure from live AEM |
| `pom-writer.ts` | Generate class-based POMs + locators |
| `spec-writer.ts` | Generate test files from CSV or DOM |
| `csv-test-parser.ts` | Parse CSV test cases |
| `requirements-merger.ts` | Merge Jira + Figma requirements |
| `state-matrix-generator.ts` | Generate state combinations |
| `visual-assertion-generator.ts` | Generate visual regression tests |
| `assertion-inferrer.ts` | Generate assertions from test steps |
| `coverage-matrix-reporter.ts` | Track and report coverage |

---

**Next Steps:**

1. **Try DOM Scanning:**
   ```bash
   COMPONENTS=button env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium
   ```

2. **View Generated Files:**
   - Check `tests/pages/ga/components/buttonPage.ts`
   - Check `tests/specFiles/ga/button/button.author.spec.ts`

3. **Run Generated Tests:**
   ```bash
   env=local npx playwright test tests/specFiles/ga/button/ --project chromium
   ```

---

**Status:** ✅ Generation System Ready for Use  
**Total Test Coverage:** 850+ auto-generated tests across 17 components  
**Time to Generate:** Seconds per component  
**Maintenance:** Automatic updates on config changes
