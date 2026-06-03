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
 * Statistic uses component-level theme classes on the parent wrapper div,
 * NOT section-level backgrounds:
 *   - default (no theme class) = white/default
 *   - cmp-statistic--theme-slate
 *   - cmp-statistic--theme-granite
 *   - cmp-statistic--theme-azul
 *
 * Other modifiers:
 *   - cmp-statistic--align-center (text alignment)
 *   - cmp-statistic--border (left border accent)
 *
 * 8 instances on style guide:
 *   0: default + border
 *   1: center-aligned
 *   2: theme-slate
 *   3: theme-slate
 *   4: theme-granite
 *   5: theme-azul
 *   6: border
 *   7: center + granite + border
 */

const ROOT = '.cmp-statistic';
const VALUE = '.cmp-statistic__value';
const WRAPPER = '.statistic';

// ── Theme Variants ───────────────────────────────────────────────────

test.describe('Statistic — State Matrix (Theme Variants)', () => {

  test('[STAT-025] @matrix @regression default theme statistic renders', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Default = no theme class on wrapper
    const defaultStat = page.locator(`${WRAPPER}:not([class*="theme-"])`).first();
    await expect(defaultStat).toBeVisible();
    await expect(defaultStat.locator(ROOT)).toBeVisible();
  });

  test('[STAT-026] @matrix @regression slate theme statistic renders', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const slate = page.locator(`${WRAPPER}.cmp-statistic--theme-slate`).first();
    await expect(slate).toBeVisible();
    await expect(slate.locator(ROOT)).toBeVisible();
  });

  test('[STAT-027] @matrix @regression granite theme statistic renders', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const granite = page.locator(`${WRAPPER}.cmp-statistic--theme-granite`).first();
    await expect(granite).toBeVisible();
    await expect(granite.locator(ROOT)).toBeVisible();
  });

  test('[STAT-028] @matrix @regression azul theme statistic renders', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const azul = page.locator(`${WRAPPER}.cmp-statistic--theme-azul`).first();
    await expect(azul).toBeVisible();
    await expect(azul.locator(ROOT)).toBeVisible();
  });
});

// ── Modifier Combos ──────────────────────────────────────────────────

test.describe('Statistic — State Matrix (Modifiers)', () => {

  test('[STAT-029] @matrix @regression border modifier renders', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const bordered = page.locator(`${WRAPPER}.cmp-statistic--border`).first();
    await expect(bordered).toBeVisible();
    await expect(bordered.locator(ROOT)).toBeVisible();
  });

  test('[STAT-030] @matrix @regression center-aligned modifier renders', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const centered = page.locator(`${WRAPPER}.cmp-statistic--align-center`).first();
    await expect(centered).toBeVisible();
    await expect(centered.locator(ROOT)).toBeVisible();
  });

  test('[STAT-031] @matrix @regression combined: granite + center + border', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const combined = page.locator(`${WRAPPER}.cmp-statistic--theme-granite.cmp-statistic--align-center.cmp-statistic--border`).first();
    await expect(combined).toBeVisible();
    await expect(combined.locator(ROOT)).toBeVisible();
  });
});

// ── Responsive ───────────────────────────────────────────────────────

test.describe('Statistic — State Matrix (Responsive)', () => {

  test('[STAT-032] @matrix @regression @mobile default statistic renders at mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const stat = page.locator(ROOT).first();
    await expect(stat).toBeVisible();
    const box = await stat.boundingBox();
    expect(box).toBeTruthy();
  });

  test('[STAT-033] @matrix @regression @mobile granite theme renders at mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const granite = page.locator(`${WRAPPER}.cmp-statistic--theme-granite`).first();
    await expect(granite).toBeVisible();
  });

  test('[STAT-034] @matrix @regression @mobile azul theme renders at mobile-390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const azul = page.locator(`${WRAPPER}.cmp-statistic--theme-azul`).first();
    await expect(azul).toBeVisible();
  });
});

// ── Theme Value Colors ───────────────────────────────────────────────

test.describe('Statistic — State Matrix (Theme Colors)', () => {

  test('[STAT-035] @matrix @regression theme variants produce distinct value colors', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const themes = ['theme-slate', 'theme-granite', 'theme-azul'];
    const colors: string[] = [];
    for (const theme of themes) {
      const el = page.locator(`${WRAPPER}.cmp-statistic--${theme}`).first();
      if (await el.count() === 0) continue;
      const color = await el.locator(VALUE).evaluate(el => getComputedStyle(el).color);
      colors.push(color);
    }
    // At least 2 distinct colors among themes
    const unique = new Set(colors);
    expect(unique.size).toBeGreaterThanOrEqual(2);
  });
});
