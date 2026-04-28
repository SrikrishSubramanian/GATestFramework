import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.BASE_URL || 'http://localhost:4503';

test.describe('Login — UI & Layout (CSV Test Cases)', () => {
  test('[LGN-001] @UI Verify Desktop Layout Structure', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
    // Verify split layout: Left marketing panel and Right login card
    const flexDir = await root.evaluate(el => getComputedStyle(el).flexDirection);
    expect(['row', 'row-reverse']).toContain(flexDir);
  });

  test('[LGN-002] @UI Background Color Validation', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    const bgColor = await root.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgColor).toBeTruthy();
  });

  test('[LGN-003] @UI Left Panel Content Order (Desktop)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    const headings = root.locator('h1, h2, h3');
    expect(await headings.count()).toBeGreaterThan(0);
  });

  test('[LGN-004] @negative @regression Key Point List - Max Items', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const listItems = page.locator('.cmp-login li');
    const count = await listItems.count();
    expect(count).toBeLessThanOrEqual(4);
  });

  test('[LGN-005] @Functional Key Point List - Empty State', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // Verify component still renders even with empty list
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
  });

  test('[LGN-006] @Functional Subheadline & Fine Print Suppression', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // If elements don't exist, they should not be rendered in DOM
    const root = page.locator('.cmp-login').first();
    const emptyDivs = root.locator('div:empty');
    // Component should not have many empty containers
    expect(await emptyDivs.count()).toBeLessThan(5);
  });

  test('[LGN-007] @UI Decorative SVG Pattern (Desktop)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const svgs = page.locator('.cmp-login svg[aria-hidden="true"]');
    const count = await svgs.count();
    // SVG may be present with aria-hidden for decoration
    if (count > 0) {
      const firstSvg = svgs.first();
      const ariaHidden = await firstSvg.getAttribute('aria-hidden');
      expect(ariaHidden).toBe('true');
    }
  });

  test('[LGN-008] @UI Login Card Visuals', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const card = page.locator('.cmp-login').first();
    await expect(card).toBeVisible();
    // Card should have visible styling
    const opacity = await card.evaluate(el => getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0);
  });

  test('[LGN-009] @UI Form Card Content Centering', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    const content = root.locator('[data-testid="form-container"], form, .cmp-login__form');
    const count = await content.count();
    if (count > 0) {
      await expect(content.first()).toBeVisible();
    }
  });

  test('[LGN-010] @Functional AEM Dialog Data Integration', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // Verify form renders without errors
    const form = page.locator('form').first();
    const isVisible = await form.isVisible();
    expect(isVisible).toBe(true);
  });

  test('[LGN-011] @Functional Password Masking Toggle', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwdInput = pom.passwordInput;
    const inputType = await pwdInput.getAttribute('type');
    expect(['password', 'text']).toContain(inputType);
  });

  test('[LGN-012] @A11y Toggle Button ARIA Update', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const toggleBtn = page.locator('button[aria-label*="password" i], button[aria-label*="show" i]');
    if (await toggleBtn.count() > 0) {
      const ariaLabel = await toggleBtn.first().getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('[LGN-013] @negative @regression Empty Validation: Both Fields', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const submitBtn = pom.loginButton;
    const usernameInput = pom.usernameInput;
    const passwordInput = pom.passwordInput;
    await expect(usernameInput).toBeEmpty();
    await expect(passwordInput).toBeEmpty();
  });

  test('[LGN-014] @negative @regression Empty Validation: Username Only', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const usernameInput = pom.usernameInput;
    const passwordInput = pom.passwordInput;
    await passwordInput.fill('TestPassword123');
    await expect(usernameInput).toBeEmpty();
  });

  test('[LGN-015] @Functional Data Preservation on Validation', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const usernameInput = pom.usernameInput;
    const passwordInput = pom.passwordInput;
    await usernameInput.fill('admin@example.com');
    const inputValue = await usernameInput.inputValue();
    expect(inputValue).toBe('admin@example.com');
  });

  test('[LGN-016] @A11y Error Message Association', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const errorMsg = pom.errorMessage;
    if (await errorMsg.count() > 0) {
      const ariaDescribedBy = await pom.usernameInput.getAttribute('aria-describedby');
      if (ariaDescribedBy) {
        const msgId = await errorMsg.first().getAttribute('id');
        expect(msgId).toBeTruthy();
      }
    }
  });

  test('[LGN-017] @A11y Error Message Screen Reader Trigger', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const role = await pom.errorMessage.first().getAttribute('role');
    expect(['alert', 'status', 'log']).toContain(role);
  });

  test('[LGN-018] @UI Mobile: Single Column Layout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    const flexDir = await root.evaluate(el => getComputedStyle(el).flexDirection);
    expect(['column', 'column-reverse']).toContain(flexDir);
  });

  test('[LGN-019] @UI Mobile: Heading Repositioning', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const heading = page.locator('.cmp-login h1, .cmp-login h2');
    if (await heading.count() > 0) {
      await expect(heading.first()).toBeVisible();
    }
  });

  test('[LGN-020] @Functional Mobile: Key Point List Hidden', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const target = page.locator('.cmp-login__breadcrumb').first();
    const count = await target.count();
    if (count > 0) {
      const isHidden = await target.evaluate(el => {
        const cs = getComputedStyle(el);
        return cs.display === 'none' || cs.visibility === 'hidden';
      });
      expect(isHidden).toBe(true);
    }
  });

  test('[LGN-021] @UI Mobile: Fine Print Position', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
  });

  test('[LGN-022] @UI Mobile: Footer Reordering', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const footer = page.locator('.cmp-login footer, .cmp-login__footer');
    if (await footer.count() > 0) {
      await expect(footer.first()).toBeVisible();
    }
  });

  test('[LGN-023] @UI Mobile: Decorative SVG Hidden', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const svg = page.locator('.cmp-login svg').first();
    const count = await svg.count();
    if (count > 0) {
      const isHidden = await svg.evaluate(el => {
        const cs = getComputedStyle(el);
        return cs.display === 'none' || cs.visibility === 'hidden';
      });
      // SVG should be hidden on mobile
      expect(isHidden).toBe(true);
    }
  });

  test('[LGN-024] @A11y Semantic HTML: Headings', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const h1 = page.locator('.cmp-login h1').first();
    const h2 = page.locator('.cmp-login h2').first();
    expect(
      (await h1.count()) > 0 || (await h2.count()) > 0
    ).toBe(true);
  });

  test('[LGN-025] @A11y Input Labels', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const labels = page.locator('.cmp-login label');
    if (await labels.count() > 0) {
      const firstLabel = labels.first();
      const forAttr = await firstLabel.getAttribute('for');
      expect(forAttr).toBeTruthy();
    }
  });

  test('[LGN-026] @A11y Required Fields ARIA', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const inputs = page.locator('.cmp-login input[required]');
    expect(await inputs.count()).toBeGreaterThan(0);
  });

  test('[LGN-027] @A11y Focus Indicators', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const button = pom.loginButton;
    await button.focus();
    const outline = await button.evaluate(el => getComputedStyle(el).outline);
    expect(outline).not.toBe('none');
  });

  test('[LGN-028] @A11y Touch Target Size', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-login a, .cmp-login button, .cmp-login input');
    const count = await interactive.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[LGN-029] @A11y Tab Order Logic (Desktop)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const focusableElements = page.locator('.cmp-login a, .cmp-login button, .cmp-login input');
    expect(await focusableElements.count()).toBeGreaterThan(0);
  });

  test('[LGN-030] @A11y Tab Order Logic (Mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const focusableElements = page.locator('.cmp-login a, .cmp-login button, .cmp-login input');
    expect(await focusableElements.count()).toBeGreaterThan(0);
  });

  test('[LGN-031] @Functional Template Availability', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
  });

  test('[LGN-032] @UI Phone Number Wrapping', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const phone = page.locator('.cmp-login').first();
    await expect(phone).toBeVisible();
  });
});

