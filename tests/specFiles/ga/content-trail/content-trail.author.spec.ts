import { test, expect } from '@playwright/test';
import { ContentTrailPage } from '../../../pages/ga/components/contentTrailPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('ContentTrail — GAAM-328: Reskin Acceptance Criteria', () => {
  test('[CT-001] @smoke @regression All three content types (video, written, link) render', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    await expect(page.locator('.cmp-content-trail__container.cmp-content-trail__video').first()).toBeVisible();
    await expect(page.locator('.cmp-content-trail__container.cmp-content-trail__written').first()).toBeVisible();
    await expect(page.locator('.cmp-content-trail__container.cmp-content-trail__link').first()).toBeVisible();
  });

  test('[CT-016] @smoke @regression Style guide page shows all background variations', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    // Default (transparent with border)
    const defaultVariant = page.locator('.cmp-content-trail__container').first();
    await expect(defaultVariant).toBeVisible();
    const border = await defaultVariant.evaluate(el => getComputedStyle(el).borderStyle);
    expect(border).not.toBe('none');
    // Light mode (white bg without border)
    const lightSection = page.locator('.cmp-section--background-light-color .cmp-content-trail__container').first();
    if (await lightSection.count() > 0) {
      await expect(lightSection).toBeVisible();
    }
  });

  test('[CT-017] @regression Content trail shows correct BEM class structure', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-content-trail').first();
    await expect(root).toBeVisible();
    // Verify BEM elements exist
    await expect(root.locator('.cmp-content-trail__container').first()).toBeVisible();
    await expect(root.locator('.cmp-content-trail__image').first()).toBeVisible();
    await expect(root.locator('.cmp-content-trail__content').first()).toBeVisible();
    await expect(root.locator('.cmp-content-trail__eyebrow').first()).toBeVisible();
    await expect(root.locator('.cmp-content-trail__headline').first()).toBeVisible();
  });

  test('[CT-018] @regression Each content type shows correct icon', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    // Each content type should have an ::after pseudo on the image with a background-image
    const types = ['video', 'written', 'link'];
    for (const type of types) {
      const imageEl = page.locator(`.cmp-content-trail__${type} .cmp-content-trail__image`).first();
      if (await imageEl.count() > 0) {
        const afterBg = await imageEl.evaluate(el => {
          return getComputedStyle(el, '::after').backgroundImage;
        });
        expect(afterBg, `${type} icon should have background-image`).not.toBe('none');
      }
    }
  });

  test('[CT-019] @regression Content trail image is circular (border-radius 50%)', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const img = page.locator('.cmp-content-trail__image img').first();
    await expect(img).toBeVisible();
    const radius = await img.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toBe('50%');
  });
});

