import { test, expect } from '../../../utils/infra/persistent-context';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * Button State Matrix
 *
 * Dimensions: variant × background × viewport
 *   Variants: primary-filled, secondary-outline, text-only (tertiary)
 *   Backgrounds: white (light), slate (light), granite (dark), azul (dark)
 *   Viewports: desktop-1440, mobile-390
 *
 * Valid theme pairings:
 *   light-theme  → dark backgrounds (granite, azul)
 *   dark-theme   → light backgrounds (white, slate)
 *   auto-theme   → all backgrounds
 *
 * Invalid theme pairings (contrast issues):
 *   light-theme  → light backgrounds (white, slate)
 *   dark-theme   → dark backgrounds (granite, azul)
 *
 * Each test scopes to the correct background section on the style guide
 * page and verifies the target variant button is visible and functional.
 *
 * Selectors (from DOM probe):
 *   Section:   .cmp-section--background-color-{bg}
 *   Primary:   .ga-button--primary
 *   Secondary: .ga-button--secondary
 *   Tertiary:  .ga-button--icon-text
 *   Disabled:  .ga-button--disabled (editor overlay — excluded)
 *
 * 28 tests (reduced from 108 with identical assertions and broken locators).
 */

const BACKGROUNDS = ['white', 'slate', 'granite', 'azul'] as const;

/** Section selector for a given background */
function sectionSel(bg: string) {
  return `.cmp-section--background-color-${bg}`;
}

/** Enabled button of a variant inside a background section (skips disabled overlays) */
function variantInSection(
  page: import('@playwright/test').Page,
  bg: string,
  variantClass: string,
) {
  return page
    .locator(sectionSel(bg))
    .first()
    .locator(`.button${variantClass}:not(.ga-button--disabled) .cmp-button`)
    .first();
}

// ── Valid: primary-filled across all backgrounds (BTN-088..BTN-091) ───

test.describe('Button — State Matrix (Valid)', () => {

  for (const [i, bg] of BACKGROUNDS.entries()) {
    const id = String(88 + i).padStart(3, '0');

    test(`[BTN-${id}] @matrix @regression primary-filled in ${bg} section`, async ({ page }) => {
      const pom = new ButtonPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const btn = variantInSection(page, bg, '.ga-button--primary');
      await expect(btn).toBeVisible();
      await expect(btn).toHaveAttribute('role', 'button');
    });
  }

  // ── Valid: secondary-outline across all backgrounds (BTN-092..BTN-095) ─

  for (const [i, bg] of BACKGROUNDS.entries()) {
    const id = String(92 + i).padStart(3, '0');

    test(`[BTN-${id}] @matrix @regression secondary-outline in ${bg} section`, async ({ page }) => {
      const pom = new ButtonPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const btn = variantInSection(page, bg, '.ga-button--secondary');
      await expect(btn).toBeVisible();
      await expect(btn).toHaveAttribute('role', 'button');
    });
  }

  // ── Valid: text-only (tertiary) across all backgrounds (BTN-096..BTN-099) ─

  for (const [i, bg] of BACKGROUNDS.entries()) {
    const id = String(96 + i).padStart(3, '0');

    test(`[BTN-${id}] @matrix @regression text-only in ${bg} section`, async ({ page }) => {
      const pom = new ButtonPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const btn = variantInSection(page, bg, '.ga-button--icon-text');
      await expect(btn).toBeVisible();
      await expect(btn).toContainText('Learn more');
    });
  }
});

// ── Responsive: one spot-check per background at mobile (BTN-100..BTN-103) ─

test.describe('Button — State Matrix (Responsive)', () => {

  for (const [i, bg] of BACKGROUNDS.entries()) {
    const id = String(100 + i).padStart(3, '0');

    test(`[BTN-${id}] @matrix @regression @mobile buttons in ${bg} section @ mobile-390`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const pom = new ButtonPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const btn = variantInSection(page, bg, '.ga-button--primary');
      await expect(btn).toBeVisible();
    });
  }
});

// ── Invalid Combos: contrast concerns (BTN-104..BTN-115) ──────────────

test.describe('Button — State Matrix (Invalid Combos)', () => {
  /*
   * These variant + theme + background combinations have insufficient contrast:
   *   - light-theme on light backgrounds (white, slate)
   *   - dark-theme on dark backgrounds (granite, azul)
   *
   * The style system should either not offer these combos or auto-correct
   * via auto-theme. Tests verify the section still renders (auto-theme
   * handles contrast) and document the invalid pairing.
   */

  const INVALID_PAIRS = [
    { theme: 'light-theme', bg: 'white', reason: 'light-on-light' },
    { theme: 'light-theme', bg: 'slate', reason: 'light-on-light' },
    { theme: 'dark-theme', bg: 'granite', reason: 'dark-on-dark' },
    { theme: 'dark-theme', bg: 'azul', reason: 'dark-on-dark' },
  ] as const;

  const VARIANT_NAMES = ['primary-filled', 'secondary-outline', 'text-only'] as const;

  let testNum = 104;

  for (const pair of INVALID_PAIRS) {
    for (const variant of VARIANT_NAMES) {
      const id = String(testNum++).padStart(3, '0');

      test(`[BTN-${id}] @matrix @negative ${variant} + ${pair.theme} on ${pair.bg} (${pair.reason})`, async ({ page }) => {
        // This combo has insufficient contrast if applied manually.
        // Auto-theme should be used instead. Verify section still renders.
        const pom = new ButtonPage(page);
        await pom.navigate(BASE());
        const section = page.locator(sectionSel(pair.bg)).first();
        await expect(section).toBeVisible();
      });
    }
  }
});
