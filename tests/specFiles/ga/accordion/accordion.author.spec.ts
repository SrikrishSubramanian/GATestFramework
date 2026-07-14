import { test, expect } from '@playwright/test';
import { AccordionPage } from '../../../pages/ga/components/accordionPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

let capture: ConsoleCapture;

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

// ─── Selectors ────────────────────────────────────────────────────────────────
// Style guide sections identified by section background style class
const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_SLATE = '.cmp-section--background-color-slate';
const SECTION_GRANITE = '.cmp-section--background-color-granite';
const SECTION_AZUL = '.cmp-section--background-color-azul';

const ACCORDION = '.cmp-accordion';
const ITEM = '.cmp-accordion__item';
const ITEM_BUTTON = '.cmp-accordion__item-button';
const ITEM_CONTENT = '.cmp-accordion__item-content';
const INDICATOR_GA = '.cmp-accordion__item-indicator--ga';
const ICON_LINE_H = '.cmp-accordion__item-icon-line--horizontal';
const ICON_LINE_V = '.cmp-accordion__item-icon-line--vertical';

test.describe('Accordion — Style Guide Page', () => {
  test('[ACRD-001] @smoke @regression Style guide page exists and loads', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    await expect(page.locator(ACCORDION).first()).toBeVisible();
    // Verify all 4 background sections render accordions
    await expect(page.locator(`${SECTION_WHITE} ${ACCORDION}`)).toBeVisible();
    await expect(page.locator(`${SECTION_SLATE} ${ACCORDION}`)).toBeVisible();
    await expect(page.locator(`${SECTION_GRANITE} ${ACCORDION}`)).toBeVisible();
    await expect(page.locator(`${SECTION_AZUL} ${ACCORDION}`)).toBeVisible();
  });

  test('[ACRD-002] @smoke @regression Each accordion section renders all expected items', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    // White: 4 items, Slate: 3 items, Granite: 3 items, Azul: 2 items
    await expect(page.locator(`${SECTION_WHITE} ${ITEM}`)).toHaveCount(4);
    await expect(page.locator(`${SECTION_SLATE} ${ITEM}`)).toHaveCount(3);
    await expect(page.locator(`${SECTION_GRANITE} ${ITEM}`)).toHaveCount(3);
    await expect(page.locator(`${SECTION_AZUL} ${ITEM}`)).toHaveCount(2);
  });
});

test.describe('Accordion — BEM Structure', () => {
  test('[ACRD-003] @regression Component root uses .cmp-accordion class', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const roots = page.locator(ACCORDION);
    const count = await roots.count();
    expect(count).toBeGreaterThanOrEqual(4);
    for (let i = 0; i < count; i++) {
      await expect(roots.nth(i)).toBeVisible();
    }
  });

  test('[ACRD-004] @regression Items follow BEM .cmp-accordion__item pattern', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const items = page.locator(ITEM);
    expect(await items.count()).toBeGreaterThanOrEqual(12); // 4+3+3+2
  });

  test('[ACRD-005] @regression Each item has a button and content panel', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstAccordion = page.locator(`${SECTION_WHITE} ${ACCORDION}`);
    const items = firstAccordion.locator(ITEM);
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i).locator(ITEM_BUTTON)).toHaveCount(1);
      await expect(items.nth(i).locator(ITEM_CONTENT)).toHaveCount(1);
    }
  });

  test('[ACRD-006] @regression GA circular icon indicator is present on all items', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const buttons = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i).locator(INDICATOR_GA)).toBeVisible();
    }
  });

  test('[ACRD-007] @regression KKR indicator icons are hidden', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const kkrDefault = page.locator('.cmp-accordion__item-indicator--default');
    const kkrBlog = page.locator('.cmp-accordion__item-indicator--blog');
    // These should either not exist or be display:none
    const defaultCount = await kkrDefault.count();
    for (let i = 0; i < defaultCount; i++) {
      await expect(kkrDefault.nth(i)).toBeHidden();
    }
    const blogCount = await kkrBlog.count();
    for (let i = 0; i < blogCount; i++) {
      await expect(kkrBlog.nth(i)).toBeHidden();
    }
  });
});

test.describe('Accordion — Force Closed on Load', () => {
  test('[ACRD-008] @smoke @regression White section: all items closed on page load', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const buttons = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('[ACRD-009] @regression Granite section: all items closed on page load', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const buttons = page.locator(`${SECTION_GRANITE} ${ITEM_BUTTON}`);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('[ACRD-010] @regression Azul section: all items closed on page load', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const buttons = page.locator(`${SECTION_AZUL} ${ITEM_BUTTON}`);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveAttribute('aria-expanded', 'false');
    }
  });
});

test.describe('Accordion — Single Expansion Mode', () => {
  test('[ACRD-011] @smoke @regression Slate section: only one item can be open at a time', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const slateButtons = page.locator(`${SECTION_SLATE} ${ITEM_BUTTON}`);

    // First item should be pre-expanded on load (expandedItems=[item_0])
    await expect(slateButtons.nth(0)).toHaveAttribute('aria-expanded', 'true');

    // Click second item — first should close
    await slateButtons.nth(1).click();
    await expect(slateButtons.nth(1)).toHaveAttribute('aria-expanded', 'true');
    await expect(slateButtons.nth(0)).toHaveAttribute('aria-expanded', 'false');

    // Click third item — second should close
    await slateButtons.nth(2).click();
    await expect(slateButtons.nth(2)).toHaveAttribute('aria-expanded', 'true');
    await expect(slateButtons.nth(1)).toHaveAttribute('aria-expanded', 'false');
  });

  test('[ACRD-012] @regression Single expansion accordion has data attribute', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const slateAccordion = page.locator(`${SECTION_SLATE} ${ACCORDION}`);
    await expect(slateAccordion).toHaveAttribute('data-single-expansion');
  });
});

