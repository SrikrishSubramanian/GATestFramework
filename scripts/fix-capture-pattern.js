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

function findFiles(dir, pattern) {
  const result = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      result.push(...findFiles(fullPath, pattern));
    } else if (file.match(pattern)) {
      result.push(fullPath);
    }
  }
  return result;
}

const SPEC_DIR = path.join(__dirname, '../tests/specFiles/ga');
const specFiles = findFiles(SPEC_DIR, /\.spec\.ts$/);

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}🔧 FIX CONSOLE CAPTURE PATTERN${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);
console.log(`📊 Processing ${specFiles.length} spec files...\n`);

const stats = {
  filesProcessed: 0,
  filesChanged: 0,
  beforeEachFixed: 0,
  afterEachFixed: 0,
  errors: [],
};

specFiles.forEach((specFile) => {
  try {
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;
    const fileName = path.basename(specFile);

    // FIX 1: Initialize capture in beforeEach
    if (content.includes('let capture: ConsoleCapture;') && !content.includes('capture = new ConsoleCapture(page);')) {
      // Find beforeEach block and add capture initialization
      const beforeEachMatch = content.match(/test\.beforeEach\s*\(\s*async\s*\(\s*\{\s*page\s*\}\s*\)\s*=>\s*\{/);
      if (beforeEachMatch) {
        const insertPos = beforeEachMatch.index + beforeEachMatch[0].length;
        // Find the end of the first line
        const nextNewline = content.indexOf('\n', insertPos);
        content = content.slice(0, nextNewline + 1) +
          '  capture = new ConsoleCapture(page);\n' +
          '  capture.start();\n' +
          content.slice(nextNewline + 1);
        stats.beforeEachFixed++;
      }
    }

    // FIX 2: Fix attachConsoleCapture call pattern
    // Change from: await attachConsoleCapture(testInfo, errors, warnings);
    // To: await attachConsoleCapture(testInfo, capture);
    if (content.includes('await attachConsoleCapture(testInfo, errors, warnings)')) {
      // Also remove the lines that extract errors and warnings
      content = content.replace(
        /const errors = capture\.getErrors\(\);[\s\n]*const warnings = capture\.getWarnings\(\);[\s\n]*if \(errors\.length > 0 \|\| warnings\.length > 0\) \{[\s\n]*await attachConsoleCapture\(testInfo, errors, warnings\);[\s\n]*\}/g,
        'if (capture) {\n    await attachConsoleCapture(testInfo, capture);\n  }'
      );
      stats.afterEachFixed++;
    }

    // FIX 3: Fix annotateEnvironment call pattern
    // Change from: await annotateEnvironment(testInfo);
    // To: await annotateEnvironment(testInfo); (already correct, but make sure it's there)
    if (!content.includes('await annotateEnvironment(testInfo)')) {
      // If it doesn't have it, we need to add it in afterEach
      const afterEachMatch = content.match(/test\.afterEach\s*\(\s*async\s*\(\s*\{\s*page\s*\}\s*,\s*testInfo\s*\)\s*=>/);
      if (afterEachMatch) {
        const closeMatch = content.match(/test\.afterEach[^}]*\{[^}]*\}/);
        if (closeMatch && !closeMatch[0].includes('annotateEnvironment')) {
          // Find the closing brace and add before it
          const lastBrace = closeMatch[0].lastIndexOf('}');
          const insertPoint = closeMatch.index + lastBrace;
          content = content.slice(0, insertPoint) +
            '  await annotateEnvironment(testInfo);\n' +
            content.slice(insertPoint);
        }
      }
    }

    // Write back if changed
    if (content !== original) {
      fs.writeFileSync(specFile, content, 'utf-8');
      stats.filesChanged++;
      console.log(`${colors.green}✓${colors.reset} ${fileName}`);
    }
    stats.filesProcessed++;
  } catch (error) {
    const fileName = path.basename(specFile);
    stats.errors.push({ file: fileName, error: error.message });
    console.log(`${colors.red}✗${colors.reset} ${fileName}: ${error.message}`);
  }
});

// Print summary
console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}📊 CONSOLE CAPTURE PATTERN FIX RESULTS${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.cyan}Files:${colors.reset}`);
console.log(`  Processed:                  ${stats.filesProcessed}/${specFiles.length}`);
console.log(`  Fixed:                      ${stats.filesChanged}`);
console.log(`  Errors:                     ${stats.errors.length}`);

console.log(`\n${colors.cyan}Fixes Applied:${colors.reset}`);
console.log(`  beforeEach initialized:     ${stats.beforeEachFixed}`);
console.log(`  afterEach corrected:        ${stats.afterEachFixed}`);

if (stats.errors.length > 0) {
  console.log(`\n${colors.red}Errors:${colors.reset}`);
  stats.errors.forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
}

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}✅ Console Capture Pattern Fix Complete!${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.yellow}Next Steps:${colors.reset}`);
console.log(`  1. Check TypeScript: npx tsc --noEmit`);
console.log(`  2. Review changes: git diff tests/specFiles/`);
console.log(`  3. Commit: git commit -m "fix: Correct console capture pattern in all specs"\n`);

process.exit(stats.errors.length > 0 ? 1 : 0);
