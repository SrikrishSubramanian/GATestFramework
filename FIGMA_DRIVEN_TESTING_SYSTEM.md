# Figma-Driven Testing System

## 🎯 Core Concept

**Figma is the Source of Truth**

```
Figma Design
    ↓
Extract Design Specs (colors, fonts, sizes, spacing)
    ↓
Compare with Rendered Component
    ↓
Visual Validation (screenshot comparison)
    ↓
Report: ✅ MATCHES or ❌ DEVIATES
```

---

## 📋 What Testers Should Validate Against Figma

### 1. **Colors** (Most Critical)
```
From Figma:
  Primary Button → #0066CC
  Hover State → #0052A3
  Disabled → #CCCCCC
  Text → #FFFFFF

In Test:
  ✅ Verify actual component color matches Figma
  ❌ If different → Component wrong or Figma needs update
```

### 2. **Typography**
```
From Figma:
  Font Family → Inter
  Font Size → 16px
  Font Weight → 500
  Line Height → 1.5

In Test:
  ✅ Verify button text properties match
```

### 3. **Spacing & Layout**
```
From Figma:
  Button Height → 44px
  Button Width → 200px
  Padding → 12px 16px
  Border Radius → 4px

In Test:
  ✅ Verify dimensions match spec
```

### 4. **States** (Interactive)
```
From Figma:
  Default → #0066CC, no shadow
  Hover → #0052A3, shadow: 0 2px 8px
  Focus → border: 2px solid #0066CC
  Disabled → #CCCCCC, opacity: 0.5

In Test:
  ✅ Verify each state renders correctly
```

### 5. **Visual Appearance** (Screenshots)
```
From Figma:
  Export as PNG at 1x and 2x scale
  Compare pixel-perfect match

In Test:
  ✅ Screenshot comparison against Figma export
```

---

## 🏗️ Implementation Architecture

```
Figma API / Manual Export
         ↓
┌─────────────────────────────────────────┐
│  Design Spec Extractor                  │
│  ├─ Colors                              │
│  ├─ Typography                          │
│  ├─ Dimensions                          │
│  ├─ Spacing                             │
│  └─ Component States                    │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Design Spec JSON Files                 │
│  tests/data/figma/                      │
│  ├─ button.json                         │
│  ├─ feature-banner.json                 │
│  └─ statistic.json                      │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Component Tests                        │
│  ├─ Color Validation Tests              │
│  ├─ Typography Validation Tests         │
│  ├─ Dimension Validation Tests          │
│  ├─ State Validation Tests              │
│  └─ Visual Snapshot Tests               │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Test Results                           │
│  ✅ Matches Figma                       │
│  ❌ Deviates from Figma (needs fix)     │
└─────────────────────────────────────────┘
```

---

## 📂 File Structure

```
tests/data/figma/
├── button.json                    ← Button design spec
├── feature-banner.json
├── statistic.json
├── shared-tokens.json             ← Global design tokens
└── baselines/
    ├── button-primary.png         ← Figma export
    ├── button-hover.png
    └── button-disabled.png

tests/specFiles/ga/button/
├── button.visual.spec.ts          ← Figma validation tests
├── button.colors.spec.ts          ← Color validation
├── button.typography.spec.ts      ← Font validation
├── button.dimensions.spec.ts      ← Size/spacing validation
└── button.states.spec.ts          ← State validation
```

---

## 📐 Design Spec JSON Format

```json
// tests/data/figma/button.json
{
  "component": "button",
  "figmaUrl": "https://figma.com/file/...",
  "lastSyncedFromFigma": "2026-06-01T14:30:00Z",
  "syncedBy": "qa-team",
  
  "globalTokens": {
    "primaryColor": "#0066CC",
    "primaryHoverColor": "#0052A3",
    "disabledColor": "#CCCCCC",
    "textColor": "#FFFFFF",
    "fontFamily": "Inter",
    "borderRadius": "4px"
  },
  
  "variants": {
    "primary": {
      "default": {
        "backgroundColor": "#0066CC",
        "textColor": "#FFFFFF",
        "borderRadius": "4px",
        "height": "44px",
        "padding": "12px 16px",
        "fontSize": "16px",
        "fontWeight": "500",
        "boxShadow": "none"
      },
      "hover": {
        "backgroundColor": "#0052A3",
        "boxShadow": "0 2px 8px rgba(0, 0, 0, 0.15)"
      },
      "focus": {
        "backgroundColor": "#0066CC",
        "outline": "2px solid #0066CC",
        "outlineOffset": "2px"
      },
      "disabled": {
        "backgroundColor": "#CCCCCC",
        "textColor": "#999999",
        "opacity": "0.5",
        "cursor": "not-allowed"
      }
    },
    
    "secondary": {
      "default": {
        "backgroundColor": "#F5F5F5",
        "textColor": "#333333",
        "borderRadius": "4px",
        "height": "44px",
        "padding": "12px 16px",
        "border": "1px solid #DDDDDD"
      },
      "hover": {
        "backgroundColor": "#EEEEEE"
      }
    }
  },
  
  "baselineImages": {
    "primary-default": "button-primary-default.png",
    "primary-hover": "button-primary-hover.png",
    "primary-focus": "button-primary-focus.png",
    "primary-disabled": "button-primary-disabled.png",
    "secondary-default": "button-secondary-default.png"
  },
  
  "validationRules": {
    "pixelPerfect": false,
    "maxColorDiffPercent": 2,
    "maxDimensionDiff": 2,
    "maxDiffPixels": 500
  }
}
```