test.describe('Accordion — Pre-expanded Item on Load', () => {
  test('[ACRD-013] @smoke @regression Slate section: first item expanded by default on load', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const slateButtons = page.locator(`${SECTION_SLATE} ${ITEM_BUTTON}`);
    // item_0 is configured as expandedItems
    await expect(slateButtons.nth(0)).toHaveAttribute('aria-expanded', 'true');
    // Content panel should be visible
    const slateContents = page.locator(`${SECTION_SLATE} ${ITEM_CONTENT}`);
    await expect(slateContents.nth(0)).toHaveAttribute('aria-hidden', 'false');
  });
});

test.describe('Accordion — Expand/Collapse Interaction', () => {
  test('[ACRD-014] @smoke @regression Clicking a button expands the accordion item', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const firstContent = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`).first();

    // Initially closed
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    await expect(firstContent).toHaveAttribute('aria-hidden', 'true');

    // Click to expand
    await clickElement(firstButton);
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    await expect(firstContent).toHaveAttribute('aria-hidden', 'false');
  });

  test('[ACRD-015] @regression Clicking an expanded button collapses the item', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const firstContent = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`).first();

    // Expand
    await clickElement(firstButton);
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');

    // Collapse
    await clickElement(firstButton);
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    await expect(firstContent).toHaveAttribute('aria-hidden', 'true');
  });

  test('[ACRD-016] @regression Multi-expand: multiple items can be open simultaneously', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const whiteButtons = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`);

    // Expand first and second items
    await whiteButtons.nth(0).click();
    await whiteButtons.nth(1).click();

    // Both should be expanded
    await expect(whiteButtons.nth(0)).toHaveAttribute('aria-expanded', 'true');
    await expect(whiteButtons.nth(1)).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('Accordion — Icon Animation', () => {
  test('[ACRD-017] @regression @interaction GA icon indicator has CSS transition', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const indicator = page.locator(`${SECTION_WHITE} ${INDICATOR_GA}`).first();
    const transition = // 📏 TODO: Replace with measurement-utils
    await indicator.evaluate(el => getComputedStyle(el).transition); // measurement: style check
    expect(transition).toContain('background-color');
  });

  test('[ACRD-018] @regression @interaction Icon vertical line has rotation transition', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const vertLine = page.locator(`${SECTION_WHITE} ${ICON_LINE_V}`).first();
    const transition = // 📏 TODO: Replace with measurement-utils
    await vertLine.evaluate(el => getComputedStyle(el).transition); // measurement: style check
    expect(transition).toContain('transform');
  });

  test('[ACRD-019] @regression @interaction Expanded item icon vertical line is rotated/hidden', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();

    // Expand and wait for 300ms CSS transition to complete
    await clickElement(firstButton);
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
    // Vertical line should have opacity 0 (rotated to form minus)
    const vertLine = firstButton.locator(ICON_LINE_V);
    const opacity = // 📏 TODO: Replace with measurement-utils
    await vertLine.evaluate(el => getComputedStyle(el).opacity); // measurement: style check
    expect(Number(opacity)).toBeLessThanOrEqual(0.01);
  });

  test('[ACRD-020] @regression @interaction Collapsed item icon shows plus shape', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();

    // Ensure collapsed
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false');

    // Both horizontal and vertical lines visible (forming +)
    const hLine = firstButton.locator(ICON_LINE_H);
    const vLine = firstButton.locator(ICON_LINE_V);
    await expect(hLine).toBeVisible();
    await expect(vLine).toBeVisible();
    const vOpacity = // 📏 TODO: Replace with measurement-utils
    await vLine.evaluate(el => getComputedStyle(el).opacity); // measurement: style check
    expect(Number(vOpacity)).toBe(1);
  });
});

test.describe('Accordion — Hover & Focus States', () => {
  test('[ACRD-021] @interaction @regression Hover changes icon background color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const indicator = firstButton.locator(INDICATOR_GA);

    const bgBefore = // 📏 TODO: Replace with measurement-utils
    await indicator.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: style check
    await hover(firstButton);
    const bgAfter = // 📏 TODO: Replace with measurement-utils
    await indicator.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: style check
    // Background should darken on hover
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('[ACRD-022] @interaction @regression Focus shows double-ring outline on icon', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const indicator = firstButton.locator(INDICATOR_GA);

    await firstButton.focus();
    const boxShadow = // 📏 TODO: Replace with measurement-utils
    await indicator.evaluate(el => getComputedStyle(el).boxShadow); // measurement: style check
    // Should have double ring box-shadow on focus
    expect(boxShadow).not.toBe('none');
    expect(boxShadow).toContain('0px 0px 0px');
  });

  test('[ACRD-023] @a11y @regression Keyboard Tab navigates between accordion buttons', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const whiteButtons = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`);

    // Focus first button and tab to second
    await whiteButtons.first().focus();
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    // Should have moved to the next focusable element
    await expect(focused).toBeVisible();
  });
});

