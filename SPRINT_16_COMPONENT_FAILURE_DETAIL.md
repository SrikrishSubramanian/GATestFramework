# 📊 SPRINT 16 - COMPONENT FAILURE DETAILS

**Format**: Each Component Shows What Failed & Why  
**Test Environment**: DEV (Adobe AEM Cloud)  
**Date**: May 30, 2026

---

## 🎯 ACCORDION — 23 Failed / 77 Passed

### ❌ ACRD-006 | GA circular icon indicator present
**Scenario**: Verify `.cmp-accordion__item-indicator--ga` element renders on all accordion items  
**Why Failed**: Missing DOM element — GA indicator spans not rendering in template  
**Expected**: Element `.cmp-accordion__item-indicator--ga` should be visible  
**Actual**: Element not found (timeout after 15000ms waiting for selector)  
**Root Cause**: GA component uses KKR base template without GA indicator override  

---

### ❌ ACRD-008 | All items closed on page load (White section)
**Scenario**: Verify all accordion items start in closed state on initial page load  
**Why Failed**: Server-rendered `aria-expanded="true"` overrides closed state  
**Expected**: `aria-expanded="false"` on all buttons initially  
**Actual**: `aria-expanded="true"` initially (flickers to false after JS loads)  
**Root Cause**: HTL hard-codes aria-expanded="true"; JS collapse is slow/async  

---

### ❌ ACRD-009 | All items closed on page load (Granite section)
**Scenario**: Same as ACRD-008 but for dark background (granite) section  
**Why Failed**: Same as ACRD-008  
**Expected**: `aria-expanded="false"`  
**Actual**: `aria-expanded="true"` initially  

---

### ❌ ACRD-010 | All items closed on page load (Azul section)
**Scenario**: Same as ACRD-008 but for azul section  
**Why Failed**: Same as ACRD-008  
**Expected**: `aria-expanded="false"`  
**Actual**: `aria-expanded="true"` initially  

---

### ❌ ACRD-017 | Icon vertical line opacity transitions on expand
**Scenario**: Verify `.cmp-accordion__item-icon-line--vertical` element transitions opacity  
**Why Failed**: Missing DOM element — vertical icon-line span doesn't exist  
**Expected**: Span with `opacity: 1` that transitions to `opacity: 0`  
**Actual**: Element not found in DOM  
**Root Cause**: GA indicator override doesn't exist yet  

---

### ❌ ACRD-019 | Icon vertical line rotates when expanded
**Scenario**: Verify vertical line rotates 90 degrees on expand  
**Why Failed**: Missing DOM element  
**Expected**: `.cmp-accordion__item-icon-line--vertical` should have transform rotate  
**Actual**: Element not found  

---

### ❌ ACRD-020 | Collapsed item shows plus shape (horizontal + vertical lines)
**Scenario**: Verify plus icon (✚) shows in collapsed state  
**Why Failed**: Missing DOM elements  
**Expected**: Both horizontal and vertical icon-line spans visible  
**Actual**: Selector `.cmp-accordion__item-icon-line--horizontal` not found  

---

### ❌ ACRD-023 | Keyboard Tab navigates between buttons
**Scenario**: Verify Tab key moves focus between accordion buttons  
**Why Failed**: Missing GA indicator blocks keyboard navigation test setup  
**Expected**: Focus moves to next button after Tab key  
**Actual**: Focus doesn't move (timeout waiting for visible element)  
**Root Cause**: Test setup requires visible indicator to exist first  

---

### ❌ ACRD-024 | Granite section borders are white
**Scenario**: Verify button borders are white on dark granite background  
**Why Failed**: CSS color inheritance issue — currentColor defaults to black  
**Expected**: `getComputedStyle(item).borderBottomColor = "rgb(255, 255, 255)"` (WHITE)  
**Actual**: `"rgb(0, 0, 0)"` (BLACK)  
**Root Cause**: `.cmp-accordion__item` uses `borderBottomColor: currentColor` but `color` not set on item; set only on button  

---

### ❌ ACRD-025 | Granite section button text is white
**Scenario**: Verify button title text is white on dark background  
**Why Failed**: CSS color not applied to button in dark section  
**Expected**: `getComputedStyle(button).color = "rgb(255, 255, 255)"` (WHITE)  
**Actual**: `"rgb(51, 51, 51)"` (DARK GRAY — body text color)  
**Root Cause**: Dark section CSS doesn't set `color: @c-ga-white` on buttons  

---

### ❌ ACRD-026 | Azul section borders are white
**Scenario**: Verify borders are white on azul background  
**Why Failed**: Same as ACRD-024 but for azul section  
**Expected**: `borderBottomColor = "rgb(255, 255, 255)"`  
**Actual**: `"rgb(0, 0, 0)"`  

---

### ❌ ACRD-027 | Azul section button text is white
**Scenario**: Verify button text is white on azul background  
**Why Failed**: Same as ACRD-025 but for azul section  
**Expected**: `color = "rgb(255, 255, 255)"`  
**Actual**: `"rgb(51, 51, 51)"`  

---

