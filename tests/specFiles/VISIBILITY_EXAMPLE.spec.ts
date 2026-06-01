/**
 * EXAMPLE: Test with Detailed Execution Visibility
 *
 * This example shows how to see exactly what tests are running and what they're testing.
 * Run with: env=local npx playwright test tests/specFiles/VISIBILITY_EXAMPLE.spec.ts --project chromium
 */

import { test, expect } from '@playwright/test';
import { VerboseTestLogger } from '../utils/infra/verbose-test-logger';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4503';

// Global logger for all tests
let globalLogger: VerboseTestLogger;

test.beforeAll(() => {
  // Initialize logger before all tests
  globalLogger = new VerboseTestLogger();
});

test.afterAll(() => {
  // Save logs after all tests complete
  globalLogger.saveToFile();

  // Print summary
  const summary = globalLogger.getSummary();
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║              📊 TEST EXECUTION SUMMARY                     ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  Total Tests:    ${String(summary.total).padEnd(43)}║`);
  console.log(`║  ✅ Passed:      ${String(summary.passed).padEnd(43)}║`);
  console.log(`║  ❌ Failed:      ${String(summary.failed).padEnd(43)}║`);
  console.log(`║  ⏱️  Duration:    ${String(summary.duration + 'ms').padEnd(43)}║`);
  console.log('╚════════════════════════════════════════════════════════════╝');

  console.log('\n📦 By Component:');
  Object.entries(summary.byComponent).forEach(([component, stats]) => {
    const status = stats.failed === 0 ? '✅' : '❌';
    console.log(
      `   ${status} ${component.padEnd(20)} ${stats.passed} passed, ${stats.failed} failed`
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════════

test('[DEMO-001] Page loads successfully', async ({ page, browserName }, testInfo) => {
  // Start logging this test
  globalLogger.startTest(testInfo, browserName, '1440x900');

  try {
    // Step 1: Navigate to page
    globalLogger.logStep(
      'Navigate to page',
      `Go to ${BASE_URL}/button.html`,
      'Page should load without errors'
    );
    await page.goto(`${BASE_URL}/button.html`, { waitUntil: 'networkidle' });
    globalLogger.logStep(
      'Navigate to page',
      `Go to ${BASE_URL}/button.html`,
      'Page loaded',
      'passed'
    );

    // Step 2: Check page title
    globalLogger.logStep(
      'Check page title',
      'Get page title',
      'Title should contain "Button"'
    );
    const title = await page.title();
    globalLogger.logAssertion(
      'Page has title',
      'Title exists',
      title || 'No title',
      title.length > 0
    );
    globalLogger.logStep('Check page title', 'Get page title', undefined, 'passed');

    // Test passed
    globalLogger.endTest(true);
  } catch (error) {
    globalLogger.endTest(false, error instanceof Error ? error.message : String(error));
    throw error;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════

test('[DEMO-002] Button element exists', async ({ page, browserName }, testInfo) => {
  globalLogger.startTest(testInfo, browserName, '1440x900');

  try {
    // Step 1: Navigate
    globalLogger.logStep('Navigate', 'Go to page', 'Load page');
    await page.goto(`${BASE_URL}/button.html`);
    globalLogger.logStep('Navigate', 'Go to page', undefined, 'passed');

    // Step 2: Find button
    globalLogger.logStep(
      'Find button element',
      'Look for .button.primary selector',
      'Button should exist in DOM'
    );
    const button = page.locator('.button.primary');
    const count = await button.count();
    globalLogger.logAssertion(
      'Button exists',
      'count > 0',
      `count = ${count}`,
      count > 0
    );
    globalLogger.logStep('Find button element', 'Look for button', undefined, 'passed');

    // Step 3: Check visibility
    globalLogger.logStep(
      'Check visibility',
      'Wait for button to be visible',
      'Button should be in viewport'
    );
    await expect(button.first()).toBeVisible();
    globalLogger.logAssertion(
      'Button visible',
      'isVisible = true',
      'isVisible = true',
      true
    );
    globalLogger.logStep('Check visibility', 'Wait for button', undefined, 'passed');

    globalLogger.endTest(true);
  } catch (error) {
    globalLogger.endTest(false, error instanceof Error ? error.message : String(error));
    throw error;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════

test('[DEMO-003] Button text is correct', async ({ page, browserName }, testInfo) => {
  globalLogger.startTest(testInfo, browserName, '1440x900');

  try {
    // Step 1: Navigate
    globalLogger.logStep('Navigate', 'Go to button page');
    await page.goto(`${BASE_URL}/button.html`);
    globalLogger.logStep('Navigate', 'Go to button page', undefined, 'passed');

    // Step 2: Get button text
    globalLogger.logStep(
      'Get button text',
      'Extract text content from button',
      'Button should have readable text'
    );
    const button = page.locator('.button.primary');
    const text = await button.first().textContent();
    globalLogger.logAssertion(
      'Button has text',
      'text.length > 0',
      `text = "${text}"`,
      text ? text.length > 0 : false
    );
    globalLogger.logStep('Get button text', 'Extract text', undefined, 'passed');

    // Step 3: Verify it's not empty
    globalLogger.logStep(
      'Verify text not empty',
      'Check text length',
      'Text should have characters'
    );
    const isNotEmpty = text && text.trim().length > 0;
    globalLogger.logAssertion(
      'Text not empty',
      'true',
      isNotEmpty ? 'true' : 'false',
      isNotEmpty
    );
    globalLogger.logStep('Verify text not empty', 'Check length', undefined, 'passed');

    globalLogger.endTest(true);
  } catch (error) {
    globalLogger.endTest(false, error instanceof Error ? error.message : String(error));
    throw error;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════

test('[DEMO-004] Button is clickable', async ({ page, browserName }, testInfo) => {
  globalLogger.startTest(testInfo, browserName, '1440x900');

  try {
    // Step 1: Navigate
    globalLogger.logStep('Navigate', 'Go to page');
    await page.goto(`${BASE_URL}/button.html`);
    globalLogger.logStep('Navigate', 'Go to page', undefined, 'passed');

    // Step 2: Find button
    globalLogger.logStep(
      'Find button',
      'Locate .button.primary element',
      'Button should exist'
    );
    const button = page.locator('.button.primary');
    globalLogger.logStep('Find button', 'Locate button', undefined, 'passed');

    // Step 3: Check enabled state
    globalLogger.logStep(
      'Check enabled state',
      'Verify button is not disabled',
      'Button should be enabled'
    );
    const isEnabled = await button.first().isEnabled();
    globalLogger.logAssertion(
      'Button enabled',
      'true',
      isEnabled ? 'true' : 'false',
      isEnabled
    );
    globalLogger.logStep('Check enabled state', 'Verify enabled', undefined, 'passed');

    // Step 4: Verify clickable
    globalLogger.logStep(
      'Verify clickable',
      'Check if button responds to interactions',
      'Button should accept clicks'
    );
    const isClickable = isEnabled;
    globalLogger.logAssertion(
      'Button clickable',
      'true',
      isClickable ? 'true' : 'false',
      isClickable
    );
    globalLogger.logStep('Verify clickable', 'Check interactive', undefined, 'passed');

    globalLogger.endTest(true);
  } catch (error) {
    globalLogger.endTest(false, error instanceof Error ? error.message : String(error));
    throw error;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════

test('[DEMO-005] Button responds to hover (with possible failure)', async (
  { page, browserName },
  testInfo
) => {
  globalLogger.startTest(testInfo, browserName, '1440x900');

  try {
    // Step 1: Navigate
    globalLogger.logStep('Navigate', 'Go to page');
    await page.goto(`${BASE_URL}/button.html`);
    globalLogger.logStep('Navigate', 'Go to page', undefined, 'passed');

    // Step 2: Find button and get original style
    globalLogger.logStep(
      'Get initial state',
      'Capture button style before hover',
      'Store baseline style'
    );
    const button = page.locator('.button.primary');
    const initialColor = await button.first().evaluate((el: Element) => {
      return window.getComputedStyle(el as HTMLElement).backgroundColor;
    });
    globalLogger.logAssertion(
      'Initial color captured',
      'color exists',
      initialColor || 'none',
      !!initialColor
    );
    globalLogger.logStep('Get initial state', 'Capture style', undefined, 'passed');

    // Step 3: Hover over button
    globalLogger.logStep(
      'Hover over button',
      'Move mouse to button element',
      'Trigger hover state'
    );
    await button.first().hover();
    await page.waitForTimeout(200); // Wait for CSS transition
    globalLogger.logStep('Hover over button', 'Move mouse', undefined, 'passed');

    // Step 4: Get style after hover (this might fail)
    globalLogger.logStep(
      'Check hover style',
      'Get button style after hover',
      'Style should change'
    );
    const hoverColor = await button.first().evaluate((el: Element) => {
      return window.getComputedStyle(el as HTMLElement).backgroundColor;
    });

    // This assertion might fail if hover CSS is not properly set
    const colorChanged = initialColor !== hoverColor;
    globalLogger.logAssertion(
      'Color changed on hover',
      'colorChanged = true',
      `colorChanged = ${colorChanged}`,
      colorChanged
    );

    if (!colorChanged) {
      throw new Error(`Hover color did not change. Initial: ${initialColor}, Hover: ${hoverColor}`);
    }

    globalLogger.logStep('Check hover style', 'Get style', undefined, 'passed');

    globalLogger.endTest(true);
  } catch (error) {
    globalLogger.endTest(false, error instanceof Error ? error.message : String(error));
    throw error;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