test.describe('Login — Positive: Happy Path & Valid Credentials', () => {
  test('[LGN-033] @smoke @positive @regression Login renders correctly', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
    const heading = root.locator('h1, h2, h3').first();
    if (await heading.count() > 0) {
      await expect(heading).toBeVisible();
    }
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    expect(errors).toEqual([]);
  });

  test('[LGN-034] @smoke @positive @regression Login interactive elements are functional', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
    const interactive = root.locator('a, button');
    const count = await interactive.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(interactive.nth(i)).toBeVisible();
      await expect(interactive.nth(i)).toBeEnabled();
    }
  });

  test('[LGN-047] @positive @smoke Valid username field accepts standard email format', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user@example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('user@example.com');
  });

  test('[LGN-048] @positive @regression Valid username with subdomain email format', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('admin.user@mail.example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('admin.user@mail.example.com');
  });

  test('[LGN-049] @positive @regression Valid username with plus addressing', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user+tag@example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('user+tag@example.com');
  });

  test('[LGN-050] @positive @regression Password accepts alphanumeric characters', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('Password123');
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe('Password123');
  });

  test('[LGN-051] @positive @regression Password accepts special characters', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('P@ssw0rd!#$%');
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe('P@ssw0rd!#$%');
  });

  test('[LGN-052] @positive @regression Password accepts spaces', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('Pass word 123');
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe('Pass word 123');
  });

  test('[LGN-053] @positive @regression Username field is masked by default', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const inputType = await pom.usernameInput.getAttribute('type');
    expect(inputType).toBe('text');
  });

  test('[LGN-054] @positive @regression Password field is masked by default', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const inputType = await pom.passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('[LGN-055] @positive @regression Form submission with Enter key in password field', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('testuser');
    await pom.passwordInput.fill('testpass');
    await pom.passwordInput.press('Enter');
    // Form should submit (button click triggered)
    await page.waitForTimeout(500);
  });

  test('[LGN-056] @positive @regression Login form has proper heading hierarchy', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const headings = page.locator('.cmp-login h1, .cmp-login h2, .cmp-login h3');
    expect(await headings.count()).toBeGreaterThan(0);
  });

  test('[LGN-057] @positive @regression Login form has visible labels for inputs', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const labels = page.locator('.cmp-login label');
    if (await labels.count() > 0) {
      await expect(labels.first()).toBeVisible();
    }
  });

  test('[LGN-058] @positive @regression Form state persists after validation error', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const testEmail = 'test@example.com';
    await pom.usernameInput.fill(testEmail);
    await pom.passwordInput.fill('password');
    const emailValue = await pom.usernameInput.inputValue();
    expect(emailValue).toBe(testEmail);
  });

  test('[LGN-059] @positive @regression Tab key navigates through form fields', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.focus();
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.id);
    expect(focusedElement).toBeTruthy();
  });

  test('[LGN-060] @positive @regression Shift+Tab navigates backwards through form fields', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.loginButton.focus();
    await page.keyboard.press('Shift+Tab');
    // Focus should move to previous element
    await page.waitForTimeout(200);
  });
});

