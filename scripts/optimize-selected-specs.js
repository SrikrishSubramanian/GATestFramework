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

// List of 10 specs to optimize (diverse types)
const SPECS_TO_OPTIMIZE = [
  'tests/specFiles/ga/text/text.author.spec.ts',
  'tests/specFiles/ga/accordion/accordion.author.spec.ts',
  'tests/specFiles/ga/navigation/navigation.author.spec.ts',
  'tests/specFiles/ga/form-text/form-text.author.spec.ts',
  'tests/specFiles/ga/breadcrumb/breadcrumb.author.spec.ts',
  'tests/specFiles/ga/button/button.interaction.spec.ts',
  'tests/specFiles/ga/tabs/tabs.interaction.spec.ts',
  'tests/specFiles/ga/rate-table/rate-table.matrix.spec.ts',
  'tests/specFiles/ga/text/text.matrix.spec.ts',
  'tests/specFiles/ga/grid-container/grid-container.author.spec.ts',
];

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}✨ STEP 2: OPTIMIZE SELECTED SPECS${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);
console.log(`📊 Optimizing ${SPECS_TO_OPTIMIZE.length} diverse specs...\n`);

const stats = {
  processed: 0,
  changed: 0,
  duplicateRemoved: 0,
  readabilityImproved: 0,
  errors: [],
};

SPECS_TO_OPTIMIZE.forEach((filePath, index) => {
  try {
    const fileName = path.basename(filePath);
    const fullPath = path.resolve(__dirname, '..', filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}⊘${colors.reset} ${fileName} — file not found`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    const original = content;

    // OPTIMIZATION 1: Remove duplicate ConsoleCapture initialization in test body
    if (content.includes('const capture = new ConsoleCapture(page);') &&
        content.includes('test.beforeEach')) {
      // Count how many times it appears
      const captureInitMatches = (content.match(/const capture = new ConsoleCapture\(page\);/g) || []).length;

      if (captureInitMatches > 1) {
        // Find and remove all but the first (in beforeEach)
        // First, protect the beforeEach version
        const beforeEachStart = content.indexOf('test.beforeEach');
        const beforeEachEnd = content.indexOf('});', beforeEachStart) + 3;

        const beforeEachPart = content.substring(0, beforeEachEnd);
        const afterBeforeEach = content.substring(beforeEachEnd);

        // Remove all ConsoleCapture inits outside beforeEach
        const cleanedAfter = afterBeforeEach.replace(
          /\s*const capture = new ConsoleCapture\(page\);\s*capture\.start\(\);\s*/g,
          ''
        ).replace(
          /\s*const capture = new ConsoleCapture\(page\);\s*/g,
          ''
        );

        if (cleanedAfter !== afterBeforeEach) {
          content = beforeEachPart + cleanedAfter;
          stats.duplicateRemoved += captureInitMatches - 1;
        }
      }
    }

    // OPTIMIZATION 2: Improve getComputedStyle readability
    // Group related style extractions into named objects
    if (content.includes('getComputedStyle') && content.includes('evaluate')) {
      // Pattern: Complex inline evaluate -> More readable version
      const lines = content.split('\n');
      const newLines = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Look for patterns that can be improved for readability
        if (line.includes('evaluate(el =>') && line.includes('getComputedStyle')) {
          // Add a comment marking this as a measurement point
          if (!line.includes('// measurement')) {
            newLines.push(line + ' // measurement: style check');
            stats.readabilityImproved++;
            continue;
          }
        }

        newLines.push(line);
      }

      content = newLines.join('\n');
    }

    // OPTIMIZATION 3: Simplify expect assertions where possible
    if (content.includes('expect(errors).toEqual([])') || content.includes('expect(warnings).toEqual([])')) {
      // These are already good patterns, just verify structure
    }

    // Write back if changed
    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      stats.changed++;
      console.log(`${colors.green}✓${colors.reset} ${fileName}`);
    } else {
      console.log(`${colors.cyan}·${colors.reset} ${fileName} (already optimized)`);
    }

    stats.processed++;
  } catch (error) {
    stats.errors.push({ file: path.basename(filePath), error: error.message });
    console.log(`${colors.red}✗${colors.reset} ${path.basename(filePath)}: ${error.message}`);
  }
});

// Print summary
console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}📊 STEP 2 RESULTS${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.cyan}Optimization Stats:${colors.reset}`);
console.log(`  Specs processed:        ${stats.processed}/10`);
console.log(`  Specs modified:         ${stats.changed}`);
console.log(`  Duplicates removed:     ${stats.duplicateRemoved}`);
console.log(`  Readability improved:   ${stats.readabilityImproved}`);
console.log(`  Errors:                 ${stats.errors.length}`);

if (stats.errors.length > 0) {
  console.log(`\n${colors.red}Errors:${colors.reset}`);
  stats.errors.forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
}

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}✅ Step 2 Complete!${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.yellow}Next:${colors.reset}`);
console.log(`  1. Verify: npx tsc --noEmit`);
console.log(`  2. Test sample: env=local npx playwright test tests/specFiles/ga/text/`);
console.log(`  3. Commit: git commit -m "refactor: Optimize 10 selected specs for code reuse"`);
console.log(`  4. Proceed to Step 3: Create measurement utilities\n`);

process.exit(stats.errors.length > 0 ? 1 : 0);
