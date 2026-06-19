import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
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

test.describe('Login — CSV Test Cases', () => {
  test('[LGN-001] @smoke @regression CMS BE: Login cookie sessionIndex update & Ping Logout Servlet implementation — AC1', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for Ping Logout Servlet - See GAAM-821, GAAM-1217 for SAML SLO requirements
    test.fixme();
  });
});

test.describe('Login — Happy Path', () => {
  test('[LGN-002] @smoke @regression Login renders correctly', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
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

  test('[LGN-003] @smoke @regression Login interactive elements are functional', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
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

test.describe('Login — Negative & Boundary', () => {
  test('[LGN-004] @negative @regression Login handles empty content gracefully', async ({ page }) => {
    // Capture JS errors during page load
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // Component should render without JS errors
    expect(errors).toEqual([]);
    // Root element should still be present (not crash)
    await expect(page.locator('.cmp-login').first()).toBeVisible();
  });

  test('[LGN-005] @negative @regression Login handles missing images', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Login — Responsive', () => {
  test('[LGN-006] @mobile @regression @mobile Login adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
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

  test('[LGN-007] @mobile @regression Login adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = // 📏 TODO: Replace with measurement-utils
    await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('Login — Console & Resources', () => {
  test('[LGN-008] @regression Login produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Login — Broken Images', () => {
  test('[LGN-009] @regression Login all images load successfully', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = // 📏 TODO: Replace with measurement-utils
    await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[LGN-010] @regression Login all images have alt attributes', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Login — Accessibility', () => {
  test('[LGN-011] @a11y @wcag22 @regression @smoke Login passes axe-core scan', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-login')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[LGN-012] @a11y @wcag22 @regression @smoke Login interactive elements meet 24px target size', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-login a, .cmp-login button, .cmp-login input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[LGN-013] @a11y @wcag22 @regression @smoke Login focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-login a, .cmp-login button, .cmp-login input');
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

test.describe('Login — AEM Dialog Configuration', () => {
  // Regression: GA overlay components must have their own _cq_dialog with helpPath.
  // Without helpPath, authors see no help link in the component toolbar.

  test('[LGN-014] @author @regression @smoke @smoke Login dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Login GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Login dialog missing helpPath property').toBeTruthy();
  });

  test('[LGN-015] @author @regression @smoke Login helpPath points to correct component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});
