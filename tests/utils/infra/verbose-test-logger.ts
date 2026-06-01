/**
 * Verbose Test Logger
 * Logs detailed execution info: what's being tested, assertions, results
 * Shows real-time progress with test details
 */

import { TestInfo, TestCase } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface TestExecutionStep {
  stepName: string;
  action: string;
  assertion?: string;
  status: 'pending' | 'executing' | 'passed' | 'failed';
  timestamp: string;
  duration?: number;
  error?: string;
}

export interface TestExecutionLog {
  testId: string;
  testName: string;
  component: string;
  category: string;
  tags: string[];
  status: 'passed' | 'failed' | 'skipped' | 'timeout';
  startTime: string;
  endTime: string;
  duration: number;
  steps: TestExecutionStep[];
  assertions: string[];
  error?: string;
  browser: string;
  viewport?: string;
}

export class VerboseTestLogger {
  private currentTest: TestExecutionLog | null = null;
  private logs: TestExecutionLog[] = [];
  private logFile: string;
  private consoleOutput: string[] = [];

  constructor(logDir: string = 'tests/data/test-execution-logs') {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.logFile = path.join(logDir, `test-execution-${timestamp}.log`);
  }

  /**
   * Start logging a test
   */
  startTest(testInfo: TestInfo, browser: string, viewport?: string): void {
    const testName = testInfo.title;
    const component = this.extractComponent(testInfo.file);
    const category = this.extractCategory(testName);
    const tags = this.extractTags(testName);

    this.currentTest = {
      testId: this.generateTestId(component, testInfo.titlePath),
      testName,
      component,
      category,
      tags,
      status: 'passed',
      startTime: new Date().toISOString(),
      endTime: '',
      duration: 0,
      steps: [],
      assertions: [],
      browser,
      viewport,
    };

    this.logConsole('', '═'.repeat(80));
    this.logConsole('🧪 TEST START', `${this.currentTest.testId} - ${testName}`);
    this.logConsole('📦 Component', component);
    this.logConsole('📋 Category', category);
    this.logConsole('🏷️  Tags', tags.join(', '));
    this.logConsole('🌐 Browser', `${browser} ${viewport || 'desktop'}`);
    this.logConsole('⏱️  Started', new Date().toLocaleTimeString());
    this.logConsole('', '');
  }

  /**
   * Log a test step
   */
  logStep(
    stepName: string,
    action: string,
    assertion?: string,
    status: 'executing' | 'passed' | 'failed' = 'executing'
  ): void {
    if (!this.currentTest) return;

    const step: TestExecutionStep = {
      stepName,
      action,
      assertion,
      status,
      timestamp: new Date().toISOString(),
    };

    this.currentTest.steps.push(step);

    const statusIcon = {
      executing: '⏳',
      passed: '✅',
      failed: '❌',
    }[status];

    this.logConsole('', `${statusIcon} STEP: ${stepName}`);
    this.logConsole('   Action', action);
    if (assertion) {
      this.logConsole('   Assertion', assertion);
    }
  }

  /**
   * Log an assertion
   */
  logAssertion(
    assertion: string,
    expected: string,
    actual: string,
    passed: boolean = true
  ): void {
    if (!this.currentTest) return;

    const assertionText = `${assertion} | Expected: ${expected} | Actual: ${actual}`;
    this.currentTest.assertions.push(assertionText);

    const icon = passed ? '✅' : '❌';
    this.logConsole('', `${icon} ASSERTION: ${assertion}`);
    this.logConsole('   Expected', expected);
    this.logConsole('   Actual', actual);
  }

  /**
   * End logging a test
   */
  endTest(passed: boolean, error?: string): void {
    if (!this.currentTest) return;

    const endTime = new Date();
    const startTime = new Date(this.currentTest.startTime);
    const duration = endTime.getTime() - startTime.getTime();

    this.currentTest.status = passed ? 'passed' : 'failed';
    this.currentTest.endTime = endTime.toISOString();
    this.currentTest.duration = duration;
    if (error) {
      this.currentTest.error = error;
    }

    const statusIcon = passed ? '✅' : '❌';
    const statusText = passed ? 'PASSED' : 'FAILED';

    this.logConsole('', '');
    this.logConsole('🧪 TEST END', `${statusIcon} ${statusText}`);
    this.logConsole('⏱️  Duration', `${duration}ms`);
    this.logConsole('📊 Steps Executed', this.currentTest.steps.length.toString());
    this.logConsole('📝 Assertions', this.currentTest.assertions.length.toString());

    if (error) {
      this.logConsole('❌ Error', error);
    }

    this.logConsole('', '═'.repeat(80));
    this.logConsole('', '');

    this.logs.push(this.currentTest);
    this.currentTest = null;
  }

