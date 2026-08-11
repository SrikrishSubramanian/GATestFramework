import { test, expect } from '@playwright/test';
import { FormContainerPage } from '../../../pages/ga/components/formContainerPage';
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
test.describe('Form Container — Happy Path', () => {
    test('[FC-001] @smoke @regression @sanity Form Container renders', async ({ page }) => {
        const pom = new FormContainerPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-form').first();
        await expect(root).toBeVisible();
    });
    test('[FC-002] @regression Form element is present', async ({ page }) => {
        const pom = new FormContainerPage(page);
        await pom.navigate(BASE());
        const form = page.locator('form.cmp-form').first();
        await expect(form).toBeVisible();
    });
});
test.describe('Form Container — Accessibility', () => {
    test.describe.configure({ retries: 1 });
});
// Relocated from text.author.spec.ts (TEXT-020) — CSV import mis-bucketed this under Text;
// it's explicitly about the Form Container component's dialog.
test.describe('Form Container — CSV Test Cases (GAAM-1308)', () => {
    test('[FC-003] @smoke @regression CMS BE: Form Container — Marketo Illustrations Action Type — AC1', async ({ page }) => {
        const pom = new FormContainerPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Dialog Structure*
        test.fixme();
    });
});
