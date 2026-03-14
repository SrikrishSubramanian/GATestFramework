import * as fs from 'fs';
import * as path from 'path';

export interface TestRunResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut';
  duration: number;
  browser: string;
  errors?: string[];
  screenshots?: string[];
  traceFile?: string;
  locatorFallbacks?: Array<{
    element: string;
    primaryStrategy: string;
    usedStrategy: string;
  }>;
}

export interface CSVMetadataInfo {
  testName?: string;
  jiraId?: string;
  testedUrl?: string;
  figmaLink?: string;
  component?: string;
}

export interface TestRunLog {
  runId: string;
  timestamp: string;
  environment: string;
  browser: string;
  csvMetadata?: CSVMetadataInfo;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestRunResult[];
}

/**
 * Per-run JSON logger. Writes structured test run data to logs/ directory.
 * Log path: logs/YYYY-MM-DD/run-<timestamp>.json
 */
export class TestLogger {
  private log: TestRunLog;
  private logDir: string;
  private logFile: string;

  constructor(environment: string = 'local', browser: string = 'chromium') {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timestamp = now.toISOString().replace(/[:.]/g, '-');

    this.logDir = path.resolve(__dirname, '..', '..', 'logs', dateStr);
    this.logFile = path.join(this.logDir, `run-${timestamp}.json`);

    this.log = {
      runId: `run-${timestamp}`,
      timestamp: now.toISOString(),
      environment,
      browser,
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0,
      results: [],
    };
  }

  setCSVMetadata(metadata: CSVMetadataInfo): void {
    this.log.csvMetadata = metadata;
  }

  addResult(result: TestRunResult): void {
    this.log.results.push(result);
    this.log.totalTests++;
    this.log.duration += result.duration;

    switch (result.status) {
      case 'passed':
        this.log.passed++;
        break;
      case 'failed':
        this.log.failed++;
        break;
      case 'skipped':
        this.log.skipped++;
        break;
    }
  }

  save(): string {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
    fs.writeFileSync(this.logFile, JSON.stringify(this.log, null, 2), 'utf-8');
    return this.logFile;
  }

  getLog(): TestRunLog {
    return { ...this.log };
  }

  getLogPath(): string {
    return this.logFile;
  }
}
