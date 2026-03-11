import { TestInfo } from '@playwright/test';
import { ConsoleCapture, CapturedConsoleEntry } from './console-capture';
import { TestLogger, TestRunResult } from './test-logger';

/**
 * Enhances Playwright HTML reports with additional metadata:
 * - Console errors/warnings as test attachments
 * - Environment info as annotations
 * - Locator fallback data as annotations
 * - Visual diff images as attachments
 */

/**
 * Attach console capture data to test report.
 */
export async function attachConsoleCapture(
  testInfo: TestInfo,
  capture: ConsoleCapture
): Promise<void> {
  const all = capture.getAll();
  if (all.length === 0) return;

  const report = capture.formatForReport();
  await testInfo.attach('console-output', {
    body: Buffer.from(report, 'utf-8'),
    contentType: 'text/plain',
  });

  // Add error count as annotation
  const errors = capture.getErrors();
  if (errors.length > 0) {
    testInfo.annotations.push({
      type: 'console-errors',
      description: `${errors.length} JS error(s) detected`,
    });
  }

  const responseErrors = capture.getResponseErrors();
  if (responseErrors.length > 0) {
    testInfo.annotations.push({
      type: 'response-errors',
      description: `${responseErrors.length} failed HTTP request(s)`,
    });
  }
}

/**
 * Add environment info as test annotations.
 */
export function annotateEnvironment(
  testInfo: TestInfo,
  env: string,
  mode: 'author' | 'publish'
): void {
  testInfo.annotations.push(
    { type: 'environment', description: env },
    { type: 'mode', description: mode }
  );
}

/**
 * Add locator fallback info as test annotations.
 */
export function annotateLocatorFallback(
  testInfo: TestInfo,
  element: string,
  primaryStrategy: string,
  usedStrategy: string
): void {
  testInfo.annotations.push({
    type: 'locator-fallback',
    description: `${element}: primary "${primaryStrategy}" failed, used "${usedStrategy}"`,
  });
}

/**
 * Create a test result entry for the logger from Playwright TestInfo.
 */
export function testInfoToLogResult(testInfo: TestInfo): TestRunResult {
  const result: TestRunResult = {
    testName: testInfo.title,
    status: testInfo.status === 'passed' ? 'passed'
      : testInfo.status === 'failed' ? 'failed'
      : testInfo.status === 'timedOut' ? 'timedOut'
      : 'skipped',
    duration: testInfo.duration,
    browser: testInfo.project.name,
    errors: testInfo.errors.map(e => e.message || String(e)),
    screenshots: testInfo.attachments
      .filter(a => a.contentType.startsWith('image/'))
      .map(a => a.path || ''),
  };

  // Extract locator fallback annotations
  const fallbacks = testInfo.annotations
    .filter(a => a.type === 'locator-fallback')
    .map(a => {
      const match = a.description?.match(/^(.+): primary "(.+)" failed, used "(.+)"$/);
      return match
        ? { element: match[1], primaryStrategy: match[2], usedStrategy: match[3] }
        : null;
    })
    .filter((f): f is NonNullable<typeof f> => f !== null);

  if (fallbacks.length > 0) {
    result.locatorFallbacks = fallbacks;
  }

  return result;
}

/**
 * Attach a text summary to the test report.
 */
export async function attachSummary(
  testInfo: TestInfo,
  name: string,
  content: string
): Promise<void> {
  await testInfo.attach(name, {
    body: Buffer.from(content, 'utf-8'),
    contentType: 'text/plain',
  });
}
