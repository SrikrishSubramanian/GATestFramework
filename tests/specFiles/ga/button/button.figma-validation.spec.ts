/**
 * FIGMA-DRIVEN TESTING
 *
 * Validates that button component EXACTLY matches Figma design specs
 *
 * Figma is source of truth:
 * - Colors from Figma
 * - Sizes from Figma
 * - Fonts from Figma
 * - Styles from Figma
 *
 * If component doesn't match → FAIL TEST → FIX COMPONENT
 *
 * Run: env=local npx playwright test tests/specFiles/ga/button/button.figma-validation.spec.ts
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { resolveComponentUrl, deployFixture } from '../../../utils/infra/content-fixture-deployer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

let capture: ConsoleCapture;

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
  await deployFixture('button', page);
  capture = new ConsoleCapture(page);
  capture.start();
});

/**
 * NOT SOURCED FROM A REAL FIGMA FILE.
 *
 * This object was originally checked in as unadapted boilerplate — #0066CC/#0052A3-style
 * "generic corporate blue" values that do not match any color in GA's real palette
 * (kkr-aem/ui.apps.ga/.../less/abstracts/variables.less), and a 4px border-radius that contradicts
 * the component's actual pill shape. No Figma file/URL reference for the button component exists
 * anywhere in this repo (tests/data/, .claude/ config, or elsewhere) to query via the Figma MCP
 * tools, so genuine Figma ground truth could not be fetched this session.
 *
 * The values below have instead been re-grounded against the real implementation so this file
 * exercises real regression coverage instead of comparing against fabricated numbers:
 *   - button.less:158-205 `.ga-button--primary` + light-theme block (the "Filled (Primary)"
 *     variant driven by cq:styleId="primary-filled" -> cq:styleClasses="ga-button--primary",
 *     see ui.content.ga/.../conf/global-atlantic/settings/wcm/policies/.content.xml:481,493-494)
 *   - variables.less:288 `@c-primary-azul: #154197;` (aliased as `@c-azul-100`, button.less:313)
 *   - variables.less:312 `@c-azul-110: #0C2E70;` (hover)
 *   - variables.less:319 `@c-azul-20: #D0D9EA;` (disabled bg, light theme)
 *   - variables.less:337 `@c-ga-white: #FFFFFF;`
 *   - mixins.less:48-52 `.ff-graphie-bold()` -> `font-weight: 700;` (NOT 500 as previously hardcoded)
 *   - button.less:50 base `.cmp-button` -> `border-radius: 999px;` (pill, NOT 4px as previously
 *     hardcoded). `min-height: 44px;` is only a floor, not the real rendered height: with
 *     box-sizing:border-box, 15px top+bottom padding (button.less:62) plus the primary variant's
 *     2px top+bottom border (button.less:161, "border: 2px solid transparent") plus the 16px
 *     line-box push the actual box past the 44px floor. Confirmed LIVE against the running local
 *     AEM instance (env=local, BTN-FIGMA-004): `getComputedStyle(el).height` === "50px", not
 *     "44px" — the figmaSpec height below reflects that live-verified value, not a CSS calculation.
 *   - button.less:195-203 disabled (light theme, `.ga-button--disabled`) sets background/color only
 *     — there is NO opacity change on this variant, so the previous `disabled.opacity: '0.5'` had
 *     no basis in the real CSS either.
 *
 * This is source-code ground truth, not Figma ground truth — still the best available source of
 * truth in the absence of real Figma access. If/when a real Figma file for this component becomes
 * available, replace these values (and this comment) with values pulled directly from Figma via
 * the Figma MCP tools.
 */
const figmaSpec = {
  component: 'button',
  primary: {
    default: {
      backgroundColor: '#154197',   // @c-primary-azul / @c-azul-100 (button.less:160,183)
      textColor: '#FFFFFF',         // @c-ga-white (button.less:162,184)
      height: '50px',               // LIVE-VERIFIED (env=local, BTN-FIGMA-004) rendered height —
                                     // NOT the `min-height: 44px` floor in button.less:60; see comment above
      fontSize: '16px',             // rem-calc(16px) (button.less:55)
      fontWeight: '700',            // .ff-graphie-bold() (mixins.less:51) — was incorrectly '500'
      borderRadius: '999px'         // pill shape (button.less:50) — was incorrectly '4px'
    },
    hover: {
      backgroundColor: '#0C2E70'    // @c-azul-110 (button.less:169,191)
    },
    disabled: {
      backgroundColor: '#D0D9EA',   // @c-azul-20, light theme (button.less:200)
      opacity: null                 // no opacity rule exists for this variant — see comment above
    }
  }
};

