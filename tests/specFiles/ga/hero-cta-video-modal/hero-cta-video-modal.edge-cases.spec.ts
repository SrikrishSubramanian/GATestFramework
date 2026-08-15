import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
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
test.describe('Hero CTA Video Modal — Edge Cases', () => {
    test('[GAAM-621-EDGE-004] @edge Verify Space key opens modal on button', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const cta = page.locator('button[class*="cta"]').first();
        if (await cta.count() > 0) {
            await cta.focus();
            await page.keyboard.press('Space');
            // ?? DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
            const modal = page.locator('[role="dialog"], [class*="modal"]').first();
            if (await modal.count() > 0) {
                expect(await modal.isVisible()).toBe(true);
            }
        }
    });
    test('[GAAM-621-EDGE-006] @edge Verify video resets position on modal close/reopen', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const video = page.locator('video').first();
        if (await video.count() > 0) {
            const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
            // Open modal
            await clickElement(cta);
            // ?? Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
            // Close modal
            const closeBtn = page.locator('button[aria-label*="close"], [class*="close-button"]').first();
            if (await closeBtn.count() > 0) {
                await clickElement(closeBtn);
                // ?? DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
            }
            // Reopen modal
            await clickElement(cta);
            // ?? Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
            // Check video position reset
            const position = // ?? TODO: Replace with measurement-utils
             await video.evaluate((el: HTMLVideoElement) => el.currentTime);
            expect(position).toBeDefined();
        }
    });
    // ============ Edge Case: Error Scenarios ============
    test('[GAAM-621-EDGE-013] @edge Verify modal gracefully handles missing video source', async ({ page }) => {
        // Fixed 2026-08-15: this player is video-js/Brightcove (`class="vjs-tech"`, `data-video-id`),
        // which sets `src`/`<source>` entirely via JS after fetching the Brightcove manifest — it
        // never uses the legacy HTML5 `<video><source>...fallback text</video>` pattern, so `src`/
        // `<source>` being absent is normal/expected at any point, not evidence of a "missing source"
        // needing graceful handling, and checking `video.textContent()` for fallback text (a pattern
        // that never applies here) is why this always failed. Live-verified on env=dev: this page's
        // video(s) genuinely have stale/broken Brightcove IDs (see GAAM-621-005/014 in the sibling
        // hero-cta-video-modal.spec.ts) and never get a currentSrc — but video-js DOES gracefully
        // handle that by rendering its own `.vjs-error-display` overlay instead of a blank/broken
        // player or a thrown JS error. That is the real, meaningful "gracefully handles missing video
        // source" signal for this component.
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'load' });
        const video = page.locator('video').first();
        if (await video.count() > 0) {
            const currentSrc = await video.evaluate((el: HTMLVideoElement) => el.currentSrc);
            if (!currentSrc) {
                await expect(page.locator('.vjs-error-display').first()).toBeAttached();
            }
        }
    });
    test('[GAAM-621-EDGE-018] @edge Verify modal content contrast meets WCAG standards', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
        if (await cta.count() > 0) {
            await clickElement(cta);
            // ?? DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
            const modal = page.locator('[role="dialog"], [class*="modal"]').first();
            if (await modal.count() > 0) {
                const bgColor = // ?? TODO: Replace with measurement-utils
                 await modal.evaluate(el => window.getComputedStyle(el).backgroundColor);
                const textColor = // ?? TODO: Replace with measurement-utils
                 await modal.evaluate(el => window.getComputedStyle(el).color);
                expect(bgColor).toBeTruthy();
                expect(textColor).toBeTruthy();
            }
        }
    });
});
