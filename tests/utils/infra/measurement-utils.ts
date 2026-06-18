import { Locator, Page } from '@playwright/test';

/**
 * Get natural dimensions of an image element
 * @param image - Image locator
 * @returns Object with naturalWidth and naturalHeight
 */
export async function getImageDimensions(
  image: Locator
): Promise<{ naturalWidth: number; naturalHeight: number; loaded: boolean }> {
  const dimensions = await image.evaluate((el: HTMLImageElement) => ({
    naturalWidth: el.naturalWidth,
    naturalHeight: el.naturalHeight,
    loaded: el.complete,
    src: el.src,
  }));

  return {
    naturalWidth: dimensions.naturalWidth,
    naturalHeight: dimensions.naturalHeight,
    loaded: dimensions.loaded,
  };
}

/**
 * Get element dimensions and position
 * @param element - Element locator
 * @returns Object with width, height, offsetWidth, offsetHeight, clientWidth, clientHeight
 */
export async function getElementMeasurements(
  element: Locator
): Promise<{
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  boundingBox: { x: number; y: number; width: number; height: number } | null;
}> {
  const measurements = await element.evaluate((el: HTMLElement) => ({
    offsetWidth: el.offsetWidth,
    offsetHeight: el.offsetHeight,
    clientWidth: el.clientWidth,
    clientHeight: el.clientHeight,
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
    getBoundingClientRect: JSON.stringify(el.getBoundingClientRect()),
  }));

  const bbox = JSON.parse(measurements.getBoundingClientRect);

  return {
    width: bbox.width,
    height: bbox.height,
    offsetWidth: measurements.offsetWidth,
    offsetHeight: measurements.offsetHeight,
    clientWidth: measurements.clientWidth,
    clientHeight: measurements.clientHeight,
    scrollWidth: measurements.scrollWidth,
    scrollHeight: measurements.scrollHeight,
    boundingBox: {
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
    },
  };
}

/**
 * Check if element has overflow
 * @param element - Element locator
 * @returns Object with overflow info for x and y axes
 */
export async function getElementOverflow(
  element: Locator
): Promise<{ overflowX: boolean; overflowY: boolean; hasOverflow: boolean }> {
  const overflow = await element.evaluate((el: HTMLElement) => ({
    overflowX: el.scrollWidth > el.clientWidth,
    overflowY: el.scrollHeight > el.clientHeight,
  }));

  return {
    overflowX: overflow.overflowX,
    overflowY: overflow.overflowY,
    hasOverflow: overflow.overflowX || overflow.overflowY,
  };
}

/**
 * Get element's computed style for specific properties
 * @param element - Element locator
 * @param properties - Array of CSS property names to check
 * @returns Object with computed style values
 */
export async function getComputedStyles(
  element: Locator,
  properties: string[]
): Promise<Record<string, string>> {
  const styles = await element.evaluate((el: HTMLElement, props: string[]) => {
    const computed = getComputedStyle(el);
    const result: Record<string, string> = {};

    props.forEach(prop => {
      result[prop] = computed.getPropertyValue(prop);
    });

    return result;
  }, properties);

  return styles;
}

/**
 * Get element's visibility state
 * @param element - Element locator
 * @returns Object with visibility info
 */
export async function getElementVisibility(
  element: Locator
): Promise<{
  isVisible: boolean;
  isHidden: boolean;
  displayNone: boolean;
  visibilityHidden: boolean;
  opacityZero: boolean;
}> {
  const visibility = await element.evaluate((el: HTMLElement) => {
    const computed = getComputedStyle(el);
    const isVisible =
      computed.display !== 'none' &&
      computed.visibility !== 'hidden' &&
      computed.opacity !== '0';

    return {
      isVisible,
      isHidden: !isVisible,
      displayNone: computed.display === 'none',
      visibilityHidden: computed.visibility === 'hidden',
      opacityZero: computed.opacity === '0',
      display: computed.display,
      visibility: computed.visibility,
      opacity: computed.opacity,
    };
  });

  return {
    isVisible: visibility.isVisible,
    isHidden: visibility.isHidden,
    displayNone: visibility.displayNone,
    visibilityHidden: visibility.visibilityHidden,
    opacityZero: visibility.opacityZero,
  };
}

/**
 * Get viewport measurements
 * @param page - Playwright page object
 * @returns Object with viewport dimensions
 */
export async function getViewportMeasurements(
  page: Page
): Promise<{ innerWidth: number; innerHeight: number; outerWidth: number; outerHeight: number }> {
  const measurements = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
  }));

  return measurements;
}
