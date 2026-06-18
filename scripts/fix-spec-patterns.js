#!/usr/bin/env node

/**
 * Framework Refactoring Script
 * Applies proper console-capture + report-enhancer pattern to all spec files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const SPEC_DIR = path.join(__dirname, '../tests/specFiles/ga');

// Track stats
const stats = {
  total: 0,
  fixed: 0,
  skipped: 0,
  errors: 0,
};

/**
 * Add ConsoleCapture + report-enhancer to a spec file
 */
function fixSpecFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // 1. Add imports if missing
    const hasReportEnhancer = content.includes('attachConsoleCapture');
    if (!hasReportEnhancer) {
      // Find the last import line
      const importMatch = content.match(/^import .* from ['""].*['""];?$/m);
      if (importMatch) {
        const lastImportEnd = content.lastIndexOf('\n', content.indexOf(importMatch[0]) + importMatch[0].length);
        if (lastImportEnd > 0) {
          // Check import depth for proper relative paths
          const depth = (filePath.match(/\/ga\/([^/]+)\//g) || ['']).length > 0 ? '../../' : '../../../';
          const importToAdd = `import { attachConsoleCapture, annotateEnvironment } from '${depth}utils/infra/report-enhancer';\n`;

          if (!content.includes(importToAdd.trim())) {
            content = content.slice(0, lastImportEnd + 1) + importToAdd + content.slice(lastImportEnd + 1);
          }
        }
      }
    }

    // 2. Add capture variable if missing
    const hasCaptureVar = content.includes('let capture: ConsoleCapture;');
    if (!hasCaptureVar) {
      // Find where to insert (after imports, before first const or test)
      const insertPoint = content.search(/\nconst [A-Z_]+ = |^test\./m);
      if (insertPoint > 0) {
        content = content.slice(0, insertPoint) + '\nlet capture: ConsoleCapture;\n' + content.slice(insertPoint);
      }
    }

    // 3. Update beforeEach to initialize capture
    const beforeEachPattern = /test\.beforeEach\s*\(\s*async\s*\(\s*{\s*page\s*}\s*\)\s*=>\s*{([^}]*(?:{[^}]*}[^}]*)*)\n\s*}\s*\);/s;
    if (beforeEachPattern.test(content)) {
      content = content.replace(beforeEachPattern, (match, body) => {
        // Only add if not already there
        if (!body.includes('capture = new ConsoleCapture')) {
          const lines = body.split('\n');
          const lastLine = lines[lines.length - 2] || ''; // -2 because last is the closing }

          const captureInit = '\n  capture = new ConsoleCapture(page);\n  capture.start();';
          return match.replace(body, body.slice(0, -1) + captureInit + '\n ');
        }
        return match;
      });
    }

    // 4. Add afterEach if missing
    if (!content.includes('test.afterEach')) {
      // Find where to add (after beforeEach)
      const beforeEachEnd = content.indexOf('});', content.indexOf('test.beforeEach'));
      if (beforeEachEnd > 0) {
        const afterEachBlock = `\n\ntest.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});`;
        content = content.slice(0, beforeEachEnd + 3) + afterEachBlock + content.slice(beforeEachEnd + 3);
      }
    }

    // Only write if changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      stats.fixed++;
      console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
    } else {
      stats.skipped++;
    }
  } catch (error) {
    stats.errors++;
    console.error(`✗ Error: ${path.relative(process.cwd(), filePath)}: ${error.message}`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Framework Refactoring Script\n');
  console.log(`Scanning: ${SPEC_DIR}\n`);

  // Find all .author.spec.ts files
  const authorSpecs = glob.sync(path.join(SPEC_DIR, '**/*.author.spec.ts'));

  console.log(`Found ${authorSpecs.length} author specs\n`);

  authorSpecs.forEach(filePath => {
    stats.total++;
    fixSpecFile(filePath);
  });

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 Summary:');
  console.log(`   Total scanned:  ${stats.total}`);
  console.log(`   Fixed:          ${stats.fixed}`);
  console.log(`   Skipped:        ${stats.skipped}`);
  console.log(`   Errors:         ${stats.errors}`);
  console.log(`${'='.repeat(60)}`);

  process.exit(stats.errors > 0 ? 1 : 0);
}

main();
