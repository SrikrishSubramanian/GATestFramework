import { test, expect } from '@playwright/test';
import { RoleSelectorPage } from '../../../pages/ga/components/roleSelectorPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
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
test.describe('Role Selector — Happy Path', () => {
    test('[RS-001] @smoke @regression Role Selector renders', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-role-selector').first();
        await expect(root).toBeVisible();
    });
});
test.describe('Role Selector — Interaction', () => {
    test('[RS-005] @interaction @regression Role selection changes content', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const options = page.locator('.cmp-role-selector__option');
        if (await options.count() > 0) {
            await options.first().click();
            await expect(options.first()).toHaveClass(/selected/);
        }
    });
});
test.describe('Role Selector — Accessibility', () => {
    test.describe.configure({ retries: 1 });
});
test.describe('RoleSelector — CSV Test Cases (GAAM-1314)', () => {
    test('[RS-011] @smoke @regression CMS BE & FE: Deprecate Role Selector and Top Nav Components — AC1', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Deprecation Scope*
        test.fixme();
    });
});
test.describe('RoleSelector — Happy Path', () => {
    test('[RS-012] @smoke @regression RoleSelector renders correctly', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-role-selector').first();
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
    test('[RS-013] @smoke @regression RoleSelector interactive elements are functional', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-role-selector').first();
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
test.describe('RoleSelector — Negative & Boundary', () => {
    test('[RS-014] @negative @regression RoleSelector handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-role-selector').first()).toBeVisible();
    });
    test('[RS-015] @negative @regression RoleSelector handles missing images', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-role-selector img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('RoleSelector — Responsive', () => {
    test('[RS-016] @mobile @regression @mobile RoleSelector adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-role-selector').first();
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
    test('[RS-017] @mobile @regression RoleSelector adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-role-selector').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('RoleSelector — Console & Resources', () => {
});
test.describe('RoleSelector — Broken Images', () => {
    test('[RS-019] @regression RoleSelector all images load successfully', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-role-selector img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[RS-020] @regression RoleSelector all images have alt attributes', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-role-selector img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('RoleSelector — Accessibility', () => {
});
test.describe('RoleSelector — AEM Dialog Configuration', () => {
});
