/**
 * Custom Playwright Reporter for Test Execution Tracking
 * Captures real-time test data and generates comprehensive reports
 */

import { Reporter, TestCase, TestResult, Suite } from '@playwright/test/reporter';
import { ExecutionTracker } from '../generation/test-execution-tracker';
import { DetailedReportGenerator } from '../generation/detailed-report-generator';
import * as path from 'path';
import * as fs from 'fs';

export class CustomExecutionReporter implements Reporter {
  private tracker: ExecutionTracker;
  private env: string;
  private browsers: string[];

  constructor(options: { env?: string; browsers?: string[] } = {}) {
    this.env = options.env || process.env.env || 'local';
    this.browsers = options.browsers || ['chromium'];
    this.tracker = new ExecutionTracker(this.env, this.browsers);
  }

  onBegin(config: any, suite: Suite) {
    console.log(`\n📊 Starting test execution tracking...`);
    console.log(`   Environment: ${this.env}`);
    console.log(`   Browsers: ${this.browsers.join(', ')}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const component = this.extractComponent(test.file);
    const category = this.extractCategory(test.title);
    const tags = this.extractTags(test.title);

    // Format error details if test failed
    let errorDetail: any = undefined;
    if (result.errors && result.errors.length > 0) {
      const error = result.errors[0];
      errorDetail = {
        message: error.message || 'Unknown error',
        stack: error.stack,
        failureType: this.getFailureType(result),
        failedLine: this.extractFailedLine(error.stack),
      };

      // Try to extract expected vs actual from assertion errors
      if (error.message.includes('Expected') && error.message.includes('received')) {
        const parts = error.message.split('received');
        if (parts.length === 2) {
          errorDetail.expectedVsActual = {
            expected: parts[0].replace('Expected', '').trim(),
            actual: parts[1].trim(),
          };
        }
      }
    }

    // Record the test execution
    this.tracker.recordTestExecution({
      testId: test.id,
      testName: test.title,
      component,
      category,
      tags,
      status: this.mapStatus(result.status),
      duration: result.duration,
      startTime: new Date(result.startTime).toISOString(),
      endTime: new Date(result.startTime + result.duration).toISOString(),
      browser: test.parent?.project?.name || 'unknown',
      viewport: this.extractViewport(test),
      error: errorDetail,
      screenshots: result.attachments
        ?.filter(a => a.mimeType?.startsWith('image'))
        .map(a => a.path)
        .filter((p): p is string => Boolean(p)) || [],
      logs: this.extractLogs(result),
    });
  }

  onEnd() {
    const report = this.tracker.generateReport();

    // Ensure reports directory exists
    const reportsDir = 'tests/data/reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Save JSON report
    const jsonReportPath = this.tracker.saveReport(reportsDir);

    // Generate HTML report
    const generator = new DetailedReportGenerator(report);
    const htmlReportPath = generator.saveReport(reportsDir);

    // Print summary
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ TEST EXECUTION COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\n📈 Summary:`);
    console.log(`   Total Tests:    ${report.summary.totalTests}`);
    console.log(`   ✓ Passed:       ${report.summary.passedTests} (${report.summary.passRate})`);
    console.log(`   ✗ Failed:       ${report.summary.failedTests}`);
    console.log(`   ⊘ Skipped:      ${report.summary.skippedTests}`);
    console.log(`   ⏱ Duration:     ${this.formatDuration(report.executionDuration)}`);
    console.log(`   ⌛ Avg/Test:     ${report.summary.averageTestDuration}ms`);

    if (report.failedTests.length > 0) {
      console.log(`\n❌ Failed Tests by Component:`);
      const byComponent: { [key: string]: typeof report.failedTests } = {};
      report.failedTests.forEach(test => {
        if (!byComponent[test.component]) {
          byComponent[test.component] = [];
        }
        byComponent[test.component].push(test);
      });

      Object.entries(byComponent).forEach(([comp, tests]) => {
        console.log(`   ${comp}: ${tests.length} failure(s)`);
        tests.forEach(test => {
          console.log(`      • ${test.testName}`);
          if (test.error) {
            console.log(`        └─ ${test.error.failureType}: ${test.error.message.split('\n')[0]}`);
          }
        });
      });
    }

    console.log(`\n📊 Reports Generated:`);
    console.log(`   📋 JSON:  ${jsonReportPath}`);
    console.log(`   🌐 HTML:  ${htmlReportPath}`);
    console.log(`\n💡 Open the HTML report in your browser for interactive analysis.`);
    console.log(`${'='.repeat(60)}\n`);
  }

