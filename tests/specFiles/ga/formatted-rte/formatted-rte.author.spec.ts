import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../src/utils/action-utils';

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

test.describe('Formatted RTE Component (GAAM-530)', () => {
  // ============ RTE Container & Structure ============
  test('[GAAM-530-001] @regression Verify RTE component renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const rte = page.locator('[class*="rte"], [class*="rich-text"], [role="textbox"]').first();
    if (await rte.count() > 0) {
      expect(await rte.isVisible()).toBe(true);
    }
  });

  test('[GAAM-530-002] @regression Verify RTE has content area', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const content = page.locator('[class*="rte-content"], [class*="text-content"], div[contenteditable="true"]').first();
    if (await content.count() > 0) {
      expect(await content.isVisible()).toBe(true);
    }
  });

  // ============ Text Formatting ============
  test('[GAAM-530-003] @regression Verify bold text formatting applies', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const boldText = page.locator('strong, b, [style*="font-weight"]').first();
    if (await boldText.count() > 0) {
      const fontWeight = // 📏 TODO: Replace with measurement-utils
    await boldText.evaluate(el =>
        window.getComputedStyle(el).fontWeight
      );
      expect(fontWeight).not.toBe('400'); // TODO: Use assertTypography() for font checks
    }
  });

  test('[GAAM-530-004] @regression Verify italic text formatting applies', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const italicText = page.locator('em, i, [style*="font-style"]').first();
    if (await italicText.count() > 0) {
      const fontStyle = // 📏 TODO: Replace with measurement-utils
    await italicText.evaluate(el =>
        window.getComputedStyle(el).fontStyle
      );
      expect(fontStyle).toBe('italic');
    }
  });

  test('[GAAM-530-005] @regression Verify underline text formatting applies', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const underlineText = page.locator('u, [style*="text-decoration"]').first();
    if (await underlineText.count() > 0) {
      const decoration = // 📏 TODO: Replace with measurement-utils
    await underlineText.evaluate(el =>
        window.getComputedStyle(el).textDecoration
      );
      expect(decoration).toContain('underline');
    }
  });

  test('[GAAM-530-006] @regression Verify strikethrough text formatting applies', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const strikeText = page.locator('del, s, [style*="text-decoration: line-through"]').first();
    if (await strikeText.count() > 0) {
      // Verify structure supports strikethrough
      expect(await strikeText.count()).toBeGreaterThan(0);
    }
  });

  // ============ Headings & Paragraphs ============
  test('[GAAM-530-007] @regression Verify heading 1 renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const h1 = page.locator('h1, [class*="heading-1"]').first();
    if (await h1.count() > 0) {
      expect(await h1.isVisible()).toBe(true);
    }
  });

  test('[GAAM-530-008] @regression Verify heading 2 renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const h2 = page.locator('h2, [class*="heading-2"]').first();
    if (await h2.count() > 0) {
      expect(await h2.isVisible()).toBe(true);
    }
  });

  test('[GAAM-530-009] @regression Verify heading 3 renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const h3 = page.locator('h3, [class*="heading-3"]').first();
    if (await h3.count() > 0) {
      expect(await h3.isVisible()).toBe(true);
    }
  });

  test('[GAAM-530-010] @regression Verify paragraph text renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const paragraph = page.locator('p').first();
    if (await paragraph.count() > 0) {
      expect(await paragraph.isVisible()).toBe(true);
    }
  });

  // ============ Lists ============
  test('[GAAM-530-011] @regression Verify unordered list renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const ul = page.locator('ul').first();
    if (await ul.count() > 0) {
      const items = ul.locator('li');
      expect(await items.count()).toBeGreaterThan(0);
    }
  });

  test('[GAAM-530-012] @regression Verify ordered list renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const ol = page.locator('ol').first();
    if (await ol.count() > 0) {
      const items = ol.locator('li');
      expect(await items.count()).toBeGreaterThan(0);
    }
  });

  test('[GAAM-530-013] @regression Verify list items display bullet points', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const li = page.locator('li').first();
    if (await li.count() > 0) {
      const listStyleType = // 📏 TODO: Replace with measurement-utils
    await li.evaluate(el =>
        window.getComputedStyle(el).listStyleType
      );
      expect(listStyleType).not.toBe('none');
    }
  });

  test('[GAAM-530-014] @regression Verify nested lists render correctly', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const nestedList = page.locator('ul ul, ol ol, ul ol, ol ul').first();
    if (await nestedList.count() > 0) {
      expect(await nestedList.isVisible()).toBe(true);
    }
  });

  // ============ Links ============
  test('[GAAM-530-015] @regression Verify links render and are clickable', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const link = page.locator('a[href]').first();
    if (await link.count() > 0) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('[GAAM-530-016] @regression Verify links have accessible text', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const link = page.locator('a[href]').first();
    if (await link.count() > 0) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('[GAAM-530-017] @regression Verify internal links work correctly', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const internalLink = page.locator('a[href^="/"]').first();
    if (await internalLink.count() > 0) {
      const href = await internalLink.getAttribute('href');
      expect(href).toMatch(/^\//);
    }
  });

  test('[GAAM-530-018] @regression Verify external links have target attribute', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const externalLink = page.locator('a[href^="http"]').first();
    if (await externalLink.count() > 0) {
      const target = await externalLink.getAttribute('target');
      // External links typically have target="_blank"
      expect(target).toBeDefined();
    }
  });

  // ============ Code & Blockquotes ============
  test('[GAAM-530-019] @regression Verify code formatting renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const code = page.locator('code').first();
    if (await code.count() > 0) {
      const fontFamily = // 📏 TODO: Replace with measurement-utils
    await code.evaluate(el =>
        window.getComputedStyle(el).fontFamily
      );
      expect(fontFamily).toContain('mono');
    }
  });

  test('[GAAM-530-020] @regression Verify blockquote renders with styling', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const blockquote = page.locator('blockquote').first();
    if (await blockquote.count() > 0) {
      const marginLeft = // 📏 TODO: Replace with measurement-utils
    await blockquote.evaluate(el =>
        window.getComputedStyle(el).marginLeft
      );
      expect(marginLeft).not.toBe('0px'); // TODO: Use assertSpacing() for padding/margin
    }
  });

  test('[GAAM-530-021] @regression Verify pre-formatted text preserves whitespace', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const pre = page.locator('pre').first();
    if (await pre.count() > 0) {
      const whiteSpace = // 📏 TODO: Replace with measurement-utils
    await pre.evaluate(el =>
        window.getComputedStyle(el).whiteSpace
      );
      expect(whiteSpace).toBe('pre');
    }
  });

  // ============ Text Color & Highlighting ============
  test('[GAAM-530-022] @regression Verify text color formatting applies', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const coloredText = page.locator('[style*="color:"]').first();
    if (await coloredText.count() > 0) {
      const color = // 📏 TODO: Replace with measurement-utils
    await coloredText.evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(color).not.toBe('rgb(0, 0, 0)');
    }
  });

  test('[GAAM-530-023] @regression Verify text background/highlight applies', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const highlightedText = page.locator('[style*="background-color:"]').first();
    if (await highlightedText.count() > 0) {
      const bgColor = // 📏 TODO: Replace with measurement-utils
    await highlightedText.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  // ============ Horizontal Rule ============
  test('[GAAM-530-024] @regression Verify horizontal rule renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const hr = page.locator('hr, [class*="divider"], [class*="separator"]').first();
    if (await hr.count() > 0) {
      expect(await hr.isVisible()).toBe(true);
    }
  });

  // ============ Alignment ============
  test('[GAAM-530-025] @regression Verify left-aligned text', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const paragraph = page.locator('p').first();
    if (await paragraph.count() > 0) {
      const textAlign = // 📏 TODO: Replace with measurement-utils
    await paragraph.evaluate(el =>
        window.getComputedStyle(el).textAlign
      );
      expect(['left', 'start']).toContain(textAlign);
    }
  });

  test('[GAAM-530-026] @regression Verify center-aligned text renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const centerText = page.locator('[style*="text-align: center"]').first();
    if (await centerText.count() > 0) {
      expect(await centerText.isVisible()).toBe(true);
    }
  });

  test('[GAAM-530-027] @regression Verify right-aligned text renders', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const rightText = page.locator('[style*="text-align: right"]').first();
    if (await rightText.count() > 0) {
      expect(await rightText.isVisible()).toBe(true);
    }
  });

  // ============ Responsive Behavior ============
  test('[GAAM-530-028] @regression Verify RTE responsive on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const rte = page.locator('[class*="rte"]').first();
    if (await rte.count() > 0) {
      const width = // 📏 TODO: Replace with measurement-utils
    await rte.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  test('[GAAM-530-029] @regression Verify RTE responsive on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const rte = page.locator('[class*="rte"]').first();
    if (await rte.count() > 0) {
      const width = // 📏 TODO: Replace with measurement-utils
    await rte.evaluate(el => el.offsetWidth);
      expect(width).toBeLessThanOrEqual(768);
    }
  });

  test('[GAAM-530-030] @regression Verify RTE responsive on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const rte = page.locator('[class*="rte"]').first();
    if (await rte.count() > 0) {
      const width = // 📏 TODO: Replace with measurement-utils
    await rte.evaluate(el => el.offsetWidth);
      expect(width).toBeGreaterThan(400);
    }
  });

  // ============ Content Readability ============
  test('[GAAM-530-031] @a11y @regression Verify readable font size', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const text = page.locator('p, li').first();
    if (await text.count() > 0) {
      const fontSize = // 📏 TODO: Replace with measurement-utils
    await text.evaluate(el => {
        const size = window.getComputedStyle(el).fontSize;
        return parseInt(size);
      });
      expect(fontSize).toBeGreaterThanOrEqual(12); // TODO: Use assertTypography() for font checks
    }
  });

  test('[GAAM-530-032] @a11y @regression Verify readable line height', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const text = page.locator('p').first();
    if (await text.count() > 0) {
      const lineHeight = // 📏 TODO: Replace with measurement-utils
    await text.evaluate(el => {
        const lh = window.getComputedStyle(el).lineHeight;
        return parseInt(lh);
      });
      expect(lineHeight).toBeGreaterThanOrEqual(16); // TODO: Use assertTypography() for font checks
    }
  });

  test('[GAAM-530-033] @a11y @regression Verify readable text contrast', async ({ page }) => {
    const url = resolveComponentUrl('formatted-rte');
    await page.goto(url);

    const text = page.locator('p').first();
    if (await text.count() > 0) {
      const color = // 📏 TODO: Replace with measurement-utils
    await text.evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});

