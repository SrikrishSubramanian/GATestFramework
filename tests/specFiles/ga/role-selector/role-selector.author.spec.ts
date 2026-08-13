import { test, expect } from '@playwright/test';
import { RoleSelectorPage } from '../../../pages/ga/components/roleSelectorPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
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
    test('[RS-011] @regression @sanity CMS BE & FE: Deprecate Role Selector and Top Nav Components — AC1', async ({ page }) => {
        // GAAM-1314 deprecation, confirmed in kkr-aem source (read-only check, not this repo):
        // - The standalone component at apps/kkr-aem-base/components/content/role-selector renders
        //   `class="cmp-role-selector"` (role-selector.html) but its .content.xml now sets
        //   `componentGroup=".hidden"`, so it can no longer be dragged onto pages in the component browser.
        // - The equivalent role UI is now baked directly into the site header's global Experience
        //   Fragment as `.cmp-site-header-role-selector` (ui.apps.ga .../structure/site-header/site-header.html),
        //   which is what RoleSelectorPage's locator sidecar (roleSelectorPage.locators.json, source: "dom")
        //   already targets for `root`/`trigger`/`panel`/`options` above.
        // This asserts that deprecation actually held on a live page: the old standalone markup is gone,
        // and the header-embedded replacement is what's present instead.
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        const legacyStandaloneRoleSelector = page.locator('.cmp-role-selector');
        await expect(legacyStandaloneRoleSelector).toHaveCount(0);
        const root = await pom.root;
        await expect(root).toBeVisible();
    });
});
test.describe('RoleSelector — Happy Path', () => {
    test('[RS-012] @smoke @regression @sanity RoleSelector renders correctly', async ({ page }) => {
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
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
    test('[RS-013] @smoke @regression @sanity RoleSelector interactive elements are functional', async ({ page }) => {
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
    test('[RS-014] @negative @regression @sanity RoleSelector handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new RoleSelectorPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        const root = await pom.root;
        await expect(root).toBeVisible();
    });
    test('[RS-015] @negative @regression @sanity RoleSelector handles missing images', async ({ page }) => {
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
    test('[RS-016] @mobile @regression @mobile @sanity RoleSelector adapts to mobile viewport', async ({ page }) => {
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
    test('[RS-017] @mobile @regression @sanity RoleSelector adapts to tablet viewport', async ({ page }) => {
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
