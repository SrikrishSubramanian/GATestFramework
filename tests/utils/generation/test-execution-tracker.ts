/**
 * Test Execution Tracker
 * Captures real-time test execution data (pass/fail/duration/errors) during Playwright runs
 */

import * as fs from 'fs';
import * as path from 'path';

export interface TestCaseExecution {
  testId: string;
  testName: string;
  component: string;
  category: string;
  tags: string[];
  status: 'passed' | 'failed' | 'skipped' | 'timeout';
  duration: number; // ms
  startTime: string;
  endTime: string;
  browser: string;
  viewport?: string;
  error?: {
    message: string;
    stack?: string;
    failureType: 'assertion' | 'timeout' | 'error' | 'unknown';
    failedLine?: string;
    expectedVsActual?: {
      expected: string;
      actual: string;
    };
  };
  screenshots?: string[];
  logs?: string[];
}

export interface ComponentExecution {
  component: string;
  status: 'passed' | 'partial' | 'failed';
  totalTests: number;
  passCount: number;
  failCount: number;
  skippedCount: number;
  passRate: string;
  totalDuration: number;
  tests: TestCaseExecution[];
}

export interface TestRunReport {
  runId: string;
  timestamp: string;
  environment: string;
  browsers: string[];
  executionStartTime: string;
  executionEndTime: string;
  executionDuration: number; // ms

  // Overall stats
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    skippedTests: number;
    passRate: string;
    averageTestDuration: number;
  };

  // Tag coverage
  tagCoverage: {
    [tag: string]: {
      total: number;
      passed: number;
      failed: number;
      passRate: string;
    };
  };

  // Component breakdown
  componentBreakdown: ComponentExecution[];

  // Failed tests detail
  failedTests: TestCaseExecution[];

  // Category breakdown
  categoryStats: {
    [category: string]: {
      total: number;
      passed: number;
      failed: number;
      passRate: string;
    };
  };
}

export class ExecutionTracker {
  private testExecutions: TestCaseExecution[] = [];
  private componentExecutions: Map<string, ComponentExecution> = new Map();
  private runId: string;
  private startTime: Date;
  private environment: string;
  private browsers: string[];

  constructor(environment: string = 'local', browsers: string[] = ['chromium']) {
    this.runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.startTime = new Date();
    this.environment = environment;
    this.browsers = browsers;
  }

  recordTestExecution(test: TestCaseExecution): void {
    this.testExecutions.push(test);

    // Update component tracking
    const component = test.component;
    if (!this.componentExecutions.has(component)) {
      this.componentExecutions.set(component, {
        component,
        status: 'passed',
        totalTests: 0,
        passCount: 0,
        failCount: 0,
        skippedCount: 0,
        passRate: '100%',
        totalDuration: 0,
        tests: [],
      });
    }

    const comp = this.componentExecutions.get(component)!;
    comp.tests.push(test);
    comp.totalTests++;
    comp.totalDuration += test.duration;

    if (test.status === 'passed') {
      comp.passCount++;
    } else if (test.status === 'failed') {
      comp.failCount++;
    } else if (test.status === 'skipped') {
      comp.skippedCount++;
    }

    // Update component status
    if (comp.failCount > 0) {
      comp.status = 'failed';
    } else if (comp.skippedCount > 0) {
      comp.status = 'partial';
    }

    comp.passRate = `${((comp.passCount / comp.totalTests) * 100).toFixed(1)}%`;
  }

  generateReport(): TestRunReport {
    const endTime = new Date();
    const executionDuration = endTime.getTime() - this.startTime.getTime();

    // Calculate summary stats
    const total = this.testExecutions.length;
    const passed = this.testExecutions.filter(t => t.status === 'passed').length;
    const failed = this.testExecutions.filter(t => t.status === 'failed').length;
    const skipped = this.testExecutions.filter(t => t.status === 'skipped').length;
    const totalDuration = this.testExecutions.reduce((sum, t) => sum + t.duration, 0);

    // Calculate tag coverage
    const tagCoverage: { [key: string]: { total: number; passed: number; failed: number; passRate: string } } = {};
    this.testExecutions.forEach(test => {
      test.tags.forEach(tag => {
        if (!tagCoverage[tag]) {
          tagCoverage[tag] = { total: 0, passed: 0, failed: 0, passRate: '0%' };
        }
        tagCoverage[tag].total++;
        if (test.status === 'passed') {
          tagCoverage[tag].passed++;
        } else if (test.status === 'failed') {
          tagCoverage[tag].failed++;
        }
      });
    });

    Object.keys(tagCoverage).forEach(tag => {
      const stat = tagCoverage[tag];
      stat.passRate = `${((stat.passed / stat.total) * 100).toFixed(1)}%`;
    });

    // Calculate category stats
    const categoryStats: { [key: string]: { total: number; passed: number; failed: number; passRate: string } } = {};
    this.testExecutions.forEach(test => {
      const cat = test.category;
      if (!categoryStats[cat]) {
        categoryStats[cat] = { total: 0, passed: 0, failed: 0, passRate: '0%' };
      }
      categoryStats[cat].total++;
      if (test.status === 'passed') {
        categoryStats[cat].passed++;
      } else if (test.status === 'failed') {
        categoryStats[cat].failed++;
      }
    });

    Object.keys(categoryStats).forEach(cat => {
      const stat = categoryStats[cat];
      stat.passRate = `${((stat.passed / stat.total) * 100).toFixed(1)}%`;
    });

    // Get failed tests
    const failedTests = this.testExecutions.filter(t => t.status === 'failed');

    return {
      runId: this.runId,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      browsers: this.browsers,
      executionStartTime: this.startTime.toISOString(),
      executionEndTime: endTime.toISOString(),
      executionDuration,
      summary: {
        totalTests: total,
        passedTests: passed,
        failedTests: failed,
        skippedTests: skipped,
        passRate: `${((passed / total) * 100).toFixed(1)}%`,
        averageTestDuration: Math.round(totalDuration / total),
      },
      tagCoverage,
      componentBreakdown: Array.from(this.componentExecutions.values()),
      failedTests,
      categoryStats,
    };
  }

  saveReport(outputDir: string = 'tests/data/reports'): string {
    const report = this.generateReport();

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const reportPath = path.join(outputDir, `test-run-${this.runId}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`✓ Test execution report saved: ${reportPath}`);
    return reportPath;
  }
}
