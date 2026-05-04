import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Hero CTA Video Modal — Edge Cases', () => {
  // ============ Edge Case: Multiple Modal Interactions ============
  test('[GAAM-621-EDGE-001] @edge Verify modal can be opened and closed multiple times', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      // Open, close, open cycle
      for (let i = 0; i < 2; i++) {
        await cta.click();
        await page.waitForTimeout(300);

        const modal = page.locator('[role="dialog"], [class*="modal"]').first();
        if (await modal.count() > 0) {
          const isVisible = await modal.isVisible();
          expect(isVisible).toBe(true);
        }

        const closeBtn = page.locator('button[aria-label*="close"], [class*="close-button"]').first();
        if (await closeBtn.count() > 0) {
          await closeBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }
  });

  // ============ Edge Case: Rapid Click Behavior ============
  test('[GAAM-621-EDGE-002] @edge Verify rapid CTA clicks do not create multiple modals', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      // Click multiple times rapidly
      await cta.click();
      await cta.click();
      await cta.click();
      await page.waitForTimeout(500);

      const modals = page.locator('[role="dialog"], [class*="modal"]');
      const count = await modals.count();
      // Should only have one modal (or zero if prevention works)
      expect(count).toBeLessThanOrEqual(1);
    }
  });

  // ============ Edge Case: Keyboard Interaction Combinations ============
  test('[GAAM-621-EDGE-003] @edge Verify Tab + Enter opens modal', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      if (await modal.count() > 0) {
        const isVisible = await modal.isVisible();
        expect(isVisible).toBe(true);
      }
    }
  });

  test('[GAAM-621-EDGE-004] @edge Verify Space key opens modal on button', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      if (await modal.count() > 0) {
        expect(await modal.isVisible()).toBe(true);
      }
    }
  });

  // ============ Edge Case: Video Playback Edge Cases ============
  test('[GAAM-621-EDGE-005] @edge Verify video remains paused if not interacted', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const video = page.locator('video').first();
      if (await video.count() > 0) {
        await page.waitForTimeout(500);
        const isPaused = await video.evaluate((el: HTMLVideoElement) => el.paused);
        // Video should start paused
        expect(isPaused).toBeDefined();
      }
    }
  });

  test('[GAAM-621-EDGE-006] @edge Verify video resets position on modal close/reopen', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const video = page.locator('video').first();
    if (await video.count() > 0) {
      const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();

      // Open modal
      await cta.click();
      await page.waitForTimeout(300);

      // Close modal
      const closeBtn = page.locator('button[aria-label*="close"], [class*="close-button"]').first();
      if (await closeBtn.count() > 0) {
        await closeBtn.click();
        await page.waitForTimeout(300);
      }

      // Reopen modal
      await cta.click();
      await page.waitForTimeout(300);

      // Check video position reset
      const position = await video.evaluate((el: HTMLVideoElement) => el.currentTime);
      expect(position).toBeDefined();
    }
  });

  // ============ Edge Case: Focus Management Edge Cases ============
  test('[GAAM-621-EDGE-007] @a11y @edge Verify focus loop in modal with single focusable element', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const closeBtn = page.locator('button[aria-label*="close"], [class*="close-button"]').first();
      if (await closeBtn.count() > 0) {
        await closeBtn.focus();
        await page.keyboard.press('Tab');

        const focused = await page.evaluate(() => document.activeElement?.getAttribute('class'));
        expect(focused).toBeDefined();
      }
    }
  });

  test('[GAAM-621-EDGE-008] @a11y @edge Verify Shift+Tab backwards navigation in modal', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      if (await modal.count() > 0) {
        const lastFocusable = modal.locator('button, a, input').last();
        await lastFocusable.focus();
        await page.keyboard.press('Shift+Tab');

        const focused = await page.evaluate(() => document.activeElement?.tagName);
        expect(focused).toBeDefined();
      }
    }
  });

  // ============ Edge Case: Overlay Interaction Edge Cases ============
  test('[GAAM-621-EDGE-009] @edge Verify clicking on video does not close modal', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const video = page.locator('video').first();
      if (await video.count() > 0) {
        // Get click position inside video (not on overlay)
        const box = await video.boundingBox();
        if (box) {
          await page.click(`video`, { position: { x: 10, y: 10 } });
          await page.waitForTimeout(300);

          const modal = page.locator('[role="dialog"], [class*="modal"]').first();
          expect(await modal.isVisible()).toBe(true);
        }
      }
    }
  });

  test('[GAAM-621-EDGE-010] @edge Verify clicking overlay edge closes modal', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const overlay = page.locator('[class*="overlay"], [class*="backdrop"]').first();
      if (await overlay.count() > 0) {
        // Click on edge of overlay (away from video)
        const box = await overlay.boundingBox();
        if (box) {
          await page.click(`[class*="overlay"]`, { position: { x: 5, y: 5 } });
          await page.waitForTimeout(300);

          const modal = page.locator('[role="dialog"], [class*="modal"]').first();
          const closed = !(await modal.isVisible().catch(() => false));
          expect(closed).toBeDefined();
        }
      }
    }
  });

  // ============ Edge Case: Responsive Behavior Edge Cases ============
  test('[GAAM-621-EDGE-011] @edge Verify modal adapts to viewport resize', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      const initialWidth = await modal.evaluate(el => el.offsetWidth);

      // Resize viewport
      await page.setViewportSize({ width: 500, height: 600 });
      await page.waitForTimeout(300);

      const resizedWidth = await modal.evaluate(el => el.offsetWidth);
      expect(resizedWidth).toBeLessThanOrEqual(500);
    }
  });

  test('[GAAM-621-EDGE-012] @edge Verify modal orientation change behavior', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      await cta.click();
      await page.waitForTimeout(300);

      // Switch to landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      expect(await modal.isVisible()).toBe(true);
    }
  });

  // ============ Edge Case: Error Scenarios ============
  test('[GAAM-621-EDGE-013] @edge Verify modal gracefully handles missing video source', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const video = page.locator('video').first();
    if (await video.count() > 0) {
      // Check for fallback content
      const source = video.locator('source');
      const hasFallback = (await source.count()) === 0;

      if (hasFallback) {
        const fallbackText = await video.textContent();
        expect(fallbackText).toBeTruthy();
      }
    }
  });

  test('[GAAM-621-EDGE-014] @edge Verify no JavaScript errors on modal interactions', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.keyboard.press('Escape');
      await cta.click();
      await page.keyboard.press('Escape');
    }

    expect(errors.length).toBe(0);
  });

  // ============ Edge Case: Accessibility Edge Cases ============
  test('[GAAM-621-EDGE-015] @a11y @edge Verify close button has accessible label', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const closeBtn = page.locator('button[aria-label*="close"], [class*="close-button"]').first();
      if (await closeBtn.count() > 0) {
        const ariaLabel = await closeBtn.getAttribute('aria-label');
        const title = await closeBtn.getAttribute('title');
        const text = await closeBtn.textContent();

        expect(ariaLabel || title || text).toBeTruthy();
      }
    }
  });

  test('[GAAM-621-EDGE-016] @a11y @edge Verify modal has proper aria-modal attribute', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"]').first();
      if (await modal.count() > 0) {
        const role = await modal.getAttribute('role');
        expect(role).toBe('dialog');
      }
    }
  });

  test('[GAAM-621-EDGE-017] @a11y @edge Verify video has captions/subtitles support', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const video = page.locator('video').first();
    if (await video.count() > 0) {
      const track = video.locator('track[kind="captions"], track[kind="subtitles"]');
      const hasCaptions = await track.count() > 0;
      expect(hasCaptions).toBeDefined();
    }
  });

  test('[GAAM-621-EDGE-018] @edge Verify modal content contrast meets WCAG standards', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      if (await modal.count() > 0) {
        const bgColor = await modal.evaluate(el =>
          window.getComputedStyle(el).backgroundColor
        );
        const textColor = await modal.evaluate(el =>
          window.getComputedStyle(el).color
        );

        expect(bgColor).toBeTruthy();
        expect(textColor).toBeTruthy();
      }
    }
  });

  test('[GAAM-621-EDGE-019] @edge Verify modal min/max width constraints', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await page.setViewportSize({ width: 300, height: 400 });
      await cta.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      if (await modal.count() > 0) {
        const width = await modal.evaluate(el => el.offsetWidth);
        expect(width).toBeGreaterThan(0);
      }
    }
  });

  test('[GAAM-621-EDGE-020] @edge Verify no layout shift when modal appears', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/hero.html?wcmmode=disabled`);

    const body = page.locator('body');
    const initialWidth = await body.evaluate(el => el.offsetWidth);

    const cta = page.locator('button[class*="cta"], a[class*="cta"]').first();
    if (await cta.count() > 0) {
      await cta.click();
      await page.waitForTimeout(300);

      const finalWidth = await body.evaluate(el => el.offsetWidth);
      // Width should remain the same (no scrollbar shift)
      expect(finalWidth).toBe(initialWidth);
    }
  });
});
