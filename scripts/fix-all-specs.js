#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Find files recursively matching pattern
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
  byType: {}
};

function getImportDepth(filePath) {
  const parts = filePath.split(path.sep);
  const gaIndex = parts.indexOf('ga');
  if (gaIndex >= 0) {
    const afterGa = parts.length - gaIndex - 1;
    return afterGa > 1 ? '../../../' : '../../';
  }
  return '../../../';
}

function fixSpecFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    const specType = filePath.match(/\.(author|interaction|matrix|visual|images)\.spec\.ts/)?.[1] || 'unknown';

    if (!stats.byType[specType]) {
      stats.byType[specType] = { fixed: 0, skipped: 0 };
    }

    // Skip if already has the proper pattern
    if (content.includes('test.afterEach') && content.includes('attachConsoleCapture')) {
      stats.byType[specType].skipped++;
      stats.skipped++;
      return;
    }

    // 1. Add report-enhancer import if missing
    if (!content.includes('attachConsoleCapture')) {
      const depth = getImportDepth(filePath);
      const importLine = `import { attachConsoleCapture, annotateEnvironment } from '${depth}utils/infra/report-enhancer';`;

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

    // 2. Add console-capture import if missing
    if (!content.includes('ConsoleCapture')) {
      const depth = getImportDepth(filePath);
      const importLine = `import { ConsoleCapture } from '${depth}utils/infra/console-capture';`;

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

    // 3. Add capture variable if missing
    if (!content.includes('let capture: ConsoleCapture;')) {
      const match = content.match(/\n(const [A-Z_]+ = |test\.)/);
      if (match && match.index) {
        const insertPos = match.index + 1;
        content = content.slice(0, insertPos) + 'let capture: ConsoleCapture;\n\n' + content.slice(insertPos);
      }
    }

    // 4. Update beforeEach to initialize capture
    const beforeEachRegex = /test\.beforeEach\s*\(\s*async\s*\(\s*{\s*page\s*}\s*\)\s*=>\s*{/;
    if (beforeEachRegex.test(content) && !content.includes('capture = new ConsoleCapture')) {
      const beforeEachMatch = content.match(beforeEachRegex);
      if (beforeEachMatch) {
        let braceCount = 1;
        let pos = beforeEachMatch.index + beforeEachMatch[0].length;
        while (braceCount > 0 && pos < content.length) {
          if (content[pos] === '{') braceCount++;
          if (content[pos] === '}') braceCount--;
          pos++;
        }
        const insertPos = pos - 1;
        const captureInit = '\n  capture = new ConsoleCapture(page);\n  capture.start();';
        content = content.slice(0, insertPos) + captureInit + content.slice(insertPos);
      }
    }

    // 5. Add afterEach if missing
    if (!content.includes('test.afterEach')) {
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
      stats.byType[specType].fixed++;
      stats.fixed++;
    }
  } catch (error) {
    stats.errors++;
    console.error(`✗ Error: ${path.relative(process.cwd(), filePath)}: ${error.message}`);
  }
}

function main() {
  console.log('🔧 Comprehensive Framework Refactoring Script\n');
  console.log(`Scanning: ${SPEC_DIR}\n`);

  // Find ALL .spec.ts files (not just author)
  const allSpecs = findFiles(SPEC_DIR, /\.spec\.ts$/);

  console.log(`Found ${allSpecs.length} total spec files\n`);

  // Group by type
  const specsByType = {};
  allSpecs.forEach(spec => {
    const type = spec.match(/\.(author|interaction|matrix|visual|images)\.spec\.ts/)?.[1] || 'unit';
    if (!specsByType[type]) specsByType[type] = [];
    specsByType[type].push(spec);
  });

  // Process each spec
  Object.entries(specsByType).forEach(([type, specs]) => {
    console.log(`\n📋 Processing ${specs.length} ${type} specs...`);
    specs.forEach(spec => {
      stats.total++;
      fixSpecFile(spec);
    });
  });

  // Print summary
  console.log(`\n${'='.repeat(70)}`);
  console.log('📊 Summary by Spec Type:');
  console.log(`${'='.repeat(70)}`);

  Object.entries(stats.byType).forEach(([type, data]) => {
    console.log(`${type.padEnd(15)} → Fixed: ${data.fixed.toString().padStart(3)} | Skipped: ${data.skipped.toString().padStart(3)}`);
  });

  console.log(`${'='.repeat(70)}`);
  console.log(`Total scanned:  ${stats.total}`);
  console.log(`Total fixed:    ${stats.fixed}`);
  console.log(`Total skipped:  ${stats.skipped}`);
  console.log(`Errors:         ${stats.errors}`);
  console.log(`${'='.repeat(70)}`);

  process.exit(stats.errors > 0 ? 1 : 0);
}

main();
