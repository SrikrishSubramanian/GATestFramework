/**
 * Reusable assertion helpers for AEM component testing.
 *
 * Each helper wraps common Playwright assertions for layout, spacing,
 * background color, typography, conditional rendering, etc.
 * Modeled after patterns in navigation.author.spec.ts and button.visual.spec.ts.
 */
import { expect, Locator, Page } from '@playwright/test';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LayoutExpected {
  flexDirection?: string;
  display?: string;
  gridTemplateColumns?: string;
}

export interface SpacingExpected {
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
}

export interface TypographyExpected {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: string;
}

export interface ColumnLayoutExpected {
  columns: number;
  direction: 'row' | 'column';
}

export interface ResponsiveCSSProps {
  flexDirection?: string;
  display?: string;
  gridTemplateColumns?: string;
  gap?: string;
  padding?: string;
}

// ─── Layout Assertions ───────────────────────────────────────────────────────

/**
 * Assert CSS layout properties (display, flex-direction, grid-template, etc.)
 */
export async function assertLayout(
  locator: Locator,
  expected: LayoutExpected
): Promise<void> {
  const actual = await locator.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      flexDirection: cs.flexDirection,
      display: cs.display,
      gridTemplateColumns: cs.gridTemplateColumns,
    };
  });

  if (expected.flexDirection) {
    expect(actual.flexDirection, `Expected flex-direction: ${expected.flexDirection}`).toBe(expected.flexDirection);
  }
  if (expected.display) {
    expect(actual.display, `Expected display: ${expected.display}`).toBe(expected.display);
  }
  if (expected.gridTemplateColumns) {
    expect(actual.gridTemplateColumns, `Expected grid-template-columns: ${expected.gridTemplateColumns}`).toBe(expected.gridTemplateColumns);
  }
}

/**
 * Assert that a container is laid out as N columns in the given direction.
 */
export async function assertColumnLayout(
  locator: Locator,
  expected: ColumnLayoutExpected
): Promise<void> {
  const actual = await locator.evaluate((el) => {
    const cs = getComputedStyle(el);
    const children = el.children;
    return {
      flexDirection: cs.flexDirection,
      display: cs.display,
      childCount: children.length,
    };
  });

  // Direction check
  if (expected.direction === 'row') {
    expect(
      actual.flexDirection === 'row' || actual.display.includes('grid'),
      `Expected row layout, got flexDirection=${actual.flexDirection}, display=${actual.display}`
    ).toBe(true);
  } else {
    expect(actual.flexDirection, `Expected column layout`).toBe('column');
  }

  // Column count check (direct children count should be >= expected columns)
  if (expected.columns > 0) {
    expect(actual.childCount, `Expected at least ${expected.columns} columns`).toBeGreaterThanOrEqual(expected.columns);
  }
}

// ─── Spacing Assertions ──────────────────────────────────────────────────────

/**
 * Assert spacing (gap, padding, margin) with pixel tolerance.
 */
export async function assertSpacing(
  locator: Locator,
  expected: SpacingExpected,
  tolerance: number = 2
): Promise<void> {
  const actual = await locator.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      gap: cs.gap,
      rowGap: cs.rowGap,
      columnGap: cs.columnGap,
      padding: cs.padding,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      margin: cs.margin,
      marginTop: cs.marginTop,
      marginRight: cs.marginRight,
      marginBottom: cs.marginBottom,
      marginLeft: cs.marginLeft,
    };
  });

  for (const [prop, expectedVal] of Object.entries(expected)) {
    if (expectedVal === undefined) continue;
    const actualVal = actual[prop as keyof typeof actual];
    assertPixelValue(actualVal, expectedVal, prop, tolerance);
  }
}

/**
 * Compare pixel values with tolerance. Handles shorthand like "16px 24px".
 */
function assertPixelValue(
  actual: string,
  expected: string,
  label: string,
  tolerance: number
): void {
  const actualParts = actual.split(/\s+/).map(parseFloat);
  const expectedParts = expected.split(/\s+/).map(parseFloat);

  // If expected has fewer parts (e.g., single value), compare against first actual value
  for (let i = 0; i < expectedParts.length; i++) {
    const a = actualParts[i] || 0;
    const e = expectedParts[i];
    if (isNaN(e)) continue;
    expect(
      Math.abs(a - e),
      `${label}: expected ~${e}px, got ${a}px (tolerance ±${tolerance})`
    ).toBeLessThanOrEqual(tolerance);
  }
}

// ─── Color Assertions ────────────────────────────────────────────────────────

/**
 * Assert background-color (accepts rgb() string).
 */
