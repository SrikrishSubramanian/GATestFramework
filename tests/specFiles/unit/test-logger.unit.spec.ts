import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { TestLogger } from '../../utils/test-logger';

test.describe('TestLogger — Unit Tests', () => {
  let logger: TestLogger;

  test.beforeEach(() => {
    logger = new TestLogger('test-env', 'chromium');
  });

  test.afterEach(() => {
    // Clean up any written log files
    const logPath = logger.getLogPath();
    if (fs.existsSync(logPath)) {
      fs.unlinkSync(logPath);
      const dir = path.dirname(logPath);
      try { fs.rmdirSync(dir); } catch { /* dir not empty or already gone */ }
    }
  });

  test('initializes with correct metadata', () => {
    const log = logger.getLog();
    expect(log.environment).toBe('test-env');
    expect(log.browser).toBe('chromium');
    expect(log.totalTests).toBe(0);
    expect(log.passed).toBe(0);
    expect(log.failed).toBe(0);
    expect(log.skipped).toBe(0);
    expect(log.runId).toContain('run-');
    expect(log.timestamp).toBeTruthy();
  });

  test('addResult tracks passed tests', () => {
    logger.addResult({
      testName: 'test 1',
      status: 'passed',
      duration: 500,
      browser: 'chromium',
    });
    const log = logger.getLog();
    expect(log.totalTests).toBe(1);
    expect(log.passed).toBe(1);
    expect(log.failed).toBe(0);
    expect(log.duration).toBe(500);
  });

  test('addResult tracks failed tests', () => {
    logger.addResult({
      testName: 'test fail',
      status: 'failed',
      duration: 1200,
      browser: 'chromium',
      errors: ['Element not found'],
    });
    const log = logger.getLog();
    expect(log.totalTests).toBe(1);
    expect(log.failed).toBe(1);
    expect(log.results[0].errors).toContain('Element not found');
  });

  test('addResult tracks skipped tests', () => {
    logger.addResult({
      testName: 'test skip',
      status: 'skipped',
      duration: 0,
      browser: 'chromium',
    });
    const log = logger.getLog();
    expect(log.skipped).toBe(1);
  });

  test('addResult accumulates duration', () => {
    logger.addResult({ testName: 'a', status: 'passed', duration: 100, browser: 'chromium' });
    logger.addResult({ testName: 'b', status: 'passed', duration: 200, browser: 'chromium' });
    logger.addResult({ testName: 'c', status: 'failed', duration: 300, browser: 'chromium' });
    const log = logger.getLog();
    expect(log.totalTests).toBe(3);
    expect(log.passed).toBe(2);
    expect(log.failed).toBe(1);
    expect(log.duration).toBe(600);
  });

  test('save writes JSON file to disk', () => {
    logger.addResult({ testName: 'test save', status: 'passed', duration: 50, browser: 'chromium' });
    const filePath = logger.save();
    expect(fs.existsSync(filePath)).toBe(true);

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    expect(content.totalTests).toBe(1);
    expect(content.environment).toBe('test-env');
    expect(content.results).toHaveLength(1);
  });

  test('save creates nested date directories', () => {
    logger.addResult({ testName: 'test dir', status: 'passed', duration: 10, browser: 'chromium' });
    const filePath = logger.save();
    const dirName = path.basename(path.dirname(filePath));
    // Should be YYYY-MM-DD format
    expect(dirName).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('getLogPath returns expected path pattern', () => {
    const logPath = logger.getLogPath();
    expect(logPath).toContain('logs');
    expect(logPath).toContain('run-');
    expect(logPath).toMatch(/\.json$/);
  });

  test('tracks locator fallback data in results', () => {
    logger.addResult({
      testName: 'test fallback',
      status: 'passed',
      duration: 100,
      browser: 'chromium',
      locatorFallbacks: [
        { element: 'submitBtn', primaryStrategy: 'testid', usedStrategy: 'css' },
      ],
    });
    const log = logger.getLog();
    expect(log.results[0].locatorFallbacks).toHaveLength(1);
    expect(log.results[0].locatorFallbacks![0].element).toBe('submitBtn');
  });
});
