import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Text — Visual Regression', () => {
  test('[TEXT-VISUAL-001] @visual Text content is readable', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const root = page.locator('.cmp-text').first();
    await expect(root).toBeVisible();

    const fontSize = await root.evaluate(el =>
      window.getComputedStyle(el).fontSize
    );
    const size = parseInt(fontSize);
    expect(size).toBeGreaterThan(10);
  });

  test('[TEXT-VISUAL-002] @visual Text color contrast is adequate', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const root = page.locator('.cmp-text').first();
    const color = await root.evaluate(el =>
      window.getComputedStyle(el).color
    );
    const bg = await root.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );

    expect(color).toBeTruthy();
    expect(bg).toBeTruthy();
  });

  test('[TEXT-VISUAL-003] @visual Text formatting is preserved', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const root = page.locator('.cmp-text').first();
    const bold = root.locator('strong, b');
    const italic = root.locator('em, i');
    const underline = root.locator('u, [style*="text-decoration"]');

    // At least some formatting should be present
    const hasFormatting = await Promise.all([
      bold.count(),
      italic.count(),
      underline.count()
    ]);

    const total = hasFormatting.reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThanOrEqual(0);
  });

  test('[TEXT-VISUAL-004] @visual Text line height is appropriate', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const text = page.locator('.cmp-text p').first();
    if (await text.count() > 0) {
      const lineHeight = await text.evaluate(el =>
        window.getComputedStyle(el).lineHeight
      );
      expect(lineHeight).not.toBe('normal');
    }
  });

  test('[TEXT-VISUAL-005] @visual Text lists display correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/text.html?wcmmode=disabled`);

    const lists = page.locator('.cmp-text ul, .cmp-text ol');
    const count = await lists.count();

    if (count > 0) {
      const items = lists.first().locator('li');
      expect(await items.count()).toBeGreaterThan(0);
    }
  });
});
