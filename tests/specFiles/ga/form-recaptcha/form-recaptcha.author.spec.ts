import { test, expect } from '@playwright/test';
import { FormRecaptchaPage } from '../../../pages/ga/components/formRecaptchaPage';
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
test.describe('Form reCAPTCHA — Happy Path', () => {
    test('[RECAP-001] @smoke @regression @sanity reCAPTCHA field renders', async ({ page }) => {
        const pom = new FormRecaptchaPage(page);
        await pom.navigate(BASE());
        // This site renders Google's invisible reCAPTCHA variant (data-size="invisible"),
        // so it is attached to the DOM but never visually visible — that's expected.
        const root = page.locator('.cmp-recaptcha').first();
        await expect(root).toBeAttached();
    });
    test('[RECAP-002] @regression reCAPTCHA container is present', async ({ page }) => {
        const pom = new FormRecaptchaPage(page);
        await pom.navigate(BASE());
        const captcha = page.locator('.g-recaptcha, [data-sitekey]');
        expect(await captcha.count()).toBeGreaterThan(0);
    });
});
test.describe('Form reCAPTCHA — Accessibility', () => {
    test.describe.configure({ retries: 1 });
});