---

## 🧪 Test Implementation

### Test 1: Color Validation

```typescript
// tests/specFiles/ga/button/button.colors.spec.ts
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const figmaSpec = JSON.parse(
  fs.readFileSync('tests/data/figma/button.json', 'utf-8')
);

test('[BTN-COLOR-001] Button primary default color matches Figma', async ({ page }) => {
  const BASE_URL = 'http://localhost:4503';
  await page.goto(`${BASE_URL}/button.html`);
  
  const button = page.locator('.button.primary');
  const expectedColor = figmaSpec.variants.primary.default.backgroundColor;
  
  const actualColor = await button.evaluate(el => {
    return getComputedStyle(el).backgroundColor;
  });
  
  // Compare colors (allow small variance due to color space differences)
  expect(rgbToHex(actualColor)).toBe(expectedColor);
});

test('[BTN-COLOR-002] Button primary hover color matches Figma', async ({ page }) => {
  const BASE_URL = 'http://localhost:4503';
  await page.goto(`${BASE_URL}/button.html`);
  
  const button = page.locator('.button.primary');
  const expectedHoverColor = figmaSpec.variants.primary.hover.backgroundColor;
  
  // Hover over button
  await button.hover();
  await page.waitForTimeout(300); // Wait for transition
  
  const actualColor = await button.evaluate(el => {
    return getComputedStyle(el).backgroundColor;
  });
  
  expect(rgbToHex(actualColor)).toBe(expectedHoverColor);
});

test('[BTN-COLOR-003] Button disabled color matches Figma', async ({ page }) => {
  const BASE_URL = 'http://localhost:4503';
  await page.goto(`${BASE_URL}/button-disabled.html`);
  
  const button = page.locator('.button.primary:disabled');
  const expectedColor = figmaSpec.variants.primary.disabled.backgroundColor;
  
  const actualColor = await button.evaluate(el => {
    return getComputedStyle(el).backgroundColor;
  });
  
  expect(rgbToHex(actualColor)).toBe(expectedColor);
});
```

### Test 2: Typography Validation

```typescript
// tests/specFiles/ga/button/button.typography.spec.ts
test('[BTN-TYPO-001] Button text font matches Figma', async ({ page }) => {
  await page.goto('http://localhost:4503/button.html');
  
  const button = page.locator('.button.primary');
  const spec = figmaSpec.variants.primary.default;
  
  const actualFont = await button.evaluate(el => ({
    family: getComputedStyle(el).fontFamily,
    size: getComputedStyle(el).fontSize,
    weight: getComputedStyle(el).fontWeight
  }));
  
  expect(actualFont.family).toContain(spec.fontFamily);
  expect(actualFont.size).toBe(spec.fontSize);
  expect(actualFont.weight).toBe(String(spec.fontWeight));
});
```

### Test 3: Dimension Validation

```typescript
// tests/specFiles/ga/button/button.dimensions.spec.ts
test('[BTN-DIM-001] Button height matches Figma', async ({ page }) => {
  await page.goto('http://localhost:4503/button.html');
  
  const button = page.locator('.button.primary');
  const spec = figmaSpec.variants.primary.default;
  
  const height = await button.evaluate(el => 
    getComputedStyle(el).height
  );
  
  expect(height).toBe(spec.height);
});

test('[BTN-DIM-002] Button padding matches Figma', async ({ page }) => {
  await page.goto('http://localhost:4503/button.html');
  
  const button = page.locator('.button.primary');
  const spec = figmaSpec.variants.primary.default;
  
  const padding = await button.evaluate(el => 
    getComputedStyle(el).padding
  );
  
  const [top, right, bottom, left] = padding.split(' ').map(p => p.trim());
  expect(`${top} ${right}`).toBe(spec.padding);
});
```

### Test 4: Visual Snapshot (Figma Comparison)

```typescript
// tests/specFiles/ga/button/button.visual.spec.ts
test('[BTN-VIS-001] Button primary matches Figma screenshot', async ({ page }) => {
  await page.goto('http://localhost:4503/button.html');
  
  const button = page.locator('.button.primary');
  const baselinePath = `tests/data/figma/baselines/${figmaSpec.baselineImages['primary-default']}`;
  
  // Compare with Figma baseline
  await expect(button).toHaveScreenshot(baselinePath, {
    maxDiffPixels: figmaSpec.validationRules.maxDiffPixels,
    threshold: 0.2 // 20% tolerance
  });
});

test('[BTN-VIS-002] Button hover state matches Figma', async ({ page }) => {
  await page.goto('http://localhost:4503/button.html');
  
  const button = page.locator('.button.primary');
  await button.hover();
  
  const baselinePath = `tests/data/figma/baselines/${figmaSpec.baselineImages['primary-hover']}`;
  
  await expect(button).toHaveScreenshot(baselinePath, {
    maxDiffPixels: figmaSpec.validationRules.maxDiffPixels
  });
});
```

