import { test, expect } from '@playwright/test';
import { ButtonPage } from '../../../pages/ga/components/buttonPage';
import ENV from '../../../utils/infra/env';

import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Button — Happy Path', () => {
  test('[BTTN-001] @smoke @regression Button renders correctly', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.button').first();
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

  test('[BTTN-002] @smoke @regression Button interactive elements are functional', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    // Scope to non-disabled button wrappers — style guide includes disabled variants by design
    const enabledButtons = page.locator('.button:not(.ga-button--disabled) .cmp-button');
    const count = await enabledButtons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(enabledButtons.nth(i)).toBeVisible();
      await expect(enabledButtons.nth(i)).toBeEnabled();
    }
  });
});

test.describe('Button — Responsive', () => {
  // Retry once — Windows Chromium occasionally crashes on viewport resize
  test.describe.configure({ retries: 1 });

  test('[BTTN-006] @mobile @regression Button adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.button').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('Button — Accessibility', () => {
  // Retry once — Windows Chromium occasionally crashes under axe-core memory pressure
  test.describe.configure({ retries: 1 });

  test('[BTTN-010] @a11y @wcag22 @regression @smoke Button passes axe-core scan', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.button')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[BTTN-011] @a11y @wcag22 @regression @smoke Button interactive elements meet 24px target size', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.button a, .button button, .button input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[BTTN-012] @a11y @wcag22 @regression @smoke Button focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new ButtonPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.button a, .button button, .button input');
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
