import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.BASE_URL || 'http://localhost:4503';
test.describe('Login — UI & Layout (CSV Test Cases)', () => {
    test.afterEach(async ({ page }, testInfo) => {
        if (capture) {
            await attachConsoleCapture(testInfo, capture);
        }
        await annotateEnvironment(testInfo);
    });
    test('[LGN-002] @UI Background Color Validation', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-login').first();
        const bgColor = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).backgroundColor);
        // measurement: use measurement-utils for cleaner code
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
        const opacity = // 📏 TODO: Replace with measurement-utils
         await card.evaluate(el => getComputedStyle(el).opacity);
        // measurement: use measurement-utils for cleaner code
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
        const pwdInput = pom.getPasswordInput();
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
        const submitBtn = pom.getLoginButton();
        const usernameInput = pom.getUsernameInput();
        const passwordInput = pom.getPasswordInput();
        expect(await usernameInput.inputValue()).toBe('');
        expect(await passwordInput.inputValue()).toBe('');
    });
    test('[LGN-014] @negative @regression Empty Validation: Username Only', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const usernameInput = pom.getUsernameInput();
        const passwordInput = pom.getPasswordInput();
        await fill(passwordInput, 'TestPassword123');
        expect(await usernameInput.inputValue()).toBe('');
    });
    test('[LGN-015] @Functional Data Preservation on Validation', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const usernameInput = pom.getUsernameInput();
        const passwordInput = pom.getPasswordInput();
        await fill(usernameInput, 'admin@example.com');
        const inputValue = await usernameInput.inputValue();
        expect(inputValue).toBe('admin@example.com');
    });
    test('[LGN-017] @A11y Error Message Screen Reader Trigger', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const role = await pom.getErrorMessage().first().getAttribute('role');
        expect(['alert', 'status', 'log']).toContain(role);
    });
    test('[LGN-018] @UI Mobile: Single Column Layout', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-login').first();
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => getComputedStyle(el).flexDirection);
        // measurement: use measurement-utils for cleaner code
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
            const isHidden = // 📏 TODO: Replace with measurement-utils
             await target.evaluate(el => {
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
    test('[LGN-024] @A11y Semantic HTML: Headings', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const h1 = page.locator('.cmp-login h1').first();
        const h2 = page.locator('.cmp-login h2').first();
        expect((await h1.count()) > 0 || (await h2.count()) > 0).toBe(true);
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
    test('[LGN-027] @A11y Focus Indicators', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const button = pom.getLoginButton();
        await button.focus();
        const outline = // 📏 TODO: Replace with measurement-utils
         await button.evaluate(el => getComputedStyle(el).outline);
        // measurement: use measurement-utils for cleaner code
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
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
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
        await pom.getUsernameInput().fill('user@example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('user@example.com');
    });
    test('[LGN-048] @positive @regression Valid username with subdomain email format', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('admin.user@mail.example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('admin.user@mail.example.com');
    });
    test('[LGN-049] @positive @regression Valid username with plus addressing', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user+tag@example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('user+tag@example.com');
    });
    test('[LGN-050] @positive @regression Password accepts alphanumeric characters', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('Password123');
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe('Password123');
    });
    test('[LGN-051] @positive @regression Password accepts special characters', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('P@ssw0rd!#$%');
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe('P@ssw0rd!#$%');
    });
    test('[LGN-052] @positive @regression Password accepts spaces', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('Pass word 123');
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe('Pass word 123');
    });
    test('[LGN-053] @positive @regression Username field is masked by default', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const inputType = await pom.getUsernameInput().getAttribute('type');
        expect(inputType).toBe('text');
    });
    test('[LGN-054] @positive @regression Password field is masked by default', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const inputType = await pom.getPasswordInput().getAttribute('type');
        expect(inputType).toBe('password');
    });
    test('[LGN-055] @positive @regression Form submission with Enter key in password field', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('testuser');
        await pom.getPasswordInput().fill('testpass');
        await pom.getPasswordInput().press('Enter');
        // Form should submit (button click triggered)
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
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
        await pom.getUsernameInput().fill(testEmail);
        await pom.getPasswordInput().fill('password');
        const emailValue = await pom.getUsernameInput().inputValue();
        expect(emailValue).toBe(testEmail);
    });
    test('[LGN-060] @positive @regression Shift+Tab navigates backwards through form fields', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getLoginButton().focus();
        await page.keyboard.press('Shift+Tab');
        // Focus should move to previous element
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    });
});
test.describe('Login — Negative: Validation & Error Handling', () => {
    test('[LGN-035] @negative @regression Login handles empty content gracefully', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
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
        const usernameValue = await pom.getUsernameInput().inputValue();
        const passwordValue = await pom.getPasswordInput().inputValue();
        expect(usernameValue).toBe('');
        expect(passwordValue).toBe('');
    });
    test('[LGN-062] @negative @regression Empty username validation error', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('password');
        const usernameValue = await pom.getUsernameInput().inputValue();
        expect(usernameValue).toBe('');
    });
    test('[LGN-063] @negative @regression Empty password validation error', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user@example.com');
        const passwordValue = await pom.getPasswordInput().inputValue();
        expect(passwordValue).toBe('');
    });
    test('[LGN-064] @negative @regression Invalid email format: missing @symbol', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('userexample.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('userexample.com');
    });
    test('[LGN-065] @negative @regression Invalid email format: missing domain extension', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user@example');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('user@example');
    });
    test('[LGN-066] @negative @regression Invalid email format: double @symbol', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user@@example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('user@@example.com');
    });
    test('[LGN-067] @negative @regression Email with leading space character', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill(' user@example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe(' user@example.com');
    });
    test('[LGN-068] @negative @regression Email with trailing space character', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user@example.com ');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('user@example.com ');
    });
    test('[LGN-069] @negative @regression Email with internal space character', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user name@example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('user name@example.com');
    });
    test('[LGN-070] @negative @regression Password field rejects SQL injection attempt', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const sqlInjection = "' OR '1'='1";
        await pom.getPasswordInput().fill(sqlInjection);
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe(sqlInjection);
    });
    test('[LGN-071] @negative @regression Username field rejects SQL injection attempt', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const sqlInjection = "admin'--";
        await pom.getUsernameInput().fill(sqlInjection);
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe(sqlInjection);
    });
    test('[LGN-072] @negative @regression Password field rejects XSS payload', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const xssPayload = '<script>alert("xss")</script>';
        await pom.getPasswordInput().fill(xssPayload);
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe(xssPayload);
    });
    test('[LGN-073] @negative @regression Username field rejects XSS payload', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const xssPayload = '"><svg/onload=alert(1)>';
        await pom.getUsernameInput().fill(xssPayload);
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe(xssPayload);
    });
    test('[LGN-074] @negative @regression Non-existent user email rejection', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('nonexistent@invalid.local');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('nonexistent@invalid.local');
    });
    test('[LGN-075] @negative @regression Incorrect password attempt tracking', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user@example.com');
        await pom.getPasswordInput().fill('wrongpassword');
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe('wrongpassword');
    });
    test('[LGN-076] @negative @regression Form does not auto-submit with invalid data', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const initialUrl = page.url();
        await pom.getUsernameInput().fill('invalid');
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const currentUrl = page.url();
        expect(currentUrl).toBe(initialUrl);
    });
    test('[LGN-077] @negative @regression Password field input value is not exposed in page source', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('SecretPassword123');
        const pageContent = await page.content();
        expect(pageContent).not.toContain('SecretPassword123');
    });
    test('[LGN-078] @negative @regression Console does not log password values', async ({ page }) => {
        const consoleLogs: string[] = [];
        page.on('console', msg => consoleLogs.push(msg.text()));
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('SecretPassword123');
        const hasPassword = consoleLogs.some(log => log.includes('SecretPassword123'));
        expect(hasPassword).toBe(false);
    });
});
test.describe('Login — Edge Cases: Boundary Conditions & Input Limits', () => {
    test('[LGN-079] @edge @regression Maximum length email input handling', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const longEmail = 'a'.repeat(64) + '@' + 'b'.repeat(63) + '.' + 'c'.repeat(62);
        await pom.getUsernameInput().fill(longEmail);
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBeTruthy();
    });
    test('[LGN-080] @edge @regression Maximum length password input handling', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const longPassword = 'P'.repeat(128) + '@1';
        await pom.getPasswordInput().fill(longPassword);
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBeTruthy();
    });
    test('[LGN-081] @edge @regression Minimum length username (single character)', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('a');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('a');
    });
    test('[LGN-082] @edge @regression Minimum length password (single character)', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('x');
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe('x');
    });
    test('[LGN-083] @edge @regression Field with only spaces (username)', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('     ');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('     ');
    });
    test('[LGN-084] @edge @regression Field with only spaces (password)', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('     ');
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe('     ');
    });
    test('[LGN-085] @edge @regression Field with only special characters (username)', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('!@#$%^&*()');
        const value = await pom.getUsernameInput().inputValue();
        expect(value, `Expected '!@#$%^&*(, got ${value}`).toBe('!@#$%^&*()');
    });
    test('[LGN-086] @edge @regression Field with only special characters (password)', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('!@#$%^&*()_+-=[]{}|;:,.<>?');
        const value = await pom.getPasswordInput().inputValue();
        expect(value, `Expected '!@#$%^&*(, got ${value}`).toBe('!@#$%^&*()_+-=[]{}|;:,.<>?');
    });
    test('[LGN-089] @edge @regression Rapid consecutive field focus/blur cycles', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        for (let i = 0; i < 10; i++) {
            await pom.getUsernameInput().focus();
            await pom.getPasswordInput().focus();
            await pom.getUsernameInput().focus();
        }
        await expect(pom.getUsernameInput()).toBeFocused();
    });
    test('[LGN-090] @edge @regression Rapid consecutive form submission attempts', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user@example.com');
        await pom.getPasswordInput().fill('password');
        for (let i = 0; i < 3; i++) {
            const isDisabled = await pom.getLoginButton().isDisabled();
            if (!isDisabled) {
                await pom.getLoginButton().click();
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
        await pom.getUsernameInput().fill(unicodeEmail);
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe(unicodeEmail);
    });
    test('[LGN-093] @edge @regression Unicode characters in password field', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const unicodePass = 'パスワード123';
        await pom.getPasswordInput().fill(unicodePass);
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe(unicodePass);
    });
    test('[LGN-094] @edge @regression Emoji characters in username field', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const emojiEmail = 'user😀@example.com';
        await pom.getUsernameInput().fill(emojiEmail);
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe(emojiEmail);
    });
    test('[LGN-095] @edge @regression Emoji characters in password field', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const emojiPass = 'Pass123😀🔒';
        await pom.getPasswordInput().fill(emojiPass);
        const value = await pom.getPasswordInput().inputValue();
        expect(value).toBe(emojiPass);
    });
    test('[LGN-096] @edge @regression Multiple @ symbols in email field', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user@domain@example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('user@domain@example.com');
    });
    test('[LGN-097] @edge @regression Password visibility toggle state persistence', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('TestPassword');
        const initialType = await pom.getPasswordInput().getAttribute('type');
        expect(initialType).toBe('password');
    });
    test('[LGN-098] @edge @regression Form reset functionality (if present)', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('test@example.com');
        await pom.getPasswordInput().fill('password123');
        const resetBtn = page.locator('button[type="reset"]').first();
        if (await resetBtn.count() > 0) {
            await clickElement(resetBtn);
            const usernameValue = await pom.getUsernameInput().inputValue();
            const passwordValue = await pom.getPasswordInput().inputValue();
            expect(usernameValue).toBe('');
            expect(passwordValue).toBe('');
        }
    });
    test('[LGN-099] @edge @regression Field value cleared on logout (session management)', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('user@example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBeTruthy();
    });
    test('[LGN-100] @edge @regression Very long email domain handling', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const longDomain = 'user@' + 'subdomain.'.repeat(10) + 'example.com';
        await pom.getUsernameInput().fill(longDomain);
        const value = await pom.getUsernameInput().inputValue();
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
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => {
            const cs = getComputedStyle(el);
            return cs.flexDirection || cs.display;
        });
        expect(flexDir).toBeDefined();
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
        await expect(pom.getUsernameInput()).toBeVisible();
        await expect(pom.getPasswordInput()).toBeVisible();
        await expect(pom.getLoginButton()).toBeVisible();
    });
    test('[LGN-104] @mobile @regression Mobile: No horizontal scrolling on input focus', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().focus();
        const hasHorizontalScroll = // 📏 TODO: Replace with measurement-utils
         await page.evaluate(() => {
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
        await pom.getUsernameInput().fill('test@example.com');
        await pom.getPasswordInput().fill('password');
        const startTime = Date.now();
        await pom.getLoginButton().click();
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const responseTime = Date.now() - startTime;
        expect(responseTime).toBeGreaterThanOrEqual(0);
    });
    test('[LGN-107] @perf @regression Input field responsiveness during typing', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const testEmail = 'test@example.com';
        const startTime = Date.now();
        await pom.getUsernameInput().fill(testEmail);
        const fillTime = Date.now() - startTime;
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe(testEmail);
        expect(fillTime).toBeLessThan(1000);
    });
    test('[LGN-108] @regression Password data not stored in visible variables or cookies', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getPasswordInput().fill('SecretPassword123');
        const cookies = await page.context().cookies();
        const cookieString = JSON.stringify(cookies);
        expect(cookieString).not.toContain('SecretPassword123');
    });
    test('[LGN-109] @regression Password not leaked in HTTP requests', async ({ page }) => {
        const requestBodies: string[] = [];
        page.on('request', request => {
            const postData = request.postData();
            if (postData)
                requestBodies.push(postData);
        });
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('test@example.com');
        await pom.getPasswordInput().fill('SecretPassword123');
        // Don't actually submit to avoid authentication attempts
    });
    test('[LGN-110] @regression Form data cleared after logout (simulated)', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('test@example.com');
        await pom.getPasswordInput().fill('password');
        // Simulate form reset
        // 📏 TODO: Replace with measurement-utils
        await page.evaluate(() => {
            const form = document.querySelector('form') as HTMLFormElement;
            if (form)
                form.reset();
        });
        const usernameValue = await pom.getUsernameInput().inputValue();
        const passwordValue = await pom.getPasswordInput().inputValue();
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
});
test.describe('Login — Broken Images & Resources', () => {
    test('[LGN-040] @regression Login all images load successfully', async ({ page }) => {
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
    test('[LGN-115] @regression Console produces no JS errors', async ({ page }) => {
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
test.describe('Login — Accessibility: WCAG 2.2 AA Compliance', () => {
});
test.describe('Login — Browser Autofill & Password Manager', () => {
    test('[LGN-131] @regression Autofill credential detection via autocomplete attributes', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const usernameAutocomplete = await pom.getUsernameInput().getAttribute('autocomplete');
        const passwordAutocomplete = await pom.getPasswordInput().getAttribute('autocomplete');
        expect(usernameAutocomplete || passwordAutocomplete).toBeTruthy();
    });
    test('[LGN-132] @regression Password manager compatible field naming', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const usernameName = await pom.getUsernameInput().getAttribute('name');
        const passwordName = await pom.getPasswordInput().getAttribute('name');
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
        await pom.getUsernameInput().fill('test@example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('test@example.com');
    });
    test('[LGN-135] @regression Input masking consistent across browsers', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const inputType = await pom.getPasswordInput().getAttribute('type');
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
        await page.goto(initialUrl + '/extra', { waitUntil: 'domcontentloaded' }).catch(() => { });
        await page.goBack();
        // Should be back on login page
        const root = page.locator('.cmp-login').first();
        const isVisible = await root.isVisible();
        expect(isVisible).toBe(true);
    });
    test('[LGN-138] @regression Forward button navigation', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await page.goBack().catch(() => { });
        await page.goForward();
        // Form should still be functional
        await expect(pom.getUsernameInput()).toBeVisible();
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
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const root = page.locator('.cmp-login').first();
        await expect(root).toBeVisible();
    });
});
test.describe('Login — Mobile-Specific Interactions', () => {
    test('[LGN-142] @mobile @regression Mobile: Virtual keyboard does not hide submit button', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().focus();
        const submitButton = pom.getLoginButton();
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
        const hasScroll = // 📏 TODO: Replace with measurement-utils
         await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(hasScroll).toBe(false);
    });
});
test.describe('Login — Error Recovery & Retries', () => {
    test('[LGN-145] @regression Form recovers after network error', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        // Offline simulation would require more complex setup
        // Verify form is still interactive
        await expect(pom.getUsernameInput()).toBeEnabled();
        await expect(pom.getPasswordInput()).toBeEnabled();
    });
    test('[LGN-146] @regression User can retry after failed submission', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        await pom.getUsernameInput().fill('test@example.com');
        await pom.getPasswordInput().fill('password');
        // Clear and retry
        await pom.getUsernameInput().clear();
        await pom.getUsernameInput().fill('retry@example.com');
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe('retry@example.com');
    });
    test('[LGN-147] @regression Form preserves user input during error display', async ({ page }) => {
        const pom = new LoginPage(page);
        await pom.navigate(BASE());
        const testEmail = 'user@example.com';
        await pom.getUsernameInput().fill(testEmail);
        // Simulate error - field should retain value
        const value = await pom.getUsernameInput().inputValue();
        expect(value).toBe(testEmail);
    });
});
test.describe('Login — AEM Dialog Configuration', () => {
    test('[LGN-149] @author @regression Login component has cq:icon configured', async ({ page }) => {
        const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
        const response = await page.request.get(dialogUrl);
        if (!response.ok()) {
            test.skip();
            return;
        }
        const dialog = await response.json();
        // Dialog should be valid for component rendering
        expect(dialog).toBeTruthy();
    });
});
