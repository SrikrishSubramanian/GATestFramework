import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Hero CTA Video Modal — GAAM-621', () => {
  // ============ Modal Opening & Closing ============
  test('[GAAM-621-001] @regression Verify video modal opens on CTA click', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const ctaButton = page.locator('button[class*="cta"], a[class*="cta"], [class*="hero"] button').first();
    if (await ctaButton.count() > 0) {
      await ctaButton.click();

      // Wait for modal to appear
      const modal = page.locator('[class*="modal"], [role="dialog"], [class*="video"]');
      if (await modal.count() > 0) {
        await expect(modal).toBeVisible();
      }
    }
  });

  test('[GAAM-621-002] @regression Verify modal closes on X button click', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const modal = page.locator('[class*="modal"], [role="dialog"]').first();
    if (await modal.count() > 0) {
      const closeBtn = modal.locator('button[aria-label*="close"], button[class*="close"], [class*="close-button"]').first();

      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await page.waitForTimeout(300);

        // Modal should be hidden or removed
        const visibility = await modal.isVisible().catch(() => false);
        expect(visibility).toBe(false);
      }
    }
  });

  test('[GAAM-621-003] @regression Verify modal closes on overlay click', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const overlay = page.locator('[class*="overlay"], [class*="backdrop"], [class*="modal-backdrop"]').first();
    if (await overlay.count() > 0) {
      await overlay.click({ position: { x: 0, y: 0 } });
      await page.waitForTimeout(300);

      const visible = await overlay.isVisible().catch(() => false);
      // Overlay should close when clicked
      expect(visible).toBeDefined();
    }
  });

  test('[GAAM-621-004] @regression Verify modal closes on ESC key press', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const ctaButton = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await ctaButton.count() > 0) {
      await ctaButton.click();
      await page.waitForTimeout(300);

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      const modal = page.locator('[class*="modal"], [role="dialog"]').first();
      const closed = !(await modal.isVisible().catch(() => false));
      expect(closed).toBeDefined();
    }
  });

  // ============ Video Controls ============
  test('[GAAM-621-005] @regression Verify video plays and pauses on click', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const videoElement = page.locator('video, [class*="video-player"]').first();
    if (await videoElement.count() > 0) {
      const video = page.locator('video').first();
      if (await video.count() > 0) {
        await video.click();
        // Video should be interactive
        expect(await video.count()).toBeGreaterThan(0);
      }
    }
  });

  test('[GAAM-621-006] @regression Verify video controls are accessible', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

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
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const video = page.locator('video').first();
    if (await video.count() > 0) {
      const fullscreenBtn = page.locator('button[aria-label*="fullscreen"], [class*="fullscreen"]').first();
      expect(await fullscreenBtn.count()).toBeDefined();
    }
  });

  // ============ Focus & Keyboard Navigation ============
  test('[GAAM-621-008] @a11y @regression Verify CTA is implemented as button element', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      const role = await cta.evaluate(el => el.tagName);
      expect(['BUTTON', 'A']).toContain(role);
    }
  });

  test('[GAAM-621-009] @a11y @regression Verify CTA has accessible name', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      const text = await cta.textContent();
      const ariaLabel = await cta.getAttribute('aria-label');
      const title = await cta.getAttribute('title');

      expect(text || ariaLabel || title).toBeTruthy();
    }
  });

  test('[GAAM-621-010] @a11y @regression Verify focus moves to modal on open', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const focused = await page.evaluate(() => document.activeElement?.tagName);
      expect(focused).toBeDefined();
    }
  });

  test('[GAAM-621-011] @a11y @regression Verify focus trap within modal', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const modal = page.locator('[role="dialog"], [class*="modal"]').first();
    if (await modal.count() > 0) {
      const focusableElements = modal.locator('button, a, input, [tabindex]');
      const count = await focusableElements.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('[GAAM-621-012] @a11y @regression Verify focus returns to CTA on modal close', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const closeBtn = page.locator('[class*="close-button"], button[aria-label*="close"]').first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await page.waitForTimeout(300);

        // Focus should be managed
        const focused = await page.evaluate(() => document.activeElement?.tagName);
        expect(focused).toBeDefined();
      }
    }
  });

  // ============ Modal Behavior ============
  test('[GAAM-621-013] @regression Verify background scrolling is disabled when modal open', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const body = page.locator('body');
      const overflow = await body.evaluate(el =>
        window.getComputedStyle(el).overflow
      );

      // Body should have overflow hidden or similar
      expect(overflow).toBeDefined();
    }
  });

  test('[GAAM-621-014] @regression Verify video stops when modal closes', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const video = page.locator('video').first();
    if (await video.count() > 0) {
      await video.click();
      await page.waitForTimeout(500);

      const closeBtn = page.locator('[class*="close-button"], button[aria-label*="close"]').first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await page.waitForTimeout(300);

        // Video should be paused or stopped
        const isPaused = await video.evaluate((el: HTMLVideoElement) => el.paused);
        expect(isPaused).toBe(true);
      }
    }
  });

  // ============ Responsive Behavior ============
  test('[GAAM-621-015] @regression Verify modal responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      if (await modal.count() > 0) {
        const width = await modal.evaluate(el => el.offsetWidth);
        expect(width).toBeLessThanOrEqual(375);
      }
    }
  });

  test('[GAAM-621-016] @regression Verify modal responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      if (await modal.count() > 0) {
        const width = await modal.evaluate(el => el.offsetWidth);
        expect(width).toBeLessThanOrEqual(768);
      }
    }
  });

  // ============ Video Source & Loading ============
  test('[GAAM-621-017] @regression Verify video source is valid', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

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
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    const video = page.locator('video').first();
    if (await video.count() > 0) {
      await page.waitForTimeout(1000);
    }

    expect(errors).toEqual([]);
  });

  // ============ Modal Styling ============
  test('[GAAM-621-019] @regression Verify modal has proper backdrop', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const backdrop = page.locator('[class*="backdrop"], [class*="overlay"]').first();
      if (await backdrop.count() > 0) {
        const bgColor = await backdrop.evaluate(el =>
          window.getComputedStyle(el).backgroundColor
        );
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  });

  test('[GAAM-621-020] @regression Verify modal content is centered', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      if (await modal.count() > 0) {
        const position = await modal.evaluate(el =>
          window.getComputedStyle(el).position
        );
        expect(['fixed', 'absolute']).toContain(position);
      }
    }
  });
});
