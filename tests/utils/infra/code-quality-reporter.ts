/**
 * Code Quality Reporter
 *
 * Generates comprehensive code quality reports:
 * - 98-100% quality metrics
 * - Test reliability scores
 * - AEM best practices compliance
 * - Beautiful HTML reports
 */

import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import { getTestReliabilityManager } from './test-reliability-manager';

export interface QualityScore {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  details: string;
}

export class CodeQualityReporter implements Reporter {
  private testResults: Array<{
    name: string;
    passed: boolean;
    duration: number;
    error?: string;
  }> = [];
  private outputDir: string;

  constructor() {
    this.outputDir = 'test-results';
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const reliabilityManager = getTestReliabilityManager();

    this.testResults.push({
      name: test.title,
      passed: result.status === 'passed',
      duration: result.duration,
      error: result.errors?.[0]?.message
    });

    // Record in reliability database
    reliabilityManager.recordTestResult(
      test.title,
      result.status === 'passed',
      result.errors?.[0]?.message,
      result.duration
    );
  }

  onEnd(): void {
    const reliabilityManager = getTestReliabilityManager();

    // Generate reports
    this.generateQualityReport(reliabilityManager);
    this.generateHTMLReport(reliabilityManager);

    console.log(reliabilityManager.getQualityReport());
  }

  private generateQualityReport(reliabilityManager: any): void {
    const metrics = reliabilityManager.calculateCodeQuality();
    const reportPath = path.join(this.outputDir, 'code-quality.json');

    const report = {
      timestamp: new Date().toISOString(),
      metrics: {
        overallScore: metrics.overallScore,
        testCoverage: Math.round(metrics.testCoverage),
        codeQuality: metrics.codeQuality,
        testReliability: metrics.testReliability,
        performanceScore: metrics.performanceScore
      },
      qualityScores: this.calculateDetailedScores(reliabilityManager),
      executionStats: this.calculateExecutionStats(),
      recommendations: this.generateRecommendations(metrics),
      timestamp_readable: new Date().toLocaleString()
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`✅ Code quality report saved: ${reportPath}`);
  }

  private calculateDetailedScores(reliabilityManager: any): QualityScore[] {
    const metrics = reliabilityManager.calculateCodeQuality();

    return [
      {
        name: 'Test Reliability',
        score: metrics.testReliability,
        status: this.getScoreStatus(metrics.testReliability),
        details: `Tests have ${metrics.testReliability}% reliability rate. ${
          metrics.testReliability >= 98
            ? 'Excellent - tests are stable'
            : 'Needs improvement - reduce flakiness'
        }`
      },
      {
        name: 'Code Quality',
        score: metrics.codeQuality,
        status: this.getScoreStatus(metrics.codeQuality),
        details: `Code meets quality standards at ${metrics.codeQuality}%. ${
          metrics.codeQuality >= 98
            ? 'Excellent - minimal issues'
            : 'Needs improvement - address quality issues'
        }`
      },
      {
        name: 'Test Coverage',
        score: metrics.testCoverage,
        status: this.getScoreStatus(metrics.testCoverage),
        details: `Test coverage is at ${Math.round(metrics.testCoverage)}%. ${
          metrics.testCoverage >= 80
            ? 'Good coverage'
            : 'Consider adding more tests'
        }`
      },
      {
        name: 'Performance',
        score: metrics.performanceScore,
        status: this.getScoreStatus(metrics.performanceScore),
        details: `Performance score is ${metrics.performanceScore}%. Tests execute efficiently.`
      },
      {
        name: 'Overall Quality',
        score: metrics.overallScore,
        status: this.getScoreStatus(metrics.overallScore),
        details: `Overall code quality score: ${metrics.overallScore}%. ${
          metrics.overallScore >= 98
            ? 'Production-ready ✅'
            : 'Requires attention before production'
        }`
      }
    ];
  }

  private calculateExecutionStats(): any {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.testResults.reduce((sum, t) => sum + t.duration, 0);
    const avgDuration = totalDuration / totalTests;

    return {
      totalTests,
      passedTests,
      failedTests,
      passRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : '0.00',
      totalDurationMs: totalDuration,
      averageDurationMs: Math.round(avgDuration),
      slowestTest: Math.max(...this.testResults.map(t => t.duration)),
      fastestTest: Math.min(...this.testResults.map(t => t.duration))
    };
  }

