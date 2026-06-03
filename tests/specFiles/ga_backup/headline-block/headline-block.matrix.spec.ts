import { test, expect } from '@playwright/test';
import { HeadlineBlockPage } from '../../../pages/ga/components/headlineBlockPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';
const HB = '.ga-headline-block';
const EYEBROW = '.ga-headline-block__eyebrow';
const TITLE = '.ga-headline-block__title';
const DESCRIPTOR = '.ga-headline-block__descriptor';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * Headline Block State Matrix
 *
 * Dimensions: alignment (left, center) × background (white, slate, granite, azul)
 * Style guide has 8 variations covering the full matrix.
 * Each section contains 2 headline-blocks: first = left-aligned, second = center-aligned
 * (OR sections alternate: odd index = left, even index = center within same bg)
 *
 * The style guide layout:
 *   White left → White center → Slate left → Slate center →
 *   Granite left → Granite center → Azul left → Azul center
 */

/** Helper: find nth headline-block in a given section background */
function hbInSection(page: import('@playwright/test').Page, sectionSel: string, nth: number) {
  return page.locator(`${sectionSel} ${HB}`).nth(nth);
}

// ── Alignment × Background: Desktop ──

test.describe('Headline Block — Matrix: Alignment × Background (Desktop)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('[HB-MX-001] @matrix @regression Left-aligned on white: text-align left + max-width 1032px', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    await expect(block).toBeVisible();
    const eyeAlign = await block.locator(EYEBROW).evaluate(el => getComputedStyle(el).textAlign);
    expect(['left', 'start']).toContain(eyeAlign);
    const maxWidth = await block.evaluate(el => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe('1032px');
  });

  test('[HB-MX-002] @matrix @regression Center-aligned on white: text-align center + max-width 1150px', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    // Center-aligned is in the second white section
    const block = page.locator(`${SECTION_WHITE}`).nth(1).locator(HB);
    await expect(block).toBeVisible();
    const titleAlign = await block.locator(TITLE).evaluate(el => getComputedStyle(el).textAlign);
    expect(titleAlign).toBe('center');
    const maxWidth = await block.evaluate(el => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe('1150px');
  });

  test('[HB-MX-003] @matrix @regression Left-aligned on slate: light-mode colors', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_SLATE} ${HB}`).first();
    await expect(block).toBeVisible();
    const titleColor = await block.locator(TITLE).evaluate(el => getComputedStyle(el).color);
    // Light mode: title should be dark, not white
    expect(titleColor).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-MX-004] @matrix @regression Center-aligned on slate: centered + light-mode colors', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_SLATE}`).nth(1).locator(HB);
    await expect(block).toBeVisible();
    const titleAlign = await block.locator(TITLE).evaluate(el => getComputedStyle(el).textAlign);
    expect(titleAlign).toBe('center');
    const titleColor = await block.locator(TITLE).evaluate(el => getComputedStyle(el).color);
    expect(titleColor).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-MX-005] @matrix @regression Left-aligned on granite: dark-mode white text', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_GRANITE} ${HB}`).first();
    await expect(block).toBeVisible();
    const titleColor = await block.locator(TITLE).evaluate(el => getComputedStyle(el).color);
    expect(titleColor).toMatch(/rgb\(255,\s*255,\s*255\)/);
    const descColor = await block.locator(`${DESCRIPTOR} p`).first().evaluate(el => getComputedStyle(el).color);
    expect(descColor).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-MX-006] @matrix @regression Center-aligned on granite: centered + dark-mode', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_GRANITE}`).nth(1).locator(HB);
    await expect(block).toBeVisible();
    const titleAlign = await block.locator(TITLE).evaluate(el => getComputedStyle(el).textAlign);
    expect(titleAlign).toBe('center');
    const titleColor = await block.locator(TITLE).evaluate(el => getComputedStyle(el).color);
    expect(titleColor).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-MX-007] @matrix @regression Left-aligned on azul: dark-mode white text', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_AZUL} ${HB}`).first();
    await expect(block).toBeVisible();
    const titleColor = await block.locator(TITLE).evaluate(el => getComputedStyle(el).color);
    expect(titleColor).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-MX-008] @matrix @regression Center-aligned on azul: centered + dark-mode', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_AZUL}`).nth(1).locator(HB);
    await expect(block).toBeVisible();
    const titleAlign = await block.locator(TITLE).evaluate(el => getComputedStyle(el).textAlign);
    expect(titleAlign).toBe('center');
    const titleColor = await block.locator(TITLE).evaluate(el => getComputedStyle(el).color);
    expect(titleColor).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });
});

// ── Responsive: Mobile spot checks ──

test.describe('Headline Block — Matrix: Responsive (Mobile)', () => {
  test('[HB-MX-009] @matrix @regression @mobile White section: headline-block visible at mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    await expect(block).toBeVisible();
    // No max-width on mobile
    const maxWidth = await block.evaluate(el => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe('none');
  });

  test('[HB-MX-010] @matrix @regression @mobile Granite section: dark-mode colors preserved at mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_GRANITE} ${HB}`).first();
    await expect(block).toBeVisible();
    const titleColor = await block.locator(TITLE).evaluate(el => getComputedStyle(el).color);
    expect(titleColor).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-MX-011] @matrix @regression @mobile Azul section: CTAs stack vertically at mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const ctaWrapper = page.locator(`${SECTION_AZUL} ${HB} .ga-headline-block__cta-wrapper`).first();
    const flexDir = await ctaWrapper.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');
  });

  test('[HB-MX-012] @matrix @regression @mobile Mobile padding: 32px top and bottom on all backgrounds', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const backgrounds = [SECTION_WHITE, SECTION_SLATE, SECTION_GRANITE, SECTION_AZUL];
    for (const bg of backgrounds) {
      const block = page.locator(`${bg} ${HB}`).first();
      const count = await block.count();
      if (count === 0) continue;
      const pt = await block.evaluate(el => getComputedStyle(el).paddingTop);
      const pb = await block.evaluate(el => getComputedStyle(el).paddingBottom);
      expect(pt, `${bg} paddingTop`).toBe('32px');
      expect(pb, `${bg} paddingBottom`).toBe('32px');
    }
  });
});
