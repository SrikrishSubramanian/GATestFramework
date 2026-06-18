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
console.log(`${colors.bright}🔧 FINAL TYPESCRIPT FIXES${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);
console.log(`📊 Processing ${specFiles.length} spec files...\n`);

const stats = {
  filesProcessed: 0,
  filesChanged: 0,
  beforeEachFixed: 0,
  afterEachFixed: 0,
  importsFixed: 0,
};

specFiles.forEach((specFile) => {
  try {
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;
    const fileName = path.basename(specFile);

    // FIX 1: Add ConsoleCapture initialization in beforeEach
    if (content.includes('let capture: ConsoleCapture;') && content.includes('test.beforeEach')) {
      // Check if capture is initialized in beforeEach
      const beforeEachMatch = content.match(/test\.beforeEach\s*\(\s*async\s*\(\s*\{\s*page\s*\}\s*\)\s*=>\s*\{([^}]*)\}\s*\);/s);

      if (beforeEachMatch) {
        const beforeEachBody = beforeEachMatch[1];

        // Only add if not already there
        if (!beforeEachBody.includes('capture = new ConsoleCapture')) {
          // Find the opening brace of beforeEach and add initialization after first line
          const newBeforeEach = beforeEachMatch[0].replace(
            /test\.beforeEach\s*\(\s*async\s*\(\s*\{\s*page\s*\}\s*\)\s*=>\s*\{\s*/,
            `test.beforeEach(async ({ page }) => {\n  capture = new ConsoleCapture(page);\n  capture.start();\n  `
          );
          content = content.replace(beforeEachMatch[0], newBeforeEach);
          stats.beforeEachFixed++;
        }
      }
    }

    // FIX 2: Fix afterEach to use correct function signatures
    if (content.includes('await attachConsoleCapture(page,')) {
      // Old pattern: attachConsoleCapture(page, testInfo, errors, warnings)
      // New pattern: attachConsoleCapture(testInfo, capture)
      content = content.replace(
        /const errors = capture\.getErrors\(\);[\s\n]*const warnings = capture\.getWarnings\(\);[\s\n]*if \(errors\.length > 0 \|\| warnings\.length > 0\) \{[\s\n]*await attachConsoleCapture\(page, testInfo, errors, warnings\);[\s\n]*\}/g,
        `if (capture) {\n    await attachConsoleCapture(testInfo, capture);\n  }`
      );
      stats.afterEachFixed++;
    }

    // FIX 3: Fix annotateEnvironment calls
    if (content.includes('await annotateEnvironment(page, testInfo)')) {
      // Old: annotateEnvironment(page, testInfo)
      // New: annotateEnvironment(testInfo) - with default params
      content = content.replace(
        /await annotateEnvironment\(page, testInfo\);/g,
        `await annotateEnvironment(testInfo);`
      );
      stats.afterEachFixed++;
    }

    // FIX 4: Add missing image-scan-utils import if scanImages is used
    if (content.includes('scanImages(') && !content.includes('image-scan-utils')) {
      const importPath = '../../../utils/infra/image-scan-utils';
      const firstImport = content.match(/^import /m);
      if (firstImport) {
        content = content.slice(0, firstImport.index) +
          `import { scanImages, attachImageScanResults } from '${importPath}';\n` +
          content.slice(firstImport.index);
        stats.importsFixed++;
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
    console.log(`${colors.red}✗${colors.reset} ${path.basename(specFile)}: ${error.message}`);
  }
});

// Print summary
console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}📊 FINAL FIX RESULTS${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.cyan}Files:${colors.reset}`);
console.log(`  Processed:                  ${stats.filesProcessed}/${specFiles.length}`);
console.log(`  Fixed:                      ${stats.filesChanged}`);

console.log(`\n${colors.cyan}Fixes Applied:${colors.reset}`);
console.log(`  beforeEach initialization:  ${stats.beforeEachFixed}`);
console.log(`  afterEach corrected:        ${stats.afterEachFixed}`);
console.log(`  Missing imports added:      ${stats.importsFixed}`);

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}✅ Final Fixes Complete!${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.yellow}Verify:${colors.reset}`);
console.log(`  npx tsc --noEmit 2>&1 | grep "error TS" | wc -l\n`);
