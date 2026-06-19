import { test, expect } from '@playwright/test';
import { NavigationPage } from '../../../pages/ga/components/navigationPage';
import ENV from '../../../../tests/utils/infra/env';
import { ConsoleCapture } from '../../../../tests/utils/infra/console-capture';
import { loginToAEMAuthor } from '../../../../tests/utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../../tests/utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../../tests/utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const MOBILE = { width: 390, height: 844 };
const DESKTOP = { width: 1440, height: 900 };

const NAV = '.cmp-navigation';
const GROUP = '.cmp-navigation__group';
const ITEM_L0 = '.cmp-navigation__item--level-0';
const ITEM_L1 = '.cmp-navigation__item--level-1';
const LINK = '.cmp-navigation__item-link';
const SECTION_WHITE = '.cmp-section--background-color-white';
const SECTION_GRANITE = '.cmp-section--background-color-granite';

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

// ── Desktop Hover & Focus States ──

test.describe('Navigation — Desktop Hover & Focus (GAAM-395)', () => {
  test('[NVGT-INT-001] @interaction @regression Link hover adds rounded background on light bg', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    // Target interactive links (not grouped headings with pointer-events: none)
    const link = page.locator(`${SECTION_WHITE} ${ITEM_L1} ${LINK}, ${SECTION_WHITE} ${NAV}:not(:has(${ITEM_L1})) ${LINK}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.scrollIntoViewIfNeeded();
    const bgBefore = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    await hover(link);
    const bgAfter = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    expect(bgAfter).not.toBe(bgBefore);
    const borderRadius = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => getComputedStyle(el).borderRadius); // measurement: use measurement-utils for cleaner code
    expect(parseFloat(borderRadius)).toBeGreaterThanOrEqual(20);
  });

  test('[NVGT-INT-002] @interaction @regression Link hover on dark bg changes background', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`${SECTION_GRANITE} ${ITEM_L1} ${LINK}, ${SECTION_GRANITE} ${NAV}:not(:has(${ITEM_L1})) ${LINK}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.scrollIntoViewIfNeeded();
    const bgBefore = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    await hover(link);
    const bgAfter = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => getComputedStyle(el).backgroundColor); // measurement: use measurement-utils for cleaner code
    expect(bgAfter).not.toBe(bgBefore);
  });

  test('[NVGT-INT-003] @interaction @a11y @regression Focus-visible indicator on light background', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`${SECTION_WHITE} ${LINK}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    const hasIndicator = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => {
      const cs = getComputedStyle(el);
      const bgChanged = cs.backgroundColor !== 'rgba(0, 0, 0, 0)';
      const outlineW = parseFloat(cs.outlineWidth) || 0;
      const boxShadow = cs.boxShadow !== 'none';
      return bgChanged || outlineW > 0 || boxShadow;
    });
    expect(hasIndicator).toBe(true);
  });

  test('[NVGT-INT-004] @interaction @a11y @regression Focus-visible on dark bg uses box-shadow', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const link = page.locator(`${SECTION_GRANITE} ${LINK}`).first();
    if (await link.count() === 0) { test.skip(); return; }
    await link.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    const boxShadow = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => getComputedStyle(el).boxShadow); // measurement: use measurement-utils for cleaner code
    expect(boxShadow).not.toBe('none');
  });
});

// ── Mobile Accordion Transitions ──

test.describe('Navigation — Mobile Accordion Interactions (GAAM-396)', () => {
  test('[NVGT-INT-005] @interaction @mobile @regression Accordion expand shows child links', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(NAV).filter({ has: page.locator(ITEM_L1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const trigger = groupedNav.locator(ITEM_L0).first();
    const childGroup = trigger.locator(`:scope > ${GROUP}`);
    const displayBefore = // 📏 TODO: Replace with measurement-utils
    await childGroup.evaluate(el => getComputedStyle(el).display); // measurement: use measurement-utils for cleaner code
    expect(displayBefore).toBe('none');
    await trigger.locator(`:scope > ${LINK}`).click();
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const displayAfter = // 📏 TODO: Replace with measurement-utils
    await childGroup.evaluate(el => getComputedStyle(el).display); // measurement: use measurement-utils for cleaner code
    expect(displayAfter).not.toBe('none');
  });

  test('[NVGT-INT-006] @interaction @mobile @regression Plus icon changes to minus on expand', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(NAV).filter({ has: page.locator(ITEM_L1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const trigger = groupedNav.locator(ITEM_L0).first();
    const link = trigger.locator(`:scope > ${LINK}`);
    const collapsedContent = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => getComputedStyle(el, '::after').content); // measurement: use measurement-utils for cleaner code
    expect(collapsedContent).toContain('+');
    await clickElement(link);
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const expandedContent = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => getComputedStyle(el, '::after').content); // measurement: use measurement-utils for cleaner code
    expect(expandedContent).not.toContain('+');
  });

  test('[NVGT-INT-007] @interaction @mobile @regression Expanding one section closes other', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(NAV).filter({ has: page.locator(ITEM_L1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const triggers = groupedNav.locator(ITEM_L0);
    const count = await triggers.count();
    test.skip(count < 2, 'Need at least 2 accordion sections');
    await triggers.nth(0).locator(`:scope > ${LINK}`).click();
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    expect(await triggers.nth(0).evaluate(el => el.classList.contains('cmp-navigation__item--expanded'))).toBe(true);
    await triggers.nth(1).locator(`:scope > ${LINK}`).click();
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    expect(await triggers.nth(1).evaluate(el => el.classList.contains('cmp-navigation__item--expanded'))).toBe(true);
    expect(await triggers.nth(0).evaluate(el => el.classList.contains('cmp-navigation__item--expanded'))).toBe(false);
  });

  test('[NVGT-INT-008] @interaction @mobile @regression Accordion icon is 32px circular', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(NAV).filter({ has: page.locator(ITEM_L1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const link = groupedNav.locator(`${ITEM_L0} > ${LINK}`).first();
    const afterStyles = // 📏 TODO: Replace with measurement-utils
    await link.evaluate(el => {
      const cs = getComputedStyle(el, '::after');
      return { width: cs.width, height: cs.height, borderRadius: cs.borderRadius };
    });
    expect(afterStyles.width).toBe('32px');
    expect(afterStyles.height).toBe('32px');
    expect(afterStyles.borderRadius).toBe('50%');
  });
});

// ── Keyboard Navigation ──

test.describe('Navigation — Keyboard Navigation', () => {
  test('[NVGT-INT-009] @interaction @a11y @regression Tab cycles through nav links', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const nav = page.locator(`${SECTION_WHITE} ${NAV}`).first();
    if (await nav.count() === 0) { test.skip(); return; }
    const links = nav.locator(LINK);
    const count = await links.count();
    expect(count).toBeGreaterThan(1);
    await links.first().focus();
    const firstText = await links.first().textContent();
    await page.keyboard.press('Tab');
    const focusedText = // 📏 TODO: Replace with measurement-utils
    await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focusedText).not.toBe(firstText?.trim());
  });

  test('[NVGT-INT-010] @interaction @mobile @a11y @regression Enter key opens accordion on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(NAV).filter({ has: page.locator(ITEM_L1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const trigger = groupedNav.locator(ITEM_L0).first();
    const link = trigger.locator(`:scope > ${LINK}`);
    await link.focus();
    await page.keyboard.press('Enter');
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    const expanded = // 📏 TODO: Replace with measurement-utils
    await trigger.evaluate(el => el.classList.contains('cmp-navigation__item--expanded'));
    expect(expanded).toBe(true);
  });
});

// ── Responsive Layout Transition ──

test.describe('Navigation — Responsive Transition', () => {
  test('[NVGT-INT-011] @interaction @regression Horizontal nav: row at desktop, column at mobile', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const nav = page.locator(`${SECTION_WHITE} ${NAV}`).first();
    if (await nav.count() === 0) { test.skip(); return; }
    const group = nav.locator(`> ${GROUP}`);
    expect(// 📏 TODO: Replace with measurement-utils
    await group.evaluate(el => getComputedStyle(el).flexDirection)).toBe('row'); // measurement: use measurement-utils for cleaner code
    await page.setViewportSize(MOBILE);
    // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
    expect(// 📏 TODO: Replace with measurement-utils
    await group.evaluate(el => getComputedStyle(el).flexDirection)).toBe('column'); // measurement: use measurement-utils for cleaner code
  });

  test('[NVGT-INT-012] @interaction @mobile @regression Accordion dividers between sections', async ({ page }) => {
    await page.setViewportSize(MOBILE);
    const pom = new NavigationPage(page);
    await pom.navigate(BASE());
    const groupedNav = page.locator(NAV).filter({ has: page.locator(ITEM_L1) }).first();
    if (await groupedNav.count() === 0) { test.skip(); return; }
    const secondItem = groupedNav.locator(ITEM_L0).nth(1);
    if (await secondItem.count() === 0) { test.skip(); return; }
    const hasBorder = // 📏 TODO: Replace with measurement-utils
    await secondItem.evaluate(el => {
      const before = getComputedStyle(el, '::before');
      return before.borderTopWidth !== '0px' && before.content !== 'none';
    });
    expect(hasBorder).toBe(true);
  });
});
