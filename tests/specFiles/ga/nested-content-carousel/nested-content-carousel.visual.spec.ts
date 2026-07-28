import { test, expect } from '@playwright/test';
import { NestedContentCarouselPage } from '../../../pages/ga/components/nestedContentCarouselPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);

  capture = new ConsoleCapture(page);
  capture.start();});

test.afterEach(async ({ page }, testInfo) => {
  if (capture) {
    await attachConsoleCapture(testInfo, capture);
  }
  await annotateEnvironment(testInfo);
});

test.describe('NestedContentCarousel — Visual Regression', () => {
  test('@visual @regression Desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    // Force the scrollbar gutter to always be reserved. Without this, whether this
    // long style-guide page's content crosses the viewport height varies by a few
    // pixels run-to-run, so the vertical scrollbar flickers in/out — reflowing the
    // carousel's available width (~7px) and, with it, its text-wrap-driven height.
    await page.addStyleTag({ content: 'html { overflow-y: scroll !important; }' });

    // Autoplay's progress bar advances continuously via JS, not CSS — `animations: 'disabled'`
    // doesn't freeze it, so consecutive screenshot attempts see it mid-motion. Pause it first.
    // Different slides have different content/dimensions, so also pin down slide "01" before
    // pausing — otherwise the slide captured depends on how long login/navigation took, and
    // each run screenshots a different, non-deterministic slide.
    const counter = page.locator('.cmp-nested-content-carousel__current').first();
    if (await counter.isVisible().catch(() => false)) {
      await expect(counter).toHaveText('01', { timeout: 15000 });
    }

    const toggle = page.locator('.cmp-nested-content-carousel__toggle').first();
    if (await toggle.isVisible().catch(() => false)) {
      // force: an overlapping hero-fifty-fifty section can intercept the click
      // at narrow viewports even though the toggle itself is visible.
      await toggle.click({ force: true });
      await page.waitForTimeout(300);
    }

    const el = page.locator('.cmp-nested-content-carousel').first();

    // AEM's adaptive image component lazy-loads slide images via JS rather than a
    // native src (same known behavior documented in content-trail.images.spec.ts).
    // Without waiting for it, the screenshot races the load: sometimes it fires
    // before the image renders (shorter card) and sometimes after (taller card),
    // producing a non-deterministic captured size independent of slide/scrollbar state.
    await page.waitForFunction(
      (selector) => Array.from(document.querySelectorAll(`${selector} img`))
        .every((img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0),
      '.cmp-nested-content-carousel',
      { timeout: 10000 }
    );
    await expect(el).toHaveScreenshot('nested-content-carousel-desktop.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression @mobile Mobile screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    // Force the scrollbar gutter to always be reserved. Without this, whether this
    // long style-guide page's content crosses the viewport height varies by a few
    // pixels run-to-run, so the vertical scrollbar flickers in/out — reflowing the
    // carousel's available width (~7px) and, with it, its text-wrap-driven height.
    await page.addStyleTag({ content: 'html { overflow-y: scroll !important; }' });

    // Autoplay's progress bar advances continuously via JS, not CSS — `animations: 'disabled'`
    // doesn't freeze it, so consecutive screenshot attempts see it mid-motion. Pause it first.
    // Different slides have different content/dimensions, so also pin down slide "01" before
    // pausing — otherwise the slide captured depends on how long login/navigation took, and
    // each run screenshots a different, non-deterministic slide.
    const counter = page.locator('.cmp-nested-content-carousel__current').first();
    if (await counter.isVisible().catch(() => false)) {
      await expect(counter).toHaveText('01', { timeout: 15000 });
    }

    const toggle = page.locator('.cmp-nested-content-carousel__toggle').first();
    if (await toggle.isVisible().catch(() => false)) {
      // force: an overlapping hero-fifty-fifty section can intercept the click
      // at narrow viewports even though the toggle itself is visible.
      await toggle.click({ force: true });
      await page.waitForTimeout(300);
    }

    const el = page.locator('.cmp-nested-content-carousel').first();

    // AEM's adaptive image component lazy-loads slide images via JS rather than a
    // native src (same known behavior documented in content-trail.images.spec.ts).
    // Without waiting for it, the screenshot races the load: sometimes it fires
    // before the image renders (shorter card) and sometimes after (taller card),
    // producing a non-deterministic captured size independent of slide/scrollbar state.
    await page.waitForFunction(
      (selector) => Array.from(document.querySelectorAll(`${selector} img`))
        .every((img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0),
      '.cmp-nested-content-carousel',
      { timeout: 10000 }
    );
    await expect(el).toHaveScreenshot('nested-content-carousel-mobile.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression Tablet screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    // Force the scrollbar gutter to always be reserved. Without this, whether this
    // long style-guide page's content crosses the viewport height varies by a few
    // pixels run-to-run, so the vertical scrollbar flickers in/out — reflowing the
    // carousel's available width (~7px) and, with it, its text-wrap-driven height.
    await page.addStyleTag({ content: 'html { overflow-y: scroll !important; }' });

    // Autoplay's progress bar advances continuously via JS, not CSS — `animations: 'disabled'`
    // doesn't freeze it, so consecutive screenshot attempts see it mid-motion. Pause it first.
    // Different slides have different content/dimensions, so also pin down slide "01" before
    // pausing — otherwise the slide captured depends on how long login/navigation took, and
    // each run screenshots a different, non-deterministic slide.
    const counter = page.locator('.cmp-nested-content-carousel__current').first();
    if (await counter.isVisible().catch(() => false)) {
      await expect(counter).toHaveText('01', { timeout: 15000 });
    }

    const toggle = page.locator('.cmp-nested-content-carousel__toggle').first();
    if (await toggle.isVisible().catch(() => false)) {
      // force: an overlapping hero-fifty-fifty section can intercept the click
      // at narrow viewports even though the toggle itself is visible.
      await toggle.click({ force: true });
      await page.waitForTimeout(300);
    }

    const el = page.locator('.cmp-nested-content-carousel').first();

    // AEM's adaptive image component lazy-loads slide images via JS rather than a
    // native src (same known behavior documented in content-trail.images.spec.ts).
    // Without waiting for it, the screenshot races the load: sometimes it fires
    // before the image renders (shorter card) and sometimes after (taller card),
    // producing a non-deterministic captured size independent of slide/scrollbar state.
    await page.waitForFunction(
      (selector) => Array.from(document.querySelectorAll(`${selector} img`))
        .every((img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0),
      '.cmp-nested-content-carousel',
      { timeout: 10000 }
    );
    await expect(el).toHaveScreenshot('nested-content-carousel-tablet.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
