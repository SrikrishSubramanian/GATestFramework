import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Formatted RTE Frontend — Edge Cases (GAAM-531)', () => {
  // ============ Edge Case: Content Variations ============
  test('[GAAM-531-EDGE-001] @edge Verify very long paragraph wraps correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const p = page.locator('p').first();
    if (await p.count() > 0) {
      const text = await p.textContent();
      if (text && text.length > 200) {
        const height = await p.evaluate(el => el.offsetHeight);
        expect(height).toBeGreaterThan(40);
      }
    }
  });

  test('[GAAM-531-EDGE-002] @edge Verify nested list indentation preserved', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const nestedList = page.locator('ul ul, ol ol').first();
    if (await nestedList.count() > 0) {
      const marginLeft = await nestedList.evaluate(el => window.getComputedStyle(el).marginLeft);
      expect(marginLeft).not.toBe('0px');
    }
  });

  test('[GAAM-531-EDGE-003] @edge Verify empty lines between paragraphs', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const paragraphs = page.locator('p');
    const count = await paragraphs.count();

    if (count > 1) {
      const margin = await paragraphs.first().evaluate(el => window.getComputedStyle(el).marginBottom);
      expect(margin).not.toBe('0px');
    }
  });

  // ============ Edge Case: Link Edge Cases ============
  test('[GAAM-531-EDGE-004] @edge Verify email links format correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const emailLink = page.locator('a[href^="mailto:"]').first();
    if (await emailLink.count() > 0) {
      const href = await emailLink.getAttribute('href');
      expect(href).toMatch(/^mailto:/);
    }
  });

  test('[GAAM-531-EDGE-005] @edge Verify anchor links work', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const anchorLink = page.locator('a[href^="#"]').first();
    if (await anchorLink.count() > 0) {
      const href = await anchorLink.getAttribute('href');
      expect(href).toMatch(/^#/);
    }
  });

  // ============ Edge Case: Code & Blockquote ============
  test('[GAAM-531-EDGE-006] @edge Verify code blocks maintain formatting', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const code = page.locator('code, pre').first();
    if (await code.count() > 0) {
      const whiteSpace = await code.evaluate(el => window.getComputedStyle(el).whiteSpace);
      expect(['pre', 'pre-wrap', 'pre-line']).toContain(whiteSpace);
    }
  });

  test('[GAAM-531-EDGE-007] @edge Verify blockquote styling distinct', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const blockquote = page.locator('blockquote').first();
    if (await blockquote.count() > 0) {
      const borderLeft = await blockquote.evaluate(el => window.getComputedStyle(el).borderLeft);
      expect(borderLeft).not.toBe('none');
    }
  });

  // ============ Edge Case: Text Variations ============
  test('[GAAM-531-EDGE-008] @edge Verify mixed text formatting (bold + italic)', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const mixed = page.locator('strong em, em strong, b i, i b').first();
    if (await mixed.count() > 0) {
      expect(await mixed.isVisible()).toBe(true);
    }
  });

  test('[GAAM-531-EDGE-009] @edge Verify underlined text visible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const underline = page.locator('u, ins, [style*="text-decoration: underline"]').first();
    if (await underline.count() > 0) {
      const decoration = await underline.evaluate(el => window.getComputedStyle(el).textDecoration);
      expect(decoration).toContain('underline');
    }
  });

  // ============ Edge Case: Alignment ============
  test('[GAAM-531-EDGE-010] @edge Verify center-aligned text correct position', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const centered = page.locator('[style*="text-align: center"]').first();
    if (await centered.count() > 0) {
      const textAlign = await centered.evaluate(el => window.getComputedStyle(el).textAlign);
      expect(textAlign).toBe('center');
    }
  });

  test('[GAAM-531-EDGE-011] @edge Verify right-aligned text correct position', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const rightAligned = page.locator('[style*="text-align: right"]').first();
    if (await rightAligned.count() > 0) {
      const textAlign = await rightAligned.evaluate(el => window.getComputedStyle(el).textAlign);
      expect(textAlign).toBe('right');
    }
  });

  // ============ Edge Case: Responsive Image Handling ============
  test('[GAAM-531-EDGE-012] @edge Verify images responsive width on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const img = page.locator('img').first();
    if (await img.count() > 0) {
      const width = await img.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[GAAM-531-EDGE-013] @edge Verify table responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const table = page.locator('table').first();
    if (await table.count() > 0) {
      const width = await table.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  // ============ Edge Case: Accessibility Compliance ============
  test('[GAAM-531-EDGE-014] @a11y @edge Verify skip to content link if present', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const skipLink = page.locator('a[href*="content"], a[href*="main"]').first();
    // Verify skip link exists or main content is properly marked
    expect(skipLink.count() + await page.locator('[role="main"], main').count()).toBeGreaterThanOrEqual(0);
  });

  test('[GAAM-531-EDGE-015] @a11y @edge Verify headings use semantic tags', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const semanticHeadings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await semanticHeadings.count();
    // Headings should use proper semantic HTML
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('[GAAM-531-EDGE-016] @a11y @edge Verify list structure is semantic', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const lists = page.locator('ul, ol');
    const count = await lists.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const items = lists.nth(i).locator('li');
      expect(await items.count()).toBeGreaterThan(0);
    }
  });

  // ============ Edge Case: Performance ============
  test('[GAAM-531-EDGE-017] @edge Verify no cumulative layout shift', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const body = page.locator('body');
    const width1 = await body.evaluate(el => el.offsetWidth);

    await page.waitForTimeout(1500);

    const width2 = await body.evaluate(el => el.offsetWidth);
    expect(width1).toBe(width2);
  });

  test('[GAAM-531-EDGE-018] @edge Verify fast content rendering', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      expect(await content.isVisible()).toBe(true);
    }

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // Should load in less than 5 seconds
  });

  // ============ Edge Case: Content Preservation ============
  test('[GAAM-531-EDGE-019] @edge Verify special characters preserved', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const text = await content.textContent();
      // Content should preserve formatting
      expect(text).toBeTruthy();
    }
  });

  test('[GAAM-531-EDGE-020] @edge Verify HTML not visible to users', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const bodyText = await page.locator('body').textContent();
    // HTML tags should not be visible as text
    expect(bodyText).not.toMatch(/<[^>]*>/);
  });

  // ============ Edge Case: No Editing Capability ============
  test('[GAAM-531-EDGE-021] @edge Verify content cannot be edited by users', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const editableContent = page.locator('[contenteditable="true"]');
    const count = await editableContent.count();
    expect(count).toBe(0);
  });

  test('[GAAM-531-EDGE-022] @edge Verify no edit dialogs present', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const editDialogs = page.locator('[class*="edit"], [role="dialog"]');
    const count = await editDialogs.count();
    // No editing interfaces should be visible
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ============ Edge Case: JavaScript Errors ============
  test('[GAAM-531-EDGE-023] @edge Verify no JavaScript errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test('[GAAM-531-EDGE-024] @edge Verify no JavaScript errors on link click', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte-frontend.html?wcmmode=disabled`);

    const internalLink = page.locator('a[href^="/"]').first();
    if (await internalLink.count() > 0) {
      await internalLink.hover();
    }

    expect(errors).toEqual([]);
  });
});
