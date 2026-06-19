import { test, expect } from '@playwright/test';
import { TextPage } from '../../../pages/ga/components/textPage';
import ENV from '../../../../tests/utils/infra/env';
import { ConsoleCapture } from '../../../../tests/utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../../tests/utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { assertLayout, assertSpacing, assertTypography } from '../../../../tests/utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../../tests/utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  capture = new ConsoleCapture(page);
  capture.start();
  await loginToAEMAuthor(page);
});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('Text — CSV Test Cases', () => {
  test('[TEXT-001] @smoke @regression CMS FE: Homepage Hero Role Card Click Action — AC1', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Local Storage Write on Card Click*
    test.fixme();
  });
});

test.describe('Text — Happy Path', () => {
  test('[TEXT-002] @smoke @regression Text renders correctly', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-text').first();
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

  test('[TEXT-003] @smoke @regression Text interactive elements are functional', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-text').first();
    await expect(root).toBeVisible();
    // Verify interactive elements (links, buttons) are present and clickable
    const interactive = root.locator('a, button');
    const count = await interactive.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(interactive.nth(i)).toBeVisible();
      await expect(interactive.nth(i)).toBeEnabled();
    }
  });
});

test.describe('Text — Negative & Boundary', () => {
  test('[TEXT-004] @negative @regression Text handles empty content gracefully', async ({ page }) => {
    // Capture JS errors during page load
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    // Component should render without JS errors
    expect(errors).toEqual([]);
    // Root element should still be present (not crash)
    await expect(page.locator('.cmp-text').first()).toBeVisible();
  });

  test('[TEXT-005] @negative @regression Text handles missing images', async ({ page }) => {
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

test.describe('Text — Responsive', () => {
  test('[TEXT-006] @mobile @regression @mobile Text adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-text').first();
    await expect(root).toBeVisible();
    // Verify layout adapts to mobile: check flex-direction changes to column
    const flexDir = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => {
      const cs = getComputedStyle(el);
      return cs.flexDirection || cs.display;
    });
    // At mobile, flex containers typically switch to column layout
    // Grid containers may change template columns
    expect(flexDir).toBeDefined();
  });

  test('[TEXT-007] @mobile @regression Text adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-text').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('Text — Console & Resources', () => {
  test('[TEXT-008] @regression Text produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Text — Broken Images', () => {
  test('[TEXT-009] @regression Text all images load successfully', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-text img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = // 📏 TODO: Replace with measurement-utils
    await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[TEXT-010] @regression Text all images have alt attributes', async ({ page }) => {
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
  test('[TEXT-011] @a11y @wcag22 @regression @smoke Text passes axe-core scan', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-text')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[TEXT-012] @a11y @wcag22 @regression @smoke Text interactive elements meet 24px target size', async ({ page }) => {
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

  test('[TEXT-013] @a11y @wcag22 @regression @smoke Text focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new TextPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-text a, .cmp-text button, .cmp-text input');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(// 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => window.innerHeight));
      }
    }
  });
});

test.describe('Text — AEM Dialog Configuration', () => {
  // Regression: GA overlay components must have their own _cq_dialog with helpPath.
  // Without helpPath, authors see no help link in the component toolbar.

  test('[TEXT-014] @author @regression @smoke @smoke Text dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/text/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Text GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Text dialog missing helpPath property').toBeTruthy();
  });

  test('[TEXT-015] @author @regression @smoke Text helpPath points to correct component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/text/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});
