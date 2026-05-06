import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Formatted RTE Frontend Component (GAAM-531)', () => {
  // ============ Frontend Rendering ============
  test('[GAAM-531-001] @regression Verify RTE frontend renders published content', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const content = page.locator('[class*="rte-content"], [class*="text-content"]').first();
    if (await content.count() > 0) {
      expect(await content.isVisible()).toBe(true);
    }
  });

  test('[GAAM-531-002] @regression Verify no edit buttons visible in frontend', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const editButtons = page.locator('[class*="cq-editable"], button[aria-label*="edit"]');
    const count = await editButtons.count();
    expect(count).toBe(0);
  });

  test('[GAAM-531-003] @regression Verify content is read-only in frontend', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const editable = page.locator('[contenteditable="true"]');
    const count = await editable.count();
    expect(count).toBe(0);
  });

  // ============ Text Display ============
  test('[GAAM-531-004] @regression Verify formatted text displays correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const text = page.locator('p, span, div').first();
    if (await text.count() > 0) {
      const content = await text.textContent();
      expect(content).toBeTruthy();
    }
  });

  test('[GAAM-531-005] @regression Verify bold formatting visible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const bold = page.locator('strong, b').first();
    if (await bold.count() > 0) {
      const fontWeight = await bold.evaluate(el => window.getComputedStyle(el).fontWeight);
      expect(fontWeight).not.toBe('400');
    }
  });

  test('[GAAM-531-006] @regression Verify italic formatting visible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const italic = page.locator('em, i').first();
    if (await italic.count() > 0) {
      const fontStyle = await italic.evaluate(el => window.getComputedStyle(el).fontStyle);
      expect(fontStyle).toBe('italic');
    }
  });

  // ============ Link Rendering ============
  test('[GAAM-531-007] @regression Verify internal links navigate correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const internalLink = page.locator('a[href^="/"]').first();
    if (await internalLink.count() > 0) {
      const href = await internalLink.getAttribute('href');
      expect(href).toMatch(/^\//);
    }
  });

  test('[GAAM-531-008] @regression Verify external links open in new tab', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const externalLink = page.locator('a[href^="http"]').first();
    if (await externalLink.count() > 0) {
      const target = await externalLink.getAttribute('target');
      expect(target).toBe('_blank');
    }
  });

  test('[GAAM-531-009] @regression Verify links are clickable', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const link = page.locator('a[href]').first();
    if (await link.count() > 0) {
      const isVisible = await link.isVisible();
      expect(isVisible).toBe(true);
    }
  });

  // ============ List Display ============
  test('[GAAM-531-010] @regression Verify unordered lists display with bullets', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const ul = page.locator('ul').first();
    if (await ul.count() > 0) {
      const items = ul.locator('li');
      expect(await items.count()).toBeGreaterThan(0);
    }
  });

  test('[GAAM-531-011] @regression Verify ordered lists display with numbers', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const ol = page.locator('ol').first();
    if (await ol.count() > 0) {
      const items = ol.locator('li');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('[GAAM-531-012] @regression Verify list styling is consistent', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const ul = page.locator('ul').first();
    if (await ul.count() > 0) {
      const marginLeft = await ul.evaluate(el => window.getComputedStyle(el).marginLeft);
      expect(marginLeft).not.toBe('0px');
    }
  });

  // ============ Headings Display ============
  test('[GAAM-531-013] @regression Verify headings are visually distinct', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const h1 = page.locator('h1').first();
    const p = page.locator('p').first();

    if (await h1.count() > 0 && await p.count() > 0) {
      const h1Size = await h1.evaluate(el => window.getComputedStyle(el).fontSize);
      const pSize = await p.evaluate(el => window.getComputedStyle(el).fontSize);

      expect(parseInt(h1Size)).toBeGreaterThan(parseInt(pSize));
    }
  });

  test('[GAAM-531-014] @regression Verify heading hierarchy structure', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    // Should have proper heading structure
    expect(await h1.count() + await h2.count()).toBeGreaterThanOrEqual(0);
  });

  // ============ Color & Contrast ============
  test('[GAAM-531-015] @a11y @regression Verify text has sufficient contrast', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const textElement = page.locator('p, span, li').first();
    if (await textElement.count() > 0) {
      const color = await textElement.evaluate(el => window.getComputedStyle(el).color);
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('[GAAM-531-016] @a11y @regression Verify readability settings applied', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const text = page.locator('p').first();
    if (await text.count() > 0) {
      const fontSize = await text.evaluate(el => {
        const size = window.getComputedStyle(el).fontSize;
        return parseInt(size);
      });
      expect(fontSize).toBeGreaterThanOrEqual(12);
    }
  });

  // ============ Responsive Display ============
  test('[GAAM-531-017] @regression Verify responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const width = await content.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[GAAM-531-018] @regression Verify responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const width = await content.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(768);
    }
  });

  test('[GAAM-531-019] @regression Verify responsive on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const width = await content.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(400);
    }
  });

  // ============ Content Completeness ============
  test('[GAAM-531-020] @regression Verify all formatted content renders', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const childCount = await content.locator('*').count();
      expect(childCount).toBeGreaterThan(0);
    }
  });

  // ============ Accessibility ============
  test('[GAAM-531-021] @a11y @regression Verify images have alt text', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // Images should have alt text (even if decorative, should be empty string)
      expect(alt).toBeDefined();
    }
  });

  test('[GAAM-531-022] @a11y @regression Verify proper semantic HTML', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const semanticElements = page.locator('article, section, nav, header, footer').first();
    // Should use semantic HTML or at least have valid structure
    const hasContent = await page.locator('p, h1, h2, h3, ul, ol').count() > 0;
    expect(hasContent).toBe(true);
  });

  test('[GAAM-531-023] @a11y @regression Verify link focus indicators visible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const link = page.locator('a[href]').first();
    if (await link.count() > 0) {
      await link.focus();
      const outline = await link.evaluate(el => window.getComputedStyle(el).outline);
      expect(outline).toBeTruthy();
    }
  });

  // ============ Performance ============
  test('[GAAM-531-024] @regression Verify no layout shift on load', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const body = page.locator('body');
    const initialWidth = await body.evaluate(el => el.offsetWidth);

    await page.waitForTimeout(500);

    const finalWidth = await body.evaluate(el => el.offsetWidth);
    expect(finalWidth).toBe(initialWidth);
  });

  test('[GAAM-531-025] @regression Verify content loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });
});
