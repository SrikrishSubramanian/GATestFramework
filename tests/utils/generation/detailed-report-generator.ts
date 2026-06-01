/**
 * Detailed Report Generator
 * Generates comprehensive HTML report with summary and detailed views
 */

import * as fs from 'fs';
import * as path from 'path';
import { TestRunReport, TestCaseExecution } from './test-execution-tracker';

export class DetailedReportGenerator {
  private report: TestRunReport;

  constructor(report: TestRunReport) {
    this.report = report;
  }

  generate(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Execution Report - ${this.report.runId}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    /* Header */
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

    /* Navigation Tabs */
    .tabs {
      display: flex;
      border-bottom: 2px solid #e0e0e0;
      background: #f9f9f9;
    }

    .tab-button {
      flex: 1;
      padding: 15px 20px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1em;
      font-weight: 500;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }

    .tab-button.active {
      color: #667eea;
      border-bottom-color: #667eea;
      background: white;
    }

    .tab-button:hover {
      color: #667eea;
      background: #f0f0f0;
    }

    /* Tab Content */
    .tab-content {
      display: none;
      padding: 30px;
      animation: fadeIn 0.3s ease;
    }

    .tab-content.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Summary Section */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }

    .stat-card.passed {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }

    .stat-card.failed {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
    }

