import { test, expect } from '@playwright/test';
import { TopNavPage } from '../../../pages/ga/components/topNavPage';
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
test.describe('Top Nav — Happy Path', () => {
    test('[TN-001] @smoke @regression Top Navigation renders', async ({ page }) => {
        const pom = new TopNavPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-site-header__top-nav').first();
        await expect(root).toBeVisible();
    });
    test('[TN-002] @regression Navigation items are visible', async ({ page }) => {
        const pom = new TopNavPage(page);
        await pom.navigate(BASE());
        const items = page.locator('.cmp-site-header__top-nav-item');
        const count = await items.count();
        expect(count).toBeGreaterThan(0);
    });
});
test.describe('Top Nav — Interaction', () => {
    test('[TN-005] @interaction @regression Top nav items are clickable', async ({ page }) => {
        const pom = new TopNavPage(page);
        await pom.navigate(BASE());
        const items = page.locator('.cmp-site-header__top-nav-item');
        if (await items.count() > 0) {
            await expect(items.first()).toBeEnabled();
        }
    });
});
test.describe('Top Nav — Accessibility', () => {
    test.describe.configure({ retries: 1 });
});
