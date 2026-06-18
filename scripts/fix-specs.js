#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Use sync glob since async might not be available
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

const stats = {
  total: 0,
  fixed: 0,
  skipped: 0,
  errors: 0,
};

function getImportDepth(filePath) {
  const parts = filePath.split(path.sep);
  const gaIndex = parts.indexOf('ga');
  if (gaIndex >= 0) {
    // Count how many segments after ga
    const afterGa = parts.length - gaIndex - 1;
    // ga/component/file.spec.ts = 2 levels = ../../../
    // ga/file.spec.ts = 1 level = ../../
    return afterGa > 1 ? '../../../' : '../../';
  }
  return '../../../';
}

function fixSpecFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // 1. Add report-enhancer import if missing
    if (!content.includes('attachConsoleCapture')) {
      const depth = getImportDepth(filePath);
      const importLine = `import { attachConsoleCapture, annotateEnvironment } from '${depth}utils/infra/report-enhancer';`;

      // Find last import
      const importMatches = [];
      const importRegex = /^import .* from ['""].+['"""];?$/gm;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        importMatches.push(match);
      }

      if (importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const insertPos = lastImport.index + lastImport[0].length;
        if (!content.includes(importLine)) {
          content = content.slice(0, insertPos) + '\n' + importLine + content.slice(insertPos);
        }
      }
    }

    // 2. Add capture variable if missing
    if (!content.includes('let capture: ConsoleCapture;')) {
      // Find insertion point
      const match = content.match(/\n(const [A-Z_]+ = |test\.)/);
      if (match && match.index) {
        const insertPos = match.index + 1;
        content = content.slice(0, insertPos) + 'let capture: ConsoleCapture;\n\n' + content.slice(insertPos);
      }
    }

    // 3. Update beforeEach
    const beforeEachRegex = /test\.beforeEach\s*\(\s*async\s*\(\s*{\s*page\s*}\s*\)\s*=>\s*{/;
    if (beforeEachRegex.test(content) && !content.includes('capture = new ConsoleCapture')) {
      // Find the closing brace of beforeEach
      const beforeEachMatch = content.match(beforeEachRegex);
      if (beforeEachMatch) {
        let braceCount = 1;
        let pos = beforeEachMatch.index + beforeEachMatch[0].length;
        while (braceCount > 0 && pos < content.length) {
          if (content[pos] === '{') braceCount++;
          if (content[pos] === '}') braceCount--;
          pos++;
        }
        // Insert before the closing });
        const insertPos = pos - 1;
        const captureInit = '\n  capture = new ConsoleCapture(page);\n  capture.start();';
        content = content.slice(0, insertPos) + captureInit + content.slice(insertPos);
      }
    }

    // 4. Add afterEach if missing
    if (!content.includes('test.afterEach')) {
      // Find where to add (after beforeEach)
      const beforeEachStart = content.indexOf('test.beforeEach');
      const closePos = content.indexOf('});', beforeEachStart);
      if (closePos > 0) {
        const insertPos = closePos + 3;
        const afterEachBlock = `

test.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});`;
        content = content.slice(0, insertPos) + afterEachBlock + content.slice(insertPos);
      }
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      stats.fixed++;
      const rel = path.relative(process.cwd(), filePath);
      console.log(`✓ Fixed: ${rel}`);
    } else {
      stats.skipped++;
    }
  } catch (error) {
    stats.errors++;
    console.error(`✗ Error: ${path.relative(process.cwd(), filePath)}: ${error.message}`);
  }
}

function main() {
  console.log('🔧 Framework Refactoring Script\n');
  console.log(`Scanning: ${SPEC_DIR}\n`);

  // Find all .author.spec.ts files
  const authorSpecs = findFiles(SPEC_DIR, /\.author\.spec\.ts$/);

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
