import { test, expect } from '@playwright/test';
import { TextPage } from '../../../pages/ga/components/textPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.describe('Text — Happy Path', () => {
  test('[TEXT-040] @smoke @regression Text renders correctly', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.cmp-text').first()).toBeVisible();
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