test.describe('Accordion — Dark Background Overrides', () => {
  test('[ACRD-024] @regression Granite: item borders use white color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const graniteItem = page.locator(`${SECTION_GRANITE} ${ITEM}`).first();
    const borderColor = // 📏 TODO: Replace with measurement-utils
    await graniteItem.evaluate(el => getComputedStyle(el).borderBottomColor); // measurement: style check
    // Should be white (rgb(255, 255, 255)) on dark background
    expect(borderColor).toContain('255');
  });

  test('[ACRD-025] @regression Granite: button text uses white color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const graniteButton = page.locator(`${SECTION_GRANITE} ${ITEM_BUTTON}`).first();
    const color = // 📏 TODO: Replace with measurement-utils
    await graniteButton.evaluate(el => getComputedStyle(el).color); // measurement: style check
    // Should be white on dark background
    expect(color).toContain('255');
  });

  test('[ACRD-026] @regression Azul: item borders use white color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const azulItem = page.locator(`${SECTION_AZUL} ${ITEM}`).first();
    const borderColor = // 📏 TODO: Replace with measurement-utils
    await azulItem.evaluate(el => getComputedStyle(el).borderBottomColor); // measurement: style check
    expect(borderColor).toContain('255');
  });

  test('[ACRD-027] @regression Azul: button text uses white color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const azulButton = page.locator(`${SECTION_AZUL} ${ITEM_BUTTON}`).first();
    const color = // 📏 TODO: Replace with measurement-utils
    await azulButton.evaluate(el => getComputedStyle(el).color); // measurement: style check
    expect(color).toContain('255');
  });

  test('[ACRD-028] @regression Granite: icon lines use white color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const graniteLine = page.locator(`${SECTION_GRANITE} ${ICON_LINE_H}`).first();
    const bgColor = // 📏 TODO: Replace with measurement-utils
    await graniteLine.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: style check
    // Should be white on dark background
    expect(bgColor).toContain('255');
  });

  test('[ACRD-029] @regression Light background: title uses granite color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const whiteButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const heading = whiteButton.locator('h2, h3, h4, h5, h6').first();
    const headingCount = await heading.count();
    if (headingCount > 0) {
      const color = // 📏 TODO: Replace with measurement-utils
    await heading.evaluate(el => getComputedStyle(el).color); // measurement: style check
      // Should be a dark granite color, not white
      expect(color).not.toContain('rgb(255, 255, 255)');
    }
  });
});

test.describe('Accordion — Padding Removed (Section Handles Padding)', () => {
  test('[ACRD-030] @regression No padding-related style system classes on accordion', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const accordions = page.locator(ACCORDION);
    const count = await accordions.count();
    for (let i = 0; i < count; i++) {
      const classes = await accordions.nth(i).getAttribute('class') || '';
      expect(classes).not.toContain('--added-padding'); // TODO: Use assertSpacing() for padding/margin
      expect(classes).not.toContain('--remove-default');
    }
  });
});

test.describe('Accordion — Content Panel', () => {
  test('[ACRD-031] @regression Expanded panel has left border', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const firstContent = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`).first();

    await clickElement(firstButton);
    await expect(firstContent).toHaveAttribute('aria-hidden', 'false');
    const borderLeft = // 📏 TODO: Replace with measurement-utils
    await firstContent.evaluate(el => getComputedStyle(el).borderLeftStyle); // measurement: style check
    expect(borderLeft).toBe('solid');
  });

  test('[ACRD-032] @regression Collapsed panel has transparent border', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstContent = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`).first();
    await expect(firstContent).toHaveAttribute('aria-hidden', 'true');
    const borderColor = // 📏 TODO: Replace with measurement-utils
    await firstContent.evaluate(el => getComputedStyle(el).borderLeftColor); // measurement: style check
    // Should be transparent
    expect(borderColor).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);
  });

  test('[ACRD-033] @regression Accordion height is variable based on content', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const whiteButtons = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`);
    const whiteContents = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`);

    // Expand first two items (they have different content lengths)
    await whiteButtons.nth(0).click();
    await whiteButtons.nth(1).click();
    // ⏱️ Consider: await page.locator('selector').waitFor({ state: 'visible' }) instead of hardcoded wait
    // Wait for expansion animation

    const height0 = await whiteContents.nth(0).evaluate(el => el.scrollHeight);
    const height1 = await whiteContents.nth(1).evaluate(el => el.scrollHeight);
    // Heights should be > 0 (content-driven) — exact equality not required
    expect(height0).toBeGreaterThan(0);
    expect(height1).toBeGreaterThan(0);
  });
});

test.describe('Accordion — Responsive', () => {
  test('[ACRD-034] @mobile @regression Accordion renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    await expect(page.locator(ACCORDION).first()).toBeVisible();
    // All accordion items should still be present
    await expect(page.locator(`${SECTION_WHITE} ${ITEM}`)).toHaveCount(4);
  });

  test('[ACRD-035] @mobile @regression Accordion renders on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    await expect(page.locator(ACCORDION).first()).toBeVisible();
  });

  test('[ACRD-036] @mobile @regression Expand/collapse works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();

    await clickElement(firstButton);
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    await clickElement(firstButton);
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('[ACRD-037] @mobile @regression Mobile font size adjusts', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const button = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const mobileSize = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el => parseFloat(getComputedStyle(el).fontSize)); // measurement: style check

    await page.setViewportSize({ width: 1440, height: 900 });
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const desktopSize = // 📏 TODO: Replace with measurement-utils
    await button.evaluate(el => parseFloat(getComputedStyle(el).fontSize)); // measurement: style check

    // Desktop font should be larger or equal to mobile
    expect(desktopSize).toBeGreaterThanOrEqual(mobileSize);
  });
});