### ❌ ACRD-028 | Icon lines are white on dark background
**Scenario**: Verify indicator icon lines are white on granite/azul  
**Why Failed**: Missing DOM element (icon-line span doesn't exist)  
**Expected**: `.cmp-accordion__item-icon-line--horizontal` with `backgroundColor = "rgb(255, 255, 255)"`  
**Actual**: Element not found  

---

### ❌ ACRD-029 | Light background text is NOT white
**Scenario**: Verify button text is dark (not white) on light background  
**Why Failed**: Text incorrectly set to white on light sections  
**Expected**: `color ≠ "rgb(255, 255, 255)"`  
**Actual**: `color = "rgb(255, 255, 255)"` (WHITE on white background = invisible)  
**Root Cause**: CSS applies white color globally instead of only in dark sections  

---

### ❌ ACRD-038 | Every button has aria-expanded attribute
**Scenario**: Verify all buttons have aria-expanded set (true or false)  
**Why Failed**: Some buttons missing attribute  
**Expected**: Every `.cmp-accordion__item-button` has `aria-expanded` attribute  
**Actual**: Some buttons don't have attribute  

---

### ❌ ACRD-040 | Content panels have role="region"
**Scenario**: Verify accessibility: content panels have semantic role  
**Why Failed**: Missing ARIA role attribute  
**Expected**: `.cmp-accordion__item-content` has `role="region"`  
**Actual**: Attribute missing  
**WCAG Violation**: 1.3.1 - Info and Relationships  

---

### ❌ ACRD-044 | Dialog helpPath configured
**Scenario**: Verify component dialog has valid helpPath  
**Why Failed**: Help URL returns 404  
**Expected**: Dialog helpPath resolves with 200 status  
**Actual**: 404 Not Found  

---

### ❌ ACRD-VIS-001 through ACRD-VIS-005 | Visual baseline mismatches (5 failures)
**Scenario**: Desktop/Mobile/Tablet screenshots match baseline  
**Why Failed**: P0 HTL change altered component height  
**Expected**: Desktop height 1314×583px | Mobile 350×651px | Tablet 768×615px  
**Actual**: Desktop 1314×538px (-45px) | Mobile 350×577px (-74px) | Tablet 768×562px (-53px)  
**Root Cause**: Icon-line spans changed component dimensions; baselines need regeneration  

---

---

## 🎯 BUTTON — 14 Failed / 58 Passed

### ❌ BTN-045 | Button icon renders with GA styling
**Scenario**: Verify `.cmp-button__icon` renders inside button  
**Why Failed**: Missing DOM element  
**Expected**: `<span class="cmp-button__icon">` visible inside button  
**Actual**: Element not found  

---

### ❌ BTN-VIS-002 through BTN-VIS-006 | Visual baseline mismatches (5 failures)
**Scenario**: Button screenshots match baseline  
**Why Failed**: Icon styling or dimensions changed  
**Expected**: Baseline dimensions  
**Actual**: Different pixel dimensions (icon sizing changed)  

---

### Other Button Failures (8 remaining)
**Similar patterns**: Missing icon elements, visual baseline mismatches, styling on dark backgrounds

---

---

## 🎯 FORM OPTIONS — 23 Failed / 62 Passed

### ❌ FO-023 | Clicking radio button updates custom select
**Scenario**: Verify clicking radio updates underlying `<select>` value  
**Why Failed**: Event handler not triggered by `.check({ force: true })`  
**Expected**: Underlying select value updates when radio clicked  
**Actual**: Select value remains unchanged  
**Root Cause**: GA `options.js` listens to `change` events; `.check({ force: true })` doesn't reliably dispatch it  

---

### ❌ FO-024 | Multiple radio selection updates state
**Scenario**: Verify multiple radios can be selected and state updates  
**Why Failed**: Event not dispatched  
**Expected**: Event handler fires, internal state updates  
**Actual**: No event fired  
**Root Cause**: Same as FO-023  

---

### ❌ FO-027 | Checkbox group state persists
**Scenario**: Verify checkbox values persist after interaction  
**Why Failed**: Event handler not triggered  
**Expected**: Checkbox state syncs to internal model  
**Actual**: State doesn't sync  
**Root Cause**: Same as FO-023  

---

### ❌ FO-VIS-* | Visual baseline mismatches (4+ failures)
**Scenario**: Form options screenshots match baseline  
**Why Failed**: No baselines captured yet (new component in Sprint 16)  
**Expected**: Baseline screenshot exists  
**Actual**: Baseline file missing  

---

### Other Form Options Failures (12 remaining)
**Patterns**: Missing legend elements, styling issues, state management

---

---

## 🎯 FORM TEXT — 18 Failed / 51 Passed

### ❌ FT-012 | Input placeholder styling correct
**Scenario**: Verify placeholder text color matches design  
**Why Failed**: CSS placeholder color not applied  
**Expected**: Placeholder color light gray (design spec)  
**Actual**: Placeholder dark gray (browser default)  

---

### ❌ FT-VIS-* | Visual baseline mismatches (6+ failures)
**Scenario**: Form text field screenshots match baseline  
**Why Failed**: No baseline captured for this new component  
**Expected**: Baseline exists  
**Actual**: Baseline missing  

---

---

## 🎯 NAVIGATION — 18 Failed / 47 Passed

### ❌ NAV-015 | Mobile navigation menu collapses correctly
**Scenario**: Verify menu collapses on mobile breakpoints  
**Why Failed**: Visual baseline mismatch (responsive layout changed)  
**Expected**: Baseline 375px wide navigation  
**Actual**: Current 390px wide (15px wider)  

---

### ❌ NAV-VIS-* | Visual baseline mismatches (5+ failures)
**Scenario**: Navigation screenshots match baseline at all breakpoints  
**Why Failed**: Responsive layout baselines stale or missing  
**Expected**: Baseline exists for mobile/tablet/desktop  
**Actual**: Baselines missing or dimensions don't match  

---

---

## 🎯 ACCORDION TABS FEATURE — 16 Failed / 59 Passed

### ❌ Similar patterns to Accordion
- Missing indicator elements
- Visual baseline mismatches (6-8 failures)
- State management issues
- Color/styling on dark backgrounds

---

---

## 🎯 CONTENT TRAIL — 14 Failed / 40 Passed

### ❌ CT-012 | Breadcrumb separators render correctly
**Scenario**: Verify SVG separators between breadcrumb items  
**Why Failed**: SVG asset returns 404  
**Expected**: Separator icon visible between items  
**Actual**: Empty space (icon failed to load)  

---

### ❌ CT-VIS-* | Visual baseline mismatches (6+ failures)
**Scenario**: Breadcrumb trail layout matches baseline  
**Why Failed**: No baseline or stale baseline  
**Expected**: Baseline exists  
**Actual**: Missing or dimensions mismatch  

---

---

## 🎯 FEATURE BANNER — 14 Failed / 46 Passed

### ❌ FB-005 | CTA button spacing matches design
**Scenario**: Verify button padding matches design spec  
**Why Failed**: Button padding CSS changed  
**Expected**: Padding 16px × 24px  
**Actual**: Padding 12px × 20px (4px smaller)  

---

### ❌ FB-VIS-* | Visual baseline mismatches (6+ failures)
**Scenario**: Banner layout matches baseline  
**Why Failed**: No baseline or stale baseline  
**Expected**: Baseline exists  
**Actual**: Missing or mismatch  

---

---

## 🎯 OTHER COMPONENTS (Headline Block, Hero Fifty-Fifty, Rate Table, Spacer, Statistic, Text)

**Similar patterns across all components:**
- ✅ **Most tests pass** (passing 50-65+ tests per component)
- ❌ **Visual baseline failures** (5-8 per component) — New components or stale baselines
- ❌ **Missing elements** (2-4 per component) — Component-specific missing DOM
- ❌ **State/styling** (2-5 per component) — Dark background color issues

---

---

## 📊 SUMMARY — ROOT CAUSES BY FREQUENCY

| Root Cause | Count | Components Affected |
|------------|-------|-------------------|
| **Visual baseline stale/missing** | 75 | All 14 components |
| **Missing GA indicator elements** | 45 | Accordion, Form Options, Navigation |
| **Dark background color not applied** | 38 | All components with dark sections |
| **Missing ARIA role/attributes** | 32 | Accordion, Form Options, Navigation |
| **State management (JS errors/events)** | 15 | Accordion, Form Options |
| **Other (SVG assets, configs)** | 15 | Various |
| **TOTAL** | **220** | — |

---

## 🔧 FIX ROADMAP

### **P0 (Deploy First)** — Fixes ~115 failures (52%)
1. ✅ Create GA accordion indicator override (HTL file)
2. ✅ Add `role="region"` to accordion content panels
3. ✅ Fix dark background color inheritance (LESS)

**Expected After P0**: 220 failures → ~105 failures

### **P1 (Deploy Second)** — Fixes ~75 failures (34%)
1. Change accordion initial state `aria-expanded="false"` (HTL)
2. Add accordion JS error guard (new JS file)
3. Update form-options to use `.click()` instead of `.check()`
4. Regenerate visual baselines with `--update-snapshots`

**Expected After P0+P1**: 105 failures → ~30 failures (97% pass rate)

### **P2 (Polish)** — Remaining ~15 failures
- SVG asset fixes
- Component-specific configuration adjustments
- Edge cases

---

## 📝 HOW TO USE THIS REPORT

✅ **Find your component** → Scroll to component name  
✅ **See the failures** → Each test shows Scenario + Why Failed + Expected vs Actual  
✅ **Understand root cause** → "Why Failed" explains the technical issue  
✅ **Know what to fix** → "Expected" shows the correct behavior

**Example**:
```
Component: ACCORDION — 23 Failed / 77 Passed

❌ ACRD-006 | GA circular icon indicator present
   Scenario: Verify indicator element renders
   Why Failed: Missing DOM element (template override missing)
   Expected: .cmp-accordion__item-indicator--ga visible
   Actual: Element not found
```

---

**Report Generated**: May 30, 2026  
**Data Source**: Sprint 16 DEV test run + P0 fix analysis  
**Status**: ✅ READY FOR TEAM REVIEW

