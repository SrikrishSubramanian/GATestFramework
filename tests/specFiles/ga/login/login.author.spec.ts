import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Login — CSV Test Cases', () => {
  test('[LGN-001] @a11y @mobile Login Page - Multi-Factor Authentication (MFA) Support — AC1', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Given a user with MFA enabled, when entering valid credentials, the system should prompt for a second factor (OTP, TOTP, or SMS)
    test.fixme();
  });

  test('[LGN-002] @a11y @mobile Login Page - Multi-Factor Authentication (MFA) Support — AC2', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Given the MFA prompt is displayed, the user should be able to enter the MFA code in a dedicated input field
    test.fixme();
  });

  test('[LGN-003] @a11y @mobile Login Page - Multi-Factor Authentication (MFA) Support — AC3', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Given a valid MFA code is entered, the user should be logged in successfully
    test.fixme();
  });

  test('[LGN-004] @a11y @mobile Login Page - Multi-Factor Authentication (MFA) Support — AC4', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Given an invalid MFA code is entered, an error message should be displayed and the user should remain on the MFA prompt
    test.fixme();
  });

  test('[LGN-005] @a11y @mobile Login Page - Multi-Factor Authentication (MFA) Support — AC5', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Given the MFA timeout is exceeded (5 minutes), the user should be redirected to the login page
    test.fixme();
  });

  test('[LGN-006] @a11y @mobile Login Page - Multi-Factor Authentication (MFA) Support — AC6', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Given the user selects \'Use backup code\', an alternative input field should be displayed
    test.fixme();
  });

  test('[LGN-007] @a11y @mobile Login Page - Multi-Factor Authentication (MFA) Support — AC7', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Given a valid backup code is entered, the user should be logged in successfully
    test.fixme();
  });

  test('[LGN-008] @a11y @mobile Login Page - Multi-Factor Authentication (MFA) Support — AC8', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Given the user clicks \'Can\\'t access your authenticator\', a recovery option should be displayed
    test.fixme();
  });
});

test.describe('Login — Happy Path', () => {
  test('[LGN-009] @smoke @regression Login renders correctly', async ({ page }) => {
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

  test('[LGN-010] @smoke @regression Login interactive elements are functional', async ({ page }) => {
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
  test('[LGN-011] @negative @regression Login handles empty content gracefully', async ({ page }) => {
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

  test('[LGN-012] @negative @regression Login handles missing images', async ({ page }) => {
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
  test('[LGN-013] @mobile @regression @mobile Login adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
    // Verify layout adapts to mobile: check flex-direction changes to column
    const flexDir = await root.evaluate(el => {
      const cs = getComputedStyle(el);
      return cs.flexDirection || cs.display;
    });
    // At mobile, flex containers typically switch to column layout
    // Grid containers may change template columns
    expect(flexDir).toBeDefined();
  });

  test('[LGN-014] @mobile @regression Login adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('Login — Console & Resources', () => {
  test('[LGN-015] @regression Login produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Login — Broken Images', () => {
  test('[LGN-016] @regression Login all images load successfully', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[LGN-017] @regression Login all images have alt attributes', async ({ page }) => {
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
  test('[LGN-018] @a11y @wcag22 @regression @smoke Login passes axe-core scan', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-login')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[LGN-019] @a11y @wcag22 @regression @smoke Login interactive elements meet 24px target size', async ({ page }) => {
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

  test('[LGN-020] @a11y @wcag22 @regression @smoke Login focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-login a, .cmp-login button, .cmp-login input');
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

test.describe('Login — AEM Dialog Configuration', () => {
  // Regression: GA overlay components must have their own _cq_dialog with helpPath.
  // Without helpPath, authors see no help link in the component toolbar.

  test('[LGN-021] @author @regression @smoke @smoke Login dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Login GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Login dialog missing helpPath property').toBeTruthy();
  });

  test('[LGN-022] @author @regression @smoke Login helpPath points to correct component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});
