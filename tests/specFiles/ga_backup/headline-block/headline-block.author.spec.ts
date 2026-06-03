import { test, expect } from '@playwright/test';
import { HeadlineBlockPage } from '../../../pages/ga/components/headlineBlockPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';
const HB = '.ga-headline-block';
const EYEBROW = '.ga-headline-block__eyebrow';
const TITLE = '.ga-headline-block__title';
const DESCRIPTOR = '.ga-headline-block__descriptor';
const CTA_WRAPPER = '.ga-headline-block__cta-wrapper';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ── GAAM-344: Core Rendering ──

test.describe('Headline Block — Core Structure (GAAM-344)', () => {
  test('[HB-001] @smoke @regression Eyebrow renders above headline with correct BEM class', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const eyebrow = block.locator(EYEBROW);
    await expect(eyebrow).toBeVisible();
    await expect(eyebrow).toHaveText(/eye\s*brow/i);
    // Eyebrow should be positioned above title
    const eyeBox = await eyebrow.boundingBox();
    const titleBox = await block.locator(TITLE).boundingBox();
    expect(eyeBox!.y).toBeLessThan(titleBox!.y);
  });

  test('[HB-002] @smoke @regression Headline renders with correct semantic H2 tag', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const title = block.locator(TITLE);
    await expect(title).toBeVisible();
    // Verify it renders as <h2> element (default type in style guide)
    const tagName = await title.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('h2');
    // Verify BEM modifier class matches type
    await expect(title).toHaveClass(/headline-h2/);
  });

  test('[HB-003] @smoke @regression Descriptor renders below headline with body-m class', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const descriptor = block.locator(DESCRIPTOR);
    await expect(descriptor).toBeVisible();
    await expect(descriptor).toHaveClass(/body-m/);
    // Descriptor should be below title
    const descBox = await descriptor.boundingBox();
    const titleBox = await block.locator(TITLE).boundingBox();
    expect(descBox!.y).toBeGreaterThan(titleBox!.y);
  });

  test('[HB-004] @smoke @regression Descriptor supports rich text (contains <p> tags)', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const descriptor = block.locator(DESCRIPTOR);
    const pTag = descriptor.locator('p');
    await expect(pTag.first()).toBeVisible();
  });

  test('[HB-005] @smoke @regression Primary and secondary CTAs render below descriptor', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const ctaWrapper = block.locator(CTA_WRAPPER);
    await expect(ctaWrapper).toBeVisible();
    // Should contain at least 2 button links
    const buttons = ctaWrapper.locator('.cmp-button');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(2);
    // Verify button text
    await expect(buttons.first()).toContainText(/Optional CTA/i);
    await expect(buttons.nth(1)).toContainText(/Link Label/i);
    // CTA wrapper should be below descriptor
    const ctaBox = await ctaWrapper.boundingBox();
    const descBox = await block.locator(DESCRIPTOR).boundingBox();
    expect(ctaBox!.y).toBeGreaterThan(descBox!.y);
  });

  test('[HB-006] @smoke @regression CTA buttons have arrow icons', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const icons = block.locator(`${CTA_WRAPPER} .cmp-button__icon`);
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(1);
    // Verify icon class contains Arrow-Right
    await expect(icons.first()).toHaveClass(/Arrow-Right/);
  });

  test('[HB-007] @regression All 8 style guide variations render without errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const blocks = page.locator(HB);
    const count = await blocks.count();
    expect(count).toBeGreaterThanOrEqual(8);
    capture.stop();
    expect(capture.getErrors()).toEqual([]);
  });

  test('[HB-008] @regression @smoke HeadlineBlock uses ga-headline-block BEM prefix (not cmp-)', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(HB).first();
    await expect(block).toBeVisible();
    // Verify the component does NOT use cmp- prefix
    const hasCmp = await page.locator('.cmp-headline-block').count();
    expect(hasCmp).toBe(0);
    // Verify BEM child elements exist
    await expect(block.locator(EYEBROW)).toBeVisible();
    await expect(block.locator(TITLE)).toBeVisible();
    await expect(block.locator(DESCRIPTOR)).toBeVisible();
    await expect(block.locator(CTA_WRAPPER)).toBeVisible();
  });

  test('[HB-009] @regression No inline style attributes on headline-block elements', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const elementsWithInline = await page.locator(`${HB} [style]`).count();
    expect(elementsWithInline).toBe(0);
  });
});

