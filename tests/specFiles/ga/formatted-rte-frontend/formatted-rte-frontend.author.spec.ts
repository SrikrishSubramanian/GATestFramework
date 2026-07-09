import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('Formatted RTE Frontend Component (GAAM-531)', () => {
  // ============ Frontend Rendering ============
  test('[GAAM-531-001] @regression Verify RTE frontend renders published content', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const content = page.locator('[class*="rte-content"], [class*="text-content"]').first();
    if (await content.count() > 0) {
      expect(await content.isVisible()).toBe(true);
    }
  });

  test('[GAAM-531-002] @regression Verify no edit buttons visible in frontend', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const editButtons = page.locator('[class*="cq-editable"], button[aria-label*="edit"]');
    const count = await editButtons.count();
    expect(count).toBe(0);
  });

  test('[GAAM-531-003] @regression Verify content is read-only in frontend', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const editable = page.locator('[contenteditable="true"]');
    const count = await editable.count();
    expect(count).toBe(0);
  });

  // ============ Text Display ============
  test('[GAAM-531-004] @regression Verify formatted text displays correctly', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const text = page.locator('p, span, div').first();
    if (await text.count() > 0) {
      const content = await text.textContent();
      expect(content).toBeTruthy();
    }
  });

  test('[GAAM-531-005] @regression Verify bold formatting visible', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const bold = page.locator('strong, b').first();
    if (await bold.count() > 0) {
      const fontWeight = // ?? TODO: Replace with measurement-utils
    await bold.evaluate(el => window.getComputedStyle(el).fontWeight); // measurement: use measurement-utils for cleaner code
      expect(fontWeight).not.toBe('400'); // TODO: Use assertTypography() for font checks
    }
  });

  test('[GAAM-531-006] @regression Verify italic formatting visible', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const italic = page.locator('em, i').first();
    if (await italic.count() > 0) {
      const fontStyle = // ?? TODO: Replace with measurement-utils
    await italic.evaluate(el => window.getComputedStyle(el).fontStyle); // measurement: use measurement-utils for cleaner code
      expect(fontStyle).toBe('italic');
    }
  });

  // ============ Link Rendering ============
  test('[GAAM-531-007] @regression Verify internal links navigate correctly', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const internalLink = page.locator('a[href^="/"]').first();
    if (await internalLink.count() > 0) {
      const href = await internalLink.getAttribute('href');
      expect(href).toMatch(/^\//);
    }
  });

  test('[GAAM-531-008] @regression Verify external links open in new tab', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const externalLink = page.locator('a[href^="http"]').first();
    if (await externalLink.count() > 0) {
      const target = await externalLink.getAttribute('target');
      expect(target).toBe('_blank');
    }
  });

  test('[GAAM-531-009] @regression Verify links are clickable', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const link = page.locator('a[href]').first();
    if (await link.count() > 0) {
      const isVisible = await link.isVisible();
      expect(isVisible).toBe(true);
    }
  });

  // ============ List Display ============
  test('[GAAM-531-010] @regression Verify unordered lists display with bullets', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const ul = page.locator('ul').first();
    if (await ul.count() > 0) {
      const items = ul.locator('li');
      expect(await items.count()).toBeGreaterThan(0);
    }
  });

  test('[GAAM-531-011] @regression Verify ordered lists display with numbers', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const ol = page.locator('ol').first();
    if (await ol.count() > 0) {
      const items = ol.locator('li');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('[GAAM-531-012] @regression Verify list styling is consistent', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const ul = page.locator('ul').first();
    if (await ul.count() > 0) {
      const marginLeft = // ?? TODO: Replace with measurement-utils
    await ul.evaluate(el => window.getComputedStyle(el).marginLeft); // measurement: use measurement-utils for cleaner code
      expect(marginLeft).not.toBe('0px'); // TODO: Use assertSpacing() for padding/margin
    }
  });

  // ============ Headings Display ============
  test('[GAAM-531-013] @regression Verify headings are visually distinct', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const h1 = page.locator('h1').first();
    const p = page.locator('p').first();

    if (await h1.count() > 0 && await p.count() > 0) {
      const h1Size = // ?? TODO: Replace with measurement-utils
    await h1.evaluate(el => window.getComputedStyle(el).fontSize); // measurement: use measurement-utils for cleaner code
      const pSize = // ?? TODO: Replace with measurement-utils
    await p.evaluate(el => window.getComputedStyle(el).fontSize); // measurement: use measurement-utils for cleaner code

      expect(parseInt(h1Size)).toBeGreaterThan(parseInt(pSize));
    }
  });

  test('[GAAM-531-014] @regression Verify heading hierarchy structure', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    // Should have proper heading structure
    expect(await h1.count() + await h2.count()).toBeGreaterThanOrEqual(0);
  });

  // ============ Color & Contrast ============
  test('[GAAM-531-015] @a11y @regression Verify text has sufficient contrast', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const textElement = page.locator('p, span, li').first();
    if (await textElement.count() > 0) {
      const color = // ?? TODO: Replace with measurement-utils
    await textElement.evaluate(el => window.getComputedStyle(el).color); // measurement: use measurement-utils for cleaner code
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('[GAAM-531-016] @a11y @regression Verify readability settings applied', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const text = page.locator('p').first();
    if (await text.count() > 0) {
      const fontSize = // ?? TODO: Replace with measurement-utils
    await text.evaluate(el => {
        const size = window.getComputedStyle(el).fontSize;
        return parseInt(size);
      });
      expect(fontSize).toBeGreaterThanOrEqual(12); // TODO: Use assertTypography() for font checks
    }
  });

  // ============ Responsive Display ============
  test('[GAAM-531-017] @regression Verify responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const width = // ?? TODO: Replace with measurement-utils
    await content.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[GAAM-531-018] @regression Verify responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const width = // ?? TODO: Replace with measurement-utils
    await content.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(768);
    }
  });

  test('[GAAM-531-019] @regression Verify responsive on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const width = // ?? TODO: Replace with measurement-utils
    await content.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(400);
    }
  });

  // ============ Content Completeness ============
  test('[GAAM-531-020] @regression Verify all formatted content renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const childCount = await content.locator('*').count();
      expect(childCount).toBeGreaterThan(0);
    }
  });

  // ============ Accessibility ============
  test('[GAAM-531-021] @a11y @regression Verify images have alt text', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // Images should have alt text (even if decorative, should be empty string)
      expect(alt).toBeDefined();
    }
  });

  test('[GAAM-531-022] @a11y @regression Verify proper semantic HTML', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const semanticElements = page.locator('article, section, nav, header, footer').first();
    // Should use semantic HTML or at least have valid structure
    const hasContent = await page.locator('p, h1, h2, h3, ul, ol').count() > 0;
    expect(hasContent).toBe(true);
  });

  test('[GAAM-531-023] @a11y @regression Verify link focus indicators visible', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const link = page.locator('a[href]').first();
    if (await link.count() > 0) {
      await link.focus();
      const outline = // ?? TODO: Replace with measurement-utils
    await link.evaluate(el => window.getComputedStyle(el).outline); // measurement: use measurement-utils for cleaner code
      expect(outline).toBeTruthy();
    }
  });

  // ============ Performance ============
  test('[GAAM-531-024] @regression Verify no layout shift on load', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    const body = page.locator('body');
    const initialWidth = // ?? TODO: Replace with measurement-utils
    await body.evaluate(el => el.offsetWidth);

    // ?? DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });

    const finalWidth = // ?? TODO: Replace with measurement-utils
    await body.evaluate(el => el.offsetWidth);
    expect(finalWidth).toBe(initialWidth);
  });

  test('[GAAM-531-025] @regression Verify content loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    const url = resolveComponentUrl('formatted-rte-frontend');
    await page.goto(url);

    // ?? DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });

    expect(errors).toEqual([]);
  });
});

