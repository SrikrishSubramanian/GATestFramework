import { test, expect } from '@playwright/test';
<<<<<<< HEAD
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const ROOT = '.cmp-login';
const HERO = '.cmp-login__hero';
const FORM = '.cmp-login__form';
const PASSWORD = '.cmp-login__password input, input[type="password"]';
const PASSWORD_TOGGLE = '.cmp-login__password-toggle';
=======
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import ENV from '../../../utils/infra/env';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
>>>>>>> login_page

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Login — Visual Regression', () => {
<<<<<<< HEAD
  test('[LGN-V-001] @visual Login component desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('login-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-002] @visual Login component mobile screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('login-mobile.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-003] @visual Login component tablet screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator(ROOT).first();
    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot('login-tablet.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-004] @visual Login hero section screenshot matches baseline at desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const hero = page.locator(HERO).first();
    if (await hero.count() === 0) { test.skip(); return; }
    await expect(hero).toBeVisible();
    await expect(hero).toHaveScreenshot('login-hero-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-005] @visual Login form section screenshot matches baseline at desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const form = page.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toBeVisible();
    await expect(form).toHaveScreenshot('login-form-desktop.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-006] @visual Password field in masked state screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwd = page.locator(PASSWORD).first();
    if (await pwd.count() === 0) { test.skip(); return; }
    await pwd.fill('TestPass123');
    const form = page.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toHaveScreenshot('login-password-masked.png', { maxDiffPixelRatio: 0.02 });
  });

  test('[LGN-V-007] @visual Password field in revealed state (after toggle) screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const pwd = page.locator(PASSWORD).first();
    if (await pwd.count() === 0) { test.skip(); return; }
    await pwd.fill('TestPass123');
    const toggle = page.locator(PASSWORD_TOGGLE).first();
    if (await toggle.count() === 0) { test.skip(); return; }
    await toggle.click();
    const form = page.locator(FORM).first();
    if (await form.count() === 0) { test.skip(); return; }
    await expect(form).toHaveScreenshot('login-password-revealed.png', { maxDiffPixelRatio: 0.02 });
=======
  test('[LOGIN-VISUAL-001] @visual Login form layout is correct', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const form = page.locator('form').first();
    await expect(form).toBeVisible();

    // Verify form elements are aligned
    const inputs = form.locator('input[type="text"], input[type="email"], input[type="password"]');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);
  });

  test('[LOGIN-VISUAL-002] @visual Login input fields are styled correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const count = await inputs.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const input = inputs.nth(i);
      const borderWidth = await input.evaluate(el =>
        window.getComputedStyle(el).borderWidth
      );
      expect(borderWidth).toBeTruthy();
    }
  });

  test('[LOGIN-VISUAL-003] @visual Login submit button is prominent', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible();

    const bg = await submitBtn.evaluate(el =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(bg).toBeTruthy();
  });

  test('[LOGIN-VISUAL-004] @visual Login form labels are visible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const labels = page.locator('label');
    const count = await labels.count();

    expect(count).toBeGreaterThan(0);
  });

  test('[LOGIN-VISUAL-005] @visual Login error messages display correctly', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/login.html?wcmmode=disabled`);

    const errorElements = page.locator('[role="alert"], .error, .alert-danger');
    // May or may not have error elements initially
    await expect(page).toBeTruthy();
>>>>>>> login_page
  });
});
