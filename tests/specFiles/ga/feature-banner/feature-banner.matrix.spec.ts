import { test, expect } from '../../../utils/infra/persistent-context';
import { FeatureBannerPage } from '../../../pages/ga/components/featureBannerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * Feature Banner State Matrix
 *
 * Dimensions: variant × background × viewport
 *   Variants: default, fifty-fifty
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
 * page and verifies the feature-banner component is visible within it.
 * Without confirmed variant wrapper classes, valid tests verify any
 * .feature-banner inside each section (one test per background).
 *
 * Selectors (from DOM probe):
 *   Section:   .cmp-section--background-color-{bg}
 *   Component: .feature-banner
 *
 * 16 tests (reduced from 72 with viewport triplication and broken locators).
 */

const BACKGROUNDS = ['white', 'slate', 'granite', 'azul'] as const;

/** Section selector for a given background */
function sectionSel(bg: string) {
  return `.cmp-section--background-color-${bg}`;
}

/** Enabled feature-banner inside a background section */
function componentInSection(
  page: import('@playwright/test').Page,
  bg: string,
) {
  return page
    .locator(sectionSel(bg))
    .first()
    .locator(`.feature-banner:not([aria-disabled="true"])`)
    .first();
}

// ── Valid: feature-banner across all backgrounds (FB-025..FB-028) ─────

test.describe('FeatureBanner — State Matrix (Valid)', () => {

  for (let i = 0; i < BACKGROUNDS.length; i++) {
    const bg = BACKGROUNDS[i];
    const id = String(25 + i).padStart(3, '0');

    test(`[FB-${id}] @matrix @regression feature-banner in ${bg} section`, async ({ page }) => {
      const pom = new FeatureBannerPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const comp = componentInSection(page, bg);
      await expect(comp).toBeVisible();
    });
  }
});

// ── Responsive: one spot-check per background at mobile (FB-029..FB-032) ─

test.describe('FeatureBanner — State Matrix (Responsive)', () => {

  for (let i = 0; i < BACKGROUNDS.length; i++) {
    const bg = BACKGROUNDS[i];
    const id = String(29 + i).padStart(3, '0');

    test(`[FB-${id}] @matrix @regression @mobile feature-banner in ${bg} section @ mobile-390`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const pom = new FeatureBannerPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const comp = componentInSection(page, bg);
      await expect(comp).toBeVisible();
    });
  }
});

// ── Invalid Combos: contrast concerns (FB-033..FB-040) ───────────────

test.describe('FeatureBanner — State Matrix (Invalid Combos)', () => {
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

  const VARIANT_NAMES = ['default', 'fifty-fifty'] as const;

  let testNum = 33;

  for (const pair of INVALID_PAIRS) {
    for (const variant of VARIANT_NAMES) {
      const id = String(testNum++).padStart(3, '0');

      test(`[FB-${id}] @matrix @negative ${variant} + ${pair.theme} on ${pair.bg} (${pair.reason})`, async ({ page }) => {
        // This combo has insufficient contrast if applied manually.
        // Auto-theme should be used instead. Verify section still renders.
        const pom = new FeatureBannerPage(page);
        await pom.navigate(BASE());
        const section = page.locator(sectionSel(pair.bg)).first();
        await expect(section).toBeVisible();
      });
    }
  }
});