  private extractComponent(filePath: string): string {
    // Extract from path like: tests/specFiles/ga/button/button.spec.ts
    const match = filePath.match(/\/ga\/([^/]+)\//);
    if (match) return match[1];

    // Fallback to filename
    const filename = path.basename(filePath);
    return filename.split('.')[0];
  }

  private extractCategory(title: string): string {
    const lower = title.toLowerCase();

    if (lower.includes('interaction')) return 'interaction';
    if (lower.includes('matrix') || lower.includes('state')) return 'state-matrix';
    if (lower.includes('visual')) return 'visual';
    if (lower.includes('image') || lower.includes('broken')) return 'broken-images';
    if (lower.includes('console') || lower.includes('error')) return 'console-errors';
    if (lower.includes('accessibility') || lower.includes('a11y')) return 'accessibility';
    if (lower.includes('responsive') || lower.includes('mobile')) return 'responsive';
    if (lower.includes('negative')) return 'negative';

    return 'happy-path';
  }

  private extractTags(title: string): string[] {
    const tags: string[] = [];
    const lower = title.toLowerCase();

    if (lower.includes('smoke') || lower.includes('@smoke')) tags.push('@smoke');
    if (lower.includes('regression') || lower.includes('@regression')) tags.push('@regression');
    if (lower.includes('a11y') || lower.includes('accessibility') || lower.includes('@a11y'))
      tags.push('@a11y');
    if (lower.includes('wcag')) tags.push('@wcag22');
    if (lower.includes('mobile') || lower.includes('@mobile')) tags.push('@mobile');
    if (lower.includes('visual') || lower.includes('@visual')) tags.push('@visual');
    if (lower.includes('interaction') || lower.includes('@interaction')) tags.push('@interaction');
    if (lower.includes('matrix') || lower.includes('@matrix')) tags.push('@matrix');
    if (lower.includes('negative') || lower.includes('@negative')) tags.push('@negative');

    // Default tags if none detected
    if (tags.length === 0) {
      tags.push('@regression');
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private extractViewport(test: TestCase): string | undefined {
    const viewport = test.parent?.project?.use?.viewport;
    if (viewport && viewport.width && viewport.height) {
      return `${viewport.width}x${viewport.height}`;
    }
    return undefined;
  }

  private mapStatus(status: string): 'passed' | 'failed' | 'skipped' | 'timeout' {
    if (status === 'passed') return 'passed';
    if (status === 'failed') return 'failed';
    if (status === 'skipped') return 'skipped';
    if (status === 'timedOut') return 'timeout';
    return 'failed';
  }

  private getFailureType(result: TestResult): 'assertion' | 'timeout' | 'error' | 'unknown' {
    if (result.status === 'timedOut') return 'timeout';

    const errorMessage = result.errors?.[0]?.message || '';
    if (errorMessage.includes('expect') || errorMessage.includes('Expected')) {
      return 'assertion';
    }

    return 'error';
  }

  private extractFailedLine(stack?: string): string | undefined {
    if (!stack) return undefined;

    const lines = stack.split('\n');
    for (const line of lines) {
      // Look for the actual test file line
      if (line.includes('.spec.ts') || line.includes('.test.ts')) {
        return line.trim();
      }
    }

    // Fallback to first meaningful line
    return lines[0]?.trim();
  }

  private extractLogs(result: TestResult): string[] {
    // Placeholder for log extraction
    // Could integrate with console capture or other logging mechanisms
    return [];
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }
}

export default CustomExecutionReporter;