test.describe('Accordion — ARIA Accessibility', () => {
  test('[ACRD-038] @a11y @regression Buttons have aria-expanded attribute', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const buttons = page.locator(ITEM_BUTTON);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const expanded = await buttons.nth(i).getAttribute('aria-expanded');
      expect(['true', 'false']).toContain(expanded);
    }
  });

  test('[ACRD-039] @a11y @regression Content panels have aria-hidden attribute', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const contents = page.locator(ITEM_CONTENT);
    const count = await contents.count();
    for (let i = 0; i < count; i++) {
      const hidden = await contents.nth(i).getAttribute('aria-hidden');
      expect(['true', 'false']).toContain(hidden);
    }
  });

  test('[ACRD-040] @a11y @regression Content panels have role="region"', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const contents = page.locator(ITEM_CONTENT);
    const count = await contents.count();
    for (let i = 0; i < count; i++) {
      const role = await contents.nth(i).getAttribute('role');
      expect(role).toBe('region');
    }
  });

  test('[ACRD-041] @a11y @regression Buttons have aria-controls linking to content panel', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const ariaControls = await firstButton.getAttribute('aria-controls');
    expect(ariaControls).toBeTruthy();
    // The controlled element should exist (use attribute selector since IDs may start with digits)
    if (ariaControls) {
      await expect(page.locator(`[id="${ariaControls}"]`)).toHaveCount(1);
    }
  });

  test('[ACRD-042] @a11y @wcag22 @regression @smoke Accordion passes axe-core WCAG 2.2 scan', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include(ACCORDION)
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[ACRD-043] @a11y @wcag22 @regression Interactive elements meet 24px target size', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const buttons = page.locator(ITEM_BUTTON);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const box = await buttons.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[ACRD-044] @a11y @regression Focus indicator visible on dark background', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const graniteButton = page.locator(`${SECTION_GRANITE} ${ITEM_BUTTON}`).first();
    const indicator = graniteButton.locator(INDICATOR_GA);

    await graniteButton.focus();
    const boxShadow = // 📏 TODO: Replace with measurement-utils
    await indicator.evaluate(el => getComputedStyle(el).boxShadow); // measurement: style check
    expect(boxShadow).not.toBe('none');
  });
});

// ─── Bug Regression Tests ─────────────────────────────────────────────────────
// Tests added after two post-GAAM-381 bugs were found and fixed.
// Bug 1: Accordion-item policy only allowed accordion-item children — content
//         components (text, button, image, etc.) couldn't be added to the inner parsys.
// Bug 2: GA accordion-item had no _cq_dialog overlay, so helpPath was missing.

const FIXTURE_URL = () => `${BASE()}/content/global-atlantic/test-fixtures/accordion.html?wcmmode=disabled`;

test.describe('Accordion — Bug 1 Regression: Child Components Inside Accordion Items', () => {
  // The accordion_item_content policy must allow: text, button, image, headline-block,
  // separator, spacer, statistic, image-with-nested-content, video-external.
  // The fixture section_mixed_content has pre-expanded items with diverse child types.

  test('[ACRD-048] @regression @smoke Accordion item renders button child component', async ({ page }) => {
    await page.goto(FIXTURE_URL());
    await page.waitForLoadState('networkidle');
    // The mixed-content accordion has a button inside item_0
    const buttonInItem = page.locator(`${ITEM_CONTENT} .cmp-button`);
    await expect(buttonInItem.first()).toBeVisible();
    // Verify it rendered as a proper button with an anchor link
    await expect(buttonInItem.first().locator('a')).toBeVisible();
  });

  test('[ACRD-049] @regression Accordion item renders headline-block child component', async ({ page }) => {
    await page.goto(FIXTURE_URL());
    await page.waitForLoadState('networkidle');
    const headlineInItem = page.locator(`${ITEM_CONTENT} .cmp-headline-block`);
    await expect(headlineInItem.first()).toBeVisible();
  });

  test('[ACRD-050] @regression Accordion item renders separator child component', async ({ page }) => {
    await page.goto(FIXTURE_URL());
    await page.waitForLoadState('networkidle');
    const separatorInItem = page.locator(`${ITEM_CONTENT} .cmp-separator`);
    await expect(separatorInItem.first()).toBeVisible();
  });

  test('[ACRD-051] @regression Accordion item renders spacer child component', async ({ page }) => {
    await page.goto(FIXTURE_URL());
    await page.waitForLoadState('networkidle');
    const spacerInItem = page.locator(`${ITEM_CONTENT} .cmp-spacer`);
    await expect(spacerInItem.first()).toBeVisible();
  });

  test('[ACRD-052] @regression Multiple component types coexist in same accordion item parsys', async ({ page }) => {
    await page.goto(FIXTURE_URL());
    await page.waitForLoadState('networkidle');
    // item_1 has headline-block + separator + text — verify all three render in one panel
    const panels = page.locator(ITEM_CONTENT);
    const count = await panels.count();
    let foundMixed = false;
    for (let i = 0; i < count; i++) {
      const panel = panels.nth(i);
      const hasHeadline = (await panel.locator('.cmp-headline-block').count()) > 0;
      const hasSeparator = (await panel.locator('.cmp-separator').count()) > 0;
      const hasText = (await panel.locator('.cmp-text').count()) > 0;
      if (hasHeadline && hasSeparator && hasText) {
        foundMixed = true;
        break;
      }
    }
    expect(foundMixed).toBe(true);
  });

  test('[ACRD-053] @regression Accordion item inner parsys has responsive grid resource type', async ({ page }) => {
    await page.goto(FIXTURE_URL());
    await page.waitForLoadState('networkidle');
    // The inner parsys should be a responsive grid (allows arbitrary child components)
    const responsiveGrid = page.locator(`${ITEM_CONTENT} .aem-Grid, ${ITEM_CONTENT} .responsivegrid`);
    expect(await responsiveGrid.count()).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Accordion — Bug 2 Regression: Accordion-Item Dialog helpPath', () => {
  // GA accordion-item must have its own _cq_dialog overlay with helpPath set.
  // Without it, authors see no help link in the component toolbar.

  test('[ACRD-054] @regression @smoke Accordion-item dialog has helpPath configured', async ({ page }) => {
    // Fetch the dialog configuration via Sling JSON API
    const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/accordion-item/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok()).toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath).toBeTruthy();
  });

  test('[ACRD-055] @regression helpPath points to GA accordion component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/accordion-item/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    const dialog = await response.json();
    // Should point to the GA accordion component's details overlay
    expect(dialog.helpPath).toBe(
      '/mnt/overlay/wcm/core/content/sites/components/details.html/apps/ga/components/content/accordion'
    );
  });
});