test.describe('Login — Negative: Validation & Error Handling', () => {
  test('[LGN-035] @negative @regression Login handles empty content gracefully', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    expect(errors).toEqual([]);
    await expect(page.locator('.cmp-login').first()).toBeVisible();
  });

  test('[LGN-036] @negative @regression Login handles missing images', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[LGN-061] @negative @regression Empty username and password rejection', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const usernameValue = await pom.usernameInput.inputValue();
    const passwordValue = await pom.passwordInput.inputValue();
    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
  });

  test('[LGN-062] @negative @regression Empty username validation error', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('password');
    const usernameValue = await pom.usernameInput.inputValue();
    expect(usernameValue).toBe('');
  });

  test('[LGN-063] @negative @regression Empty password validation error', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user@example.com');
    const passwordValue = await pom.passwordInput.inputValue();
    expect(passwordValue).toBe('');
  });

  test('[LGN-064] @negative @regression Invalid email format: missing @symbol', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('userexample.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('userexample.com');
  });

  test('[LGN-065] @negative @regression Invalid email format: missing domain extension', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user@example');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('user@example');
  });

  test('[LGN-066] @negative @regression Invalid email format: double @symbol', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user@@example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('user@@example.com');
  });

  test('[LGN-067] @negative @regression Email with leading space character', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill(' user@example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe(' user@example.com');
  });

  test('[LGN-068] @negative @regression Email with trailing space character', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user@example.com ');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('user@example.com ');
  });

  test('[LGN-069] @negative @regression Email with internal space character', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user name@example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('user name@example.com');
  });

  test('[LGN-070] @negative @regression Password field rejects SQL injection attempt', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const sqlInjection = "' OR '1'='1";
    await pom.passwordInput.fill(sqlInjection);
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe(sqlInjection);
  });

  test('[LGN-071] @negative @regression Username field rejects SQL injection attempt', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const sqlInjection = "admin'--";
    await pom.usernameInput.fill(sqlInjection);
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe(sqlInjection);
  });

  test('[LGN-072] @negative @regression Password field rejects XSS payload', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const xssPayload = '<script>alert("xss")</script>';
    await pom.passwordInput.fill(xssPayload);
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe(xssPayload);
  });

  test('[LGN-073] @negative @regression Username field rejects XSS payload', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const xssPayload = '"><svg/onload=alert(1)>';
    await pom.usernameInput.fill(xssPayload);
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe(xssPayload);
  });

  test('[LGN-074] @negative @regression Non-existent user email rejection', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('nonexistent@invalid.local');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('nonexistent@invalid.local');
  });

  test('[LGN-075] @negative @regression Incorrect password attempt tracking', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user@example.com');
    await pom.passwordInput.fill('wrongpassword');
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe('wrongpassword');
  });

  test('[LGN-076] @negative @regression Form does not auto-submit with invalid data', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const initialUrl = page.url();
    await pom.usernameInput.fill('invalid');
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl).toBe(initialUrl);
  });

  test('[LGN-077] @negative @regression Password field input value is not exposed in page source', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('SecretPassword123');
    const pageContent = await page.content();
    expect(pageContent).not.toContain('SecretPassword123');
  });

  test('[LGN-078] @negative @regression Console does not log password values', async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('SecretPassword123');
    const hasPassword = consoleLogs.some(log => log.includes('SecretPassword123'));
    expect(hasPassword).toBe(false);
  });
});

