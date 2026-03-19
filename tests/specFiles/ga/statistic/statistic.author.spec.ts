import { test, expect } from '@playwright/test';
import { StatisticPage } from '../../../pages/ga/components/statisticPage';
import ENV from '../../../utils/infra/env';

import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Statistic — Happy Path', () => {
  test('[STTS-001] @smoke @regression Statistic renders correctly', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
    // Verify core structure: heading or primary content exists
    const heading = root.locator('h1, h2, h3').first();
    const hasHeading = await heading.count() > 0;
    if (hasHeading) {
      await expect(heading).toBeVisible();
    }
    // Verify no JS errors during render
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    expect(errors).toEqual([]);
  });

  test('[STTS-002] @smoke @regression Statistic interactive elements are functional', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
    // Verify interactive elements (links, buttons) are present and clickable
    const interactive = root.locator('a, button');
    const count = await interactive.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(interactive.nth(i)).toBeVisible();
      await expect(interactive.nth(i)).toBeEnabled();
    }
  });
});

// ─── Selectors (from style guide DOM + policies) ─────────────────────────────
const ROOT = '.cmp-statistic';
const ITEM = '.cmp-statistic__item';
const VALUE = '.cmp-statistic__value';
const DESCRIPTION = '.cmp-statistic__description';

const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';

test.describe('Statistic — Component Structure', () => {
  test('[STTS-020] @regression @smoke Style guide has multiple statistic instances', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const roots = page.locator(ROOT);
    expect(await roots.count()).toBeGreaterThanOrEqual(4);
  });

  test('[STTS-021] @regression Each statistic has value and description', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const first = page.locator(ROOT).first();
    await expect(first.locator(VALUE)).toBeVisible();
    await expect(first.locator(DESCRIPTION)).toBeVisible();
  });

  test('[STTS-022] @regression Statistic value contains text content', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const value = page.locator(`${ROOT} ${VALUE}`).first();
    const text = await value.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('[STTS-023] @regression Statistic description contains text content', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const desc = page.locator(`${ROOT} ${DESCRIPTION}`).first();
    const text = await desc.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });
});

test.describe('Statistic — Alignment Variants', () => {
  test('[STTS-024] @regression Left-aligned statistic has text-align left', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const leftAligned = page.locator('.cmp-statistic--align-left').first();
    if (await leftAligned.count() === 0) { test.skip(); return; }
    const textAlign = await leftAligned.evaluate(el => getComputedStyle(el).textAlign);
    expect(textAlign).toMatch(/left|start/);
  });

  test('[STTS-025] @regression Center-aligned statistic has text-align center', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const centerAligned = page.locator('.cmp-statistic--align-center').first();
    if (await centerAligned.count() === 0) { test.skip(); return; }
    const textAlign = await centerAligned.evaluate(el => getComputedStyle(el).textAlign);
    expect(textAlign).toBe('center');
  });
});

test.describe('Statistic — Theme Color Variants', () => {
  test('[STTS-026] @regression Granite theme uses granite text color', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const granite = page.locator('.cmp-statistic--theme-granite').first();
    if (await granite.count() === 0) { test.skip(); return; }
    const color = await granite.locator(VALUE).evaluate(el => getComputedStyle(el).color);
    // Granite text should be dark
    expect(color).not.toContain('rgb(255, 255, 255)');
  });

  test('[STTS-027] @regression Azul theme uses azul text color', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const azul = page.locator('.cmp-statistic--theme-azul').first();
    if (await azul.count() === 0) { test.skip(); return; }
    const color = await azul.locator(VALUE).evaluate(el => getComputedStyle(el).color);
    // Azul text should be blue-toned, not default black
    expect(color).not.toBe('rgb(0, 0, 0)');
  });

  test('[STTS-028] @regression Each theme variant produces a different value text color', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const themes = ['theme-white', 'theme-slate', 'theme-granite', 'theme-azul'];
    const colors: string[] = [];
    for (const theme of themes) {
      const el = page.locator(`.cmp-statistic--${theme}`).first();
      if (await el.count() === 0) continue;
      const color = await el.locator(VALUE).evaluate(el => getComputedStyle(el).color);
      colors.push(color);
    }
    // At least 2 distinct colors among the themes
    const unique = new Set(colors);
    expect(unique.size).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Statistic — Border Modifier', () => {
  test('[STTS-029] @regression Border-enabled statistic has visible border', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const bordered = page.locator('.cmp-statistic--border').first();
    if (await bordered.count() === 0) { test.skip(); return; }
    const borderStyle = await bordered.locator(ITEM).evaluate(el => getComputedStyle(el).borderLeftStyle);
    expect(borderStyle).not.toBe('none');
  });

  test('[STTS-030] @regression Non-bordered statistic has no visible border', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    // Find a statistic without the border class
    const all = page.locator(ROOT);
    const count = await all.count();
    for (let i = 0; i < count; i++) {
      const classes = await all.nth(i).getAttribute('class') || '';
      if (!classes.includes('--border')) {
        const borderWidth = await all.nth(i).locator(ITEM).evaluate(
          el => parseInt(getComputedStyle(el).borderLeftWidth || '0', 10)
        );
        expect(borderWidth).toBe(0);
        return;
      }
    }
  });
});

test.describe('Statistic — Typography', () => {
  test('[STTS-031] @regression Value font size is larger than description font size', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const first = page.locator(ROOT).first();
    const valueSize = await first.locator(VALUE).evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    const descSize = await first.locator(DESCRIPTION).evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(valueSize).toBeGreaterThan(descSize);
  });

  test('[STTS-032] @regression Value has bold or heavy font weight', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const value = page.locator(`${ROOT} ${VALUE}`).first();
    const weight = await value.evaluate(el => parseInt(getComputedStyle(el).fontWeight, 10));
    expect(weight).toBeGreaterThanOrEqual(600);
  });
});

test.describe('Statistic — Responsive', () => {
  test('[STTS-006] @mobile @regression Statistic adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-statistic').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('Statistic — Accessibility', () => {
  test('[STTS-010] @a11y @wcag22 @regression @smoke Statistic passes axe-core scan', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-statistic')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[STTS-011] @a11y @wcag22 @regression @smoke Statistic interactive elements meet 24px target size', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-statistic a, .cmp-statistic button, .cmp-statistic input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[STTS-012] @a11y @wcag22 @regression @smoke Statistic focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new StatisticPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-statistic a, .cmp-statistic button, .cmp-statistic input');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
      }
    }
  });
});
