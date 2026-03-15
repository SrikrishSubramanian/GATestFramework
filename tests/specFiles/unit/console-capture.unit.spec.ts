import { test, expect } from '@playwright/test';
import { ConsoleCapture } from '../../utils/infra/console-capture';

test.describe('ConsoleCapture — Unit Tests', () => {
  test('captures console errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();

    await page.setContent('<div>Test</div>');
    await page.evaluate(() => {
      console.error('Test JS error');
    });

    // Small wait for async event delivery
    await page.waitForTimeout(100);

    const errors = capture.getErrors();
    expect(errors.length).toBeGreaterThanOrEqual(1);
    expect(errors.some(e => e.message.includes('Test JS error'))).toBe(true);
    expect(errors[0].type).toBe('error');
    expect(errors[0].timestamp).toBeTruthy();

    capture.stop();
  });

  test('captures page errors (unhandled exceptions)', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();

    await page.setContent('<div>Test</div>');
    await page.evaluate(() => {
      setTimeout(() => { throw new Error('Unhandled test error'); }, 0);
    });

    await page.waitForTimeout(200);

    const errors = capture.getErrors();
    expect(errors.some(e => e.type === 'pageerror')).toBe(true);
    expect(errors.some(e => e.message.includes('Unhandled test error'))).toBe(true);

    capture.stop();
  });

  test('captures console warnings', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();

    await page.setContent('<div>Test</div>');
    await page.evaluate(() => {
      console.warn('Test warning');
    });

    await page.waitForTimeout(100);

    const warnings = capture.getWarnings();
    expect(warnings.length).toBeGreaterThanOrEqual(1);
    expect(warnings[0].type).toBe('warning');

    capture.stop();
  });

  test('getAll returns errors + warnings + response errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();

    await page.setContent('<div>Test</div>');
    await page.evaluate(() => {
      console.error('err1');
      console.warn('warn1');
    });

    await page.waitForTimeout(100);

    const all = capture.getAll();
    expect(all.length).toBeGreaterThanOrEqual(2);

    capture.stop();
  });

  test('hasErrors returns true when JS errors present', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();

    await page.setContent('<div>Test</div>');
    await page.evaluate(() => {
      console.error('some error');
    });

    await page.waitForTimeout(100);
    expect(capture.hasErrors()).toBe(true);

    capture.stop();
  });

  test('hasErrors returns false with no errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();

    await page.setContent('<div>Clean page</div>');
    await page.waitForTimeout(100);

    expect(capture.hasErrors()).toBe(false);

    capture.stop();
  });

  test('clear resets captured entries', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();

    await page.setContent('<div>Test</div>');
    await page.evaluate(() => console.error('err'));
    await page.waitForTimeout(100);

    expect(capture.getAll().length).toBeGreaterThan(0);
    capture.clear();
    expect(capture.getAll()).toHaveLength(0);

    capture.stop();
  });

  test('formatForReport returns human-readable output', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();

    await page.setContent('<div>Test</div>');
    await page.evaluate(() => {
      console.error('format test error');
    });

    await page.waitForTimeout(100);

    const report = capture.formatForReport();
    expect(report).toContain('[error]');
    expect(report).toContain('format test error');

    capture.stop();
  });

  test('formatForReport handles empty entries', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    await page.setContent('<div>Clean</div>');
    await page.waitForTimeout(50);

    expect(capture.formatForReport()).toBe('No console issues captured.');

    capture.stop();
  });

  test('stop removes listeners (no further capture)', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();

    await page.setContent('<div>Test</div>');
    capture.stop();

    await page.evaluate(() => console.error('after stop'));
    await page.waitForTimeout(100);

    // The error after stop should not be captured
    expect(capture.getErrors()).toHaveLength(0);
  });
});