export async function assertBackgroundColor(
  locator: Locator,
  expectedRgb: string
): Promise<void> {
  const actual = await locator.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(actual, `Expected background-color: ${expectedRgb}`).toBe(expectedRgb);
}

/**
 * Assert text color (accepts rgb() string).
 */
export async function assertTextColor(
  locator: Locator,
  expectedRgb: string
): Promise<void> {
  const actual = await locator.evaluate((el) => getComputedStyle(el).color);
  expect(actual, `Expected color: ${expectedRgb}`).toBe(expectedRgb);
}

/**
 * Assert that an element has a specific CSS class.
 */
export async function assertHasClass(
  locator: Locator,
  className: string
): Promise<void> {
  const classes = await locator.evaluate((el) => el.className);
  expect(classes, `Expected class "${className}" on element`).toContain(className);
}

// ─── Typography Assertions ───────────────────────────────────────────────────

/**
 * Assert typography properties (font-family, font-size, font-weight, line-height).
 */
export async function assertTypography(
  locator: Locator,
  expected: TypographyExpected
): Promise<void> {
  const actual = await locator.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      textTransform: cs.textTransform,
    };
  });

  if (expected.fontFamily) {
    expect(actual.fontFamily.toLowerCase(), `Expected font-family: ${expected.fontFamily}`)
      .toContain(expected.fontFamily.toLowerCase());
  }
  if (expected.fontSize) {
    assertPixelValue(actual.fontSize, expected.fontSize, 'font-size', 1);
  }
  if (expected.fontWeight) {
    expect(actual.fontWeight, `Expected font-weight: ${expected.fontWeight}`).toBe(expected.fontWeight);
  }
  if (expected.lineHeight) {
    assertPixelValue(actual.lineHeight, expected.lineHeight, 'line-height', 2);
  }
  if (expected.letterSpacing) {
    expect(actual.letterSpacing, `Expected letter-spacing: ${expected.letterSpacing}`).toBe(expected.letterSpacing);
  }
  if (expected.textTransform) {
    expect(actual.textTransform, `Expected text-transform: ${expected.textTransform}`).toBe(expected.textTransform);
  }
}

// ─── Alignment Assertions ────────────────────────────────────────────────────

/**
 * Assert vertical alignment of an element within its parent using bounding boxes.
 * - 'top': element is at the top of its parent
 * - 'bottom': element is at the bottom of its parent
 * - 'center': element is vertically centered in its parent
 * - 'stretch': element fills parent height
 */
export async function assertAlignment(
  locator: Locator,
  expected: 'top' | 'center' | 'bottom' | 'stretch',
  tolerance: number = 5
): Promise<void> {
  const result = await locator.evaluate((el) => {
    const parent = el.parentElement;
    if (!parent) return null;
    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      parentTop: parentRect.top,
      parentBottom: parentRect.bottom,
      parentHeight: parentRect.height,
      elTop: elRect.top,
      elBottom: elRect.bottom,
      elHeight: elRect.height,
      // Also check CSS properties
      alignSelf: getComputedStyle(el).alignSelf,
      justifyContent: getComputedStyle(parent).justifyContent,
      alignItems: getComputedStyle(parent).alignItems,
    };
  });

  if (!result) {
    throw new Error('Could not get bounding box for alignment check');
  }

  const { parentTop, parentBottom, parentHeight, elTop, elBottom, elHeight } = result;

  switch (expected) {
    case 'top':
      expect(
        Math.abs(elTop - parentTop),
        `Expected element aligned to top of parent (offset: ${Math.abs(elTop - parentTop)}px)`
      ).toBeLessThanOrEqual(tolerance);
      break;
    case 'bottom':
      expect(
        Math.abs(elBottom - parentBottom),
        `Expected element aligned to bottom of parent (offset: ${Math.abs(elBottom - parentBottom)}px)`
      ).toBeLessThanOrEqual(tolerance);
      break;
    case 'center': {
      const parentCenter = parentTop + parentHeight / 2;
      const elCenter = elTop + elHeight / 2;
      expect(
        Math.abs(parentCenter - elCenter),
        `Expected element vertically centered (offset: ${Math.abs(parentCenter - elCenter)}px)`
      ).toBeLessThanOrEqual(tolerance);
      break;
    }
    case 'stretch':
      expect(
        Math.abs(elHeight - parentHeight),
        `Expected element to stretch to parent height (diff: ${Math.abs(elHeight - parentHeight)}px)`
      ).toBeLessThanOrEqual(tolerance);
      break;
  }
}

// ─── Conditional Rendering Assertions ────────────────────────────────────────