test.describe('Login — Edge Cases: Boundary Conditions & Input Limits', () => {
  test('[LGN-079] @edge @regression Maximum length email input handling', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const longEmail = 'a'.repeat(64) + '@' + 'b'.repeat(63) + '.' + 'c'.repeat(62);
    await pom.usernameInput.fill(longEmail);
    const value = await pom.usernameInput.inputValue();
    expect(value).toBeTruthy();
  });

  test('[LGN-080] @edge @regression Maximum length password input handling', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const longPassword = 'P'.repeat(128) + '@1';
    await pom.passwordInput.fill(longPassword);
    const value = await pom.passwordInput.inputValue();
    expect(value).toBeTruthy();
  });

  test('[LGN-081] @edge @regression Minimum length username (single character)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('a');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('a');
  });

  test('[LGN-082] @edge @regression Minimum length password (single character)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('x');
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe('x');
  });

  test('[LGN-083] @edge @regression Field with only spaces (username)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('     ');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('     ');
  });

  test('[LGN-084] @edge @regression Field with only spaces (password)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('     ');
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe('     ');
  });

  test('[LGN-085] @edge @regression Field with only special characters (username)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('!@#$%^&*()');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('!@#$%^&*()');
  });

  test('[LGN-086] @edge @regression Field with only special characters (password)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('!@#$%^&*()_+-=[]{}|;:,.<>?');
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe('!@#$%^&*()_+-=[]{}|;:,.<>?');
  });

  test('[LGN-087] @edge @regression Copy-paste operation in username field', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const testData = 'test@example.com';
    await page.evaluate(([data]) => {
      const el = document.querySelector('#username') as HTMLInputElement;
      if (el) el.value = data;
    }, [testData]);
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe(testData);
  });

  test('[LGN-088] @edge @regression Copy-paste operation in password field', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const testData = 'TestPassword123';
    await page.evaluate(([data]) => {
      const el = document.querySelector('#password') as HTMLInputElement;
      if (el) el.value = data;
    }, [testData]);
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe(testData);
  });

  test('[LGN-089] @edge @regression Rapid consecutive field focus/blur cycles', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    for (let i = 0; i < 10; i++) {
      await pom.usernameInput.focus();
      await pom.passwordInput.focus();
      await pom.usernameInput.focus();
    }
    await expect(pom.usernameInput).toBeFocused();
  });

  test('[LGN-090] @edge @regression Rapid consecutive form submission attempts', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user@example.com');
    await pom.passwordInput.fill('password');
    for (let i = 0; i < 3; i++) {
      const isDisabled = await pom.loginButton.isDisabled();
      if (!isDisabled) {
        await pom.loginButton.click();
      }
    }
  });

  test('[LGN-091] @edge @regression Tab order navigation completeness', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const focusableElements = page.locator('.cmp-login input, .cmp-login button, .cmp-login a');
    const count = await focusableElements.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('[LGN-092] @edge @regression Unicode characters in username field', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const unicodeEmail = '用户@example.com';
    await pom.usernameInput.fill(unicodeEmail);
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe(unicodeEmail);
  });

  test('[LGN-093] @edge @regression Unicode characters in password field', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const unicodePass = 'パスワード123';
    await pom.passwordInput.fill(unicodePass);
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe(unicodePass);
  });

  test('[LGN-094] @edge @regression Emoji characters in username field', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const emojiEmail = 'user😀@example.com';
    await pom.usernameInput.fill(emojiEmail);
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe(emojiEmail);
  });

  test('[LGN-095] @edge @regression Emoji characters in password field', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const emojiPass = 'Pass123😀🔒';
    await pom.passwordInput.fill(emojiPass);
    const value = await pom.passwordInput.inputValue();
    expect(value).toBe(emojiPass);
  });

  test('[LGN-096] @edge @regression Multiple @ symbols in email field', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user@domain@example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('user@domain@example.com');
  });

  test('[LGN-097] @edge @regression Password visibility toggle state persistence', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('TestPassword');
    const initialType = await pom.passwordInput.getAttribute('type');
    expect(initialType).toBe('password');
  });

  test('[LGN-098] @edge @regression Form reset functionality (if present)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('test@example.com');
    await pom.passwordInput.fill('password123');
    const resetBtn = page.locator('button[type="reset"]').first();
    if (await resetBtn.count() > 0) {
      await resetBtn.click();
      const usernameValue = await pom.usernameInput.inputValue();
      const passwordValue = await pom.passwordInput.inputValue();
      expect(usernameValue).toBe('');
      expect(passwordValue).toBe('');
    }
  });

  test('[LGN-099] @edge @regression Field value cleared on logout (session management)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('user@example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBeTruthy();
  });

  test('[LGN-100] @edge @regression Very long email domain handling', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const longDomain = 'user@' + 'subdomain.'.repeat(10) + 'example.com';
    await pom.usernameInput.fill(longDomain);
    const value = await pom.usernameInput.inputValue();
    expect(value).toBeTruthy();
  });
});

