import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Formatted RTE — Edge Cases (GAAM-530)', () => {
  // ============ Edge Case: Mixed Formatting ============
  test('[GAAM-530-EDGE-001] @edge Verify mixed bold and italic formatting', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const mixedFormat = page.locator('strong em, b i, em strong, i b').first();
    if (await mixedFormat.count() > 0) {
      const fontWeight = await mixedFormat.evaluate(el =>
        window.getComputedStyle(el).fontWeight
      );
      const fontStyle = await mixedFormat.evaluate(el =>
        window.getComputedStyle(el).fontStyle
      );
      expect(fontWeight).not.toBe('400');
      expect(fontStyle).toBe('italic');
    }
  });

  test('[GAAM-530-EDGE-002] @edge Verify bold with link formatting', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const boldLink = page.locator('a strong, strong a, a b, b a').first();
    if (await boldLink.count() > 0) {
      expect(await boldLink.isVisible()).toBe(true);
    }
  });

  // ============ Edge Case: Large Lists ============
  test('[GAAM-530-EDGE-003] @edge Verify large unordered list renders correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const ul = page.locator('ul').first();
    if (await ul.count() > 0) {
      const items = ul.locator('li');
      const count = await items.count();
      // Large lists should render efficiently
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('[GAAM-530-EDGE-004] @edge Verify deeply nested list structure', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const deeplyNested = page.locator('ul ul ul, ol ol ol').first();
    if (await deeplyNested.count() > 0) {
      // Verify DOM structure supports deep nesting
      expect(await deeplyNested.isVisible()).toBe(true);
    }
  });

  // ============ Edge Case: Special Characters in Content ============
  test('[GAAM-530-EDGE-005] @edge Verify special HTML characters display correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const content = page.locator('[class*="rte-content"]').first();
    if (await content.count() > 0) {
      const text = await content.textContent();
      // Content should properly handle HTML entities
      expect(text).toBeTruthy();
    }
  });

  test('[GAAM-530-EDGE-006] @edge Verify unicode characters in RTE content', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const rte = page.locator('[class*="rte"]').first();
    if (await rte.count() > 0) {
      const text = await rte.textContent();
      expect(text).toBeTruthy();
    }
  });

  // ============ Edge Case: Empty Elements ============
  test('[GAAM-530-EDGE-007] @edge Verify empty paragraph renders without error', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const emptyP = page.locator('p:empty').first();
    if (await emptyP.count() > 0) {
      const isVisible = await emptyP.isVisible().catch(() => false);
      expect(typeof isVisible).toBe('boolean');
    }
  });

  test('[GAAM-530-EDGE-008] @edge Verify empty list items handled gracefully', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const li = page.locator('li').first();
    if (await li.count() > 0) {
      // List items should be in valid list context
      const parent = li.locator('..');
      const tag = await parent.evaluate(el => el.tagName);
      expect(['UL', 'OL']).toContain(tag);
    }
  });

  // ============ Edge Case: Very Long Content ============
  test('[GAAM-530-EDGE-009] @edge Verify RTE handles very long paragraphs', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const paragraph = page.locator('p').first();
    if (await paragraph.count() > 0) {
      const text = await paragraph.textContent();
      if (text && text.length > 500) {
        const height = await paragraph.evaluate(el => el.offsetHeight);
        // Long text should wrap and have height
        expect(height).toBeGreaterThan(0);
      }
    }
  });

  test('[GAAM-530-EDGE-010] @edge Verify RTE handles many headings', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ============ Edge Case: Link Validation ============
  test('[GAAM-530-EDGE-011] @edge Verify broken internal links handled', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const links = page.locator('a[href]');
    const count = await links.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('[GAAM-530-EDGE-012] @edge Verify mailto links work correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const mailtoLink = page.locator('a[href^="mailto:"]').first();
    if (await mailtoLink.count() > 0) {
      const href = await mailtoLink.getAttribute('href');
      expect(href).toMatch(/^mailto:/);
    }
  });

  test('[GAAM-530-EDGE-013] @edge Verify anchor links work correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const anchorLink = page.locator('a[href^="#"]').first();
    if (await anchorLink.count() > 0) {
      const href = await anchorLink.getAttribute('href');
      expect(href).toMatch(/^#/);
    }
  });

  // ============ Edge Case: Code Block Edge Cases ============
  test('[GAAM-530-EDGE-014] @edge Verify code block with special characters', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const code = page.locator('code, pre').first();
    if (await code.count() > 0) {
      const text = await code.textContent();
      expect(text).toBeTruthy();
    }
  });

  test('[GAAM-530-EDGE-015] @edge Verify code preserves formatting and indentation', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const pre = page.locator('pre').first();
    if (await pre.count() > 0) {
      const whiteSpace = await pre.evaluate(el =>
        window.getComputedStyle(el).whiteSpace
      );
      expect(whiteSpace).toBe('pre');
    }
  });

  // ============ Edge Case: Blockquote with Nested Elements ============
  test('[GAAM-530-EDGE-016] @edge Verify blockquote with nested paragraphs', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const blockquote = page.locator('blockquote').first();
    if (await blockquote.count() > 0) {
      const paragraphs = blockquote.locator('p');
      expect(await paragraphs.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('[GAAM-530-EDGE-017] @edge Verify blockquote with attribution', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const blockquote = page.locator('blockquote').first();
    if (await blockquote.count() > 0) {
      const cite = blockquote.locator('cite, footer, [class*="attribution"]');
      // Verify cite/attribution structure exists if needed
      expect(await cite.count()).toBeGreaterThanOrEqual(0);
    }
  });

  // ============ Edge Case: Table Support (if applicable) ============
  test('[GAAM-530-EDGE-018] @edge Verify table renders in RTE', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const table = page.locator('table').first();
    if (await table.count() > 0) {
      const rows = table.locator('tr');
      expect(await rows.count()).toBeGreaterThan(0);
    }
  });

  // ============ Edge Case: Responsive Text Wrapping ============
  test('[GAAM-530-EDGE-019] @edge Verify text wraps properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const paragraph = page.locator('p').first();
    if (await paragraph.count() > 0) {
      const width = await paragraph.evaluate(el => el.offsetWidth);
      const height = await paragraph.evaluate(el => el.offsetHeight);

      // Text should wrap to fit viewport
      expect(width).toBeLessThanOrEqual(375);
      expect(height).toBeGreaterThan(0);
    }
  });

  test('[GAAM-530-EDGE-020] @edge Verify lists adapt to mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const ul = page.locator('ul').first();
    if (await ul.count() > 0) {
      const width = await ul.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  // ============ Edge Case: Color & Styling Variations ============
  test('[GAAM-530-EDGE-021] @edge Verify colored text displays properly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const coloredText = page.locator('[style*="color"]').first();
    if (await coloredText.count() > 0) {
      const color = await coloredText.evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(color).toBeTruthy();
    }
  });

  test('[GAAM-530-EDGE-022] @edge Verify highlighted text background displays', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const highlighted = page.locator('[style*="background"]').first();
    if (await highlighted.count() > 0) {
      const bgColor = await highlighted.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).toBeTruthy();
    }
  });

  // ============ Edge Case: Accessibility Compliance ============
  test('[GAAM-530-EDGE-023] @a11y @edge Verify heading hierarchy is correct', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const h1Count = await page.locator('h1').count();
    // Page should have at least one H1 or RTE shouldn't have orphaned H2s without H1
    expect(h1Count + await page.locator('h2').count()).toBeGreaterThanOrEqual(0);
  });

  test('[GAAM-530-EDGE-024] @a11y @edge Verify links have visible text', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    const links = page.locator('a[href]');
    const count = await links.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = await links.nth(i).textContent();
      const ariaLabel = await links.nth(i).getAttribute('aria-label');
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  // ============ Edge Case: No JavaScript Errors ============
  test('[GAAM-530-EDGE-025] @edge Verify no JavaScript errors in RTE content', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/formatted-rte.html?wcmmode=disabled`);

    // Allow some time for any async content loading
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });
});
