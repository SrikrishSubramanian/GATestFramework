/**
 * Sprint Report Generator
 *
 * Generates detailed reports organized by sprint
 * - Groups tests by sprint
 * - Shows sprint-level summaries
 * - Generates per-sprint HTML reports
 * - Creates combined report
 */

import { Reporter, TestCase, TestResult, Suite } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import { SprintManager, getSprintManager } from './sprint-manager';

interface SprintTestResult {
  ticket: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  what: string;
  condition: string;
}

interface SprintSummary {
  sprintKey: string;
  sprintName: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  status: 'passed' | 'failed' | 'partial';
  tests: SprintTestResult[];
  passRate: number;
}

export class SprintReportGenerator implements Reporter {
  private sprintManager: SprintManager;
  private sprintResults: Map<string, SprintSummary> = new Map();
  private outputDir: string;

  constructor() {
    this.sprintManager = getSprintManager();
    this.outputDir = 'test-results';

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    // Extract Jira ticket from test title
    const ticketMatch = test.title.match(/\[([A-Z]+-\d+)\]/);
    if (!ticketMatch) {
      return; // Skip if no ticket in title
    }

    const ticket = ticketMatch[1];

    // Find which sprint this ticket belongs to
    const sprintInfo = this.sprintManager.findSprintByTicket(ticket);
    if (!sprintInfo) {
      return; // Skip if ticket not in any sprint
    }

    const { key: sprintKey, sprint } = sprintInfo;

    // Get or create sprint summary
    let summary = this.sprintResults.get(sprintKey);
    if (!summary) {
      summary = {
        sprintKey,
        sprintName: sprint.name,
        totalTests: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0,
        status: 'passed',
        tests: [],
        passRate: 0
      };
      this.sprintResults.set(sprintKey, summary);
    }

    // Parse test title for what/condition
    const { what, condition } = this.parseTestTitle(test.title);

    // Add test result
    summary.tests.push({
      ticket,
      testName: test.title,
      status: result.status as 'passed' | 'failed' | 'skipped',
      duration: result.duration,
      error: result.errors?.[0]?.message,
      what,
      condition
    });

    // Update counters
    summary.totalTests++;
    summary.duration += result.duration;

    if (result.status === 'passed') {
      summary.passed++;
    } else if (result.status === 'failed') {
      summary.failed++;
    } else if (result.status === 'skipped') {
      summary.skipped++;
    }

    // Update status
    if (summary.failed > 0) {
      summary.status = 'failed';
    } else if (summary.skipped > 0) {
      summary.status = 'partial';
    }

    // Update pass rate
    if (summary.totalTests > 0) {
      summary.passRate = Math.round((summary.passed / summary.totalTests) * 1000) / 10;
    }
  }

  onEnd(): void {
    // Generate reports
    this.generateIndividualSprintReports();
    this.generateCombinedReport();
    this.generateSummaryJSON();

    // Log summary
    this.logSummary();
  }

  private generateIndividualSprintReports(): void {
    this.sprintResults.forEach((summary, sprintKey) => {
      const html = this.buildSprintHTML(summary);
      const fileName = `sprint-report-${sprintKey}.html`;
      const filePath = path.join(this.outputDir, fileName);
      fs.writeFileSync(filePath, html, 'utf-8');

      console.log(`✅ Sprint report generated: ${fileName}`);
    });
  }

  private generateCombinedReport(): void {
    const html = this.buildCombinedHTML();
    const filePath = path.join(this.outputDir, 'sprint-summary-report.html');
    fs.writeFileSync(filePath, html, 'utf-8');

    console.log(`✅ Combined sprint report generated: sprint-summary-report.html`);
  }

