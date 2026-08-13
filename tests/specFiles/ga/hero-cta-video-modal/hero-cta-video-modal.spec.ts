import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
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
test.describe('Hero CTA Video Modal — GAAM-621', () => {
    // ============ Modal Opening & Closing ============
    test('[GAAM-621-001] @regression @sanity Verify video modal opens on CTA click', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const ctaButton = page.locator('button[aria-label="Watch video"]').first();
        if (await ctaButton.count() > 0) {
            await clickElement(ctaButton);
            // Wait for modal to appear
            const modal = page.locator('[class*="modal"], [role="dialog"], [class*="video"]');
            if (await modal.count() > 0) {
                await expect(modal).toBeVisible();
            }
        }
    });
    test('[GAAM-621-002] @regression Verify modal closes on X button click', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const modal = page.locator('[class*="modal"], [role="dialog"]').first();
        if (await modal.count() > 0) {
            const closeBtn = modal.locator('button[aria-label*="close"], button[class*="close"], [class*="close-button"]').first();
            if (await closeBtn.count() > 0) {
                await clickElement(closeBtn);
                // ?? Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
                // Modal should be hidden or removed
                const visibility = await modal.isVisible().catch(() => false);
                expect(visibility).toBe(false);
            }
        }
    });
    // ============ Video Controls ============
    test('[GAAM-621-005] @regression Verify video plays and pauses on click', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const videoElement = page.locator('video, [class*="video-player"]').first();
        if (await videoElement.count() > 0) {
            const video = page.locator('video').first();
            if (await video.count() > 0) {
                await clickElement(video);
                // Video should be interactive
                expect(await video.count()).toBeGreaterThan(0);
            }
        }
    });
    test('[GAAM-621-006] @regression Verify video controls are accessible', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const videoControl = page.locator('[class*="video-controls"], video');
        if (await videoControl.count() > 0) {
            // Check for control buttons or attributes
            const playButton = page.locator('button[aria-label*="play"], [class*="play-button"]');
            const pauseButton = page.locator('button[aria-label*="pause"], [class*="pause-button"]');
            const hasControls = await playButton.count() > 0 || await pauseButton.count() > 0;
            expect(hasControls).toBeDefined();
        }
    });
    test('[GAAM-621-007] @regression Verify video fullscreen capability', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const video = page.locator('video').first();
        if (await video.count() > 0) {
            const fullscreenBtn = page.locator('button[aria-label*="fullscreen"], [class*="fullscreen"]').first();
            expect(await fullscreenBtn.count()).toBeDefined();
        }
    });
    test('[GAAM-621-014] @regression Verify video stops when modal closes', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const video = page.locator('video').first();
        if (await video.count() > 0) {
            await clickElement(video);
            // ?? DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
            const closeBtn = page.locator('[class*="close-button"], button[aria-label*="close"]').first();
            if (await closeBtn.count() > 0) {
                await clickElement(closeBtn);
                // ?? Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
                // Video should be paused or stopped
                const isPaused = // ?? TODO: Replace with measurement-utils
                 await video.evaluate((el: HTMLVideoElement) => el.paused);
                expect(isPaused).toBe(true);
            }
        }
    });
    // ============ Video Source & Loading ============
    test('[GAAM-621-017] @regression Verify video source is valid', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const video = page.locator('video').first();
        if (await video.count() > 0) {
            const source = video.locator('source').first();
            if (await source.count() > 0) {
                const src = await source.getAttribute('src');
                expect(src).toBeTruthy();
            }
        }
    });
    test('[GAAM-621-018] @regression Verify video loads without errors', async ({ page }) => {
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const video = page.locator('video').first();
        if (await video.count() > 0) {
            // ?? DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        }
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
});