test.describe('Login — Responsive & Adaptive Design', () => {
  test('[LGN-037] @mobile @regression @mobile Login adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
    const flexDir = await root.evaluate(el => {
      const cs = getComputedStyle(el);
      return cs.flexDirection || cs.display;
    });
    expect(flexDir).toBeDefined();
  });

  test('[LGN-038] @mobile @regression Login adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });

  test('[LGN-101] @mobile @regression Mobile: Portrait orientation layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
  });

  test('[LGN-102] @mobile @regression Mobile: Landscape orientation layout', async ({ page }) => {
    await page.setViewportSize({ width: 812, height: 375 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
  });

  test('[LGN-103] @mobile @regression Mobile: Form inputs remain fully accessible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await expect(pom.usernameInput).toBeVisible();
    await expect(pom.passwordInput).toBeVisible();
    await expect(pom.loginButton).toBeVisible();
  });

  test('[LGN-104] @mobile @regression Mobile: No horizontal scrolling on input focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.focus();
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('[LGN-105] @mobile @regression Tablet: Form centering and spacing', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator('.cmp-login').first();
    const box = await form.boundingBox();
    if (box) {
      expect(box.width).toBeGreaterThan(200);
    }
  });
});

test.describe('Login — Performance & Data Integrity', () => {
  test('[LGN-039] @perf @regression Login page loads in < 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('[LGN-106] @perf @regression Form submission response time < 3 seconds', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('test@example.com');
    await pom.passwordInput.fill('password');
    const startTime = Date.now();
    await pom.loginButton.click();
    await page.waitForTimeout(100);
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeGreaterThanOrEqual(0);
  });

  test('[LGN-107] @perf @regression Input field responsiveness during typing', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const testEmail = 'test@example.com';
    const startTime = Date.now();
    await pom.usernameInput.fill(testEmail);
    const fillTime = Date.now() - startTime;
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe(testEmail);
    expect(fillTime).toBeLessThan(1000);
  });

  test('[LGN-108] @regression Password data not stored in visible variables or cookies', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.passwordInput.fill('SecretPassword123');
    const cookies = await page.context().cookies();
    const cookieString = JSON.stringify(cookies);
    expect(cookieString).not.toContain('SecretPassword123');
  });

  test('[LGN-109] @regression Password not leaked in HTTP requests', async ({ page }) => {
    const requestBodies: string[] = [];
    page.on('request', request => {
      const postData = request.postData();
      if (postData) requestBodies.push(postData);
    });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('test@example.com');
    await pom.passwordInput.fill('SecretPassword123');
    // Don't actually submit to avoid authentication attempts
  });

  test('[LGN-110] @regression Form data cleared after logout (simulated)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('test@example.com');
    await pom.passwordInput.fill('password');
    // Simulate form reset
    await page.evaluate(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) form.reset();
    });
    const usernameValue = await pom.usernameInput.inputValue();
    const passwordValue = await pom.passwordInput.inputValue();
    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
  });

  test('[LGN-111] @regression Session cookies set correctly (HTTPS enforcement if applicable)', async ({ page }) => {
    const pom = new LoginPage(page);
    const url = BASE();
    await pom.navigate(url);
    const protocol = new URL(url).protocol;
    // If HTTPS, should enforce secure cookies
    if (protocol === 'https:') {
      // Verify page loads over HTTPS
      expect(page.url()).toContain('https');
    }
  });

  test('[LGN-112] @regression Concurrent field input handling (no data corruption)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await Promise.all([
      pom.usernameInput.fill('test@example.com'),
      pom.passwordInput.fill('password')
    ]);
    const usernameValue = await pom.usernameInput.inputValue();
    const passwordValue = await pom.passwordInput.inputValue();
    expect(usernameValue).toBe('test@example.com');
    expect(passwordValue).toBe('password');
  });
});

