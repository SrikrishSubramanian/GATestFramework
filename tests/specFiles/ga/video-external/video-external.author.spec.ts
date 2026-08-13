import { test, expect } from '@playwright/test';
import { VideoExternalPage } from '../../../pages/ga/components/videoExternalPage';
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
test.describe('Video External — Happy Path', () => {
    test('[VE-001] @smoke @regression @sanity External Video renders', async ({ page }) => {
        const pom = new VideoExternalPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-video-external').first();
        await expect(root).toBeVisible();
    });
    test('[VE-002] @regression Video container is present', async ({ page }) => {
        const pom = new VideoExternalPage(page);
        await pom.navigate(BASE());
        // Verified live 2026-08-12: `.cmp-video-external__container` never existed in the real
        // DOM — it was a guessed selector. The actual poster/thumbnail container is `__image-box`.
        const container = page.locator('.cmp-video-external__image-box').first();
        await expect(container).toBeVisible();
    });
});
test.describe('Video External — Responsive', () => {
    test.describe.configure({ retries: 1 });
    test('[VE-006] @mobile @regression @sanity Video adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        const pom = new VideoExternalPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-video-external').first();
        await expect(root).toBeVisible();
    });
});
test.describe('Video External — Accessibility', () => {
    test.describe.configure({ retries: 1 });
});
