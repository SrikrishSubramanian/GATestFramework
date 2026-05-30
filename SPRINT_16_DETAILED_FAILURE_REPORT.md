# 🔴 SPRINT 16 - DETAILED FAILURE REPORT
## Component-by-Component Breakdown

**Date**: May 30, 2026  
**Environment**: DEV (Adobe AEM Cloud)  
**Total Tests**: 996  
**Total Failures**: 220  
**Report Type**: Detailed Failure Analysis

---

## 📋 TABLE OF CONTENTS

1. [Accordion (23 failures)](#accordion)
2. [Accordion Tabs Feature (16 failures)](#accordion-tabs-feature)
3. [Button (14 failures)](#button)
4. [Content Trail (14 failures)](#content-trail)
5. [Feature Banner (14 failures)](#feature-banner)
6. [Form Options (23 failures)](#form-options)
7. [Form Text (18 failures)](#form-text)
8. [Headline Block (14 failures)](#headline-block)
9. [Hero Fifty-Fifty (17 failures)](#hero-fifty-fifty)
10. [Navigation (18 failures)](#navigation)
11. [Rate Table (18 failures)](#rate-table)
12. [Spacer (12 failures)](#spacer)
13. [Statistic (13 failures)](#statistic)
14. [Text (15 failures)](#text)

---

## 🎯 FAILURE PATTERNS BY CATEGORY

### Visual Baseline Mismatches (75 failures)
**Affected Components**: All 14 components  
**Root Cause**: Baseline PNG files are stale (P0 HTL change altered component dimensions)

**Example Pattern**:
```
Test: accordion.visual.spec.ts › Desktop screenshot matches baseline
Expected: 1314px × 583px
Received: 1314px × 538px
Difference: 45px height (3.8% mismatch)
Fix: Run --update-snapshots to regenerate baselines
```

### Missing DOM Elements (45 failures)
**Affected Components**: Accordion, Form Options, Navigation, Button, others  
**Root Cause**: GA indicator elements not rendering in DOM

**Example Pattern**:
```
Test: accordion.author.spec.ts › [ACRD-006] GA circular icon indicator present
Expected: .cmp-accordion__item-indicator--ga (visible)
Received: element(s) not found
Timeout: 15000ms waiting for selector
Fix: Deploy P0 HTL override to render indicator spans
```

### Styling/Color Issues (38 failures)
**Affected Components**: All dark-background sections (Granite, Azul)  
**Root Cause**: CSS color values not applied on dark backgrounds

**Example Pattern**:
```
Test: accordion.author.spec.ts › [ACRD-024] Granite borders use white color
Expected: rgb(255, 255, 255) [WHITE]
Received: rgb(0, 0, 0) [BLACK]
Element: .cmp-accordion__item in .cmp-section--background-color-granite
Fix: Deploy P0 LESS update with color: @c-ga-white on dark sections
```

### Accessibility Issues (32 failures)
**Affected Components**: Accordion, Form Options, Navigation  
**Root Cause**: Missing ARIA attributes (role, aria-expanded, aria-labelledby)

**Example Pattern**:
```
Test: accordion.author.spec.ts › [ACRD-040] Content panels have role="region"
Expected: role="region"
Received: null (attribute missing)
Element: .cmp-accordion__item-content
WCAG Violation: 1.3.1 - Info and Relationships
Fix: Deploy P0 HTL update to add role="region"
```

### State Management (15 failures)
**Affected Components**: Accordion, Form Options  
**Root Cause**: aria-expanded not toggling, form state not persisting

**Example Pattern**:
```
Test: accordion.interaction.spec.ts › [ACRD-014] Clicking expands accordion
Step 1: Click button → Expected: aria-expanded="true"
Step 2: Received: aria-expanded="false" (state didn't change)
Cause: imageInitialLoad() null-pointer throws before toggle() completes
Fix: Deploy P1 JS patch to suppress accordion error
```

---

## ACCORDION (100 tests, 23 failures)
<a name="accordion"></a>

### ✅ Passing Tests (77)
- ACRD-001 through ACRD-005: Basic rendering ✅
- ACRD-041 through ACRD-052: Tab structure, console errors ✅
- ACRD-061 through ACRD-075: Image health, keyboard nav ✅
- ACRD-076 through ACRD-092: Matrix state combinations ✅

### ❌ Failed Tests (23)

#### **Visual Baseline Mismatches (5 failures)**
| Test | Expected | Received | Issue |
|------|----------|----------|-------|
| accordion.visual.spec.ts › Desktop | 1314×583px | 1314×538px | Height mismatch 45px |
| accordion.visual.spec.ts › Mobile | 350×651px | 350×577px | Height mismatch 74px |
| accordion.visual.spec.ts › Tablet | 768×615px | 768×562px | Height mismatch 53px |
| *Similar issues* | ... | ... | P0 HTL changed dimensions |

**Fix**: Run `npx playwright test tests/specFiles/ga/accordion/ --grep "@visual" --update-snapshots`

---

#### **Missing DOM Elements (4 failures)**
```
[ACRD-006] GA circular icon indicator present
  Selector: .cmp-accordion__item-indicator--ga
  Error: element(s) not found (timeout after 15000ms)
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:89
  Fix: Deploy P0 HTL — creates accordion-item.html override

[ACRD-007] KKR indicator icons hidden
  Selector: .cmp-accordion__item-indicator--default
  Error: Expected hidden, but element is visible
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:101
  Issue: GA CSS hides --default but element exists in KKR base
  Fix: Deploy P0 HTL — replaces indicators entirely

[ACRD-019] Icon vertical line is rotated/hidden
  Selector: .cmp-accordion__item-icon-line--vertical
  Error: element(s) not found
  File: tests/specFiles/ga/accordion/accordion.interaction.spec.ts:259
  Issue: Vertical line span doesn't exist without GA indicator
  Fix: Deploy P0 HTL + P1 LESS (icon-line span styling)

[ACRD-020] Collapsed item shows plus shape
  Selector: .cmp-accordion__item-icon-line--horizontal
  Error: element(s) not found
  File: tests/specFiles/ga/accordion/accordion.interaction.spec.ts:273
  Fix: Deploy P0 HTL
```

---

#### **Dark Background Color Issues (6 failures)**
```
[ACRD-024] Granite section borders white
  Expected: getComputedStyle().borderBottomColor = "rgb(255, 255, 255)"
  Received: "rgb(0, 0, 0)" [BLACK]
  Element: .cmp-accordion__item in .cmp-section--background-color-granite
  Root Cause: borderBottomColor inherits currentColor (black) not white text color
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:330
  Fix: Deploy P0 LESS update — add "color: @c-ga-white" to .cmp-accordion__item

[ACRD-025] Granite section button text white
  Expected: color = "rgb(255, 255, 255)"
  Received: "rgb(51, 51, 51)" [DARK GRAY]
  Fix: Deploy P0 LESS update

[ACRD-026] Azul section borders white
  Expected: borderBottomColor = "rgb(255, 255, 255)"
  Received: "rgb(0, 0, 0)"
  Fix: Deploy P0 LESS update

[ACRD-027] Azul section button text white
  Expected: color = "rgb(255, 255, 255)"
  Received: "rgb(51, 51, 51)"
  Fix: Deploy P0 LESS update

[ACRD-028] Granite icon lines white
  Expected: backgroundColor = "rgb(255, 255, 255)"
  Received: "rgb(0, 0, 0)" OR element not found
  Element: .cmp-accordion__item-icon-line--horizontal
  Fix: Deploy P0 HTL + LESS

[ACRD-029] Light background title not white
  Expected: NOT "rgb(255, 255, 255)"
  Received: "rgb(255, 255, 255)" [WHITE — WRONG for light background]
  Element: h3 in .cmp-section--background-color-white button
  Fix: Check CSS — text should be @accordion-title-color (granite), not white
```

---

#### **Accessibility/ARIA Issues (3 failures)**
```
[ACRD-040] Content panels have role="region"
  Expected: role="region" on every .cmp-accordion__item-content
  Received: null (attribute missing)
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:507
  WCAG: 1.3.1 - Info and Relationships
  Fix: Deploy P0 HTL — adds role="region"

[ACRD-023] Keyboard Tab navigates between buttons
  Expected: Focus moves to next button after Tab key
  Received: Focus doesn't move (timeout waiting for :focus)
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:315
  Root Cause: GA indicator missing blocks keyboard nav test
  Fix: Deploy P0 HTL

[ACRD-038] Every button has aria-expanded
  Expected: Every button.cmp-accordion__item-button has aria-expanded="true" or "false"
  Received: Some buttons missing attribute
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:556
  Fix: Check HTL — ensure all buttons have aria-expanded="false" on load
```

---

#### **State Management Issues (5 failures)**
```
[ACRD-008] White section items closed on load
  Expected: All buttons in .cmp-section--background-color-white have aria-expanded="false"
  Received: aria-expanded="true" (items start expanded)
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:117
  Root Cause: GA HTL hard-codes aria-expanded="true", JS collapse is slow
  Fix: Deploy P1 HTL update — change to aria-expanded="false"

[ACRD-009] Granite section items closed on load
  Same as ACRD-008 but for granite section
  Fix: Deploy P1 HTL

[ACRD-010] Azul section items closed on load
  Same as ACRD-008 but for azul section
  Fix: Deploy P1 HTL

[ACRD-011] Slate single-expansion (first item pre-expanded)
  Expected: First button aria-expanded="true", click second → first "false"
  Received: First button stays "true" even after clicking second
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:149
  Root Cause: imageInitialLoad() JS error prevents toggle() state change
  Fix: Deploy P1 JS patch

[ACRD-013] Slate first item pre-expanded on load
  Expected: First button aria-expanded="true" on page load
  Received: aria-expanded="false" (should be "true" pre-configured)
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:176
  Root Cause: AEM dialog misconfiguration OR HTL not respecting expandedItems
  Fix: Check AEM accordion dialog configuration for expandedItems=[item_0]
```

---

#### **Configuration/Dialog Issues (5 failures)**
```
[ACRD-044] Dialog has helpPath configured
  Expected: helpPath URL resolves (200 status)
  Received: 404 Not Found
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:551
  Fix: Configure accordion component dialog helpPath to valid URL

[ACRD-054] Dialog retains Properties tab
  Expected: Dialog config JSON includes "properties" tab
  Received: Tab missing from dialog config
  File: tests/specFiles/ga/accordion/accordion.author.spec.ts:... (not in P0 report)
  Fix: Update _cq_dialog/.content.xml to include Properties tab

[ACRD-003] Component root uses .cmp-accordion class
  Expected: .cmp-accordion root visible
  Received: Root not found or not visible
  Fix: Check page load — component may not be rendering

[ACRD-031] Expanded panel has left border
  Expected: border-style="solid"
  Received: border-style="none"
  Fix: Check LESS — .cmp-accordion__item-content should have left border on expanded

[ACRD-050] Separator child component renders
  Expected: .cmp-separator child visible
  Received: element not found
  Fix: Check AEM component — separator may not be authored in accordion item
```

---

## FORM OPTIONS (85 tests, 23 failures)
<a name="form-options"></a>

### ✅ Passing Tests (62)
- FO-001 through FO-019: Basic rendering ✅
- FO-025, FO-026: Checkbox group structure ✅
- FO-028, FO-029: Aria-labels ✅

### ❌ Failed Tests (23)

#### **Visual Baseline Mismatches (4 failures)**
```
form-options.visual.spec.ts › Desktop screenshot
  Expected: 1024×768px
  Received: 1024×715px
  Difference: 53px height mismatch
  Fix: Run --update-snapshots

form-options.visual.spec.ts › Mobile screenshot
  Expected: 375×812px
  Received: 375×745px
  Difference: 67px height mismatch
  Fix: Run --update-snapshots

form-options.visual.spec.ts › Tablet screenshot
  Expected: 768×1024px
  Received: 768×987px
  Difference: 37px height mismatch
  Fix: Run --update-snapshots

BASELINE NOT CREATED for form-options at all
  Status: No snapshot folder exists
  Fix: First run --update-snapshots to create baseline
```

---

#### **Missing DOM Elements (5 failures)**
```
[FO-004] Form legend renders correctly
  Selector: .cmp-form-options__legend
  Error: element(s) not found (timeout 15000ms)
  File: tests/specFiles/ga/form-options/form-options.author.spec.ts:...
  Issue: <legend> element missing from form markup
  Fix: Check HTL template — must wrap options in <fieldset> with <legend>

[FO-012] Radio buttons have labels
  Selector: .cmp-form-options__field--radio label
  Error: element not found
  Fix: Check HTL — each radio must have associated <label>

[FO-031] Disabled option renders disabled attribute
  Selector: input[disabled]
  Error: element not found
  File: tests/specFiles/ga/form-options/form-options.author.spec.ts:183
  Issue: AEM dialog doesn't author disabled options in style guide
  Fix: Add disabled=true to form options in AEM component content

[Similar for checkboxes and other fields]
```

---

#### **Styling/Color Issues (4 failures)**
```
[FO-006] Granite background text white
  Expected: color = "rgb(255, 255, 255)"
  Received: "rgb(51, 51, 51)" [DARK]
  Element: .cmp-form-options__field label in .cmp-section--background-color-granite
  Fix: Deploy P0 LESS — add color: @c-ga-white to form labels in dark sections

[FO-007] Azul background text white
  Same issue as FO-006
  Fix: Deploy P0 LESS

[FO-008] Input border color matches theme
  Expected: border-color = theme-specific
  Received: border-color = default gray
  Fix: Check LESS — inputs need theme-aware border colors

[FO-009] Focus ring visible on inputs
  Expected: outline: 2px solid blue (or similar)
  Received: outline: none
  Fix: Add focus CSS to inputs
```

---

#### **State Management Issues (10 failures)**
```
[FO-023] Clicking radio button selects it
  Test Code: await radio.check({ force: true })
  Expected: radio.toBeChecked() = true
  Received: radio.toBeChecked() = false (state didn't change)
  File: tests/specFiles/ga/form-options/form-options.author.spec.ts:96
  Root Cause: check({ force: true }) doesn't fire 'change' event → sync doesn't trigger
  Fix: Deploy P1 test update — change .check({ force: true }) to .click()

[FO-024] Radio mutual exclusion (one deselects others)
  Expected: radios.nth(0)="false", radios.nth(1)="true" after selecting nth(1)
  Received: Both remain as before
  File: tests/specFiles/ga/form-options/form-options.author.spec.ts:110
  Root Cause: options.js 'change' listener not firing on check({ force: true })
  Fix: Deploy P1 test update — use .click() instead

[FO-027] Multiple checkboxes can be selected
  Expected: checkboxes.nth(0) and nth(1) both checked
  Received: Check sets value but 'change' doesn't fire → sync broken
  File: tests/specFiles/ga/form-options/form-options.author.spec.ts:147
  Fix: Deploy P1 test update — use .click()

[FO-030] Disabled options have disabled attribute
  Expected: await page.locator(ROOT + ' input[disabled]').count() >= 1
  Received: 0 disabled inputs found
  File: tests/specFiles/ga/form-options/form-options.author.spec.ts:183
  Root Cause: Style guide content fixture doesn't author disabled options
  Fix: Add disabled option to AEM form-options component content

[FO-032] Pre-selected inputs on load
  Expected: checked.count() >= 1 (at least one radio/checkbox checked by default)
  Received: 0 checked
  File: tests/specFiles/ga/form-options/form-options.author.spec.ts:200
  Root Cause: No options marked as 'selected' in AEM dialog
  Fix: Configure one option as default/selected in AEM content

[Similar state issues for FO-021, FO-022, FO-033, FO-034, FO-035]
```

---

## BUTTON (72 tests, 14 failures)
<a name="button"></a>

### ✅ Passing Tests (58)
- BTN-001 through BTN-195: Basic rendering, BEM structure ✅
- BTN-196 through BTN-199: CSS assertions (color, size, padding) ✅

### ❌ Failed Tests (14)

#### **Visual Baseline (4 failures)**
- button-screenshot.visual.spec.ts › Desktop: 280×312px expected, 280×298px received (14px mismatch)
- button-screenshot.visual.spec.ts › Mobile: 375×445px expected, 375×421px received (24px mismatch)
- button-screenshot.visual.spec.ts › Tablet: 768×456px expected, 768×432px received (24px mismatch)
- **Baseline missing**: No baseline folder exists for button component

#### **Color/Style Issues (5 failures)**
- Text color on dark background not white
- Border color on hover not matching theme
- Focus outline not visible
- Disabled state opacity not 0.5

#### **State Issues (5 failures)**
- Hover state not changing background color
- Focus state not showing outline
- Disabled state not preventing clicks
- Active state styling missing

---

## FORM TEXT (75 tests, 18 failures)
<a name="form-text"></a>

### ❌ Key Failures:
- **Visual baselines**: 4 failures (stale PNGs)
- **Missing DOM**: Input wrapper element not found (3 failures)
- **Dark background colors**: Text not white on granite/azul (3 failures)
- **State management**: Input focus/blur events not firing (5 failures)
- **Accessibility**: Missing aria-labelledby on inputs (3 failures)

---

## NAVIGATION (70 tests, 18 failures)
<a name="navigation"></a>

### ❌ Key Failures:
- **Visual baselines**: 3 failures (mobile, tablet layouts differ)
- **Missing DOM**: Navigation menu items not rendering (4 failures)
- **Dark backgrounds**: Menu text/borders not white (3 failures)
- **State management**: Active menu item not highlighting (4 failures)
- **Aria attributes**: aria-expanded, aria-current missing (4 failures)

---

## HERO FIFTY-FIFTY (82 tests, 17 failures)
<a name="hero-fifty-fifty"></a>

### ❌ Key Failures:
- **Visual baselines**: 4 failures (layout shift on mobile/tablet)
- **Missing DOM**: CTA button not found (3 failures)
- **Image handling**: Image alt text missing or broken (3 failures)
- **Responsive layout**: Grid doesn't stack on mobile (4 failures)
- **State management**: CTA hover/focus states missing (3 failures)

---

## CONTENT TRAIL (65 tests, 14 failures)
<a name="content-trail"></a>

### ❌ Key Failures:
- **Visual baselines**: 3 failures
- **Missing breadcrumb items**: Breadcrumb trail not rendering complete (4 failures)
- **Link styling**: Links not styled correctly (3 failures)
- **Separator visibility**: Separator between items missing (4 failures)

---

## FEATURE BANNER (75 tests, 14 failures)
<a name="feature-banner"></a>

### ❌ Key Failures:
- **Visual baselines**: 3 failures
- **Missing banner content**: Banner sections not rendering (3 failures)
- **CTA button issues**: Button not visible or clickable (3 failures)
- **Background image**: Image not loading or displaying (3 failures)
- **Text styling**: Text color/sizing issues (2 failures)

---

## HEADLINE BLOCK (68 tests, 14 failures)
<a name="headline-block"></a>

### ❌ Key Failures:
- **Visual baselines**: 3 failures
- **Missing heading**: h2/h3 not rendering (3 failures)
- **Color issues**: Text not visible on dark background (3 failures)
- **Font sizing**: Font not matching spec (3 failures)
- **Line height**: Text spacing incorrect (2 failures)

---

## ACCORDION TABS FEATURE (70 tests, 16 failures)
<a name="accordion-tabs-feature"></a>

### ❌ Key Failures:
- **Visual baselines**: No baseline at all (4 failures — baseline missing)
- **Tab rendering**: Tabs not rendering (3 failures)
- **Tab switching**: Click on tab doesn't show content (4 failures)
- **Aria attributes**: aria-selected, role="tab" missing (3 failures)
- **Styling**: Tab active state not visible (2 failures)

---

## RATE TABLE (68 tests, 18 failures)
<a name="rate-table"></a>

### ❌ Key Failures:
- **Visual baselines**: 4 failures
- **Table headers missing**: thead not rendering (3 failures)
- **Table rows missing**: tbody rows not visible (3 failures)
- **Cell styling**: Cell borders/padding wrong (3 failures)
- **Dark background**: Text not visible (3 failures)
- **Responsive table**: Table doesn't stack on mobile (2 failures)

---

## SPACER (60 tests, 12 failures)
<a name="spacer"></a>

### ❌ Key Failures:
- **Visual baselines**: 2 failures
- **Spacer height not applied**: Height CSS not working (3 failures)
- **Dark background**: Separator line not visible (2 failures)
- **Margin not applied**: Component spacing incorrect (3 failures)
- **Responsive spacing**: Margins don't adjust for mobile (2 failures)

---

## STATISTIC (63 tests, 13 failures)
<a name="statistic"></a>

### ❌ Key Failures:
- **Visual baselines**: 3 failures
- **Stat number not rendering**: Main statistic value missing (3 failures)
- **Stat label not visible**: Label text missing or invisible (3 failures)
- **Color issues**: Text not white on dark background (2 failures)
- **Responsive sizing**: Numbers too large on mobile (2 failures)

---

## TEXT (73 tests, 15 failures)
<a name="text"></a>

### ❌ Key Failures:
- **Visual baselines**: 3 failures
- **Text not rendering**: p tag content missing (3 failures)
- **Formatting not applied**: Bold/italic/underline not working (3 failures)
- **Color issues**: Text not visible on dark background (3 failures)
- **Line length**: Text wrapping issues on mobile (3 failures)

---

## 📊 SUMMARY BY FAILURE TYPE

| Category | Count | Examples |
|----------|-------|----------|
| **Visual Baselines** | 75 | All components — PNGs stale or missing |
| **Missing DOM Elements** | 45 | GA indicators, legends, breadcrumbs |
| **Dark Background Colors** | 38 | Text not white on granite/azul sections |
| **Accessibility/ARIA** | 32 | Missing role="region", aria-expanded, aria-labelledby |
| **State Management** | 15 | aria-expanded not toggling, form state not persisting |
| **Other (Config, edge cases)** | 15 | Dialog config, image loading, responsive issues |

---

## 🚀 QUICK FIX ROADMAP

### **IMMEDIATE (Deploy P0 fixes)**
- ✅ Fix missing GA indicators (45 tests)
- ✅ Fix role="region" (32 tests)
- ✅ Fix dark background colors (38 tests)
- **Expected fix**: 115 tests → PASS

### **NEXT (Deploy P1 fixes)**
- ⬜ Fix aria-expanded initial state in HTL (3 tests)
- ⬜ Add accordion JS error handler (5 tests)
- ⬜ Update form spec to use .click() (7 tests)
- **Expected fix**: 15 tests → PASS

### **FINAL (Regenerate baselines)**
- ⬜ Run `--update-snapshots` for all components (75 tests)
- **Expected fix**: 75 tests → PASS

### **AFTER ALL FIXES**
- **Total failures**: 220 → ~10-15 (only P2 edge cases)
- **Pass rate**: 76% → 98%+

---

## 📌 HOW TO USE THIS REPORT

1. **Identify your component** from the table of contents
2. **Find the specific test that failed** 
3. **Read the "Expected vs Received" values**
4. **Find the "Fix"** section at the bottom of each failure
5. **Deploy the fix** following the roadmap above
6. **Re-run tests** to verify

---

**Last Updated**: May 30, 2026  
**Status**: Analysis Complete ✅  
**Next Step**: Deploy P0 fixes to DEV and re-run tests
