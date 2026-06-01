/**
 * Hierarchical Test Reporter
 *
 * Groups tests by Component/Jira Ticket with summary and details
 * Shows: Component → Test Cases → Results (passed/failed)
 */

import { Reporter, TestCase, TestResult, Suite } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface ComponentSummary {
  component: string;
  jiraTicket?: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  tests: TestDetail[];
  duration: number;
  status: 'passed' | 'failed' | 'partial';
}

interface TestDetail {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  what: string; // What is this test testing?
  condition: string; // What condition was checked?
}

export class HierarchicalTestReporter implements Reporter {
  private componentSummaries: Map<string, ComponentSummary> = new Map();
  private currentComponent: string = 'unknown';
  private outputDir: string;

  constructor() {
    this.outputDir = 'test-results';
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    // Extract component from test path
    const component = this.extractComponent(test.file);
    const jiraTicket = this.extractJiraTicket(test.title);

    // Create key for grouping
    const componentKey = jiraTicket || component;

    // Get or create component summary
    let summary = this.componentSummaries.get(componentKey);
    if (!summary) {
      summary = {
        component,
        jiraTicket,
        totalTests: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        tests: [],
        duration: 0,
        status: 'passed'
      };
      this.componentSummaries.set(componentKey, summary);
    }

    // Extract what and condition from test title
    const { what, condition } = this.parseTestTitle(test.title);

    // Add test result
    summary.tests.push({
      name: test.title,
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

    // Update component status
    if (summary.failed > 0) {
      summary.status = 'failed';
    } else if (summary.skipped > 0) {
      summary.status = 'partial';
    }
  }

  onEnd(): void {
    this.generateHTMLReport();
  }

  private generateHTMLReport(): void {
    const html = this.buildHTMLReport();
    const reportPath = path.join(this.outputDir, 'hierarchical-report.html');
    fs.writeFileSync(reportPath, html, 'utf-8');

    console.log(`\n✅ Hierarchical report generated: ${reportPath}`);
  }

  private buildHTMLReport(): string {
    const components = Array.from(this.componentSummaries.values()).sort(
      (a, b) => {
        // Sort by: failed first, then by name
        if (a.status !== b.status) {
          return a.status === 'failed' ? -1 : 1;
        }
        return (a.jiraTicket || a.component).localeCompare(b.jiraTicket || b.component);
      }
    );

    const totalTests = components.reduce((sum, c) => sum + c.totalTests, 0);
    const totalPassed = components.reduce((sum, c) => sum + c.passed, 0);
    const totalFailed = components.reduce((sum, c) => sum + c.failed, 0);
    const totalDuration = components.reduce((sum, c) => sum + c.duration, 0);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hierarchical Test Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }

    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      padding: 30px;
      background: #f9f9f9;
      border-bottom: 2px solid #e0e0e0;
    }

    .stat-card {
      background: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .stat-card h3 {
      font-size: 0.9em;
      color: #666;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    .stat-card .number {
      font-size: 2em;
      font-weight: bold;
      color: #667eea;
    }

    .content {
      padding: 30px;
    }

    .component-section {
      margin-bottom: 30px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .component-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }

    .component-header.failed {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
    }

    .component-header.partial {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .component-title {
      flex: 1;
    }

    .component-title h2 {
      font-size: 1.3em;
      margin-bottom: 5px;
    }

    .component-title p {
      font-size: 0.9em;
      opacity: 0.9;
    }

    .component-stats {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-left: 20px;
      white-space: nowrap;
    }

    .component-stats span {
      font-weight: 500;
    }

    .toggle-icon {
      font-size: 1.5em;
      transition: transform 0.3s;
    }

    .component-section.collapsed .toggle-icon {
      transform: rotate(-90deg);
    }

    .component-details {
      max-height: 2000px;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .component-section.collapsed .component-details {
      max-height: 0;
    }

    .test-item {
      padding: 15px 20px;
      border-bottom: 1px solid #f0f0f0;
    }

    .test-item:last-child {
      border-bottom: none;
    }

    .test-item.passed {
      background: #f0f8f4;
      border-left: 4px solid #11998e;
    }

    .test-item.failed {
      background: #fff5f5;
      border-left: 4px solid #eb3349;
    }

    .test-item.skipped {
      background: #fffaf5;
      border-left: 4px solid #f5a623;
    }

    .test-name {
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    .test-name .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 500;
      margin-left: 8px;
    }

    .status-badge.passed {
      background: #11998e;
      color: white;
    }

    .status-badge.failed {
      background: #eb3349;
      color: white;
    }

    .status-badge.skipped {
      background: #f5a623;
      color: white;
    }

    .test-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      font-size: 0.95em;
      color: #666;
    }

    .test-detail-item {
      display: flex;
      flex-direction: column;
    }

    .test-detail-item label {
      font-weight: 600;
      color: #333;
      margin-bottom: 3px;
    }

    .test-detail-item value {
      color: #666;
      word-break: break-word;
    }

    .test-error {
      margin-top: 10px;
      padding: 10px;
      background: #ffebee;
      border-left: 3px solid #eb3349;
      border-radius: 4px;
      color: #c53030;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }

    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      color: #666;
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 768px) {
      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .component-stats {
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
        margin-left: 0;
      }

      .test-details {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>📊 Test Results Report</h1>
      <p>Organized by Component / Jira Ticket</p>
    </div>

    <!-- Summary Stats -->
    <div class="summary-grid">
      <div class="stat-card">
        <h3>Total Tests</h3>
        <div class="number">${totalTests}</div>
      </div>
      <div class="stat-card">
        <h3>✅ Passed</h3>
        <div class="number" style="color: #11998e;">${totalPassed}</div>
      </div>
      <div class="stat-card">
        <h3>❌ Failed</h3>
        <div class="number" style="color: #eb3349;">${totalFailed}</div>
      </div>
      <div class="stat-card">
        <h3>⏱️ Duration</h3>
        <div class="number" style="color: #f5a623;">${(totalDuration / 1000).toFixed(1)}s</div>
      </div>
    </div>

    <!-- Components -->
    <div class="content">
      ${components
        .map(
          (comp, index) => `
        <div class="component-section" id="component-${index}">
          <div class="component-header ${comp.status}" onclick="toggleComponent(${index})">
            <div class="component-title">
              <h2>${comp.jiraTicket ? `[${comp.jiraTicket}] ` : ''}${comp.component}</h2>
              <p>${comp.passed}/${comp.totalTests} tests passed</p>
            </div>
            <div class="component-stats">
              <span>✅ ${comp.passed}</span>
              <span>❌ ${comp.failed}</span>
              <span>⏱️ ${(comp.duration / 1000).toFixed(2)}s</span>
              <div class="toggle-icon">▼</div>
            </div>
          </div>

          <div class="component-details">
            ${comp.tests
              .map(
                test => `
              <div class="test-item ${test.status}">
                <div class="test-name">
                  ${test.name}
                  <span class="status-badge ${test.status}">${test.status.toUpperCase()}</span>
                </div>

                <div class="test-details">
                  <div class="test-detail-item">
                    <label>🎯 What it tests:</label>
                    <value>${test.what}</value>
                  </div>
                  <div class="test-detail-item">
                    <label>✓ Condition checked:</label>
                    <value>${test.condition}</value>
                  </div>
                  <div class="test-detail-item">
                    <label>⏱️ Duration:</label>
                    <value>${test.duration}ms</value>
                  </div>
                </div>

                ${
                  test.error
                    ? `<div class="test-error"><strong>Error:</strong> ${test.error}</div>`
                    : ''
                }
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
        )
        .join('')}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Generated on ${new Date().toLocaleString()}</p>
      <p>Hierarchical Test Report v1.0</p>
    </div>
  </div>

  <script>
    function toggleComponent(index) {
      const element = document.getElementById(\`component-\${index}\`);
      element.classList.toggle('collapsed');
    }

    // Expand failed components by default
    document.querySelectorAll('.component-header.failed').forEach(header => {
      const section = header.closest('.component-section');
      const index = Array.from(document.querySelectorAll('.component-section')).indexOf(section);
      // Don't collapse failed sections
    });

    // Collapse passed components by default
    document.querySelectorAll('.component-header:not(.failed)').forEach(header => {
      const section = header.closest('.component-section');
      // Uncomment below to collapse passed by default
      // section.classList.add('collapsed');
    });
  </script>
</body>
</html>
    `;
  }

  private extractComponent(filePath: string): string {
    const match = filePath.match(/\/ga\/([^/]+)\//);
    if (match) return match[1];
    return 'unknown';
  }

  private extractJiraTicket(testTitle: string): string | undefined {
    const match = testTitle.match(/\[(.*?-\d+)\]/);
    if (match) return match[1];
    return undefined;
  }

  private parseTestTitle(
    title: string
  ): { what: string; condition: string } {
    // Example: "[BTN-001] Button should render with text"
    // Extract what and condition from title

    // Remove ID from title
    const withoutId = title.replace(/^\[.*?\]\s*/, '');

    // Try to split by "should"
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
}

export default HierarchicalTestReporter;
