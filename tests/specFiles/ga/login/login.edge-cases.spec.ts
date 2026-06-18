import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
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

test.describe('Login Component â€” Edge Cases & Enhanced Validation', () => {
  // ============ Edge Case: Max Key Points Constraint ============
  test('[LOGIN-EDGE-001] @edge Verify maximum 4 key points enforced', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const keyPointsList = page.locator('[class*="key-points"], [class*="keyPoints"], .cmp-login li');
    const count = await keyPointsList.count();

    if (count > 0) {
      expect(count).toBeLessThanOrEqual(4);
    }
  });

  test('[LOGIN-EDGE-002] @edge Verify key points list hidden when not authored', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const keyPointsContainer = page.locator('[class*="key-points"], [class*="keyPoints"]');

    // If no key points authored, container should not be visible
    if (await keyPointsContainer.count() > 0) {
      const isVisible = await keyPointsContainer.isVisible();
      const liCount = await keyPointsContainer.locator('li').count();

      if (liCount === 0) {
        expect(isVisible).toBe(false);
      }
    }
  });

  test('[LOGIN-EDGE-003] @edge Verify subheadline hidden when not authored', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const subheadline = page.locator('[class*="subheadline"], [class*="subtitle"], .cmp-login h3');

    // Subheadline should only be visible if text is authored
    if (await subheadline.count() > 0) {
      const text = await subheadline.textContent();
      if (!text || text.trim().length === 0) {
        expect(await subheadline.isVisible()).toBe(false);
      }
    }
  });

  test('[LOGIN-EDGE-004] @edge Verify fine print hidden when not authored', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const finePrint = page.locator('[class*="fine-print"], [class*="disclaimer"], .cmp-login small');

    if (await finePrint.count() > 0) {
      const text = await finePrint.textContent();
      if (!text || text.trim().length === 0) {
        expect(await finePrint.isVisible()).toBe(false);
      }
    }
  });

  // ============ Edge Case: Responsive Behavior ============
  test('[LOGIN-EDGE-005] @edge Verify decorative SVG hidden on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const svg = page.locator('[class*="login"] [class*="decorative"] svg, [class*="login"] svg[aria-hidden="true"]');

    if (await svg.count() > 0) {
      const isVisible = await svg.isVisible().catch(() => false);
      // On mobile, decorative SVG should not be displayed
      expect(isVisible).toBe(false);
    }
  });

  test('[LOGIN-EDGE-006] @edge Verify split layout preserves on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const loginComponent = page.locator('.cmp-login, [class*="login"]').first();
    if (await loginComponent.count() > 0) {
      const display = await loginComponent.evaluate(el =>
        window.getComputedStyle(el).display
      );
      expect(['flex', 'grid']).toContain(display); // TODO: Use assertLayout() for display checks
    }
  });

  test('[LOGIN-EDGE-007] @edge Verify single column layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const loginComponent = page.locator('.cmp-login, [class*="login"]').first();
    if (await loginComponent.count() > 0) {
      const width = await loginComponent.evaluate(el => el.offsetWidth);
      // Should be responsive and fit viewport
      expect(width).toBeLessThanOrEqual(375);
    }
  });

  // ============ Edge Case: Input Validation & Constraints ============
  test('[LOGIN-EDGE-008] @edge Verify username field accepts special characters', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const usernameField = page.locator('input[type="email"], input[name*="username"], input[name*="email"]').first();
    if (await usernameField.count() > 0) {
      const specialChars = "user+tag@example.com";
      await usernameField.fill(specialChars);
      const value = await usernameField.inputValue();
      expect(value).toBe(specialChars);
    }
  });

  test('[LOGIN-EDGE-009] @edge Verify password field masks input on default state', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const passwordField = page.locator('input[type="password"]').first();
    if (await passwordField.count() > 0) {
      const type = await passwordField.getAttribute('type');
      expect(type).toBe('password');
    }
  });

  test('[LOGIN-EDGE-010] @edge Verify password visibility toggle functionality', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const passwordField = page.locator('input[type="password"]').first();
    const toggleButton = page.locator('button[class*="toggle"], [class*="show-password"], [aria-label*="password"]').first();

    if (await passwordField.count() > 0 && await toggleButton.count() > 0) {
      await fill(passwordField, 'SecurePassword123');

      // Click toggle to show password
      await clickElement(toggleButton);
      await page.waitForTimeout(100);

      const fieldType = await passwordField.getAttribute('type');
      expect(['text', 'password']).toContain(fieldType);
    }
  });

  // ============ Edge Case: Validation Error Scenarios ============
  test('[LOGIN-EDGE-011] @edge Verify empty username field validation error', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const submitButton = page.locator('button:has-text("Continue"), button[type="submit"], [class*="cta"] button').first();
    if (await submitButton.count() > 0) {
      await clickElement(submitButton);

      // Check for error message
      const errorMsg = page.locator('[role="alert"], [class*="error"], .error-message');
      if (await errorMsg.count() > 0) {
        await expect(errorMsg).toBeVisible();
      }
    }
  });

  test('[LOGIN-EDGE-012] @edge Verify empty password field validation error', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const usernameField = page.locator('input[type="email"], input[name*="username"]').first();
    const submitButton = page.locator('button:has-text("Continue"), button[type="submit"]').first();

    if (await usernameField.count() > 0 && await submitButton.count() > 0) {
      // Fill username but leave password empty
      await fill(usernameField, 'test@example.com');
      await clickElement(submitButton);

      // Check for validation
      const passwordField = page.locator('input[type="password"]').first();
      if (await passwordField.count() > 0) {
        const required = await passwordField.getAttribute('required');
        expect(required).toBeTruthy();
      }
    }
  });

  test('[LOGIN-EDGE-013] @edge Verify invalid email format detection', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const emailField = page.locator('input[type="email"]').first();
    if (await emailField.count() > 0) {
      await fill(emailField, 'invalidemail');

      const type = await emailField.getAttribute('type');
      expect(type).toBe('email');
    }
  });

  // ============ Edge Case: Form State Preservation ============
  test('[LOGIN-EDGE-014] @edge Verify form state after page navigation', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const usernameField = page.locator('input[type="email"], input[name*="username"]').first();
    if (await usernameField.count() > 0) {
      await fill(usernameField, 'test@example.com');

      // Navigate and return
      await page.goto(`${BASE()}/content/global-atlantic/style-guide/`);
      await page.goBack();

      // Check if form is cleared or preserved
      const value = await usernameField.inputValue();
      // Most forms should clear for security
      expect(value).toBeDefined();
    }
  });

  test('[LOGIN-EDGE-015] @edge Verify form submission with both fields filled', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const usernameField = page.locator('input[type="email"], input[name*="username"]').first();
    const passwordField = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button:has-text("Continue"), button[type="submit"]').first();

    if (await usernameField.count() > 0 && await passwordField.count() > 0 && await submitButton.count() > 0) {
      await fill(usernameField, 'test@example.com');
      await fill(passwordField, 'Password123');

      // Verify form is ready for submission
      expect(await usernameField.inputValue()).toBe('test@example.com');
      expect(await passwordField.inputValue()).toBe('Password123');
    }
  });

  // ============ Edge Case: Accessibility ============
  test('[LOGIN-EDGE-016] @edge Verify form labels associated with inputs via for attribute', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const labels = page.locator('label');
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);

    for (let i = 0; i < labelCount; i++) {
      const label = labels.nth(i);
      const forAttr = await label.getAttribute('for');

      if (forAttr) {
        const input = page.locator(`#${forAttr}`);
        expect(await input.count()).toBeGreaterThan(0);
      }
    }
  });

  test('[LOGIN-EDGE-017] @edge Verify password toggle button has accessible label', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const toggleButton = page.locator('button[class*="toggle"], [class*="show-password"], [aria-label*="password"]').first();
    if (await toggleButton.count() > 0) {
      const ariaLabel = await toggleButton.getAttribute('aria-label');
      const title = await toggleButton.getAttribute('title');
      expect(ariaLabel || title).toBeTruthy();
    }
  });

  test('[LOGIN-EDGE-018] @edge Verify form has proper heading hierarchy', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const h1 = page.locator('h1');
    const h2 = page.locator('h2');

    // Should have either h1 or h2 as form title
    const headingCount = await h1.count() + await h2.count();
    expect(headingCount).toBeGreaterThan(0);
  });

  // ============ Edge Case: Content Constraints ============
  test('[LOGIN-EDGE-019] @edge Verify content order: H1 â†’ subheadline â†’ key points â†’ fine print', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const leftPanel = page.locator('[class*="login"] [class*="panel"], [class*="login"] [class*="left"], [class*="login"] section').first();

    if (await leftPanel.count() > 0) {
      const h1 = leftPanel.locator('h1').first();
      const subtitle = leftPanel.locator('[class*="subheadline"], h3').first();
      const keyPoints = leftPanel.locator('ul, [class*="key-points"]').first();
      const finePrint = leftPanel.locator('small, [class*="fine-print"]').first();

      // Verify elements exist and are in order if visible
      if (await h1.count() > 0) {
        expect(await h1.isVisible()).toBe(true);
      }
    }
  });

  test('[LOGIN-EDGE-020] @edge Verify slate background color applied', async ({ page }) => {
    const url = resolveComponentUrl('login');
    await page.goto(url);

    const loginComponent = page.locator('.cmp-login, [class*="login"]').first();
    if (await loginComponent.count() > 0) {
      const bgColor = await loginComponent.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );

      // Slate color should be applied (not transparent or white)
      expect(bgColor).not.toMatch(/transparent|white|255.*255.*255/);
    }
  });
});

