import { test, expect } from '@playwright/test';
import { AccordionPage } from '../../../pages/ga/components/accordionPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
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
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    await expect(firstContent).toHaveAttribute('aria-hidden', 'false');
  });

  test('[ACRD-015] @regression Clicking an expanded button collapses the item', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const firstContent = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`).first();

    // Expand
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');

    // Collapse
    await firstButton.click();
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
    const transition = await indicator.evaluate(el => getComputedStyle(el).transition);
    expect(transition).toContain('background-color');
  });

  test('[ACRD-018] @regression @interaction Icon vertical line has rotation transition', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const vertLine = page.locator(`${SECTION_WHITE} ${ICON_LINE_V}`).first();
    const transition = await vertLine.evaluate(el => getComputedStyle(el).transition);
    expect(transition).toContain('transform');
  });

  test('[ACRD-019] @regression @interaction Expanded item icon vertical line is rotated/hidden', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();

    // Expand and wait for 300ms CSS transition to complete
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    await page.waitForTimeout(500);

    // Vertical line should have opacity 0 (rotated to form minus)
    const vertLine = firstButton.locator(ICON_LINE_V);
    const opacity = await vertLine.evaluate(el => getComputedStyle(el).opacity);
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
    const vOpacity = await vLine.evaluate(el => getComputedStyle(el).opacity);
    expect(Number(vOpacity)).toBe(1);
  });
});

test.describe('Accordion — Hover & Focus States', () => {
  test('[ACRD-021] @interaction @regression Hover changes icon background color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const indicator = firstButton.locator(INDICATOR_GA);

    const bgBefore = await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
    await firstButton.hover();
    const bgAfter = await indicator.evaluate(el => getComputedStyle(el).backgroundColor);
    // Background should darken on hover
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('[ACRD-022] @interaction @regression Focus shows double-ring outline on icon', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const indicator = firstButton.locator(INDICATOR_GA);

    await firstButton.focus();
    const boxShadow = await indicator.evaluate(el => getComputedStyle(el).boxShadow);
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
    const borderColor = await graniteItem.evaluate(el => getComputedStyle(el).borderBottomColor);
    // Should be white (rgb(255, 255, 255)) on dark background
    expect(borderColor).toContain('255');
  });

  test('[ACRD-025] @regression Granite: button text uses white color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const graniteButton = page.locator(`${SECTION_GRANITE} ${ITEM_BUTTON}`).first();
    const color = await graniteButton.evaluate(el => getComputedStyle(el).color);
    // Should be white on dark background
    expect(color).toContain('255');
  });

  test('[ACRD-026] @regression Azul: item borders use white color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const azulItem = page.locator(`${SECTION_AZUL} ${ITEM}`).first();
    const borderColor = await azulItem.evaluate(el => getComputedStyle(el).borderBottomColor);
    expect(borderColor).toContain('255');
  });

  test('[ACRD-027] @regression Azul: button text uses white color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const azulButton = page.locator(`${SECTION_AZUL} ${ITEM_BUTTON}`).first();
    const color = await azulButton.evaluate(el => getComputedStyle(el).color);
    expect(color).toContain('255');
  });

  test('[ACRD-028] @regression Granite: icon lines use white color', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const graniteLine = page.locator(`${SECTION_GRANITE} ${ICON_LINE_H}`).first();
    const bgColor = await graniteLine.evaluate(el => getComputedStyle(el).backgroundColor);
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
      const color = await heading.evaluate(el => getComputedStyle(el).color);
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
      expect(classes).not.toContain('--added-padding');
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

    await firstButton.click();
    await expect(firstContent).toHaveAttribute('aria-hidden', 'false');
    const borderLeft = await firstContent.evaluate(el => getComputedStyle(el).borderLeftStyle);
    expect(borderLeft).toBe('solid');
  });

  test('[ACRD-032] @regression Collapsed panel has transparent border', async ({ page }) => {
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const firstContent = page.locator(`${SECTION_WHITE} ${ITEM_CONTENT}`).first();
    await expect(firstContent).toHaveAttribute('aria-hidden', 'true');
    const borderColor = await firstContent.evaluate(el => getComputedStyle(el).borderLeftColor);
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
    await page.waitForTimeout(500); // Wait for expansion animation

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

    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('[ACRD-037] @mobile @regression Mobile font size adjusts', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new AccordionPage(page);
    await pom.navigate(BASE());
    const button = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    const mobileSize = await button.evaluate(el => parseFloat(getComputedStyle(el).fontSize));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);
    const desktopSize = await button.evaluate(el => parseFloat(getComputedStyle(el).fontSize));

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
    const boxShadow = await indicator.evaluate(el => getComputedStyle(el).boxShadow);
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
    await page.waitForTimeout(1000);
    capture.clear();
    const firstButton = page.locator(`${SECTION_WHITE} ${ITEM_BUTTON}`).first();
    await firstButton.click();
    await page.waitForTimeout(500);
    await firstButton.click();
    await page.waitForTimeout(500);
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
