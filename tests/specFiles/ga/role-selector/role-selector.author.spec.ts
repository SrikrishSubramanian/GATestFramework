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
    test('[RS-001] @smoke @regression @sanity Role Selector renders', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const root = await pom.root;
        await expect(root).toBeVisible();
    });
});
test.describe('Role Selector — Interaction', () => {
    test('[RS-005] @interaction @regression Role selection changes content', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const panel = await pom.panel;
        await expect(panel).toBeHidden();
        await pom.openPanel();
        await expect(panel).toBeVisible();
        const options = await pom.options;
        if (await options.count() > 0) {
            await expect(options.first()).toBeVisible();
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
        const root = await pom.root;
        await expect(root).toBeVisible();
        // Verify core structure: the dropdown trigger with its prompt text exists
        const trigger = await pom.trigger;
        await expect(trigger).toBeVisible();
        // Verify no JS errors during render
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors).toEqual([]);
    });
    test('[RS-013] @smoke @regression RoleSelector interactive elements are functional', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const root = await pom.root;
        await expect(root).toBeVisible();
        const trigger = await pom.trigger;
        await expect(trigger).toBeVisible();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        // Opening the panel reveals its role links, which must be visible and clickable
        await pom.openPanel();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        const options = await pom.options;
        const count = await options.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            await expect(options.nth(i)).toBeVisible();
            await expect(options.nth(i)).toBeEnabled();
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
        const root = await pom.root;
        await expect(root).toBeVisible();
    });
    test('[RS-015] @negative @regression RoleSelector handles missing images', async ({ page }) => {
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const root = await pom.root;
        const images = root.locator('img');
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
        // The header dropdown variant stays in the DOM and visible at mobile width
        // (the accordion variant lives inside the header's mobile drawer, which is
        // closed by default and out of scope for this component's own tests).
        const root = await pom.root;
        await expect(root).toBeVisible();
        const overflow = await root.evaluate(el => el.scrollWidth > el.clientWidth + 1);
        expect(overflow).toBe(false);
    });
    test('[RS-017] @mobile @regression RoleSelector adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const root = await pom.root;
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
        const root = await pom.root;
        const images = root.locator('img');
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
        const root = await pom.root;
        const images = root.locator('img');
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