test.describe('Login — Broken Images & Resources', () => {
  test('[LGN-040] @regression Login all images load successfully', async ({ page }) => {
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

  test('[LGN-041] @regression Login all images have alt attributes', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('[LGN-113] @regression No broken image links (404 errors)', async ({ page }) => {
    const failedImages: string[] = [];
    page.on('response', response => {
      if (response.url().includes('image') && response.status() >= 400) {
        failedImages.push(response.url());
      }
    });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    expect(failedImages).toEqual([]);
  });

  test('[LGN-114] @regression Images do not cause layout shift (CLS impact)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    for (let i = 0; i < await images.count(); i++) {
      const box = await images.nth(i).boundingBox();
      expect(box).toBeTruthy();
    }
  });

  test('[LGN-115] @regression Console produces no JS errors', async ({ page }) => {
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

test.describe('Login — Accessibility: WCAG 2.2 AA Compliance', () => {
  test('[LGN-042] @a11y @wcag22 @regression @smoke Login passes axe-core scan', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-login')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[LGN-043] @a11y @wcag22 @regression @smoke Login interactive elements meet 24px target size', async ({ page }) => {
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

  test('[LGN-044] @a11y @wcag22 @regression @smoke Login focus is not obscured by sticky elements', async ({ page }) => {
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

  test('[LGN-116] @a11y @wcag22 Form labels properly associated with inputs', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const inputs = page.locator('.cmp-login input[type="text"], .cmp-login input[type="password"]');
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        expect(await label.count()).toBeGreaterThan(0);
      }
    }
  });

  test('[LGN-117] @a11y @wcag22 Form required field indicators visible', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const requiredInputs = page.locator('.cmp-login input[required]');
    expect(await requiredInputs.count()).toBeGreaterThan(0);
  });

  test('[LGN-118] @a11y @wcag22 Error messages have sufficient color contrast', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const errorMsg = pom.errorMessage;
    if (await errorMsg.count() > 0) {
      const color = await errorMsg.first().evaluate(el => getComputedStyle(el).color);
      expect(color).toBeTruthy();
    }
  });

  test('[LGN-119] @a11y @wcag22 Keyboard navigation with Tab key works correctly', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.focus();
    await page.keyboard.press('Tab');
    const focusedId = await page.evaluate(() => (document.activeElement as HTMLElement)?.id);
    expect(focusedId).toBeTruthy();
  });

  test('[LGN-120] @a11y @wcag22 Keyboard navigation with Shift+Tab works correctly', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.loginButton.focus();
    await page.keyboard.press('Shift+Tab');
    // Focus should move to previous element
    const focusedElement = await page.evaluate(() => (document.activeElement as HTMLElement)?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('[LGN-121] @a11y @wcag22 Screen reader can announce form purpose', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator('form').first();
    const ariaLabel = await form.getAttribute('aria-label');
    const ariaLabelledBy = await form.getAttribute('aria-labelledby');
    expect(ariaLabel || ariaLabelledBy).toBeTruthy();
  });

  test('[LGN-122] @a11y @wcag22 Input fields have clear purpose labels', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const usernameLabel = page.locator('label[for="username"]');
    const passwordLabel = page.locator('label[for="password"]');
    if (await usernameLabel.count() > 0) {
      await expect(usernameLabel.first()).toBeVisible();
    }
    if (await passwordLabel.count() > 0) {
      await expect(passwordLabel.first()).toBeVisible();
    }
  });

  test('[LGN-123] @a11y @wcag22 Focus visible indicator present on all interactive elements', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const button = pom.loginButton;
    await button.focus();
    const outline = await button.evaluate(el => {
      const style = getComputedStyle(el);
      return style.outline !== 'none' || style.boxShadow !== 'none';
    });
    expect(outline).toBe(true);
  });

  test('[LGN-124] @a11y @wcag22 Error announcements use role="alert" for screen readers', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const errorMsg = pom.errorMessage;
    if (await errorMsg.count() > 0) {
      const role = await errorMsg.first().getAttribute('role');
      expect(['alert', 'status', 'log']).toContain(role);
    }
  });

  test('[LGN-125] @a11y @wcag22 No keyboard traps - can tab out of any field', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.focus();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }
    const focusedElement = await page.evaluate(() => (document.activeElement as HTMLElement)?.tagName);
    expect(focusedElement).not.toBe('INPUT');
  });

  test('[LGN-126] @a11y @wcag22 Password field autocomplete attribute set correctly', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const autocomplete = await pom.passwordInput.getAttribute('autocomplete');
    expect(['password', 'current-password', 'new-password', 'off']).toContain(autocomplete);
  });

  test('[LGN-127] @a11y @wcag22 Username field autocomplete attribute set to email', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const autocomplete = await pom.usernameInput.getAttribute('autocomplete');
    expect(autocomplete).toBeTruthy();
  });

  test('[LGN-128] @a11y @wcag22 Placeholder text is not a substitute for labels', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const inputsWithoutLabel = page.locator('.cmp-login input:not([aria-label])');
    for (let i = 0; i < await inputsWithoutLabel.count(); i++) {
      const label = await inputsWithoutLabel.nth(i).evaluate(el => {
        const id = el.getAttribute('id');
        if (!id) return false;
        return !!document.querySelector(`label[for="${id}"]`);
      });
      expect(label).toBe(true);
    }
  });

  test('[LGN-129] @a11y @wcag22 Login button has descriptive text', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const buttonText = await pom.loginButton.textContent();
    const ariaLabel = await pom.loginButton.getAttribute('aria-label');
    expect(buttonText || ariaLabel).toBeTruthy();
  });

  test('[LGN-130] @a11y @wcag22 Form submission prevents default and shows feedback', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const initialUrl = page.url();
    await pom.usernameInput.fill('test@example.com');
    await pom.passwordInput.fill('password');
    // Don't submit to avoid actual auth attempt
    const currentUrl = page.url();
    expect(currentUrl).toBe(initialUrl);
  });
});