// ── GAAM-344: Alignment Variants ──

test.describe('Headline Block — Alignment (GAAM-344)', () => {
  test('[HB-010] @regression Left-aligned variant aligns all content to the left', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    // First section is left-aligned on white
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const eyebrow = block.locator(EYEBROW);
    const textAlign = await eyebrow.evaluate(el => getComputedStyle(el).textAlign);
    // left or start are both acceptable
    expect(['left', 'start']).toContain(textAlign);
  });

  test('[HB-011] @regression Center-aligned variant centers all content horizontally', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    // Second variation: center-aligned on white — find via .cmp-section--center
    const centerSection = page.locator(`${SECTION_WHITE}`).nth(1);
    const block = centerSection.locator(HB);
    const eyebrow = block.locator(EYEBROW);
    const title = block.locator(TITLE);
    const descriptor = block.locator(DESCRIPTOR);
    // All text should be centered
    const eyeAlign = await eyebrow.evaluate(el => getComputedStyle(el).textAlign);
    const titleAlign = await title.evaluate(el => getComputedStyle(el).textAlign);
    const descAlign = await descriptor.evaluate(el => getComputedStyle(el).textAlign);
    expect(eyeAlign).toBe('center');
    expect(titleAlign).toBe('center');
    expect(descAlign).toBe('center');
  });

  test('[HB-012] @regression Center-aligned CTA wrapper centers buttons', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const centerSection = page.locator(`${SECTION_WHITE}`).nth(1);
    const ctaWrapper = centerSection.locator(`${HB} ${CTA_WRAPPER}`);
    const alignItems = await ctaWrapper.evaluate(el => getComputedStyle(el).alignItems);
    expect(alignItems).toBe('center');
  });
});

// ── GAAM-344: Dark/Light Background Color Overrides ──