    .stat-card.skipped {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-card h3 {
      font-size: 0.9em;
      opacity: 0.9;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .stat-card .number {
      font-size: 2.5em;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-card .percentage {
      font-size: 0.95em;
      opacity: 0.85;
    }

    /* Charts */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .chart-container {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .chart-container h3 {
      margin-bottom: 15px;
      color: #333;
    }

    canvas {
      max-height: 300px;
    }

    /* Tables */
    .table-container {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95em;
    }

    th {
      background: #667eea;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    tr:hover {
      background: #f5f5f5;
    }

    /* Status badges */
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
    }

    .badge.passed {
      background: #d4edda;
      color: #155724;
    }

    .badge.failed {
      background: #f8d7da;
      color: #721c24;
    }

    .badge.skipped {
      background: #fff3cd;
      color: #856404;
    }

    .badge.timeout {
      background: #d1ecf1;
      color: #0c5460;
    }

    /* Component Details */
    .component-detail {
      background: #f9f9f9;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 4px;
    }

    .component-detail.failed {
      border-left-color: #eb3349;
      background: #fff5f5;
    }

    .component-detail.partial {
      border-left-color: #f5a623;
      background: #fffaf5;
    }

    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .component-name {
      font-size: 1.2em;
      font-weight: 600;
      color: #333;
    }

    .component-stats {
      display: flex;
      gap: 20px;
    }

    .component-stats span {
      font-weight: 500;
    }

    /* Error details */
    .error-detail {
      background: #fff5f5;
      border: 1px solid #f5a6a6;
      border-radius: 4px;
      padding: 15px;
      margin-top: 10px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      overflow-x: auto;
    }

    .error-detail .error-type {
      font-weight: bold;
      color: #c53030;
      margin-bottom: 5px;
    }

    .error-detail .error-message {
      color: #744210;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Tags */
    .tag {
      display: inline-block;
      background: #e9ecef;
      color: #495057;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 0.85em;
      margin-right: 5px;
      margin-bottom: 5px;
    }

    /* Meta info */
    .meta-info {
      background: #f0f0f0;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      font-size: 0.95em;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }

    .meta-item label {
      font-weight: 600;
      color: #666;
      margin-bottom: 3px;
    }

    .meta-item value {
      color: #333;
      font-family: 'Courier New', monospace;
    }

    /* Expandable */
    .expandable {
      cursor: pointer;
      user-select: none;
    }

    .expandable::before {
      content: "▶ ";
      display: inline-block;
      transition: transform 0.2s;
      color: #667eea;
    }

    .expandable.expanded::before {
      transform: rotate(90deg);
    }

    .expandable-content {
      display: none;
      margin-top: 10px;
      padding-left: 20px;
      border-left: 2px solid #e0e0e0;
    }

    .expandable.expanded .expandable-content {
      display: block;
    }

    /* Footer */
    .footer {
      background: #f5f5f5;
      padding: 20px 30px;
      text-align: center;
      color: #666;
      font-size: 0.9em;
      border-top: 1px solid #e0e0e0;
    }

    /* Print styles */
    @media print {
      body {
        background: white;
      }
      .tab-button {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🧪 Test Execution Report</h1>
      <p>${this.report.runId}</p>
    </div>

    <!-- Navigation Tabs -->
    <div class="tabs">
      <button class="tab-button active" onclick="switchTab('summary')">📊 Summary</button>
      <button class="tab-button" onclick="switchTab('components')">📦 Components</button>
      <button class="tab-button" onclick="switchTab('failures')">❌ Failures</button>
      <button class="tab-button" onclick="switchTab('tags')">🏷️ Tag Analysis</button>
      <button class="tab-button" onclick="switchTab('details')">📋 Test Details</button>
    </div>

    <!-- TAB 1: SUMMARY -->
    <div id="summary" class="tab-content active">
      <h2>Executive Summary</h2>

      <!-- Meta Information -->
      <div class="meta-info">
        <div class="meta-item">
          <label>Run ID</label>
          <value>${this.report.runId}</value>
        </div>
        <div class="meta-item">
          <label>Environment</label>
          <value>${this.report.environment.toUpperCase()}</value>
        </div>
        <div class="meta-item">
          <label>Browsers</label>
          <value>${this.report.browsers.join(', ')}</value>
        </div>
        <div class="meta-item">
          <label>Execution Time</label>
          <value>${new Date(this.report.executionStartTime).toLocaleString()}</value>
        </div>
        <div class="meta-item">
          <label>Total Duration</label>
          <value>${this.formatDuration(this.report.executionDuration)}</value>
        </div>
        <div class="meta-item">
          <label>Avg Test Duration</label>
          <value>${this.report.summary.averageTestDuration}ms</value>
        </div>
      </div>

      <!-- Summary Stats -->
      <h3 style="margin: 30px 0 20px 0; color: #333;">Overall Statistics</h3>
      <div class="summary-grid">
        <div class="stat-card">
          <h3>Total Tests</h3>
          <div class="number">${this.report.summary.totalTests}</div>
        </div>
        <div class="stat-card passed">
          <h3>Passed</h3>
          <div class="number">${this.report.summary.passedTests}</div>
          <div class="percentage">${((this.report.summary.passedTests / this.report.summary.totalTests) * 100).toFixed(1)}%</div>
        </div>
        <div class="stat-card failed">
          <h3>Failed</h3>
          <div class="number">${this.report.summary.failedTests}</div>
          <div class="percentage">${((this.report.summary.failedTests / this.report.summary.totalTests) * 100).toFixed(1)}%</div>
        </div>
        <div class="stat-card skipped">
          <h3>Skipped</h3>
          <div class="number">${this.report.summary.skippedTests}</div>
          <div class="percentage">${((this.report.summary.skippedTests / this.report.summary.totalTests) * 100).toFixed(1)}%</div>
        </div>
      </div>

      <!-- Charts -->
      <h3 style="margin: 30px 0 20px 0; color: #333;">Visual Analysis</h3>
      <div class="charts-grid">
        <div class="chart-container">
          <h3>Test Status Distribution</h3>
          <canvas id="statusChart"></canvas>
        </div>
        <div class="chart-container">
          <h3>Pass Rate by Category</h3>
          <canvas id="categoryChart"></canvas>
        </div>
      </div>

      <!-- Category Breakdown Table -->
      <h3 style="margin: 30px 0 20px 0; color: #333;">Category Breakdown</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Total Tests</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(this.report.categoryStats)
              .map(([category, stats]) => `
              <tr>
                <td><strong>${category}</strong></td>
                <td>${stats.total}</td>
                <td><span class="badge passed">${stats.passed}</span></td>
                <td><span class="badge ${stats.failed > 0 ? 'failed' : 'passed'}">${stats.failed}</span></td>
                <td><strong>${stats.passRate}</strong></td>
              </tr>
            `)
              .join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: COMPONENTS -->
    <div id="components" class="tab-content">
      <h2>Component Breakdown</h2>
      ${this.report.componentBreakdown
        .sort((a, b) => {
          if (a.status !== b.status) return a.status === 'failed' ? -1 : 1;
          return b.failCount - a.failCount;
        })
        .map(comp => this.renderComponentDetail(comp))
        .join('')}
    </div>

    <!-- TAB 3: FAILURES -->
    <div id="failures" class="tab-content">
      <h2>Failed Test Cases (${this.report.failedTests.length})</h2>
      ${
        this.report.failedTests.length === 0
          ? '<p style="color: #11998e; font-size: 1.1em; padding: 20px;">🎉 All tests passed! No failures detected.</p>'
          : this.report.failedTests
              .map((test, idx) => this.renderFailedTest(test, idx + 1))
              .join('')
      }
    </div>

    <!-- TAB 4: TAG ANALYSIS -->
    <div id="tags" class="tab-content">
      <h2>Test Coverage by Tags</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Total Tests</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Pass Rate</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(this.report.tagCoverage)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([tag, stats]) => `
              <tr>
                <td><span class="tag">${tag}</span></td>
                <td>${stats.total}</td>
                <td><span class="badge passed">${stats.passed}</span></td>
                <td><span class="badge ${stats.failed > 0 ? 'failed' : 'passed'}">${stats.failed}</span></td>
                <td><strong>${stats.passRate}</strong></td>
              </tr>
            `)
              .join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 5: TEST DETAILS -->
    <div id="details" class="tab-content">
      <h2>All Test Cases (${this.report.summary.totalTests})</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Test Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Browser</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            ${this.report.componentBreakdown
              .flatMap(comp => comp.tests)
              .map((test) => `
              <tr>
                <td><strong>${test.component}</strong></td>
                <td>${test.testName}</td>
                <td>${test.category}</td>
                <td><span class="badge ${test.status}">${test.status}</span></td>
                <td>${test.duration}ms</td>
                <td>${test.browser}</td>
                <td>${test.tags.map(t => `<span class="tag">${t}</span>`).join('')}</td>
              </tr>
            `)
              .join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Generated on ${new Date(this.report.timestamp).toLocaleString()}</p>
      <p>Test Execution Report v1.0</p>
    </div>
  </div>

  <script>
    function switchTab(tabName) {
      // Hide all tabs
      const tabs = document.querySelectorAll('.tab-content');
      tabs.forEach(tab => tab.classList.remove('active'));

      // Remove active from all buttons
      const buttons = document.querySelectorAll('.tab-button');
      buttons.forEach(btn => btn.classList.remove('active'));

      // Show selected tab
      document.getElementById(tabName).classList.add('active');

      // Add active to clicked button
      event.target.classList.add('active');

      // Render charts on summary tab
      if (tabName === 'summary') {
        setTimeout(() => renderCharts(), 100);
      }
    }

    function renderCharts() {
      // Status Distribution Chart
      const statusCtx = document.getElementById('statusChart');
      if (statusCtx && !statusCtx.chart) {
        statusCtx.chart = new Chart(statusCtx, {
          type: 'doughnut',
          data: {
            labels: ['Passed', 'Failed', 'Skipped'],
            datasets: [{
              data: [${this.report.summary.passedTests}, ${this.report.summary.failedTests}, ${this.report.summary.skippedTests}],
              backgroundColor: ['#38ef7d', '#f45c43', '#f5576c'],
              borderColor: ['#11998e', '#eb3349', '#f093fb'],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'bottom' }
            }
          }
        });
      }

      // Category Chart
      const categoryCtx = document.getElementById('categoryChart');
      if (categoryCtx && !categoryCtx.chart) {
        const categories = ${JSON.stringify(Object.entries(this.report.categoryStats))};
        categoryCtx.chart = new Chart(categoryCtx, {
          type: 'bar',
          data: {
            labels: categories.map(c => c[0]),
            datasets: [{
              label: 'Pass Rate (%)',
              data: categories.map(c => parseFloat(c[1].passRate)),
              backgroundColor: '#667eea',
              borderColor: '#764ba2',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: { max: 100 }
            },
            plugins: {
              legend: { display: false }
            }
          }
        });
      }
    }

    // Toggle expandable sections
    document.querySelectorAll('.expandable').forEach(el => {
      el.addEventListener('click', function() {
        this.classList.toggle('expanded');
      });
    });

    // Initial chart render
    setTimeout(() => renderCharts(), 500);
  </script>
</body>
</html>`;
  }

  private renderComponentDetail(comp: any): string {
    return `
      <div class="component-detail ${comp.status}">
        <div class="component-header">
          <div>
            <div class="component-name">${comp.component}</div>
            <div style="color: #666; font-size: 0.9em; margin-top: 5px;">
              ${comp.totalTests} tests • ${this.formatDuration(comp.totalDuration)}
            </div>
          </div>
          <div class="component-stats">
            <span style="color: #11998e;">✓ ${comp.passCount} passed</span>
            ${comp.failCount > 0 ? `<span style="color: #eb3349;">✗ ${comp.failCount} failed</span>` : ''}
            ${comp.skippedCount > 0 ? `<span style="color: #f5a623;">⊘ ${comp.skippedCount} skipped</span>` : ''}
            <span style="font-weight: 600; color: #667eea;">${comp.passRate}</span>
          </div>
        </div>
        ${
          comp.failCount > 0
            ? `
        <div style="background: #fff5f5; padding: 10px; border-radius: 4px; margin-top: 10px;">
          <strong style="color: #c53030;">Failed Tests in this Component:</strong>
          <ul style="margin-top: 8px; margin-left: 20px;">
            ${comp.tests
              .filter((t: any) => t.status === 'failed')
              .map((t: any) => `<li>${t.testName}</li>`)
              .join('')}
          </ul>
        </div>
      `
            : ''
        }
      </div>
    `;
  }

  private renderFailedTest(test: TestCaseExecution, index: number): string {
    return `
      <div class="component-detail failed" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
          <div>
            <div style="font-weight: 600; font-size: 1.1em; color: #c53030;">
              #${index} ${test.testName}
            </div>
            <div style="color: #666; font-size: 0.9em; margin-top: 5px;">
              Component: <strong>${test.component}</strong> • Category: <strong>${test.category}</strong>
            </div>
          </div>
          <span class="badge failed">${test.status}</span>
        </div>

        ${test.error ? this.renderErrorDetail(test.error) : ''}

        <div style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 0.9em;">
          <div><strong>Browser:</strong> ${test.browser}</div>
          <div><strong>Duration:</strong> ${test.duration}ms</div>
          <div><strong>Started:</strong> ${new Date(test.startTime).toLocaleTimeString()}</div>
        </div>
      </div>
    `;
  }

  private renderErrorDetail(error: any): string {
    return `
      <div class="error-detail">
        <div class="error-type">${error.failureType.toUpperCase()}</div>
        <div class="error-message">${this.escapeHtml(error.message)}</div>
        ${
          error.expectedVsActual
            ? `
          <div style="margin-top: 10px;">
            <div><strong>Expected:</strong> ${this.escapeHtml(error.expectedVsActual.expected)}</div>
            <div><strong>Actual:</strong> ${this.escapeHtml(error.expectedVsActual.actual)}</div>
          </div>
        `
            : ''
        }
        ${error.failedLine ? `<div style="margin-top: 10px;"><strong>Failed at:</strong> ${this.escapeHtml(error.failedLine)}</div>` : ''}
      </div>
    `;
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  saveReport(outputDir: string = 'tests/data/reports'): string {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const reportPath = path.join(outputDir, `test-report-${this.report.runId}.html`);
    fs.writeFileSync(reportPath, this.generate());

    console.log(`✓ Detailed HTML report saved: ${reportPath}`);
    return reportPath;
  }
}