  private generateSummaryJSON(): void {
    const summary: Record<string, any> = {};

    const totalTests = Array.from(this.sprintResults.values()).reduce(
      (sum, s) => sum + s.totalTests,
      0
    );
    const totalPassed = Array.from(this.sprintResults.values()).reduce(
      (sum, s) => sum + s.passed,
      0
    );
    const totalFailed = Array.from(this.sprintResults.values()).reduce(
      (sum, s) => sum + s.failed,
      0
    );

    summary.totals = {
      totalTests,
      totalPassed,
      totalFailed,
      passRate: totalTests > 0 ? Math.round((totalPassed / totalTests) * 1000) / 10 : 0
    };

    summary.sprints = {};
    this.sprintResults.forEach((s, key) => {
      summary.sprints[key] = {
        name: s.sprintName,
        totalTests: s.totalTests,
        passed: s.passed,
        failed: s.failed,
        skipped: s.skipped,
        passRate: s.passRate,
        status: s.status
      };
    });

    const filePath = path.join(this.outputDir, 'sprint-summary.json');
    fs.writeFileSync(filePath, JSON.stringify(summary, null, 2), 'utf-8');
  }

  private buildSprintHTML(summary: SprintSummary): string {
    const statusColor = summary.status === 'passed' ? '#4CAF50' : summary.status === 'failed' ? '#f44336' : '#ff9800';
    const statusText = summary.status === 'passed' ? 'PASSED' : summary.status === 'failed' ? 'FAILED' : 'PARTIAL';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${summary.sprintName} - Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
    .header h1 { font-size: 2em; margin-bottom: 10px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 30px 0; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .stat-card h3 { color: #666; font-size: 0.9em; margin-bottom: 10px; text-transform: uppercase; }
    .stat-card .number { font-size: 2em; font-weight: bold; color: #667eea; }
    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 4px; color: white; font-weight: 600; background: ${statusColor}; }
    .test-item { padding: 15px; border-bottom: 1px solid #f0f0f0; border-left: 4px solid #ddd; }
    .test-item.passed { background: #f0f8f4; border-left-color: #4CAF50; }
    .test-item.failed { background: #fff5f5; border-left-color: #f44336; }
    .test-name { font-weight: 600; margin-bottom: 8px; }
    .test-details { font-size: 0.9em; color: #666; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 8px; }
    .footer { text-align: center; padding: 20px; color: #999; border-top: 1px solid #e0e0e0; margin-top: 30px; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${summary.sprintName}</h1>
      <p style="opacity: 0.9;">Test Execution Report</p>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>Total Tests</h3>
        <div class="number">${summary.totalTests}</div>
      </div>
      <div class="stat-card">
        <h3>✅ Passed</h3>
        <div class="number" style="color: #4CAF50;">${summary.passed}</div>
      </div>
      <div class="stat-card">
        <h3>❌ Failed</h3>
        <div class="number" style="color: #f44336;">${summary.failed}</div>
      </div>
      <div class="stat-card">
        <h3>Pass Rate</h3>
        <div class="number" style="color: #ff9800;">${summary.passRate}%</div>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <span class="status-badge">${statusText}</span>
    </div>

    <h2 style="margin: 30px 0 20px 0; color: #333;">Test Details</h2>
    ${summary.tests.map(test => `
      <div class="test-item ${test.status}">
        <div class="test-name">${test.testName}</div>
        <div class="test-details">
          <div>
            <strong>What it tests:</strong> ${test.what}
          </div>
          <div>
            <strong>Condition:</strong> ${test.condition}
          </div>
          <div>
            <strong>Duration:</strong> ${test.duration}ms
          </div>
          <div>
            <strong>Status:</strong> <span style="color: ${test.status === 'passed' ? '#4CAF50' : '#f44336'};">${test.status.toUpperCase()}</span>
          </div>
        </div>
        ${test.error ? `<div style="margin-top: 10px; padding: 10px; background: #ffebee; color: #c53030; border-radius: 4px;"><strong>Error:</strong> ${test.error}</div>` : ''}
      </div>
    `).join('')}

    <div class="footer">
      Generated on ${new Date().toLocaleString()}<br>
      Sprint Report Generator v1.0
    </div>
  </div>
</body>
</html>
    `;
  }

  private buildCombinedHTML(): string {
    const sprints = Array.from(this.sprintResults.values()).sort((a, b) =>
      a.status === 'failed' ? -1 : b.status === 'failed' ? 1 : 0
    );

    const totalTests = sprints.reduce((sum, s) => sum + s.totalTests, 0);
    const totalPassed = sprints.reduce((sum, s) => sum + s.passed, 0);
    const totalFailed = sprints.reduce((sum, s) => sum + s.failed, 0);
    const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 1000) / 10 : 0;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Sprint Summary Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 30px 0; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .stat-card h3 { color: #666; font-size: 0.9em; margin-bottom: 10px; }
    .stat-card .number { font-size: 2em; font-weight: bold; color: #667eea; }
    .sprint-card { margin: 20px 0; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; }
    .sprint-card.passed { background: #f0f8f4; border-left: 4px solid #4CAF50; }
    .sprint-card.failed { background: #fff5f5; border-left: 4px solid #f44336; }
    .sprint-header { display: flex; justify-content: space-between; align-items: center; }
    .sprint-header h3 { color: #333; }
    .sprint-stats { display: flex; gap: 20px; }
    .sprint-stats span { font-weight: 600; }
    .footer { text-align: center; padding: 20px; color: #999; border-top: 1px solid #e0e0e0; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Sprint Summary Report</h1>
      <p>All Sprints (1-16) - Comprehensive Overview</p>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>Total Tests</h3>
        <div class="number">${totalTests}</div>
      </div>
      <div class="stat-card">
        <h3>✅ Passed</h3>
        <div class="number" style="color: #4CAF50;">${totalPassed}</div>
      </div>
      <div class="stat-card">
        <h3>❌ Failed</h3>
        <div class="number" style="color: #f44336;">${totalFailed}</div>
      </div>
      <div class="stat-card">
        <h3>Pass Rate</h3>
        <div class="number" style="color: #ff9800;">${passRate}%</div>
      </div>
    </div>

    <h2 style="margin: 30px 0 20px 0;">Sprints Overview</h2>
    ${sprints.map(s => `
      <div class="sprint-card ${s.status}">
        <div class="sprint-header">
          <div>
            <h3>${s.sprintName}</h3>
            <p style="color: #666; margin-top: 5px;">${s.passed}/${s.totalTests} tests passed</p>
          </div>
          <div class="sprint-stats">
            <span style="color: #4CAF50;">✅ ${s.passed}</span>
            <span style="color: #f44336;">❌ ${s.failed}</span>
            <span style="color: #ff9800;">⏱️ ${(s.duration / 1000).toFixed(2)}s</span>
          </div>
        </div>
      </div>
    `).join('')}

    <div class="footer">
      Generated on ${new Date().toLocaleString()}<br>
      Sprint Summary Report v1.0
    </div>
  </div>
</body>
</html>
    `;
  }

  private parseTestTitle(title: string): { what: string; condition: string } {
    const withoutId = title.replace(/^\[.*?\]\s*/, '');
    const shouldIndex = withoutId.toLowerCase().indexOf('should');

    if (shouldIndex > -1) {
      return {
        what: withoutId.substring(0, shouldIndex).trim(),
        condition: withoutId.substring(shouldIndex).trim()
      };
    }

    return {
      what: withoutId,
      condition: 'Test execution'
    };
  }

  private logSummary(): void {
    console.log('\n');
    console.log('╔════════════════════════════════════════╗');
    console.log('║   SPRINT-WISE TEST SUMMARY            ║');
    console.log('╚════════════════════════════════════════╝');
    console.log('');

    this.sprintResults.forEach((summary) => {
      const status = summary.status === 'passed' ? '✅' : summary.status === 'failed' ? '❌' : '⚠️';
      console.log(`${status} ${summary.sprintName}`);
      console.log(`   Tests: ${summary.passed}/${summary.totalTests} passed (${summary.passRate}%)`);
    });

    console.log('');
  }
}

export default SprintReportGenerator;