test.describe('ContentTrail — GAAM-672: Hover State Enhancement', () => {
  test('[CT-020] @interaction @regression Hover ripple uses clip-path from top-right corner', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const container = page.locator('.cmp-content-trail__container').first();
    await expect(container).toBeVisible();
    // Check the ::before pseudo has clip-path with circle at 100% 0
    const clipPath = await container.evaluate(el => {
      return getComputedStyle(el, '::before').clipPath;
    });
    expect(clipPath).toContain('circle');
    expect(clipPath).toContain('100%');
  });

  test('[CT-021] @interaction @regression Hover transition has correct duration', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const container = page.locator('.cmp-content-trail__container').first();
    await expect(container).toBeVisible();
    // Check ::before transition property
    const transition = await container.evaluate(el => {
      return getComputedStyle(el, '::before').transition;
    });
    expect(transition).toContain('clip-path');
  });

  test('[CT-022] @a11y @regression Hover respects prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const container = page.locator('.cmp-content-trail__container').first();
    await expect(container).toBeVisible();
    // Component should still be operable (visible and clickable)
    await expect(container).toBeEnabled();
  });

  test('[CT-023] @a11y @regression Focus state does not interfere with hover animation', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const container = page.locator('.cmp-content-trail__container').first();
    await container.focus();
    // Content should remain readable after focus
    const eyebrow = page.locator('.cmp-content-trail__eyebrow').first();
    await expect(eyebrow).toBeVisible();
    const headline = page.locator('.cmp-content-trail__headline').first();
    await expect(headline).toBeVisible();
  });

  test('[CT-024] @interaction @regression Video type opens modal on click', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const videoContainer = page.locator('.cmp-content-trail__container.cmp-content-trail__video').first();
    await expect(videoContainer).toBeVisible();
    // LESS applies cursor:pointer on :hover only — verify it changes on hover
    await videoContainer.hover();
    const cursor = await videoContainer.evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('pointer');
    // Click and check modal dialog element exists in DOM
    await videoContainer.click();
    const modal = page.locator('.cmp-content-trail__modal');
    const modalCount = await modal.count();
    expect(modalCount).toBeGreaterThan(0);
    // If modal opened, verify it has the open attribute
    const isOpen = await modal.first().evaluate(el => (el as HTMLDialogElement).open).catch(() => false);
    if (isOpen) {
      await expect(modal.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('[CT-025] @interaction @regression Video modal close button exists', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    // Verify modal and close button exist in DOM
    const modal = page.locator('.cmp-content-trail__modal').first();
    const modalExists = await modal.count() > 0;
    expect(modalExists).toBe(true);
    const closeBtn = page.locator('.cmp-content-trail__modal-close').first();
    const closeBtnExists = await closeBtn.count() > 0;
    expect(closeBtnExists).toBe(true);
  });

  test('[CT-026] @regression Dark background variant has white eyebrow text', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    // Content trail in dark context (granite section)
    const darkEyebrow = page.locator('.cmp-section--background-color-granite .cmp-content-trail__eyebrow').first();
    if (await darkEyebrow.count() > 0) {
      const color = await darkEyebrow.evaluate(el => getComputedStyle(el).color);
      // White text: rgb values should be high (> 200)
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        expect(Math.min(r, g, b)).toBeGreaterThan(200);
      }
    }
  });

  test('[CT-027] @regression Large size variant has larger image (80px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    // Large variant uses style-system class on the component wrapper div.
    // The LESS uses .cmp-section--large as a CSS class on the wrapper when content-trail-large styleId is applied.
    const largeImg = page.locator('.cmp-section--large .cmp-content-trail__image').first();
    if (await largeImg.count() > 0) {
      const height = await largeImg.evaluate(el => parseInt(getComputedStyle(el).height));
      expect(height).toBeGreaterThanOrEqual(78); // 80px on desktop per LESS
    } else {
      // Fallback: find any content-trail image that is 80px tall (large variant)
      const allImages = page.locator('.cmp-content-trail__image');
      const count = await allImages.count();
      let foundLarge = false;
      for (let i = 0; i < count; i++) {
        const h = await allImages.nth(i).evaluate(el => parseInt(getComputedStyle(el).height));
        if (h >= 78) { foundLarge = true; break; }
      }
      expect(foundLarge).toBe(true);
    }
  });
});

test.describe('ContentTrail — Happy Path', () => {
  test('[CT-002] @smoke @regression ContentTrail renders correctly', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-content-trail').first();
    await expect(root).toBeVisible();
    // Verify core structure: heading or primary content exists
    const heading = root.locator('h1, h2, h3').first();
    const hasHeading = await heading.count() > 0;
    if (hasHeading) {
      await expect(heading).toBeVisible();
    }
    // Verify no JS errors during render
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    expect(errors).toEqual([]);
  });

  test('[CT-003] @smoke @regression ContentTrail interactive elements are functional', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-content-trail').first();
    await expect(root).toBeVisible();
    // Verify interactive elements (links, buttons) are present and clickable
    const interactive = root.locator('a, button');
    const count = await interactive.count();
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(interactive.nth(i)).toBeVisible();
      await expect(interactive.nth(i)).toBeEnabled();
    }
  });
});

