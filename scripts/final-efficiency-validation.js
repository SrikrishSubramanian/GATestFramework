#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function findSpecFiles(dir) {
  const result = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      result.push(...findSpecFiles(fullPath));
    } else if (file.match(/\.spec\.ts$/)) {
      result.push(fullPath);
    }
  }
  return result;
}

const SPEC_DIR = path.join(__dirname, '../tests/specFiles/ga');
const specFiles = findSpecFiles(SPEC_DIR);

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}🎯 EFFICIENCY VALIDATION & FINAL OPTIMIZATION${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);
console.log(`📊 Analyzing ${specFiles.length} spec files for optimization opportunities...\n`);

const metrics = {
  total: specFiles.length,
  withActionUtils: 0,
  withComponentAssertions: 0,
  withMeasurementUtils: 0,
  withAuthentication: 0,
  withReportEnhancer: 0,
  withProperErrorHandling: 0,
  withTypeAnnotations: 0,
  rawPlaywrightOps: 0,
  inlineEvaluates: 0,
  hardcodedWaits: 0,
  duplicatePatterns: 0,
};

specFiles.forEach((specFile) => {
  const content = fs.readFileSync(specFile, 'utf-8');

  // Check for utilities
  if (content.includes('clickElement') || content.includes('fill(') || content.includes('hover(')) {
    metrics.withActionUtils++;
  }
  if (content.includes('assertLayout') || content.includes('assertSpacing') ||
      content.includes('assertTypography') || content.includes('assertBackground')) {
    metrics.withComponentAssertions++;
  }
  if (content.includes('getElementMeasurements') || content.includes('getComputedStyles') ||
      content.includes('getElementVisibility')) {
    metrics.withMeasurementUtils++;
  }
  if (content.includes('loginToAEMAuthor')) {
    metrics.withAuthentication++;
  }
  if (content.includes('attachConsoleCapture') || content.includes('annotateEnvironment')) {
    metrics.withReportEnhancer++;
  }

  // Check for anti-patterns
  if (content.includes('.click()') || content.includes('.fill(') || content.includes('.hover(')) {
    metrics.rawPlaywrightOps++;
  }
  if (content.includes('.evaluate(')) {
    const matches = (content.match(/\.evaluate\(/g) || []).length;
    metrics.inlineEvaluates += matches;
  }
  if (content.includes('page.waitForTimeout')) {
    metrics.hardcodedWaits++;
  }

  // Check for code quality
  if (content.includes(': ') && content.includes('const')) {
    metrics.withTypeAnnotations++;
  }
  if (content.includes('try') && content.includes('catch')) {
    metrics.withProperErrorHandling++;
  }
});

console.log(`${colors.bright}📈 OPTIMIZATION METRICS${colors.reset}\n`);

console.log(`${colors.cyan}✅ Utility Adoption:${colors.reset}`);
const actionScore = ((metrics.withActionUtils / metrics.total) * 100).toFixed(1);
const assertScore = ((metrics.withComponentAssertions / metrics.total) * 100).toFixed(1);
const measureScore = ((metrics.withMeasurementUtils / metrics.total) * 100).toFixed(1);
const authScore = ((metrics.withAuthentication / metrics.total) * 100).toFixed(1);
const reportScore = ((metrics.withReportEnhancer / metrics.total) * 100).toFixed(1);

console.log(`  Action utilities:        ${metrics.withActionUtils}/${metrics.total} (${actionScore}%)`);
console.log(`  Component assertions:    ${metrics.withComponentAssertions}/${metrics.total} (${assertScore}%)`);
console.log(`  Measurement utilities:   ${metrics.withMeasurementUtils}/${metrics.total} (${measureScore}%)`);
console.log(`  Centralized auth:        ${metrics.withAuthentication}/${metrics.total} (${authScore}%)`);
console.log(`  Report enhancement:      ${metrics.withReportEnhancer}/${metrics.total} (${reportScore}%)`);

console.log(`\n${colors.cyan}⚠️ Anti-patterns Found:${colors.reset}`);
const rawOpsScore = ((metrics.rawPlaywrightOps / metrics.total) * 100).toFixed(1);
const evalScore = ((metrics.inlineEvaluates / 162) * 100).toFixed(1);
const waitScore = ((metrics.hardcodedWaits / metrics.total) * 100).toFixed(1);

console.log(`  Raw Playwright ops:      ${metrics.rawPlaywrightOps}/${metrics.total} (${rawOpsScore}%) - should use action utilities`);
console.log(`  Inline evaluate():       ${metrics.inlineEvaluates} patterns - should use measurement utilities`);
console.log(`  Hardcoded waitFor:       ${metrics.hardcodedWaits}/${metrics.total} (${waitScore}%) - should use locator.waitFor`);

console.log(`\n${colors.cyan}📊 Code Quality:${colors.reset}`);
const typeScore = ((metrics.withTypeAnnotations / metrics.total) * 100).toFixed(1);
const errorScore = ((metrics.withProperErrorHandling / metrics.total) * 100).toFixed(1);

console.log(`  Type annotations:        ${metrics.withTypeAnnotations}/${metrics.total} (${typeScore}%)`);
console.log(`  Error handling:          ${metrics.withProperErrorHandling}/${metrics.total} (${errorScore}%)`);

// Calculate efficiency score
const utilityScore = (parseFloat(actionScore) + parseFloat(assertScore) +
                     parseFloat(measureScore) + parseFloat(authScore) +
                     parseFloat(reportScore)) / 5;

const qualityScore = 100 - (parseFloat(rawOpsScore) + parseFloat(waitScore)) / 2;
const overallScore = (utilityScore * 0.7 + qualityScore * 0.3);

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}📊 CALCULATED EFFICIENCY SCORE${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.cyan}Score Breakdown:${colors.reset}`);
console.log(`  Utility adoption:        ${utilityScore.toFixed(1)}/100`);
console.log(`  Code quality:            ${qualityScore.toFixed(1)}/100`);
console.log(`  ─────────────────────────`);
console.log(`  ${colors.bright}Overall Score:          ${overallScore.toFixed(1)}/100${colors.reset}`);

console.log(`\n${colors.cyan}Recommendations to Reach 90-97:${colors.reset}`);
if (parseFloat(actionScore) < 95) {
  console.log(`  1. Increase action utilities to 95%+ adoption`);
}
if (parseFloat(assertScore) < 90) {
  console.log(`  2. Increase component assertions to 90%+ adoption`);
}
if (parseFloat(measureScore) < 85) {
  console.log(`  3. Increase measurement utilities to 85%+ adoption`);
}
if (parseFloat(rawOpsScore) > 5) {
  console.log(`  4. Reduce raw Playwright operations below 5%`);
}
if (parseFloat(waitScore) > 5) {
  console.log(`  5. Replace hardcoded waits with explicit waits`);
}

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}✅ Validation Complete!${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.yellow}Next Actions:${colors.reset}`);
console.log(`  1. Run Priority 3 Phase 2: node scripts/migrate-to-component-assertions.js`);
console.log(`  2. Run Priority 1: node scripts/priority-1-measurement-utilities.js`);
console.log(`  3. Run Advanced: node scripts/advanced-optimization.js`);
console.log(`  4. Run comprehensive integration again`);
console.log(`  5. Verify with: npx tsc --noEmit && npm run test:sample`);

process.exit(0);