/**
 * Assert whether an element exists in the DOM.
 */
export async function assertConditionalRendering(
  page: Page,
  selector: string,
  shouldExist: boolean
): Promise<void> {
  const count = await page.locator(selector).count();
  if (shouldExist) {
    expect(count, `Expected "${selector}" to exist in DOM`).toBeGreaterThan(0);
  } else {
    expect(count, `Expected "${selector}" to NOT exist in DOM`).toBe(0);
  }
}

/**
 * Assert that a container has no empty wrapper children (zero-child elements).
 */
export async function assertNoEmptyWrappers(locator: Locator): Promise<void> {
  const emptyCount = await locator.evaluate((el) => {
    let count = 0;
    for (const child of el.children) {
      if (child.children.length === 0 && child.textContent?.trim() === '') {
        count++;
      }
    }
    return count;
  });
  expect(emptyCount, 'Expected no empty wrapper elements').toBe(0);
}

// ─── Element Order Assertion ─────────────────────────────────────────────────

/**
 * Assert that elements appear in a specific DOM order within a container.
 */
export async function assertElementOrder(
  container: Locator,
  selectors: string[]
): Promise<void> {
  const positions = await container.evaluate((el, sels) => {
    const results: { selector: string; index: number }[] = [];
    const allChildren = Array.from(el.querySelectorAll('*'));
    for (const sel of sels) {
      const found = el.querySelector(sel);
      if (found) {
        results.push({ selector: sel, index: allChildren.indexOf(found) });
      } else {
        results.push({ selector: sel, index: -1 });
      }
    }
    return results;
  }, selectors);

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    if (prev.index === -1 || curr.index === -1) continue; // skip missing elements
    expect(
      prev.index,
      `Expected "${prev.selector}" before "${curr.selector}" in DOM order`
    ).toBeLessThan(curr.index);
  }
}

// ─── Image Assertions ────────────────────────────────────────────────────────

/**
 * Assert that an image fills its container (width/height close to container dimensions).
 */
export async function assertImageFillsContainer(
  imgLocator: Locator,
  containerLocator: Locator,
  tolerance: number = 5
): Promise<void> {
  const imgBox = await imgLocator.boundingBox();
  const containerBox = await containerLocator.boundingBox();

  expect(imgBox, 'Image bounding box should exist').not.toBeNull();
  expect(containerBox, 'Container bounding box should exist').not.toBeNull();

  if (imgBox && containerBox) {
    // Image width should fill container width
    expect(
      Math.abs(imgBox.width - containerBox.width),
      `Image width (${imgBox.width}px) should fill container width (${containerBox.width}px)`
    ).toBeLessThanOrEqual(tolerance);

    // Image height should fill container height
    expect(
      Math.abs(imgBox.height - containerBox.height),
      `Image height (${imgBox.height}px) should fill container height (${containerBox.height}px)`
    ).toBeLessThanOrEqual(tolerance);
  }
}

/**
 * Assert that an overlay element sits on top of a background element.
 * Checks that both are visible and the overlay's z-index or position overlaps.
 */
export async function assertOverlay(
  overlayLocator: Locator,
  backgroundLocator: Locator
): Promise<void> {
  const overlayBox = await overlayLocator.boundingBox();
  const bgBox = await backgroundLocator.boundingBox();

  expect(overlayBox, 'Overlay bounding box should exist').not.toBeNull();
  expect(bgBox, 'Background bounding box should exist').not.toBeNull();

  if (overlayBox && bgBox) {
    // Overlay should overlap with the background area
    const overlapsX = overlayBox.x < bgBox.x + bgBox.width && overlayBox.x + overlayBox.width > bgBox.x;
    const overlapsY = overlayBox.y < bgBox.y + bgBox.height && overlayBox.y + overlayBox.height > bgBox.y;
    expect(overlapsX && overlapsY, 'Overlay should visually overlap the background element').toBe(true);
  }

  // Check that overlay has position absolute/relative or higher z-index
  const overlayPosition = await overlayLocator.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { position: cs.position, zIndex: cs.zIndex };
  });

  expect(
    ['absolute', 'relative', 'fixed', 'sticky'].includes(overlayPosition.position) ||
    overlayPosition.zIndex !== 'auto',
    `Overlay should have positioned layout (position: ${overlayPosition.position}, z-index: ${overlayPosition.zIndex})`
  ).toBe(true);
}

// ─── Responsive Assertions ───────────────────────────────────────────────────

/**
 * Assert that CSS properties change between desktop and mobile viewports.
 */