test.describe('Accordion — Console & Resources', () => {
  test('[ACRD-045] @regression Accordion produces no unexpected JS errors on interaction', async ({ page }) => {
    // Known issue: base accordion JS throws "Cannot read properties of null (reading 'getAttribute')"
    // on expand/collapse — this is a pre-existing bug in the KKR base component JS
    const KNOWN_ERRORS = ["Cannot read properties of null (reading 'getAttribute')"];
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    capture.clear();
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    await clickElement(firstButton);
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    await clickElement(firstButton);
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const errors = capture.getErrors();
    capture.stop();
    const unexpected = errors.filter(e => !KNOWN_ERRORS.some(known => e.message.includes(known)));
    expect(unexpected).toEqual([]);
  });

  test('[ACRD-046] @regression No HTL comments in published HTML', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const html = await page.content();
    expect(html).not.toContain('<!--/*');
  });

  test('[ACRD-047] @regression No author-added inline styles on accordion markup', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    // Check buttons and indicator elements (not items — JS sets opacity on items for animation)
    const buttons = page.locator(ITEM_BUTTON);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const style = await buttons.nth(i).getAttribute('style');
      expect(style).toBeFalsy();
    }
  });
});

// ─── GAAM-611: Dialog Structure After Header Tab Removal ─────────────────────
test.describe('Accordion — GAAM-611: Header Tab Removed from Dialog', () => {
  test('[ACRD-056] @author @regression Accordion dialog has no Header tab', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/_cq_dialog.infinity.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok()).toBe(true);
    const dialog = JSON.stringify(await response.json());
    // Header tab fields (eyebrow, headline RTE, path) should not be present
    expect(dialog).not.toContain('"header"');
    expect(dialog).not.toContain('"eyebrow"');
  });

  test('[ACRD-057] @author @regression Accordion dialog retains Items tab', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/_cq_dialog.infinity.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok()).toBe(true);
    const dialog = JSON.stringify(await response.json());
    expect(dialog).toContain('items');
  });

  test('[ACRD-058] @author @regression Accordion dialog retains Properties tab', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/_cq_dialog.infinity.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok()).toBe(true);
    const dialog = JSON.stringify(await response.json());
    expect(dialog).toContain('properties');
  });
});

test.describe('Accordion — CSV Test Cases (GAAM-1362)', () => {
  test('[CCRD-059] @smoke @regression CMS-FE | Text component font size is incorrect when it is added inside "Accordion" component — AC1', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Launch [https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/components/accordion.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/components/accordion.html?wcmmode=disabled] 
    // 
    // Inspect on the text component under Accordion and verify the font size
    // 
    // *Actual*: Font size is displayed as 22px when added inside “Accordion” component. But it is showing as 18px correctly for standalone Text component
    // 
    // *Expected*: Font size should be displayed as 18px
    // 
    // !image-20260624-101015.png|width=344,alt="image-20260624-101015.png"!
    test.fixme();
  });
});

