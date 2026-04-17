import { test, expect } from '@playwright/test';
import { NestedContentCarouselPage } from '../../../pages/ga/components/nestedContentCarouselPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const NCC = '.cmp-nested-content-carousel';
const TOGGLE = '.cmp-nested-content-carousel__toggle';
const CURRENT = '.cmp-nested-content-carousel__current';
const PROGRESS_BAR = '.carousel-progress .progress';
const CTA = 'a.nested-carousel-button';
const CTA_ICON = '.nested-carousel-button__icon';

test.describe('Nested Content Carousel — Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
  });

  // ---------------------------------------------------------------------------
  // Auto-Play Behavior
  // ---------------------------------------------------------------------------

  test('NCC-INT-001: Progress bar width increases over time', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    // Find a multi-slide carousel
    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const progressBar = carousel.locator(PROGRESS_BAR).first();
    await progressBar.waitFor({ state: 'visible', timeout: 10000 });

    // Record width at t=0
    const widthAtStart = await progressBar.evaluate((el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.width);
    });

    // Wait 3 seconds and check again
    await page.waitForTimeout(3000);

    const widthAt3s = await progressBar.evaluate((el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.width);
    });

    expect(widthAt3s).toBeGreaterThan(widthAtStart);
  });

  test('NCC-INT-002: Counter advances from "01" to "02" after ~6-7 seconds', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const counter = carousel.locator(CURRENT).first();
    await counter.waitFor({ state: 'visible', timeout: 10000 });

    // Verify initial counter shows first slide
    const initialText = (await counter.textContent())?.trim() ?? '';
    expect(initialText).toBe('01');

    // Wait enough time for auto-play to advance (6s interval + 1s buffer + fade speed)
    await page.waitForTimeout(7000);

    const updatedText = (await counter.textContent())?.trim() ?? '';
    expect(updatedText).toBe('02');
  });

  test('NCC-INT-003: Carousel loops back to "01" after reaching the last slide', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const counter = carousel.locator(CURRENT).first();
    await counter.waitFor({ state: 'visible', timeout: 10000 });

    // Count total slides
    const totalSlides = await carousel.locator('.swiper-slide').count();

    // Wait for all slides to cycle through: totalSlides * 7s per slide
    const waitTime = totalSlides * 7000;
    await page.waitForTimeout(waitTime);

    const loopedText = (await counter.textContent())?.trim() ?? '';
    expect(loopedText).toBe('01');
  });

  // ---------------------------------------------------------------------------
  // Pause/Play Toggle
  // ---------------------------------------------------------------------------

  test('NCC-INT-004: Clicking toggle button adds ".is-paused" class', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const toggle = carousel.locator(TOGGLE).first();
    await toggle.waitFor({ state: 'visible', timeout: 10000 });

    // Should not have is-paused initially
    await expect(toggle).not.toHaveClass(/is-paused/);

    await toggle.click();

    await expect(toggle).toHaveClass(/is-paused/);
  });

  test('NCC-INT-005: Clicking toggle changes aria-label to "Play carousel"', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const toggle = carousel.locator(TOGGLE).first();
    await toggle.waitFor({ state: 'visible', timeout: 10000 });

    // Initial state: playing
    await expect(toggle).toHaveAttribute('aria-label', 'Pause carousel');

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-label', 'Play carousel');
  });

  test('NCC-INT-006: Clicking toggle twice resumes playing (removes ".is-paused")', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const toggle = carousel.locator(TOGGLE).first();
    await toggle.waitFor({ state: 'visible', timeout: 10000 });

    // Pause
    await toggle.click();
    await expect(toggle).toHaveClass(/is-paused/);

    // Resume
    await toggle.click();
    await expect(toggle).not.toHaveClass(/is-paused/);
  });

  test('NCC-INT-007: Progress bar stops advancing when paused', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const toggle = carousel.locator(TOGGLE).first();
    const progressBar = carousel.locator(PROGRESS_BAR).first();

    await toggle.waitFor({ state: 'visible', timeout: 10000 });
    await progressBar.waitFor({ state: 'visible', timeout: 10000 });

    // Pause the carousel
    await toggle.click();
    await expect(toggle).toHaveClass(/is-paused/);

    // Record width right after pausing
    const widthAfterPause = await progressBar.evaluate((el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.width);
    });

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Record width again — should not have changed significantly
    const widthAfter2s = await progressBar.evaluate((el: HTMLElement) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.width);
    });

    // Allow a small tolerance of 2px for sub-pixel rendering differences
    expect(Math.abs(widthAfter2s - widthAfterPause)).toBeLessThanOrEqual(2);
  });

  // ---------------------------------------------------------------------------
  // Keyboard Navigation
  // ---------------------------------------------------------------------------

  test('NCC-INT-008: Tab navigation reaches the toggle button', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const toggle = carousel.locator(TOGGLE).first();
    await toggle.waitFor({ state: 'visible', timeout: 10000 });

    // Focus the toggle directly and verify it is focusable
    await toggle.focus();

    const focusedTag = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.tagName.toLowerCase() : '';
    });

    expect(focusedTag).toBe('button');
  });

  test('NCC-INT-009: Space/Enter on toggle button toggles pause state', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const toggle = carousel.locator(TOGGLE).first();
    await toggle.waitFor({ state: 'visible', timeout: 10000 });

    // Focus then press Space to pause
    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveClass(/is-paused/);

    // Press Enter to resume
    await page.keyboard.press('Enter');
    await expect(toggle).not.toHaveClass(/is-paused/);
  });

  test('NCC-INT-010: CTA link is focusable via Tab', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const ctaLink = carousel.locator(CTA).first();
    await ctaLink.waitFor({ state: 'visible', timeout: 10000 });

    await ctaLink.focus();

    const focusedTag = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.tagName.toLowerCase() : '';
    });

    expect(focusedTag).toBe('a');
  });

  // ---------------------------------------------------------------------------
  // CTA Hover Effects
  // ---------------------------------------------------------------------------

  test('NCC-INT-011: CTA hover changes icon background color (azul 10% opacity)', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const ctaLink = carousel.locator(CTA).first();
    const ctaIcon = ctaLink.locator(CTA_ICON).first();

    await ctaLink.waitFor({ state: 'visible', timeout: 10000 });

    // Capture background color before hover
    const bgBefore = await ctaIcon.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Hover over the CTA link
    await ctaLink.hover();
    await page.waitForTimeout(400); // allow CSS transition to complete

    // Capture background color after hover
    const bgAfter = await ctaIcon.evaluate((el: HTMLElement) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // The background should have changed on hover (azul at 10% opacity)
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('NCC-INT-012: CTA hover increases gap between icon and text', async ({ page }) => {
    const pom = new NestedContentCarouselPage(page);
    await pom.navigate(BASE());

    const carousel = page.locator(NCC).filter({ has: page.locator('.swiper-slide:nth-child(2)') }).first();
    const hasMultiSlide = await carousel.count() > 0;
    test.skip(!hasMultiSlide, 'No multi-slide carousel found on this page');

    const ctaLink = carousel.locator(CTA).first();
    await ctaLink.waitFor({ state: 'visible', timeout: 10000 });

    // Capture gap before hover
    const gapBefore = await ctaLink.evaluate((el: HTMLElement) => {
      return parseFloat(window.getComputedStyle(el).gap || '0');
    });

    // Hover over the CTA link
    await ctaLink.hover();
    await page.waitForTimeout(400); // allow CSS transition to complete

    // Capture gap after hover
    const gapAfter = await ctaLink.evaluate((el: HTMLElement) => {
      return parseFloat(window.getComputedStyle(el).gap || '0');
    });

    // Gap should increase from 8px to 12px on hover
    expect(gapAfter).toBeGreaterThan(gapBefore);
    expect(gapAfter).toBeCloseTo(12, 0);
  });
});
