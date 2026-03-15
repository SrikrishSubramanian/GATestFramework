import * as fs from 'fs';
import * as path from 'path';
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';
import { TestLogger, TestRunResult, CSVMetadataInfo } from './test-logger';
import { loadSyncResults, formatSyncWarnings } from './fixture-sync-checker';

/**
 * Custom Playwright reporter that feeds results into TestLogger.
 * Produces per-run JSON logs in logs/YYYY-MM-DD/run-<timestamp>.json
 * with full test details, mapping each test to its result.
 */
class TestRunReporter implements Reporter {
  private logger!: TestLogger;
  private loadedMetaFiles = new Set<string>();

  onBegin(config: FullConfig, suite: Suite): void {
    const env = process.env.env || 'unknown';
    const browser = config.projects[0]?.name || 'unknown';
    this.logger = new TestLogger(env, browser);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const testId = this.extractTestId(test.title);

    // Load CSV metadata sidecar if available (once per spec file)
    this.loadMetaSidecar(test.location.file);

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

    // Also enhance the Playwright results.json with CSV metadata
    this.enhanceResultsJson();

    // Show fixture sync warnings prominently at the end of the run
    const syncReport = loadSyncResults();
    if (syncReport?.hasWarnings) {
      console.warn(formatSyncWarnings(syncReport));
    }
  }

  /**
   * Post-process Playwright's results.json to inject CSV metadata at the top level.
   * Finds the results.json in the current report directory and adds csvMetadata field.
   */
  private enhanceResultsJson(): void {
    const log = this.logger.getLog();
    if (!log.csvMetadata) return;

    // Find the results.json written by the JSON reporter in playwright-report/
    const reportRoot = path.resolve(__dirname, '..', '..', 'playwright-report');
    if (!fs.existsSync(reportRoot)) return;

    // Get the most recent date folder, then the most recent run folder
    const dateDirs = fs.readdirSync(reportRoot)
      .filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d))
      .sort()
      .reverse();

    for (const dateDir of dateDirs) {
      const datePath = path.join(reportRoot, dateDir);
      const runDirs = fs.readdirSync(datePath)
        .filter(d => d.startsWith('run-'))
        .sort()
        .reverse();

      for (const runDir of runDirs) {
        const resultsPath = path.join(datePath, runDir, 'results.json');
        if (fs.existsSync(resultsPath)) {
          try {
            const resultsData = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
            resultsData.csvMetadata = log.csvMetadata;
            fs.writeFileSync(resultsPath, JSON.stringify(resultsData, null, 2), 'utf-8');
            console.log(`📎 CSV metadata injected into ${path.relative(process.cwd(), resultsPath)}`);
          } catch {
            // Ignore if results.json is not ready yet
          }
          return; // Only enhance the latest one
        }
      }
    }
  }

  /**
   * Extract test ID from title. Expected format: "[BTN-001] test name"
   */
  private extractTestId(title: string): string | null {
    const match = title.match(/^\[([A-Z]+-\d+)\]/);
    return match ? match[1] : null;
  }

  /**
   * Load CSV metadata from a .meta.json sidecar file next to the spec file.
   * Only loads once per spec file path.
   */
  private loadMetaSidecar(specFile: string): void {
    if (this.loadedMetaFiles.has(specFile)) return;
    this.loadedMetaFiles.add(specFile);

    // Look for <component>.meta.json next to <component>.<mode>.spec.ts
    const metaPath = specFile.replace(/\.\w+\.spec\.ts$/, '.meta.json');
    if (fs.existsSync(metaPath)) {
      try {
        const meta: CSVMetadataInfo = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        this.logger.setCSVMetadata(meta);
      } catch {
        // Ignore malformed sidecar files
      }
    }
  }
}

export default TestRunReporter;