// Helper: Convert RGB to Hex
function rgbToHex(rgb: string): string {
  const matches = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!matches) return rgb;
  const r = parseInt(matches[1]).toString(16).padStart(2, '0');
  const g = parseInt(matches[2]).toString(16).padStart(2, '0');
  const b = parseInt(matches[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 COLOR TESTS - Validate colors match Figma exactly
// ═══════════════════════════════════════════════════════════════════════════

test('[BTN-FIGMA-001] Primary button color matches Figma', async ({ page }) => {
  await page.goto(resolveComponentUrl('button'));

  // Real selector: the "Filled (Primary)" variant is the wrapper class `.ga-button--primary`
  // (from cq:styleId="primary-filled" -> cq:styleClasses="ga-button--primary", see
  // ui.content.ga/.../conf/global-atlantic/settings/wcm/policies/.content.xml:481,493-494)
  // around the real button element `.cmp-button` (button.html:98; button.author.spec.ts uses
  // `.cmp-button:not(#skip-nav)` throughout). There is no `.button.primary` class combination
  // anywhere in kkr-aem for this component. `.first()` picks the first "Filled M (Primary)"
  // button in the fixture, rendered outside any section container (light theme, no container
  // background overrides).
  const button = page.locator('.ga-button--primary .cmp-button').first();
  const expectedColor = figmaSpec.primary.default.backgroundColor;

  const bgColor = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el =>
    getComputedStyle(el).backgroundColor
  );

  const actualColor = rgbToHex(bgColor);

  console.log(`\n🎨 COLOR TEST`);
  console.log(`   Figma spec: ${expectedColor}`);
  console.log(`   Component: ${actualColor}`);

  expect(actualColor).toBe(expectedColor);
  console.log(`   ✅ MATCH`);
});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test('[BTN-FIGMA-002] Button hover color matches Figma', async ({ page }) => {
  await page.goto(resolveComponentUrl('button'));

  const button = page.locator('.ga-button--primary .cmp-button').first();
  const expectedHoverColor = figmaSpec.primary.hover.backgroundColor;

  // Simulate hover
  await hover(button);
  // hover() (src/utils/action-utils.ts:191-194) is a bare `locator.hover()` with no settle wait.
  // button.less:65-69 declares `transition: background 0.58s ease, ...` on `.cmp-button` — reading
  // getComputedStyle() immediately after hover() was confirmed live (env=local) to capture a
  // mid-transition interpolated color (observed "#133E90", between the default "#154197" and the
  // settled hover "#0C2E70"), not the final hover state. Wait out the transition before reading.
  await page.waitForTimeout(650);

  const hoverColor = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el =>
    getComputedStyle(el).backgroundColor
  );

  const actualColor = rgbToHex(hoverColor);

  console.log(`\n🎨 HOVER COLOR TEST`);
  console.log(`   Figma spec: ${expectedHoverColor}`);
  console.log(`   Component: ${actualColor}`);

  expect(actualColor).toBe(expectedHoverColor);
  console.log(`   ✅ MATCH`);
});

test('[BTN-FIGMA-003] Button text color matches Figma', async ({ page }) => {
  await page.goto(resolveComponentUrl('button'));

  const button = page.locator('.ga-button--primary .cmp-button').first();
  const expectedTextColor = figmaSpec.primary.default.textColor;

  const textColor = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el =>
    getComputedStyle(el).color
  );

  const actualColor = rgbToHex(textColor);

  console.log(`\n🎨 TEXT COLOR TEST`);
  console.log(`   Figma spec: ${expectedTextColor}`);
  console.log(`   Component: ${actualColor}`);

  expect(actualColor).toBe(expectedTextColor);
  console.log(`   ✅ MATCH`);
});

// ═══════════════════════════════════════════════════════════════════════════
// 📐 DIMENSION TESTS - Validate sizes match Figma exactly
// ═══════════════════════════════════════════════════════════════════════════

test('[BTN-FIGMA-004] Button height matches Figma', async ({ page }) => {
  await page.goto(resolveComponentUrl('button'));

  const button = page.locator('.ga-button--primary .cmp-button').first();
  const expectedHeight = figmaSpec.primary.default.height;

  const height = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el =>
    getComputedStyle(el).height
  );

  console.log(`\n📐 DIMENSION TEST - HEIGHT`);
  console.log(`   Figma spec: ${expectedHeight}`);
  console.log(`   Component: ${height}`);

  expect(height).toBe(expectedHeight);
  console.log(`   ✅ MATCH`);
});

test('[BTN-FIGMA-005] Button border radius matches Figma', async ({ page }) => {
  await page.goto(resolveComponentUrl('button'));

  const button = page.locator('.ga-button--primary .cmp-button').first();
  const expectedRadius = figmaSpec.primary.default.borderRadius;

  const radius = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el =>
    getComputedStyle(el).borderRadius
  );

  console.log(`\n📐 DIMENSION TEST - BORDER RADIUS`);
  console.log(`   Figma spec: ${expectedRadius}`);
  console.log(`   Component: ${radius}`);

  expect(radius).toBe(expectedRadius);
  console.log(`   ✅ MATCH`);
});

// ═══════════════════════════════════════════════════════════════════════════
// 🔤 TYPOGRAPHY TESTS - Validate fonts match Figma exactly
// ═══════════════════════════════════════════════════════════════════════════

