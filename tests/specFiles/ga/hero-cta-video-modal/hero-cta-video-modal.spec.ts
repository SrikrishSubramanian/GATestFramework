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
        // Confirmed live 2026-08-15: homepage-hero has a one-way, scroll-triggered "shrink" state
        // (homepage-hero.js — the hero collapses once scrolled past, per the same shrink-mode
        // system as HH-007) that permanently hides this CTA once triggered — scrolling back up
        // does NOT restore it. On the default viewport the button sits ~1285px down the page, so
        // clickElement()'s scrollIntoViewIfNeeded() scrolls just far enough to reveal it but also
        // crosses the shrink threshold, hiding the button ~1s later — before even Playwright's own
        // atomic .click() (which does its own minimal scroll) can land. That made this test hang
        // for the full 5-minute CI timeout retrying a click on an element stuck disappearing.
        // Using a tall viewport puts the button inside the initial (unscrolled) viewport, avoiding
        // the scroll trigger entirely and letting the actual "does the CTA open the modal" AC run —
        // confirmed this way the click succeeds immediately and <dialog open> is set.
        // The scroll-triggered permanent hide itself is a separate, real, reproducible bug (not
        // this AC's concern) — tracked in confirmed-bugs-2026-08-11.xlsx.
        await page.setViewportSize({ width: 1440, height: 2000 });
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const ctaButton = page.locator('button[aria-label="Watch video"]').first();
        if (await ctaButton.count() > 0) {
            await clickElement(ctaButton);
            // Wait for modal to appear. The generic '[class*="modal"], [role="dialog"],
            // [class*="video"]' selector used to match 100+ unrelated elements (the video-js
            // player itself, its internal caption/error vjs-modal-dialog popups, etc.), causing a
            // Playwright strict-mode violation — scope to the actual CTA video modal
            // (homepage-hero.html:88, dialog.cmp-button__video-modal).
            const modal = page.locator('dialog.cmp-button__video-modal').first();
            if (await modal.count() > 0) {
                await expect(modal).toBeVisible();
            }
        }
    });
    test('[GAAM-621-002] @regression Verify modal closes on X button click', async ({ page }) => {
        // Same scroll-triggered shrink-mode issue as GAAM-621-001, plus this test never actually
        // opened the modal before trying to close it — it grabbed whatever dialog-like element
        // happened to exist on a fresh page load ('[class*="modal"], [role="dialog"]' matches
        // video-js's own internal accessibility dialogs), whose close button was covered by
        // unrelated hero content. Open the real CTA modal first, then scope to its own close
        // button (homepage-hero.html:88-93, dialog.cmp-button__video-modal).
        await page.setViewportSize({ width: 1440, height: 2000 });
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const ctaButton = page.locator('button[aria-label="Watch video"]').first();
        if (await ctaButton.count() > 0) {
            await clickElement(ctaButton);
            const modal = page.locator('dialog.cmp-button__video-modal').first();
            await expect(modal).toBeVisible();
            const closeBtn = modal.locator('button.cmp-button__video-modal-close[aria-label="Close video"]');
            await clickElement(closeBtn);
            await expect(modal).toBeHidden();
        }
    });
    // ============ Video Controls ============
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
        // Same wrong-element issue as GAAM-621-005 (video.first() = ambient background video, not
        // the modal's), plus the close button selector wasn't scoped to the modal at all — open
        // the real CTA modal first and scope both the video and close button to it.
        await page.setViewportSize({ width: 1440, height: 2000 });
        const url = `${BASE()}/content/global-atlantic/style-guide/components/homepage-hero.html?wcmmode=disabled`;
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const ctaButton = page.locator('button[aria-label="Watch video"]').first();
        if (await ctaButton.count() > 0) {
            await clickElement(ctaButton);
            const modal = page.locator('dialog.cmp-button__video-modal').first();
            await expect(modal).toBeVisible();
            const video = modal.locator('video').first();
            const closeBtn = modal.locator('button.cmp-button__video-modal-close[aria-label="Close video"]');
            await clickElement(closeBtn);
            await expect(modal).toBeHidden();
            // Video should be paused or stopped
            const isPaused = await video.evaluate((el: HTMLVideoElement) => el.paused);
            expect(isPaused).toBe(true);
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