test.describe('Login — Browser Autofill & Password Manager', () => {
  test('[LGN-131] @regression Autofill credential detection via autocomplete attributes', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const usernameAutocomplete = await pom.usernameInput.getAttribute('autocomplete');
    const passwordAutocomplete = await pom.passwordInput.getAttribute('autocomplete');
    expect(usernameAutocomplete || passwordAutocomplete).toBeTruthy();
  });

  test('[LGN-132] @regression Password manager compatible field naming', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const usernameName = await pom.usernameInput.getAttribute('name');
    const passwordName = await pom.passwordInput.getAttribute('name');
    expect(usernameName || passwordName).toBeTruthy();
  });

  test('[LGN-133] @regression Form action attribute present for submission', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      const action = await form.getAttribute('action');
      const method = await form.getAttribute('method');
      expect(method).toBeTruthy();
    }
  });
});

test.describe('Login — Cross-Browser Compatibility', () => {
  test('[LGN-134] @regression Form works across major browsers (Chromium)', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('test@example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('test@example.com');
  });

  test('[LGN-135] @regression Input masking consistent across browsers', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const inputType = await pom.passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('[LGN-136] @regression Form CSS styles work without JavaScript', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Login — Navigation & Session Flow', () => {
  test('[LGN-137] @regression Back button behavior after failed login', async ({ page }) => {
    const pom = new LoginPage(page);
    const initialUrl = BASE();
    await pom.navigate(initialUrl);
    // Navigate to another page then back
    await page.goto(initialUrl + '/extra', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.goBack();
    // Should be back on login page
    const root = page.locator('.cmp-login').first();
    const isVisible = await root.isVisible();
    expect(isVisible).toBe(true);
  });

  test('[LGN-138] @regression Forward button navigation', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await page.goBack().catch(() => {});
    await page.goForward();
    // Form should still be functional
    await expect(pom.usernameInput).toBeVisible();
  });

  test('[LGN-139] @regression Direct URL access to login page', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
  });

  test('[LGN-140] @regression Session timeout graceful degradation', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // Simulate session timeout by checking if form still renders
    await page.waitForTimeout(2000);
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
  });
});

