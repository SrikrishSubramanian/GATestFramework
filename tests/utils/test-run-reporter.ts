import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import { TestLogger, TestRunResult } from './test-logger';

/**
 * Custom Playwright reporter that feeds results into TestLogger.
 * Produces per-run JSON logs in logs/YYYY-MM-DD/run-<timestamp>.json
 * with full test details, mapping each test to its result.
 */
class TestRunReporter implements Reporter {
  private logger!: TestLogger;

  onBegin(config: FullConfig, suite: Suite): void {
    const env = process.env.env || 'unknown';
    const browser = config.projects[0]?.name || 'unknown';
    this.logger = new TestLogger(env, browser);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const testId = this.extractTestId(test.title);

    const logResult: TestRunResult = {
      testName: test.title,
      status:
        result.status === 'passed' ? 'passed'
        : result.status === 'failed' ? 'failed'
        : result.status === 'timedOut' ? 'timedOut'
        : 'skipped',
      duration: result.duration,
      browser: test.parent?.project()?.name || 'unknown',
      errors: result.errors.map((e) => e.message || String(e)),
      screenshots: result.attachments
        .filter((a) => a.contentType.startsWith('image/'))
        .map((a) => a.path || ''),
    };

    // Attach test ID if present
    if (testId) {
      (logResult as any).testId = testId;
    }

    // Attach spec file path for traceability
    (logResult as any).specFile = test.location.file;
    (logResult as any).line = test.location.line;

    this.logger.addResult(logResult);
  }

  onEnd(result: FullResult): void {
    const logPath = this.logger.save();
    console.log(`\n📋 Test run log saved: ${logPath}`);
  }

  /**
   * Extract test ID from title. Expected format: "[BTN-001] test name"
   */
  private extractTestId(title: string): string | null {
    const match = title.match(/^\[([A-Z]+-\d+)\]/);
    return match ? match[1] : null;
  }
}

export default TestRunReporter;