  /**
   * Log a message to both console and file
   */
  private logConsole(label: string, message: string): void {
    let output: string;

    if (label) {
      output = `[${label}] ${message}`;
    } else {
      output = message;
    }

    console.log(output);
    this.consoleOutput.push(output);
  }

  /**
   * Save all logs to file
   */
  saveToFile(): void {
    const output = this.consoleOutput.join('\n');
    fs.writeFileSync(this.logFile, output, 'utf-8');

    // Also save JSON version
    const jsonPath = this.logFile.replace('.log', '.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.logs, null, 2), 'utf-8');

    console.log(`\n✅ Test logs saved to: ${this.logFile}`);
    console.log(`✅ JSON logs saved to: ${jsonPath}`);
  }

  /**
   * Get all test logs
   */
  getLogs(): TestExecutionLog[] {
    return this.logs;
  }

  /**
   * Extract component from test file path
   */
  private extractComponent(filePath: string): string {
    const match = filePath.match(/\/ga\/([^/]+)\//);
    if (match) return match[1];
    return 'unknown';
  }

  /**
   * Extract category from test name
   */
  private extractCategory(testName: string): string {
    const lower = testName.toLowerCase();
    if (lower.includes('interaction')) return 'interaction';
    if (lower.includes('matrix') || lower.includes('state')) return 'state-matrix';
    if (lower.includes('visual')) return 'visual';
    if (lower.includes('image') || lower.includes('broken')) return 'broken-images';
    if (lower.includes('accessibility') || lower.includes('a11y')) return 'accessibility';
    if (lower.includes('responsive') || lower.includes('mobile')) return 'responsive';
    if (lower.includes('negative')) return 'negative';
    return 'happy-path';
  }

  /**
   * Extract tags from test name
   */
  private extractTags(testName: string): string[] {
    const tags: string[] = [];
    const lower = testName.toLowerCase();

    if (lower.includes('smoke') || lower.includes('@smoke')) tags.push('@smoke');
    if (lower.includes('regression') || lower.includes('@regression'))
      tags.push('@regression');
    if (lower.includes('a11y') || lower.includes('accessibility') || lower.includes('@a11y'))
      tags.push('@a11y');
    if (lower.includes('mobile') || lower.includes('@mobile')) tags.push('@mobile');
    if (lower.includes('visual') || lower.includes('@visual')) tags.push('@visual');

    return [...new Set(tags)];
  }

  /**
   * Generate test ID
   */
  private generateTestId(component: string, titlePath: string[]): string {
    const prefix = component.slice(0, 3).toUpperCase();
    const testNum = titlePath.length;
    return `[${prefix}-${String(testNum).padStart(3, '0')}]`;
  }

  /**
   * Get summary
   */
  getSummary(): {
    total: number;
    passed: number;
    failed: number;
    duration: number;
    byComponent: { [key: string]: { passed: number; failed: number } };
  } {
    const summary = {
      total: this.logs.length,
      passed: this.logs.filter(l => l.status === 'passed').length,
      failed: this.logs.filter(l => l.status === 'failed').length,
      duration: this.logs.reduce((sum, l) => sum + l.duration, 0),
      byComponent: {} as { [key: string]: { passed: number; failed: number } },
    };

    // Group by component
    this.logs.forEach(log => {
      if (!summary.byComponent[log.component]) {
        summary.byComponent[log.component] = { passed: 0, failed: 0 };
      }
      if (log.status === 'passed') {
        summary.byComponent[log.component].passed++;
      } else {
        summary.byComponent[log.component].failed++;
      }
    });

    return summary;
  }
}
