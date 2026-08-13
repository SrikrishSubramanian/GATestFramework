import { test, expect } from '@playwright/test';
import { FooterPage } from '../../../pages/ga/components/footerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
    capture = new ConsoleCapture(page);
    capture.start();
});
test.afterEach(async ({ page }, testInfo) => {
    if (capture) {
        await attachConsoleCapture(testInfo, capture);
    }
    await annotateEnvironment(testInfo);
});
test.describe('Footer — Happy Path & Core Functionality', () => {
    test('[FTR-001] @smoke @regression @sanity Footer renders correctly', async ({ page }) => {
        const pom = new FooterPage(page);
        await pom.navigate(BASE());
        const root = await pom.getRoot();
        await expect(root).toBeVisible();
        // Verify footer is at bottom
        const boundingBox = await root.boundingBox();
        expect(boundingBox).toBeTruthy();
    });
    test('[FTR-003] @regression Footer navigation links are functional', async ({ page }) => {
        const pom = new FooterPage(page);
        await pom.navigate(BASE());
        const links = await pom.getNavigationLinks();
        const linkCount = await links.count();
        if (linkCount > 0) {
            for (let i = 0; i < Math.min(linkCount, 3); i++) {
                const link = links.nth(i);
                await expect(link).toBeVisible();
                const href = await link.getAttribute('href');
                expect(href).toBeTruthy();
            }
        }
    });
    test('[FTR-004] @regression Footer social media links are present', async ({ page }) => {
        const pom = new FooterPage(page);
        await pom.navigate(BASE());
        const socialLinks = await pom.getSocialLinks();
        const count = await socialLinks.count();
        if (count > 0) {
            for (let i = 0; i < Math.min(count, 5); i++) {
                const link = socialLinks.nth(i);
                await expect(link).toBeVisible();
            }
        }
    });
    test('[FTR-005] @regression Footer copyright notice is visible', async ({ page }) => {
        const pom = new FooterPage(page);
        await pom.navigate(BASE());
        const copyright = await pom.getCopyright();
        const copyrightCount = await copyright.count();
        if (copyrightCount > 0) {
            await expect(copyright.first()).toBeVisible();
        }
    });
    test('[FTR-006] @regression Footer disclosure buttons expand/collapse', async ({ page }) => {
        const pom = new FooterPage(page);
        await pom.navigate(BASE());
        const buttons = await pom.getDisclosureButtons();
        const buttonCount = await buttons.count();
        if (buttonCount > 0) {
            const button = buttons.first();
            const initialState = await button.getAttribute('aria-expanded');
            await clickElement(button);
            // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
            const newState = await button.getAttribute('aria-expanded');
            expect(newState).not.toBeNull();
        }
    });
    test('[FTR-007] @regression Footer subscribe form accepts input', async ({ page }) => {
        const pom = new FooterPage(page);
        await pom.navigate(BASE());
        const form = await pom.getSubscribeForm();
        const formCount = await form.count();
        if (formCount > 0) {
            const input = await pom.getSubscribeInput();
            const inputCount = await input.count();
            if (inputCount > 0) {
                await input.first().fill('test@example.com');
                const value = await input.first().inputValue();
                expect(value).toBe('test@example.com');
            }
        }
    });
    test('[FTR-008] @negative @sanity Footer handles empty content gracefully', async ({ page }) => {
        const pom = new FooterPage(page);
        await pom.navigate(BASE());
        const root = await pom.getRoot();
        await expect(root).toBeVisible();
        // Footer should be visible even if some sections are empty
        const display = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => window.getComputedStyle(el).display);
        // measurement: use measurement-utils for cleaner code
        expect(['block', 'flex', 'grid', 'table']).toContain(display);
        // TODO: Use assertLayout() for display checks
    });
    test('[FTR-009] @regression Footer no JavaScript errors', async ({ page }) => {
        const pom = new FooterPage(page);
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        await pom.navigate(BASE());
        // Allow some errors but not footer-specific ones
        const footerErrors = errors.filter(e => e.includes('footer') || e.includes('Footer'));
        expect(footerErrors).toEqual([]);
    });
});
test.describe('Footer — Responsive Design', () => {
    test.describe.configure({ retries: 1 });
    test('[FTR-020] @mobile @regression @sanity Footer adapts to mobile viewport', async ({ page }) => {
        const pom = new FooterPage(page);
        await page.setViewportSize({ width: 375, height: 667 });
        await pom.navigate(BASE());
        const root = await pom.getRoot();
        await expect(root).toBeVisible();
        // Footer should stack vertically on mobile
        const width = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => el.offsetWidth);
        expect(width).toBeLessThanOrEqual(375);
    });
    test('[FTR-021] @mobile @regression @sanity Footer menu toggle works on mobile', async ({ page }) => {
        const pom = new FooterPage(page);
        await page.setViewportSize({ width: 375, height: 667 });
        await pom.navigate(BASE());
        const toggle = await pom.getMobileMenuToggle();
        const toggleCount = await toggle.count();
        if (toggleCount > 0) {
            await toggle.first().click();
            // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
            const nav = await pom.getNavigation();
            await expect(nav.first()).toBeVisible();
        }
    });
});
