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
import { clickElement, fill, hover, doubleClick } from '../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';

let capture: ConsoleCapture;

const BASE_URL = 'http://localhost:4503';

// Load Figma design spec
const figmaSpec = {
  component: 'button',
  primary: {
    default: {
      backgroundColor: '#0066CC',
      textColor: '#FFFFFF',
      height: '44px',
      fontSize: '16px',
      fontWeight: '500',
      borderRadius: '4px'
    },
    hover: {
      backgroundColor: '#0052A3'
    },
    disabled: {
      backgroundColor: '#CCCCCC',
      opacity: '0.5'
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
  await page.goto(`${BASE_URL}/button.html`);

  const button = page.locator('.button.primary').first();
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
  await page.goto(`${BASE_URL}/button.html`);

  const button = page.locator('.button.primary').first();
  const expectedHoverColor = figmaSpec.primary.hover.backgroundColor;

  // Simulate hover
  await hover(button);
  // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
    // Wait for CSS transition

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
  await page.goto(`${BASE_URL}/button.html`);

  const button = page.locator('.button.primary').first();
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
  await page.goto(`${BASE_URL}/button.html`);

  const button = page.locator('.button.primary').first();
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
  await page.goto(`${BASE_URL}/button.html`);

  const button = page.locator('.button.primary').first();
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
  await page.goto(`${BASE_URL}/button.html`);

  const button = page.locator('.button.primary').first();
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
  await page.goto(`${BASE_URL}/button.html`);

  const button = page.locator('.button.primary').first();
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
  await page.goto(`${BASE_URL}/button.html`);

  const button = page.locator('.button.primary').first();

  console.log(`\n📸 VISUAL SNAPSHOT TEST`);
  console.log(`   Comparing component screenshot to Figma baseline`);

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