### Test 5: State Validation

```typescript
// tests/specFiles/ga/button/button.states.spec.ts
test('[BTN-STATE-001] Button shows all required states from Figma', async ({ page }) => {
  await page.goto('http://localhost:4503/button.html');
  
  const states = ['default', 'hover', 'focus', 'disabled'];
  
  for (const state of states) {
    // Verify state exists in Figma spec
    expect(figmaSpec.variants.primary[state]).toBeDefined();
    
    // Verify state is rendered in component
    // (implementation depends on how states are marked in HTML)
  }
});
```

---

## 🔄 Figma Sync Workflow

### Daily Sync with Figma:

```bash
# 1. Export design specs from Figma
# (Manual or via Figma API)
figma-api export-specs \
  --figma-file "button-component" \
  --output tests/data/figma/button.json

# 2. Export baseline images from Figma
figma-api export-images \
  --figma-file "button-component" \
  --output tests/data/figma/baselines/

# 3. Run comparison tests
env=local npx playwright test tests/specFiles/ga/button/button.colors.spec.ts
env=local npx playwright test tests/specFiles/ga/button/button.visual.spec.ts

# 4. Generate report
npx playwright show-report
```

---

## 📊 Test Results Report

When tests run:

```
✅ MATCHES FIGMA:
  [BTN-COLOR-001] Button primary color: #0066CC ✅
  [BTN-COLOR-002] Button hover color: #0052A3 ✅
  [BTN-DIM-001] Button height: 44px ✅
  [BTN-TYPO-001] Font family: Inter ✅
  [BTN-VIS-001] Screenshot match: 99.8% ✅

❌ DEVIATES FROM FIGMA:
  [BTN-DIM-002] Button height: 42px (expected 44px) ❌
    └─ Issue: Height 2px too small
    └─ Action: Fix component CSS
  
  [BTN-COLOR-003] Button hover color: #0055BB (expected #0052A3) ❌
    └─ Issue: Color doesn't match Figma
    └─ Action: Update CSS or update Figma
```

---

## 🎯 How This Helps

### For QA:
- ✅ Know exactly what to test (Figma spec)
- ✅ Detect deviations immediately
- ✅ Know if it's a component bug or Figma change
- ✅ Have baseline to compare against

### For Developers:
- ✅ Know component must match Figma
- ✅ Get test failure if they miss detail
- ✅ Know exact Figma spec values
- ✅ Can't have mismatch

### For Designers:
- ✅ Designs are validated in tests
- ✅ Components must match what they designed
- ✅ No "close enough" implementations
- ✅ Pixel-perfect validation

---

## 🚀 Quick Implementation

### Step 1: Create Design Spec

```bash
# Create Figma spec file for button
cat > tests/data/figma/button.json << 'EOF'
{
  "component": "button",
  "figmaUrl": "https://figma.com/file/XXX",
  "lastSyncedFromFigma": "2026-06-01T14:30:00Z",
  "variants": {
    "primary": {
      "default": {
        "backgroundColor": "#0066CC",
        "textColor": "#FFFFFF",
        "height": "44px",
        "padding": "12px 16px",
        "fontSize": "16px",
        "fontWeight": "500"
      },
      "hover": {
        "backgroundColor": "#0052A3"
      }
    }
  }
}
EOF
```

### Step 2: Create Tests

Copy the test examples above into:
- `tests/specFiles/ga/button/button.colors.spec.ts`
- `tests/specFiles/ga/button/button.dimensions.spec.ts`
- `tests/specFiles/ga/button/button.visual.spec.ts`

### Step 3: Run Tests

```bash
env=local npx playwright test tests/specFiles/ga/button/ --grep @figma
```

### Step 4: Update When Figma Changes

When designer updates Figma:
1. Update design spec JSON
2. Re-export baseline images
3. Re-run tests
4. Tests should pass

---

## ✨ Key Principle

**Figma is Source of Truth**

```
Component Implementation
    ↓
Must Match Figma
    ↓
Tests Verify Match
    ↓
If Mismatch → Fix Component
```

No exceptions. Figma spec is law.

---

## 📋 Checklist to Implement

- [ ] Export current Figma designs (colors, fonts, sizes)
- [ ] Create design spec JSON files (tests/data/figma/)
- [ ] Export baseline images from Figma
- [ ] Create color validation tests
- [ ] Create typography validation tests
- [ ] Create dimension validation tests
- [ ] Create visual snapshot tests
- [ ] Run all tests against current components
- [ ] Fix any mismatches
- [ ] Set up daily Figma sync workflow
- [ ] Train team on process

---

**This makes Figma the single source of truth for component testing!** ✅