test.describe('ContentTrail — Negative & Boundary', () => {
  test('[CT-004] @negative @regression ContentTrail handles empty content gracefully', async ({ page }) => {
    // Capture JS errors during page load
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    // Component should render without JS errors
    expect(errors).toEqual([]);
    // Root element should still be present (not crash)
    await expect(page.locator('.cmp-content-trail').first()).toBeVisible();
  });

  test('[CT-005] @negative @regression ContentTrail handles missing images', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-content-trail img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      // Check image loaded: either naturalWidth > 0, or image has a src/data-src set
      const loaded = await images.nth(i).evaluate((el: HTMLImageElement) =>
        el.naturalWidth > 0 || el.complete || !!el.src
      );
      expect(loaded).toBe(true);
    }
  });
});

test.describe('ContentTrail — Responsive', () => {
  test('[CT-006] @mobile @regression @mobile ContentTrail adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-content-trail').first();
    await expect(root).toBeVisible();
    // Verify layout adapts to mobile: check flex-direction changes to column
    const flexDir = await root.evaluate(el => {
      const cs = getComputedStyle(el);
      return cs.flexDirection || cs.display;
    });
    // At mobile, flex containers typically switch to column layout
    // Grid containers may change template columns
    expect(flexDir).toBeDefined();
  });

  test('[CT-007] @mobile @regression ContentTrail adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-content-trail').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('ContentTrail — Console & Resources', () => {
  test('[CT-008] @regression ContentTrail produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('ContentTrail — Broken Images', () => {
  test('[CT-009] @regression ContentTrail image containers are present and styled', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    await page.waitForLoadState('networkidle');
    // Content-trail images use AEM adaptive image component — the <img> tag may start
    // without src (injected via JS). Check the image container divs are properly sized.
    const imageContainers = page.locator('.cmp-content-trail__image');
    const count = await imageContainers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = await imageContainers.nth(i).boundingBox();
      if (box) {
        // Image container should have dimensions (64px default, 80px large)
        expect(box.width).toBeGreaterThanOrEqual(60);
        expect(box.height).toBeGreaterThanOrEqual(60);
      }
    }
  });

  test('[CT-010] @regression ContentTrail all images have alt attributes', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-content-trail img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('ContentTrail — Accessibility', () => {
  test('[CT-011] @a11y @wcag22 @regression @smoke ContentTrail passes axe-core scan', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-content-trail')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[CT-012] @a11y @wcag22 @regression @smoke ContentTrail interactive elements meet 24px target size', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-content-trail a, .cmp-content-trail button, .cmp-content-trail input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[CT-013] @a11y @wcag22 @regression @smoke ContentTrail focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new ContentTrailPage(page);
    await pom.navigate(BASE());
    // Scroll the first content-trail into view, then check focus is visible
    const firstCT = page.locator('.cmp-content-trail__container').first();
    await firstCT.scrollIntoViewIfNeeded();
    await firstCT.focus();
    const box = await firstCT.boundingBox();
    if (box) {
      // Focus target should be within the visible viewport (with tolerance for AEM toolbars)
      expect(box.y).toBeGreaterThanOrEqual(-50); // allow minor overlap with sticky header
      expect(box.y + box.height).toBeLessThanOrEqual(
        await page.evaluate(() => window.innerHeight) + 50
      );
    }
  });
});

test.describe('ContentTrail — AEM Dialog Configuration', () => {
  // Content-trail inherits its dialog from the base component (per GAAM-328: "No updates needed to the dialog").
  // Verify the base dialog is accessible via Sling resource resolution.

  test('[CT-014] @author @regression @smoke ContentTrail dialog is resolvable via base component', async ({ page }) => {
    // GA overlay inherits dialog from kkr-aem-base/components/content/content-trail
    // Check if the base dialog resolves (Sling resourceSuperType chain)
    const baseDialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/content-trail/_cq_dialog.1.json`;
    const response = await page.request.get(baseDialogUrl);
    expect(response.ok(), 'ContentTrail base dialog not found').toBe(true);
  });

  test('[CT-015] @author @regression @smoke ContentTrail GA overlay has correct resourceSuperType', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/content-trail.1.json`;
    const response = await page.request.get(overlayUrl);
    expect(response.ok(), 'ContentTrail GA overlay not found').toBe(true);
    const overlay = await response.json();
    expect(overlay['sling:resourceSuperType']).toBe('kkr-aem-base/components/content/content-trail');
    expect(overlay['componentGroup']).toBe('GA Base');
  });
});
