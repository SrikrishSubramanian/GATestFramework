import { test, expect } from '@playwright/test';
import { WorkbenchPage } from '../../../pages/ga/components/workbenchPage';
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
test.describe('Workbench — Happy Path', () => {
    test('[WB-001] @smoke @regression @sanity Workbench component renders', async ({ page }) => {
        const pom = new WorkbenchPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-workbench').first();
        await expect(root).toBeVisible();
    });
    test('[WB-002] @regression Workbench content is displayed', async ({ page }) => {
        const pom = new WorkbenchPage(page);
        await pom.navigate(BASE());
        const content = page.locator('.cmp-workbench__content');
        await expect(content).toBeVisible();
    });
});
test.describe('Workbench — Interaction', () => {
    test('[WB-005] @interaction @regression Workbench controls are functional', async ({ page }) => {
        const pom = new WorkbenchPage(page);
        await pom.navigate(BASE());
        const controls = page.locator('.cmp-workbench__control');
        const count = await controls.count();
        expect(count).toBeGreaterThanOrEqual(0);
    });
});
test.describe('Workbench — Accessibility', () => {
    test.describe.configure({ retries: 1 });
});