  private generateRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];

    if (metrics.testReliability < 98) {
      recommendations.push('🔴 Fix flaky tests - target 98%+ reliability');
    }

    if (metrics.codeQuality < 98) {
      recommendations.push('🟡 Address code quality issues for production readiness');
    }

    if (metrics.testCoverage < 80) {
      recommendations.push('🟡 Increase test coverage to 80%+ of codebase');
    }

    if (this.testResults.filter(t => !t.passed).length > 0) {
      recommendations.push('🔴 Fix all failing tests before production deployment');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All quality metrics excellent - ready for production!');
    }

    return recommendations;
  }

  private getScoreStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 98) return 'excellent';
    if (score >= 90) return 'good';
    if (score >= 80) return 'fair';
    return 'poor';
  }

  private generateHTMLReport(reliabilityManager: any): void {
    const metrics = reliabilityManager.calculateCodeQuality();
    const scores = this.calculateDetailedScores(reliabilityManager);
    const stats = this.calculateExecutionStats();
    const recommendations = this.generateRecommendations(metrics);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Code Quality Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .header h1 { font-size: 2.5em; margin-bottom: 10px; }
    .header p { opacity: 0.9; font-size: 1.1em; }
    .overall-score {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin: 30px 0;
      padding: 30px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    .score-circle {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3em;
      font-weight: bold;
      color: white;
      ${metrics.overallScore >= 98 ? 'background: linear-gradient(135deg, #4CAF50, #45a049);' : metrics.overallScore >= 90 ? 'background: linear-gradient(135deg, #FF9800, #F57C00);' : 'background: linear-gradient(135deg, #f44336, #d32f2f);'}
    }
    .score-text {
      flex: 1;
    }
    .score-text h2 { font-size: 2em; margin-bottom: 10px; }
    .score-text p { font-size: 1.1em; color: #666; }
    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 30px;
    }
    .card {
      border-radius: 8px;
      padding: 20px;
      border-left: 4px solid;
    }
    .card.excellent {
      background: #f0f8f4;
      border-left-color: #4CAF50;
    }
    .card.good {
      background: #fff8f4;
      border-left-color: #FF9800;
    }
    .card.fair {
      background: #fff5f5;
      border-left-color: #FF9800;
    }
    .card.poor {
      background: #fff5f5;
      border-left-color: #f44336;
    }
    .card h3 { margin-bottom: 10px; }
    .card .score {
      font-size: 2em;
      font-weight: bold;
      margin: 10px 0;
    }
    .card p { color: #666; font-size: 0.95em; }
    .stats {
      padding: 30px;
      background: #f9f9f9;
      border-top: 1px solid #e0e0e0;
    }
    .stats h2 { margin-bottom: 20px; }
    .stat-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .stat-item {
      background: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-item .label { color: #666; font-size: 0.9em; }
    .stat-item .value { font-size: 2em; font-weight: bold; margin: 10px 0; }
    .recommendations {
      padding: 30px;
      background: #f9f9f9;
      border-top: 1px solid #e0e0e0;
    }
    .recommendations h2 { margin-bottom: 20px; }
    .recommendation-item {
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 4px;
      background: white;
      border-left: 4px solid #FF9800;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #999;
      border-top: 1px solid #e0e0e0;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Code Quality Report</h1>
      <p>98-100% Quality & Reliability Standards</p>
    </div>

    <div class="overall-score">
      <div class="score-circle">${metrics.overallScore}%</div>
      <div class="score-text">
        <h2>Overall Quality Score</h2>
        <p>${this.getScoreDescription(metrics.overallScore)}</p>
        <p>Status: ${metrics.overallScore >= 98 ? '✅ Production Ready' : '⚠️ Needs Improvement'}</p>
      </div>
    </div>

    <div class="cards">
      ${scores
        .map(
          score => `
        <div class="card ${score.status}">
          <h3>${score.name}</h3>
          <div class="score">${score.score}%</div>
          <p>${score.details}</p>
        </div>
      `
        )
        .join('')}
    </div>

    <div class="stats">
      <h2>📈 Execution Statistics</h2>
      <div class="stat-row">
        <div class="stat-item">
          <div class="label">Total Tests</div>
          <div class="value">${stats.totalTests}</div>
        </div>
        <div class="stat-item">
          <div class="label">✅ Passed</div>
          <div class="value" style="color: #4CAF50;">${stats.passedTests}</div>
        </div>
        <div class="stat-item">
          <div class="label">❌ Failed</div>
          <div class="value" style="color: #f44336;">${stats.failedTests}</div>
        </div>
        <div class="stat-item">
          <div class="label">Pass Rate</div>
          <div class="value">${stats.passRate}%</div>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat-item">
          <div class="label">Total Duration</div>
          <div class="value">${(stats.totalDurationMs / 1000).toFixed(2)}s</div>
        </div>
        <div class="stat-item">
          <div class="label">Average Duration</div>
          <div class="value">${stats.averageDurationMs}ms</div>
        </div>
        <div class="stat-item">
          <div class="label">Fastest Test</div>
          <div class="value">${stats.fastestTest}ms</div>
        </div>
        <div class="stat-item">
          <div class="label">Slowest Test</div>
          <div class="value">${stats.slowestTest}ms</div>
        </div>
      </div>
    </div>

    <div class="recommendations">
      <h2>💡 Recommendations</h2>
      ${recommendations.map(r => `<div class="recommendation-item">${r}</div>`).join('')}
    </div>

    <div class="footer">
      <p>Generated on ${new Date().toLocaleString()}</p>
      <p>Code Quality Reporter v1.0 | Target: 98-100% Quality & Reliability</p>
    </div>
  </div>
</body>
</html>
    `;

    const reportPath = path.join(this.outputDir, 'code-quality-report.html');
    fs.writeFileSync(reportPath, html, 'utf-8');
    console.log(`✅ HTML quality report saved: ${reportPath}`);
  }

  private getScoreDescription(score: number): string {
    if (score >= 98) return 'Excellent quality - production ready';
    if (score >= 95) return 'Very good quality - minor improvements needed';
    if (score >= 90) return 'Good quality - address issues before production';
    if (score >= 80) return 'Fair quality - significant improvements needed';
    return 'Poor quality - requires major fixes';
  }
}

export default CodeQualityReporter;