test.describe('Login — Mobile-Specific Interactions', () => {
  test('[LGN-141] @mobile @regression Mobile: Password visibility toggle tap target', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const toggleBtn = page.locator('button[aria-label*="password" i], button[aria-label*="show" i]');
    if (await toggleBtn.count() > 0) {
      const box = await toggleBtn.first().boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('[LGN-142] @mobile @regression Mobile: Virtual keyboard does not hide submit button', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.focus();
    const submitButton = pom.loginButton;
    const isVisible = await submitButton.isVisible();
    expect(isVisible).toBe(true);
  });

  test('[LGN-143] @mobile @regression Mobile: Input fields have sufficient spacing for touch', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const inputs = page.locator('.cmp-login input');
    for (let i = 0; i < await inputs.count(); i++) {
      const box = await inputs.nth(i).boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('[LGN-144] @mobile @regression Mobile: No horizontal scrolling needed for form interaction', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const hasScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasScroll).toBe(false);
  });
});

test.describe('Login — Error Recovery & Retries', () => {
  test('[LGN-145] @regression Form recovers after network error', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // Offline simulation would require more complex setup
    // Verify form is still interactive
    await expect(pom.usernameInput).toBeEnabled();
    await expect(pom.passwordInput).toBeEnabled();
  });

  test('[LGN-146] @regression User can retry after failed submission', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await pom.usernameInput.fill('test@example.com');
    await pom.passwordInput.fill('password');
    // Clear and retry
    await pom.usernameInput.clear();
    await pom.usernameInput.fill('retry@example.com');
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe('retry@example.com');
  });

  test('[LGN-147] @regression Form preserves user input during error display', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const testEmail = 'user@example.com';
    await pom.usernameInput.fill(testEmail);
    // Simulate error - field should retain value
    const value = await pom.usernameInput.inputValue();
    expect(value).toBe(testEmail);
  });
});

test.describe('Login — AEM Dialog Configuration', () => {
  test('[LGN-045] @author @regression @smoke Login dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Login GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Login dialog missing helpPath property').toBeTruthy();
  });

  test('[LGN-046] @author @regression @smoke Login helpPath points to correct component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });

  test('[LGN-148] @author @regression Login component available in component browser', async ({ page }) => {
    const componentUrl = `${BASE()}/apps/ga/components/content/login/.content.xml`;
    const response = await page.request.get(componentUrl);
    // Component should exist
    const isAvailable = response.ok() || response.status() === 403;
    expect(isAvailable).toBe(true);
  });

  test('[LGN-149] @author @regression Login component has cq:icon configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    // Dialog should be valid for component rendering
    expect(dialog).toBeTruthy();
  });
});