test.describe('Headline Block — Background Color Overrides (GAAM-344)', () => {
  test('[HB-013] @regression White section: eyebrow uses dark (granite-light) color', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const eyebrow = block.locator(EYEBROW);
    const color = await eyebrow.evaluate(el => getComputedStyle(el).color);
    // Should NOT be white/light — should be a dark color on light background
    expect(color).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-014] @regression Slate section: text uses light-mode colors', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_SLATE} ${HB}`).first();
    const title = block.locator(TITLE);
    const color = await title.evaluate(el => getComputedStyle(el).color);
    // Light mode — title should be dark colored, not white
    expect(color).not.toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-015] @regression Granite section: title uses white color (dark mode)', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_GRANITE} ${HB}`).first();
    const title = block.locator(TITLE);
    const color = await title.evaluate(el => getComputedStyle(el).color);
    // Dark mode — title should be white
    expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-016] @regression Granite section: descriptor text uses white color', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_GRANITE} ${HB}`).first();
    const desc = block.locator(`${DESCRIPTOR} p`).first();
    const color = await desc.evaluate(el => getComputedStyle(el).color);
    expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-017] @regression Azul section: title uses white color (dark mode)', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_AZUL} ${HB}`).first();
    const title = block.locator(TITLE);
    const color = await title.evaluate(el => getComputedStyle(el).color);
    expect(color).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('[HB-018] @regression Azul section: eyebrow uses light gray color', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_AZUL} ${HB}`).first();
    const eyebrow = block.locator(EYEBROW);
    const color = await eyebrow.evaluate(el => getComputedStyle(el).color);
    // Should be a light color (ga-gray-20 or similar) — NOT the dark granite-light
    // Parse RGB and check lightness
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    expect(match).toBeTruthy();
    const lightness = (parseInt(match![1]) + parseInt(match![2]) + parseInt(match![3])) / 3;
    expect(lightness).toBeGreaterThan(150); // Light color
  });
});

// ── GAAM-676: Max Width ──

test.describe('Headline Block — Max Width (GAAM-676)', () => {
  test('[HB-019] @regression Left-aligned: max-width is 1032px on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const maxWidth = await block.evaluate(el => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe('1032px');
  });

  test('[HB-020] @regression Center-aligned: max-width is 1150px on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    // Center-aligned block (second white section)
    const centerSection = page.locator(`${SECTION_WHITE}`).nth(1);
    const block = centerSection.locator(HB);
    const maxWidth = await block.evaluate(el => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe('1150px');
  });

  test('[HB-021] @regression @mobile Mobile: no max-width constraint (full container width)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const maxWidth = await block.evaluate(el => getComputedStyle(el).maxWidth);
    // On mobile, max-width should be 'none' or not set
    expect(maxWidth).toBe('none');
  });

  test('[HB-022] @regression Max-width applies to content wrapper, not individual elements', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    // Individual elements should NOT have their own max-width
    const eyebrowMaxW = await block.locator(EYEBROW).evaluate(el => getComputedStyle(el).maxWidth);
    const titleMaxW = await block.locator(TITLE).evaluate(el => getComputedStyle(el).maxWidth);
    const descMaxW = await block.locator(DESCRIPTOR).evaluate(el => getComputedStyle(el).maxWidth);
    expect(eyebrowMaxW).toBe('none');
    expect(titleMaxW).toBe('none');
    expect(descMaxW).toBe('none');
  });
});

// ── GAAM-655 / GAAM-757: Padding ──

test.describe('Headline Block — Default Padding (GAAM-655/757)', () => {
  test('[HB-023] @regression Desktop: default padding is 48px top and bottom', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const paddingTop = await block.evaluate(el => getComputedStyle(el).paddingTop);
    const paddingBottom = await block.evaluate(el => getComputedStyle(el).paddingBottom);
    expect(paddingTop).toBe('48px');
    expect(paddingBottom).toBe('48px');
  });

  test('[HB-024] @regression @mobile Mobile: default padding is 32px top and bottom', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const paddingTop = await block.evaluate(el => getComputedStyle(el).paddingTop);
    const paddingBottom = await block.evaluate(el => getComputedStyle(el).paddingBottom);
    expect(paddingTop).toBe('32px');
    expect(paddingBottom).toBe('32px');
  });

  test('[HB-025] @regression Padding-top-off class removes top padding only', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    // Look for a block with padding-top-off applied
    const paddingOffBlock = page.locator('.ga-headline-block--padding-top-off .ga-headline-block');
    const count = await paddingOffBlock.count();
    if (count === 0) {
      test.skip(true, 'No padding-top-off variation on style guide — needs content fixture');
      return;
    }
    const paddingTop = await paddingOffBlock.first().evaluate(el => getComputedStyle(el).paddingTop);
    const paddingBottom = await paddingOffBlock.first().evaluate(el => getComputedStyle(el).paddingBottom);
    expect(paddingTop).toBe('0px');
    expect(paddingBottom).toBe('48px');
  });

  test('[HB-026] @regression Padding-bottom-off class removes bottom padding only', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const paddingOffBlock = page.locator('.ga-headline-block--padding-bottom-off .ga-headline-block');
    const count = await paddingOffBlock.count();
    if (count === 0) {
      test.skip(true, 'No padding-bottom-off variation on style guide — needs content fixture');
      return;
    }
    const paddingTop = await paddingOffBlock.first().evaluate(el => getComputedStyle(el).paddingTop);
    const paddingBottom = await paddingOffBlock.first().evaluate(el => getComputedStyle(el).paddingBottom);
    expect(paddingTop).toBe('48px');
    expect(paddingBottom).toBe('0px');
  });

  test('[HB-027] @regression Internal spacing unchanged when padding removed', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    // Compare eyebrow-to-title gap in normal block vs padding-off block
    const normalBlock = page.locator(`${SECTION_WHITE} ${HB}`).first();
    const normalEyeBox = await normalBlock.locator(EYEBROW).boundingBox();
    const normalTitleBox = await normalBlock.locator(TITLE).boundingBox();
    const normalGap = normalTitleBox!.y - (normalEyeBox!.y + normalEyeBox!.height);

    // Check padding-off block if available
    const paddingOffBlock = page.locator('.ga-headline-block--padding-top-off .ga-headline-block');
    const count = await paddingOffBlock.count();
    if (count === 0) {
      test.skip(true, 'No padding-off variation on style guide — needs content fixture');
      return;
    }
    const offEyeBox = await paddingOffBlock.first().locator(EYEBROW).boundingBox();
    const offTitleBox = await paddingOffBlock.first().locator(TITLE).boundingBox();
    if (offEyeBox && offTitleBox) {
      const offGap = offTitleBox.y - (offEyeBox.y + offEyeBox.height);
      // Internal spacing should be approximately the same (±2px for rounding)
      expect(Math.abs(offGap - normalGap)).toBeLessThanOrEqual(2);
    }
  });
});

// ── GAAM-344: Responsive Behavior ──

test.describe('Headline Block — Responsive (GAAM-344)', () => {
  test('[HB-028] @mobile @regression CTAs stack vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
    const flexDir = await ctaWrapper.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');
  });

  test('[HB-029] @regression CTAs stack horizontally on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
    const flexDir = await ctaWrapper.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });

  test('[HB-030] @mobile @regression All elements stack vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    // Verify vertical ordering: eyebrow → title → descriptor → CTAs
    const eyeBox = await block.locator(EYEBROW).boundingBox();
    const titleBox = await block.locator(TITLE).boundingBox();
    const descBox = await block.locator(DESCRIPTOR).boundingBox();
    const ctaBox = await block.locator(CTA_WRAPPER).boundingBox();
    expect(eyeBox!.y).toBeLessThan(titleBox!.y);
    expect(titleBox!.y).toBeLessThan(descBox!.y);
    expect(descBox!.y).toBeLessThan(ctaBox!.y);
  });

  test('[HB-031] @mobile @regression No horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const blocks = page.locator(HB);
    const count = await blocks.count();
    for (let i = 0; i < Math.min(count, 4); i++) {
      const overflow = await blocks.nth(i).evaluate(el => el.scrollWidth > el.clientWidth);
      expect(overflow).toBe(false);
    }
  });

  test('[HB-032] @regression CTA wrapper has 12px gap between buttons', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const ctaWrapper = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER}`).first();
    const gap = await ctaWrapper.evaluate(el => getComputedStyle(el).gap);
    expect(gap).toBe('12px');
  });
});

