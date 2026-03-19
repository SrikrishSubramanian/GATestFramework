import { test, expect } from '@playwright/test';
import { TextPage } from '../../../pages/ga/components/textPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const STYLE_GUIDE = () => `${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`;

const ROOT = '.cmp-text';

// Section backgrounds used on text style guide
const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Text — Happy Path', () => {
  test('[TEXT-040] @smoke @regression Text renders correctly', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    await expect(page.locator(ROOT).first()).toBeVisible();
  });
});

test.describe('Text — Heading Rendering', () => {
  test('[TEXT-052] @regression @smoke Style guide renders H1 through H6 heading levels', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    // The text style guide shows all heading sizes
    for (const level of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
      const heading = page.locator(`${ROOT} ${level}`);
      expect(await heading.count(), `No <${level}> found in text component`).toBeGreaterThanOrEqual(1);
    }
  });

  test('[TEXT-053] @regression Heading sizes decrease from H1 to H6', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    const sizes: number[] = [];
    for (const level of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
      const heading = page.locator(`${ROOT} ${level}`).first();
      if (await heading.count() === 0) continue;
      const size = await heading.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
      sizes.push(size);
    }
    // Each heading should be smaller or equal to the previous
    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i]).toBeLessThanOrEqual(sizes[i - 1]);
    }
  });

  test('[TEXT-054] @regression Headings use semantic HTML tags (not styled divs)', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    // Headings should be actual <h1>-<h6>, not <div> with heading classes
    const fakeHeadings = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.cmp-text div[class*="heading"], .cmp-text span[class*="heading"]')).length;
    });
    expect(fakeHeadings).toBe(0);
  });
});

test.describe('Text — Rich Text Formatting', () => {
  test('[TEXT-055] @regression Body text paragraphs render with <p> tags', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    const paragraphs = page.locator(`${ROOT} p`);
    expect(await paragraphs.count()).toBeGreaterThanOrEqual(1);
  });

  test('[TEXT-056] @regression Lists render as <ul> or <ol> with <li> children', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    const lists = page.locator(`${ROOT} ul, ${ROOT} ol`);
    if (await lists.count() === 0) { test.skip(); return; }
    const firstList = lists.first();
    const listItems = firstList.locator('li');
    expect(await listItems.count()).toBeGreaterThanOrEqual(1);
  });

  test('[TEXT-057] @regression Links in text have href attributes', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    const links = page.locator(`${ROOT} a`);
    const count = await links.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});

test.describe('Text — Color Variants', () => {
  test('[TEXT-058] @regression White text variant applies light color', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    const whiteText = page.locator('.cmp-text--text-white').first();
    if (await whiteText.count() === 0) { test.skip(); return; }
    const color = await whiteText.evaluate(el => getComputedStyle(el).color);
    expect(color).toContain('255');
  });

  test('[TEXT-059] @regression Text on granite background is readable (light-colored)', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    const graniteSection = page.locator(SECTION_GRANITE);
    if (await graniteSection.count() === 0) { test.skip(); return; }
    const textInGranite = graniteSection.locator(`${ROOT}`).first();
    if (await textInGranite.count() === 0) { test.skip(); return; }
    const color = await textInGranite.evaluate(el => getComputedStyle(el).color);
    // Text on dark background should be light (RGB values > 150)
    expect(color).toContain('255');
  });

  test('[TEXT-060] @regression Text on azul background is readable (light-colored)', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    const azulSection = page.locator(SECTION_AZUL);
    if (await azulSection.count() === 0) { test.skip(); return; }
    const textInAzul = azulSection.locator(`${ROOT}`).first();
    if (await textInAzul.count() === 0) { test.skip(); return; }
    const color = await textInAzul.evaluate(el => getComputedStyle(el).color);
    expect(color).toContain('255');
  });
});

test.describe('Text — BEM Structure', () => {
  test('[TEXT-061] @regression Component root uses .cmp-text class', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    expect(await page.locator(ROOT).count()).toBeGreaterThanOrEqual(4);
  });

  test('[TEXT-062] @regression No inline styles on text elements', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    const textRoots = page.locator(ROOT);
    const count = await textRoots.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const style = await textRoots.nth(i).getAttribute('style');
      expect(style).toBeFalsy();
    }
  });

  test('[TEXT-063] @regression No HTL comments in published text HTML', async ({ page }) => {
    await page.goto(STYLE_GUIDE());
    await page.waitForLoadState('networkidle');
    const html = await page.content();
    expect(html).not.toContain('<!--/*');
  });
});

test.describe('Text — Negative & Boundary', () => {
  test('[TEXT-043] @negative @regression Text handles missing images', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-text img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Text — Console & Resources', () => {
  test('[TEXT-046] @regression Text produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Text — Broken Images', () => {
  // TEXT-047 removed: duplicate of TEXT-043 (both check naturalWidth on .cmp-text img)

  test('[TEXT-048] @regression Text all images have alt attributes', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-text img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Text — Accessibility', () => {
  test('[TEXT-049] @a11y @wcag22 @regression @smoke Text passes axe-core scan', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-text')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[TEXT-050] @a11y @wcag22 @regression @smoke Text interactive elements meet 24px target size', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-text a, .cmp-text button, .cmp-text input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[TEXT-051] @a11y @wcag22 @regression @smoke Text focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-text a, .cmp-text button, .cmp-text input');
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