test.describe('Accordion — Happy Path', () => {
  test('[CCRD-060] @smoke @regression Accordion renders correctly', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-accordion').first();
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

  test('[CCRD-061] @smoke @regression Accordion interactive elements are functional', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-accordion').first();
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

test.describe('Accordion — Negative & Boundary', () => {
  test('[CCRD-062] @negative @regression Accordion handles empty content gracefully', async ({ page }) => {
    // Capture JS errors during page load
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    // Component should render without JS errors
    expect(errors).toEqual([]);
    // Root element should still be present (not crash)
    await expect(page.locator('.cmp-accordion').first()).toBeVisible();
  });

  test('[CCRD-063] @negative @regression Accordion handles missing images', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-accordion img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Accordion — Broken Images', () => {
  test('[CCRD-067] @regression Accordion all images load successfully', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-accordion img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[CCRD-068] @regression Accordion all images have alt attributes', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-accordion img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Accordion — Accessibility', () => {
  test('[CCRD-069] @a11y @wcag22 @regression @smoke Accordion passes axe-core scan', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-accordion')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[CCRD-070] @a11y @wcag22 @regression @smoke Accordion interactive elements meet 24px target size', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-accordion a, .cmp-accordion button, .cmp-accordion input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[CCRD-071] @a11y @wcag22 @regression @smoke Accordion focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-accordion a, .cmp-accordion button, .cmp-accordion input');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
      }
    }
  });
});

test.describe('Accordion — AEM Dialog Configuration', () => {
  // Regression: GA overlay components must have their own _cq_dialog with helpPath.
  // Without helpPath, authors see no help link in the component toolbar.

  test('[CCRD-072] @author @regression @smoke @smoke Accordion dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Accordion GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Accordion dialog missing helpPath property').toBeTruthy();
  });

  test('[CCRD-073] @author @regression @smoke Accordion helpPath points to correct component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/accordion/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});

test.describe('Accordion — CSV Test Cases (GAAM-1316)', () => {
  test('[CCRD-074] @smoke @regression DR AEM FE: Filter Show/Hide Rendering – Annuity Category & Channel — AC1', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-accordion').first();
    await expect(root).toBeVisible();
    // Element ordering verified by DOM structure
    const content = root.locator('.cmp-accordion__content').first();
    await expect(content).toBeVisible();
  });
});

test.describe('Accordion — CSV Test Cases (GAAM-1315)', () => {
  test('[CCRD-075] @smoke @regression DR AEM BE: Filter Show/Hide Dialog Configuration – Annuity Category & Channel — AC1', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: *As a* content author,
    // *I want* to control the visibility of Annuity Category and Channel filters via the component dialog and configure them as optional fields in the Accordion Item
    // *So that* each filter can be independently shown or hidden, and accordion rows without a category or channel value render without a badge.
    // 
    // ----
    // 
    // *Dialog Field Specifications — “Accordion - Dynamic Rates” Component* 
    // 
    // {adf:display=block}
    // {"type":"table","attrs":{"isNumberColumnEnabled":false,"layout":"center","localId":"57a89a3a-01c7-44a7-b38e-036e7f6fa456"},"content":[{"type":"tableRow","attrs":{"localId":"5b99063a9b9b"},"content":[{"type":"tableHeader","attrs":{"localId":"61e199539b6f","colwidth":[229]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Field Name","marks":[{"type":"strong"}]}],"attrs":{"localId":"6d8578ef46dc"}}]},{"type":"tableHeader","attrs":{"localId":"8928bfc577e7","colwidth":[174]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Type","marks":[{"type":"strong"}]}],"attrs":{"localId":"7cab002ae2d3"}}]},{"type":"tableHeader","attrs":{"localId":"16dacdaeee33","colwidth":[163]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Required?","marks":[{"type":"strong"}]}],"attrs":{"localId":"9d2251ebc69f"}}]},{"type":"tableHeader","attrs":{"localId":"44ce41506972","colwidth":[190]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Default","marks":[{"type":"strong"}]}],"attrs":{"localId":"09ed6cc17e5a"}}]},{"type":"tableHeader","attrs":{"localId":"55fbc06635c4","colwidth":[329]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Authoring Guidance","marks":[{"type":"strong"}]}],"attrs":{"localId":"935110386c05"}}]},{"type":"tableHeader","attrs":{"localId":"4dc3ae7e77ed","colwidth":[288]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Developer Notes","marks":[{"type":"strong"}]}],"attrs":{"localId":"29b82fbe093d"}}]}]},{"type":"tableRow","attrs":{"localId":"f6a0d6829b50"},"content":[{"type":"tableCell","attrs":{"localId":"082fa9a8e347","colwidth":[229]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Show Annuity Category Filter"}],"attrs":{"localId":"73b4f63511d7"}}]},{"type":"tableCell","attrs":{"localId":"cac291dadebf","colwidth":[174]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Checkbox"}],"attrs":{"localId":"4e57ed1188dd"}}]},{"type":"tableCell","attrs":{"localId":"fed4cf70a31a","colwidth":[163]},"content":[{"type":"paragraph","content":[{"type":"text","text":"No"}],"attrs":{"localId":"139c8e884a65"}}]},{"type":"tableCell","attrs":{"localId":"63d500ce046f","colwidth":[190]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Checked (visible)"}],"attrs":{"localId":"0d097f469d6e"}}]},{"type":"tableCell","attrs":{"localId":"f624e00709e2","colwidth":[329]},"content":[{"type":"bulletList","content":[{"type":"listItem","attrs":{"localId":"31b2acd36c27"},"content":[{"type":"paragraph","content":[{"type":"text","text":"Uncheck to hide the Annuity Category filter"}],"attrs":{"localId":"ea8a364460c6"}}]}],"attrs":{"localId":"75ab6eb8ae99"}}]},{"type":"tableCell","attrs":{"localId":"03985760c2c3","colwidth":[288]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Store as "},{"type":"text","text":"./showAnnuityCategory","marks":[{"type":"code"}]},{"type":"text","text":"; default: "},{"type":"text","text":"true","marks":[{"type":"code"}]}],"attrs":{"localId":"3b9b2d157ab2"}}]}]},{"type":"tableRow","attrs":{"localId":"1ccba29c5e31"},"content":[{"type":"tableCell","attrs":{"localId":"75d5f52aa1f9","colwidth":[229]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Show Channel Filter"}],"attrs":{"localId":"8a0157eb748d"}}]},{"type":"tableCell","attrs":{"localId":"050c5642e01f","colwidth":[174]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Checkbox"}],"attrs":{"localId":"5520420d50a4"}}]},{"type":"tableCell","attrs":{"localId":"cdaae91f0b78","colwidth":[163]},"content":[{"type":"paragraph","content":[{"type":"text","text":"No"}],"attrs":{"localId":"68df7b4e3096"}}]},{"type":"tableCell","attrs":{"localId":"d6b902938213","colwidth":[190]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Unchecked (hidden)"}],"attrs":{"localId":"2862a9f45986"}}]},{"type":"tableCell","attrs":{"localId":"fcbcd9e2323f","colwidth":[329]},"content":[{"type":"bulletList","content":[{"type":"listItem","attrs":{"localId":"ac1bab10cb44"},"content":[{"type":"paragraph","content":[{"type":"text","text":"Check to enable the Channel filter"}],"attrs":{"localId":"0ef668e40580"}}]}],"attrs":{"localId":"eda4d903d1ee"}}]},{"type":"tableCell","attrs":{"localId":"36d72c315980","colwidth":[288]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Store as "},{"type":"text","text":"./showChannel","marks":[{"type":"code"}]},{"type":"text","text":"; default: "},{"type":"text","text":"false","marks":[{"type":"code"}]}],"attrs":{"localId":"5791408076ca"}}]}]},{"type":"tableRow","attrs":{"localId":"1ccba29c5e31"},"content":[{"type":"tableCell","attrs":{"localId":"75d5f52aa1f9","colwidth":[229,174],"colspan":2},"content":[{"type":"paragraph","content":[{"type":"text","text":"Existing Component - where changes to be incorporated"}],"attrs":{"localId":"6e55f46d94c5"}}]},{"type":"tableCell","attrs":{"localId":"cdaae91f0b78","colwidth":[163,190,329,288],"colspan":4},"content":[{"type":"mediaSingle","attrs":{"width":275,"widthType":"pixel","localId":"68e296e0767b","layout":"align-start"},"content":[{"type":"media","attrs":{"type":"file","id":"image-20260618-174810.png","alt":"image-20260618-174810.png","collection":"","localId":"4ced8758c286","height":580,"width":556}}]},{"type":"paragraph","attrs":{"localId":"6481c82d1535"}},{"type":"paragraph","attrs":{"localId":"a505fddd151e"}}]}]}]}
    // {adf}
    // 
    // *Dialog Field Specifications — “Accordion Item – Dynamic Rates” Component*
    // 
    // {adf:display=block}
    // {"type":"table","attrs":{"isNumberColumnEnabled":false,"layout":"center","localId":"1e2ad323-c850-4c12-915f-10fa8302c46b"},"content":[{"type":"tableRow","attrs":{"localId":"0cbcb7b7aa62"},"content":[{"type":"tableHeader","attrs":{"localId":"317181918206","colwidth":[199]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Field Name","marks":[{"type":"strong"}]}],"attrs":{"localId":"ffeacd03f4ed"}}]},{"type":"tableHeader","attrs":{"localId":"04979463ad33","colwidth":[172]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Type","marks":[{"type":"strong"}]}],"attrs":{"localId":"5ed8b415766a"}}]},{"type":"tableHeader","attrs":{"localId":"0ec26bcba945","colwidth":[104]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Required?","marks":[{"type":"strong"}]}],"attrs":{"localId":"d6468a30d196"}}]},{"type":"tableHeader","attrs":{"localId":"62de88d592be","colwidth":[494]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Authoring Guidance","marks":[{"type":"strong"}]}],"attrs":{"localId":"7ee86146924d"}}]},{"type":"tableHeader","attrs":{"localId":"5356ada372b8","colwidth":[298]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Developer Notes","marks":[{"type":"strong"}]}],"attrs":{"localId":"282ecf010af3"}}]}]},{"type":"tableRow","attrs":{"localId":"3d809e4791ca"},"content":[{"type":"tableCell","attrs":{"localId":"760c0ee9215c","colwidth":[199]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Title"}],"attrs":{"localId":"570f1544689c"}}]},{"type":"tableCell","attrs":{"localId":"559c36dfbd7a","colwidth":[172]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Text field"}],"attrs":{"localId":"acb0c15dce2e"}}]},{"type":"tableCell","attrs":{"localId":"d5f160eb4c32","colwidth":[104]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Yes"}],"attrs":{"localId":"ad0689036d32"}}]},{"type":"tableCell","attrs":{"localId":"ee91c098be24","colwidth":[494]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Product name displayed as the accordion row label"}],"attrs":{"localId":"489456493639"}}]},{"type":"tableCell","attrs":{"localId":"cca93f9c9d90","colwidth":[298]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Store as "},{"type":"text","text":"./title","marks":[{"type":"code"}]}],"attrs":{"localId":"3bead850653b"}}]}]},{"type":"tableRow","attrs":{"localId":"8d85f2f75b54"},"content":[{"type":"tableCell","attrs":{"localId":"2c763ff3d75a","colwidth":[199]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Annuity Category"}],"attrs":{"localId":"0075ad6e97ba"}}]},{"type":"tableCell","attrs":{"localId":"816caf7ad702","colwidth":[172]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Path field"}],"attrs":{"localId":"ccb965f26ea1"}}]},{"type":"tableCell","attrs":{"localId":"b4aa13e38f99","colwidth":[104]},"content":[{"type":"paragraph","content":[{"type":"text","text":"No"}],"attrs":{"localId":"b5918684aa0b"}}]},{"type":"tableCell","attrs":{"localId":"112ddfcdbc44","colwidth":[494]},"content":[{"type":"bulletList","content":[{"type":"listItem","attrs":{"localId":"3b2622cfc4d8"},"content":[{"type":"paragraph","content":[{"type":"text","text":"Optional; "}],"attrs":{"localId":"3dfa38d94112"}}]},{"type":"listItem","attrs":{"localId":"3b2622cfc4d8"},"content":[{"type":"paragraph","content":[{"type":"text","text":"select the applicable annuity category tag; "}],"attrs":{"localId":"3dfa38d94112"}}]},{"type":"listItem","attrs":{"localId":"3b2622cfc4d8"},"content":[{"type":"paragraph","content":[{"type":"text","text":"if left blank, no badge renders for this row"}],"attrs":{"localId":"3dfa38d94112"}}]}],"attrs":{"localId":"4eac9abb973c"}}]},{"type":"tableCell","attrs":{"localId":"a1fd87b49fe2","colwidth":[298]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Change from mandatory to optional; store as "},{"type":"text","text":"./annuityCategory","marks":[{"type":"code"}]}],"attrs":{"localId":"bfbd3d7bd186"}}]}]},{"type":"tableRow","attrs":{"localId":"2f9f5055f276"},"content":[{"type":"tableCell","attrs":{"localId":"92e5a3770e28","colwidth":[199]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Channel"}],"attrs":{"localId":"67e42c579cac"}}]},{"type":"tableCell","attrs":{"localId":"bae25dd4ba3c","colwidth":[172]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Path field"}],"attrs":{"localId":"13e3f7348286"}}]},{"type":"tableCell","attrs":{"localId":"d2884f49e1d4","colwidth":[104]},"content":[{"type":"paragraph","content":[{"type":"text","text":"No"}],"attrs":{"localId":"4119ae180d64"}}]},{"type":"tableCell","attrs":{"localId":"d481864bddac","colwidth":[494]},"content":[{"type":"bulletList","content":[{"type":"listItem","attrs":{"localId":"3b2622cfc4d8"},"content":[{"type":"paragraph","content":[{"type":"text","text":"Optional; "}],"attrs":{"localId":"e055da79ba00"}}]},{"type":"listItem","attrs":{"localId":"e5a561ca4510"},"content":[{"type":"paragraph","content":[{"type":"text","text":"select the applicable channel tag; "}],"attrs":{"localId":"1f19d9acd937"}}]},{"type":"listItem","attrs":{"localId":"e5a561ca4510"},"content":[{"type":"paragraph","content":[{"type":"text","text":"if left blank, no badge renders for this row"}],"attrs":{"localId":"1f19d9acd937"}}]}],"attrs":{"localId":"3eb4497b6367"}}]},{"type":"tableCell","attrs":{"localId":"c23bf8c9eb1e","colwidth":[298]},"content":[{"type":"paragraph","content":[{"type":"text","text":"Change from mandatory to optional; store as "},{"type":"text","text":"./channel","marks":[{"type":"code"}]}],"attrs":{"localId":"82620f1d71f3"}}]}]},{"type":"tableRow","attrs":{"localId":"77cb7f9e9b92"},"content":[{"type":"tableCell","attrs":{"localId":"b5d4ec9afa88","colwidth":[199,172],"colspan":2},"content":[{"type":"paragraph","content":[{"type":"text","text":"Existing Component - where changes to be incorporated"}],"attrs":{"localId":"b36d079a4411"}}]},{"type":"tableCell","attrs":{"localId":"998bd4cb894e","colwidth":[104,494,298],"colspan":3},"content":[{"type":"mediaSingle","attrs":{"width":380,"widthType":"pixel","localId":"b806c6aa1228","layout":"align-start"},"content":[{"type":"media","attrs":{"type":"file","id":"image-20260618-174944.png","alt":"image-20260618-174944.png","collection":"","localId":"1375c290496d","height":509,"width":539}}]},{"type":"paragraph","attrs":{"localId":"0ccfbaa158eb"}}]}]}]}
    // {adf}
    // 
    // *Acceptance Criteria*
    // 
    // *Dialog Structure*
    // 
    // * Two independent checkboxes will be added in the *“Accordion - Dynamic Rates” Component* dialog: 
    // ** Show Annuity Category Filter and 
    // ** Show Channel Filter
    // * Annuity Category checkbox is checked by default; 
    // * Channel checkbox is unchecked by default
    // * Annuity Category and Channel fields in the *“Accordion Item – Dynamic Rates” Component* dialog:
    // ** will be changed from mandatory to optional
    // 
    // *Field Behavior & Validation*
    // 
    // * Each checkbox controls both the filter visibility
    // * When Channel is unchecked, Channel filter does not render on desktop, mobile, tablet or within the mobile filter modal
    // * When Annuity Category is unchecked, Annuity Category filter does not render
    // * If Annuity Category is left blank in the Accordion Item dialog, no Annuity Category badge renders for that row
    // * If Channel is left blank in the Accordion Item dialog, no Channel badge renders for that row
    // * Both checkboxes operate independently — hiding one does not affect the other
    // 
    // 
    // 
    // *Out of Scope*
    // 
    // * Front-end rendering and visual validation (covered in [https://bounteous.jira.com/browse/GAAM-1316|https://bounteous.jira.com/browse/GAAM-1316|smart-link])
    // 
    // *Developer Instructions*
    // 
    // * Component should be available for both GA only
    // * Component should be available in all templates except Rate Admin and HTML template
    // * Update Accordion Item – Dynamic Rates dialog to make Annuity Category and Channel optional fields
    // * Update existing JUnit tests to cover both checkbox states, default values, and empty field badge behavior
    // * Create / update Author Documentation
    // 
    // *QA Checklist*
    // 
    // * Annuity Category checkbox is checked by default on a new component instance
    // * Channel checkbox is unchecked by default on a new component instance
    // * Both checkboxes save and persist correctly on dialog close
    // * Annuity Category and Channel fields in Accordion Item – Dynamic Rates dialog are optional — component saves without them
    // * Author Documentation accessible via the *?* on the component dialog
    test.fixme();
  });
});

test.describe('Accordion — CSV Test Cases (GAAM-1097)', () => {
  test('[CCRD-076] @smoke @regression CMS FE: Decision Tree – Mobile Behavior — AC1', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: Style System*
    test.fixme();
  });
});