export async function assertResponsiveSwitch(
  page: Page,
  locator: Locator,
  desktopExpected: Partial<ResponsiveCSSProps>,
  mobileExpected: Partial<ResponsiveCSSProps>,
  mobileBreakpoint: number = 768
): Promise<void> {
  // Check desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
  const desktopActual = await getResponsiveProps(locator);
  for (const [prop, val] of Object.entries(desktopExpected)) {
    if (val) {
      expect(desktopActual[prop as keyof ResponsiveCSSProps], `Desktop ${prop}`).toBe(val);
    }
  }

  // Check mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const mobileActual = await getResponsiveProps(locator);
  for (const [prop, val] of Object.entries(mobileExpected)) {
    if (val) {
      expect(mobileActual[prop as keyof ResponsiveCSSProps], `Mobile ${prop}`).toBe(val);
    }
  }
}

async function getResponsiveProps(locator: Locator): Promise<ResponsiveCSSProps> {
  return locator.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      flexDirection: cs.flexDirection,
      display: cs.display,
      gridTemplateColumns: cs.gridTemplateColumns,
      gap: cs.gap,
      padding: cs.padding,
    };
  });
}

// ─── Visibility / Hidden Assertions ──────────────────────────────────────────

/**
 * Assert that an element is hidden (display:none, visibility:hidden, or not in DOM).
 */
export async function assertHidden(locator: Locator): Promise<void> {
  const count = await locator.count();
  if (count === 0) return; // Not in DOM — passes

  const isHidden = await locator.first().evaluate((el) => {
    const cs = getComputedStyle(el);
    return cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0';
  });
  expect(isHidden, 'Expected element to be hidden').toBe(true);
}

// ─── Focus / Interaction Assertions ──────────────────────────────────────────

/**
 * Assert that an element shows a visible focus indicator when focused.
 */
export async function assertFocusIndicator(locator: Locator): Promise<void> {
  await locator.focus();
  const hasIndicator = await locator.evaluate((el) => {
    const cs = getComputedStyle(el);
    const hasOutline = cs.outline !== 'none' && cs.outline !== '' && cs.outlineWidth !== '0px';
    const hasBoxShadow = cs.boxShadow !== 'none' && cs.boxShadow !== '';
    const hasBorderChange = cs.borderColor !== 'rgb(0, 0, 0)'; // non-default border
    return hasOutline || hasBoxShadow || hasBorderChange;
  });
  expect(hasIndicator, 'Expected visible focus indicator (outline, box-shadow, or border)').toBe(true);
}

/**
 * Assert that an element has CSS transition defined for a specific property.
 */
export async function assertTransition(
  locator: Locator,
  property: string
): Promise<void> {
  const transition = await locator.evaluate((el) => getComputedStyle(el).transition);
  expect(
    transition.includes(property) || transition.includes('all'),
    `Expected CSS transition on "${property}", got: ${transition}`
  ).toBe(true);
}

// ─── Semantic HTML Assertions ────────────────────────────────────────────────

/**
 * Assert that a locator resolves to a specific HTML tag.
 */
export async function assertTagName(
  locator: Locator,
  expectedTag: string
): Promise<void> {
  const tag = await locator.evaluate((el) => el.tagName.toLowerCase());
  expect(tag, `Expected <${expectedTag}> element`).toBe(expectedTag.toLowerCase());
}

/**
 * Assert that no inline style attributes exist on elements within a container.
 */
export async function assertNoInlineStyles(
  container: Locator,
  maxElements: number = 50
): Promise<void> {
  const count = await container.locator('*[style]').count();
  expect(count, `Found ${count} elements with inline style attributes`).toBe(0);
}

/**
 * Assert BEM naming convention on root and children.
 */
export async function assertBEMNaming(
  container: Locator,
  blockClass: string
): Promise<void> {
  // Root should have the block class
  const rootClasses = await container.evaluate((el) => el.className);
  expect(rootClasses, `Root should have BEM block class "${blockClass}"`).toContain(blockClass);

  // Check children follow BEM pattern
  const invalidClasses = await container.evaluate((el, block) => {
    const invalid: string[] = [];
    for (const child of el.querySelectorAll('*')) {
      for (const cls of child.classList) {
        if (cls.startsWith(block) && !cls.match(/^[a-z][a-z0-9-]*(__[a-z][a-z0-9-]*)?(--[a-z][a-z0-9-]*)?$/)) {
          invalid.push(cls);
        }
      }
    }
    return invalid;
  }, blockClass);

  expect(invalidClasses, `Found non-BEM class names: ${invalidClasses.join(', ')}`).toEqual([]);
}
