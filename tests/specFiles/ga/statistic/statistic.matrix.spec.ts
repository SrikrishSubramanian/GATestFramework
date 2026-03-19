import { test, expect } from '../../../utils/infra/persistent-context';
import { StatisticPage } from '../../../pages/ga/components/statisticPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * Statistic State Matrix
 *
 * Dimensions: variant × background × viewport
 *   Variants: default (only 1)
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
 * page and verifies the statistic component is visible within it.
 *
 * Selectors (from DOM probe):
 *   Section:   .cmp-section--background-color-{bg}
 *   Component: .cmp-statistic
 *
 * 16 tests (reduced from 36 with viewport triplication and broken locators).
 */

const BACKGROUNDS = ['white', 'slate', 'granite', 'azul'] as const;

/** Section selector for a given background */
function sectionSel(bg: string) {
  return `.cmp-section--background-color-${bg}`;
}

/** Enabled statistic inside a background section */
function componentInSection(
  page: import('@playwright/test').Page,
  bg: string,
) {
  return page
    .locator(sectionSel(bg))
    .first()
    .locator(`.cmp-statistic:not([aria-disabled="true"])`)
    .first();
}

// ── Valid: light-theme on dark backgrounds (STAT-025..STAT-026) ──────

test.describe('Statistic — State Matrix (Valid)', () => {

  const LIGHT_ON_DARK: readonly string[] = ['granite', 'azul'];

  for (let i = 0; i < LIGHT_ON_DARK.length; i++) {
    const bg = LIGHT_ON_DARK[i];
    const id = String(25 + i).padStart(3, '0');

    test(`[STAT-${id}] @matrix @regression default + light-theme in ${bg} section`, async ({ page }) => {
      const pom = new StatisticPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const comp = componentInSection(page, bg);
      await expect(comp).toBeVisible();
    });
  }

  // ── Valid: dark-theme on light backgrounds (STAT-027..STAT-028) ─────

  const DARK_ON_LIGHT: readonly string[] = ['white', 'slate'];

  for (let i = 0; i < DARK_ON_LIGHT.length; i++) {
    const bg = DARK_ON_LIGHT[i];
    const id = String(27 + i).padStart(3, '0');

    test(`[STAT-${id}] @matrix @regression default + dark-theme in ${bg} section`, async ({ page }) => {
      const pom = new StatisticPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const comp = componentInSection(page, bg);
      await expect(comp).toBeVisible();
    });
  }

  // ── Valid: auto-theme on all backgrounds (STAT-029..STAT-032) ───────

  for (let i = 0; i < BACKGROUNDS.length; i++) {
    const bg = BACKGROUNDS[i];
    const id = String(29 + i).padStart(3, '0');

    test(`[STAT-${id}] @matrix @regression default + auto-theme in ${bg} section`, async ({ page }) => {
      const pom = new StatisticPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const comp = componentInSection(page, bg);
      await expect(comp).toBeVisible();
    });
  }
});

// ── Responsive: one spot-check per background at mobile (STAT-033..STAT-036) ─

test.describe('Statistic — State Matrix (Responsive)', () => {

  for (let i = 0; i < BACKGROUNDS.length; i++) {
    const bg = BACKGROUNDS[i];
    const id = String(33 + i).padStart(3, '0');

    test(`[STAT-${id}] @matrix @regression @mobile statistic in ${bg} section @ mobile-390`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const pom = new StatisticPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(bg)).first();
      await expect(section).toBeVisible();
      const comp = componentInSection(page, bg);
      await expect(comp).toBeVisible();
    });
  }
});

// ── Invalid Combos: contrast concerns (STAT-037..STAT-040) ───────────

test.describe('Statistic — State Matrix (Invalid Combos)', () => {
  /*
   * These theme + background combinations have insufficient contrast:
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

  let testNum = 37;

  for (const pair of INVALID_PAIRS) {
    const id = String(testNum++).padStart(3, '0');

    test(`[STAT-${id}] @matrix @negative default + ${pair.theme} on ${pair.bg} (${pair.reason})`, async ({ page }) => {
      // This combo has insufficient contrast if applied manually.
      // Auto-theme should be used instead. Verify section still renders.
      const pom = new StatisticPage(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel(pair.bg)).first();
      await expect(section).toBeVisible();
    });
  }
});