// ── AEM Dialog Configuration ──

test.describe('Headline Block — AEM Dialog Configuration', () => {
  test('[HB-033] @author @regression @smoke GA overlay has correct resourceSuperType', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/headline-block.1.json`;
    const response = await page.request.get(overlayUrl);
    expect(response.ok()).toBe(true);
    const overlay = await response.json();
    expect(overlay['sling:resourceSuperType']).toBe('kkr-aem-base/components/content/headline-block');
    expect(overlay['componentGroup']).toBe('GA Base');
  });

  test('[HB-034] @author @regression GA overlay is marked as container', async ({ page }) => {
    const overlayUrl = `${BASE()}/apps/ga/components/content/headline-block.1.json`;
    const response = await page.request.get(overlayUrl);
    expect(response.ok()).toBe(true);
    const overlay = await response.json();
    expect(overlay['cq:isContainer']).toBe(true);
  });

  test('[HB-035] @author @regression @smoke Dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/headline-block/_cq_dialog.infinity.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Headline Block GA dialog overlay not found').toBe(true);
    // helpPath is inherited from base dialog via Sling resource merger
    const resolvedDialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/headline-block/_cq_dialog.1.json`;
    const baseResponse = await page.request.get(resolvedDialogUrl);
    expect(baseResponse.ok()).toBe(true);
    const baseDialog = await baseResponse.json();
    expect(baseDialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });

  test('[HB-036] @author @regression Dialog has Properties tab with required fields', async ({ page }) => {
    // GA overlay only has RTE customizations — full dialog comes from base via Sling resource merger
    const baseDialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/headline-block/_cq_dialog.infinity.json`;
    const response = await page.request.get(baseDialogUrl);
    expect(response.ok()).toBe(true);
    const dialog = JSON.stringify(await response.json());
    // Verify Properties tab and its fields exist in the base dialog
    expect(dialog).toContain('"properties"');
    expect(dialog).toContain('"eyebrow"');
    expect(dialog).toContain('"title"');
    expect(dialog).toContain('"descriptor"');
    expect(dialog).toContain('"types"');
  });

  test('[HB-037] @author @regression Dialog Title field is required', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/headline-block/_cq_dialog.infinity.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok()).toBe(true);
    const dialog = await response.json();
    // Navigate to the title field and check required
    const titleField = dialog?.content?.items?.tabs?.items?.properties?.items?.columns?.items?.column?.items?.title;
    expect(titleField).toBeTruthy();
    expect(titleField.required).toBe(true);
  });

  test('[HB-038] @author @regression Dialog Type/Size select offers h1 through h6', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/kkr-aem-base/components/content/headline-block/_cq_dialog.infinity.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok()).toBe(true);
    const dialog = await response.json();
    const typeField = dialog?.content?.items?.tabs?.items?.properties?.items?.columns?.items?.column?.items?.types;
    expect(typeField).toBeTruthy();
    const items = typeField?.items;
    expect(items).toBeTruthy();
    // Verify all 6 heading levels
    for (const level of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
      expect(items[level], `Missing heading level ${level}`).toBeTruthy();
      expect(items[level].value).toBe(level);
    }
    // h2 should be selected by default
    expect(items.h2.selected).toBe(true);
  });

  test('[HB-039] @author @regression GA dialog overlay customizes RTE plugins', async ({ page }) => {
    const gaDialogUrl = `${BASE()}/apps/ga/components/content/headline-block/_cq_dialog.infinity.json`;
    const response = await page.request.get(gaDialogUrl);
    expect(response.ok()).toBe(true);
    const dialog = JSON.stringify(await response.json());
    // GA overlay should reference GA-specific RTE plugins
    expect(dialog).toContain('ga/components/common/richtext');
  });
});

// ── Accessibility ──

test.describe('Headline Block — Accessibility (GAAM-344/655/676)', () => {
  test('[HB-040] @a11y @wcag22 @regression @smoke Passes axe-core scan on light background', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(`${SECTION_WHITE}`)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[HB-041] @a11y @wcag22 @regression Passes axe-core scan on dark background', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(`${SECTION_GRANITE}`)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[HB-042] @a11y @wcag22 @regression CTA buttons meet 24px minimum target size', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const buttons = page.locator(`${HB} ${CTA_WRAPPER} .cmp-button`);
    const count = await buttons.count();
    for (let i = 0; i < Math.min(count, 4); i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[HB-043] @a11y @wcag22 @regression Focus indicators visible on CTA buttons', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const button = page.locator(`${SECTION_WHITE} ${HB} ${CTA_WRAPPER} .cmp-button`).first();
    await button.scrollIntoViewIfNeeded();
    // Use keyboard Tab to trigger :focus-visible (click focus may not show outline)
    await button.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    const hasIndicator = await button.evaluate(el => {
      const cs = getComputedStyle(el);
      const outlineW = parseFloat(cs.outlineWidth) || 0;
      const boxShadow = cs.boxShadow;
      const borderW = parseFloat(cs.borderWidth) || 0;
      return outlineW > 0 || (boxShadow !== 'none' && boxShadow !== '') || borderW > 0;
    });
    expect(hasIndicator).toBe(true);
  });

  test('[HB-044] @a11y @wcag22 @regression Semantic heading tag used (not styled div)', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const titles = page.locator(`${HB} ${TITLE}`);
    const count = await titles.count();
    for (let i = 0; i < Math.min(count, 4); i++) {
      const tag = await titles.nth(i).evaluate(el => el.tagName.toLowerCase());
      expect(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).toContain(tag);
    }
  });

  test('[HB-045] @a11y @regression Screen reader: content in logical order', async ({ page }) => {
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    const block = page.locator(`${SECTION_WHITE} ${HB}`).first();
    // DOM order should be: eyebrow → title → descriptor → CTA
    const children = await block.evaluate(el => {
      return Array.from(el.children).map(c => c.className.split(' ')[0]);
    });
    const eyeIdx = children.indexOf('ga-headline-block__eyebrow');
    const titleIdx = children.findIndex(c => c.includes('ga-headline-block__title'));
    const descIdx = children.indexOf('ga-headline-block__descriptor');
    const ctaIdx = children.indexOf('ga-headline-block__cta-wrapper');
    expect(eyeIdx).toBeLessThan(titleIdx);
    expect(titleIdx).toBeLessThan(descIdx);
    expect(descIdx).toBeLessThan(ctaIdx);
  });
});

// ── Console & JS Errors ──

test.describe('Headline Block — Console Errors', () => {
  test('[HB-046] @regression No JS errors on page load', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new HeadlineBlockPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    capture.stop();
    expect(capture.getErrors()).toEqual([]);
  });
});