test('[BTN-FIGMA-006] Button font size matches Figma', async ({ page }) => {
  await page.goto(resolveComponentUrl('button'));

  const button = page.locator('.ga-button--primary .cmp-button').first();
  const expectedSize = figmaSpec.primary.default.fontSize;

  const fontSize = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el =>
    getComputedStyle(el).fontSize
  );

  console.log(`\n🔤 TYPOGRAPHY TEST - FONT SIZE`);
  console.log(`   Figma spec: ${expectedSize}`);
  console.log(`   Component: ${fontSize}`);

  expect(fontSize).toBe(expectedSize); // TODO: Use assertTypography() for font checks
  console.log(`   ✅ MATCH`);
});

test('[BTN-FIGMA-007] Button font weight matches Figma', async ({ page }) => {
  await page.goto(resolveComponentUrl('button'));

  const button = page.locator('.ga-button--primary .cmp-button').first();
  const expectedWeight = figmaSpec.primary.default.fontWeight;

  const fontWeight = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el =>
    getComputedStyle(el).fontWeight
  );

  console.log(`\n🔤 TYPOGRAPHY TEST - FONT WEIGHT`);
  console.log(`   Figma spec: ${expectedWeight}`);
  console.log(`   Component: ${fontWeight}`);

  expect(fontWeight).toBe(expectedWeight); // TODO: Use assertTypography() for font checks
  console.log(`   ✅ MATCH`);
});

// ═══════════════════════════════════════════════════════════════════════════
// 📸 VISUAL SNAPSHOT TEST - Validate visual appearance matches Figma screenshot
// ═══════════════════════════════════════════════════════════════════════════

test('[BTN-FIGMA-008] Button visual appearance matches Figma screenshot', async ({ page }) => {
  await page.goto(resolveComponentUrl('button'));

  const button = page.locator('.ga-button--primary .cmp-button').first();

  console.log(`\n📸 VISUAL SNAPSHOT TEST`);
  console.log(`   Comparing component screenshot to Figma baseline`);

  // NOTE: No baseline image exists yet — there is no
  // button.figma-validation.spec.ts-snapshots/ directory in this test's folder (confirmed via
  // repo search, and by actually running this test: env=local run on 2026-08-13 failed with
  // "A snapshot doesn't exist at .../button-primary-figma-chromium-win32.png, writing actual" —
  // this repo's Playwright config does NOT auto-accept first-run snapshots, so the test fails
  // loudly rather than silently "passing" by creating a baseline. That is correct — do NOT run
  // with --update-snapshots to make this green, since the resulting baseline would just be
  // today's live rendering, not a real Figma export. A genuine baseline should be exported from
  // the real Figma design (once Figma access is available for this component — see the figmaSpec
  // comment above) and committed to the snapshots directory before this test is meaningful.
  // Visual snapshot comparison
  // First time: creates baseline
  // Subsequent runs: compares against baseline
  await expect(button).toHaveScreenshot('button-primary-figma.png', {
    maxDiffPixels: 500,      // Allow small pixel differences
    threshold: 0.2           // 20% tolerance for color variations
  });

  console.log(`   ✅ MATCH`);
});

// ═══════════════════════════════════════════════════════════════════════════
// ✅ SUMMARY TEST - Verify all Figma specs are defined
// ═══════════════════════════════════════════════════════════════════════════

test('[BTN-FIGMA-009] All Figma specs are defined', async () => {
  console.log(`\n✅ FIGMA SPEC SUMMARY`);
  console.log(`   Component: ${figmaSpec.component}`);
  console.log(`   \n   Default State:`);
  console.log(`   - Background: ${figmaSpec.primary.default.backgroundColor}`);
  console.log(`   - Text: ${figmaSpec.primary.default.textColor}`);
  console.log(`   - Height: ${figmaSpec.primary.default.height}`);
  console.log(`   - Font Size: ${figmaSpec.primary.default.fontSize}`);
  console.log(`   - Font Weight: ${figmaSpec.primary.default.fontWeight}`);
  console.log(`   - Border Radius: ${figmaSpec.primary.default.borderRadius}`);

  console.log(`   \n   Hover State:`);
  console.log(`   - Background: ${figmaSpec.primary.hover.backgroundColor}`);

  console.log(`   \n   Disabled State:`);
  console.log(`   - Background: ${figmaSpec.primary.disabled.backgroundColor}`);
  console.log(`   - Opacity: ${figmaSpec.primary.disabled.opacity}`);

  // Verify all specs are present
  expect(figmaSpec.primary.default.backgroundColor).toBeDefined(); // TODO: Use assertBackground() for color checks
  expect(figmaSpec.primary.default.textColor).toBeDefined();
  expect(figmaSpec.primary.hover.backgroundColor).toBeDefined(); // TODO: Use assertBackground() for color checks

  console.log(`\n   ✅ ALL SPECS DEFINED`);
});
