#!/usr/bin/env node

/**
 * Generate Playwright test scripts from Sprint 18 Excel test cases
 *
 * Usage:
 *   node generate-tests-from-excel.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Try to load xlsx or fall back to manual parsing
let XLSX;
try {
  XLSX = require('xlsx');
} catch (e) {
  console.log('Note: xlsx module not found. Install with: npm install xlsx');
  console.log('Attempting to continue with alternative methods...\n');
}

const TESTCASES_DIR = 'sprint-18-testcases';
const SPECS_DIR = 'tests/specFiles/ga';
const TEMP_DIR = '.temp/sprint-18-generated';

if (!fs.existsSync(TESTCASES_DIR)) {
  console.error(`❌ Test cases directory not found: ${TESTCASES_DIR}`);
  process.exit(1);
}

fs.mkdirSync(TEMP_DIR, { recursive: true });

console.log('\n╔════════════════════════════════════════════════════════════════════╗');
console.log('║   Sprint 18 Test Script Generation from Excel Test Cases         ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

const excelFiles = fs.readdirSync(TESTCASES_DIR)
  .filter(f => f.endsWith('.xlsx'))
  .sort();

console.log(`📋 Found ${excelFiles.length} Excel test case files\n`);

let processedCount = 0;
let successCount = 0;
let failedCount = 0;

function parseExcelFile(filePath) {
  if (!XLSX) {
    console.warn('⚠️  xlsx module not available. Please install with: npm install xlsx');
    return null;
  }

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    console.error(`  Error reading Excel: ${error.message}`);
    return null;
  }
}

function generatePlaywrightSpec(ticketKey, testCases) {
  // Extract component from test cases or use generic name
  const component = testCases[0]?.Component || testCases[0]?.component || 'general';
  const specDir = path.join(SPECS_DIR, component.toLowerCase());
  const specFile = path.join(specDir, `${component.toLowerCase()}.author.spec.ts`);

  // Ensure directory exists
  fs.mkdirSync(specDir, { recursive: true });

  // Generate spec file content
  const specContent = generateSpecContent(ticketKey, component, testCases);

  fs.writeFileSync(specFile, specContent);
  return specFile;
}

function generateSpecContent(ticketKey, component, testCases) {
  const testSuite = testCases.map((tc, idx) => {
    const testId = tc['Test ID'] || tc['test_id'] || `TC-${idx + 1}`;
    const title = tc['Test Title'] || tc['title'] || tc['Name'] || 'Test';
    const steps = tc['Test Steps'] || tc['steps'] || '';
    const expected = tc['Expected Result'] || tc['expected'] || '';

    return `
  test('${testId}: ${title}', async ({ page }) => {
    // Navigate to component
    await page.goto('/');

    // Steps:
    // ${steps.replace(/\n/g, '\n    // ')}

    // Expected Result:
    // ${expected.replace(/\n/g, '\n    // ')}

    // TODO: Implement test assertions based on steps and expected results
    expect(true).toBe(true);
  });`;
  }).join('\n');

  return `import { test, expect } from '@playwright/test';
import { loginToAEMAuthor } from '../../../src/utils/auth-utils';

test.describe('${component} - ${ticketKey}', () => {
  test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
  });
${testSuite}
});
`;
}

// Process each Excel file
for (const excelFile of excelFiles) {
  const ticketKey = path.basename(excelFile, '.xlsx');
  const filePath = path.join(TESTCASES_DIR, excelFile);

  console.log(`[${processedCount + 1}/${excelFiles.length}] ${ticketKey}...`);

  try {
    const testCases = parseExcelFile(filePath);

    if (!testCases || testCases.length === 0) {
      console.log(`  ⚠️  No test cases found in Excel file`);
      failedCount++;
    } else {
      const specFile = generatePlaywrightSpec(ticketKey, testCases);
      console.log(`  ✅ Generated spec with ${testCases.length} test cases`);
      console.log(`     → ${specFile}`);
      successCount++;
    }
  } catch (error) {
    console.log(`  ❌ Error processing: ${error.message}`);
    failedCount++;
  }

  processedCount++;
}

console.log('\n╔════════════════════════════════════════════════════════════════════╗');
console.log('║              Test Script Generation Complete                       ║');
console.log('╚════════════════════════════════════════════════════════════════════╝\n');

console.log('📊 Results:');
console.log(`   ✅ Successful: ${successCount}`);
console.log(`   ❌ Failed: ${failedCount}`);
console.log(`   📝 Total Processed: ${processedCount}\n`);

// Count generated files
const specCount = (execSync('find tests/specFiles/ga -name "*.author.spec.ts" -type f 2>/dev/null | wc -l', { encoding: 'utf-8' }).trim());

console.log('📁 Generated Files:');
console.log(`   Test Specs: ${specCount}\n`);

console.log('🚀 Next Steps:');
console.log('   1. Review generated test files in: tests/specFiles/ga/');
console.log('   2. Update test assertions (placeholders marked with TODO)');
console.log('   3. Run tests: env=dev npx playwright test tests/specFiles/ga/ --project chromium\n');

process.exit(failedCount > 0 ? 1 : 0);
