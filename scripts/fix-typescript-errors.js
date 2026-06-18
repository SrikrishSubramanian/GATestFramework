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
console.log(`${colors.bright}🔧 FIX TYPESCRIPT ERRORS${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);
console.log(`📊 Processing ${specFiles.length} spec files...\n`);

const stats = {
  filesProcessed: 0,
  filesChanged: 0,
  captureFixed: 0,
  importsFixed: 0,
  signatureFixed: 0,
  errors: [],
};

specFiles.forEach((specFile) => {
  try {
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;
    const fileName = path.basename(specFile);

    // FIX 1: Add missing ConsoleCapture import
    if (content.includes('capture = new ConsoleCapture') && !content.includes('import { ConsoleCapture }')) {
      const firstImport = content.match(/^import /m);
      if (firstImport) {
        content = content.slice(0, firstImport.index) +
          `import { ConsoleCapture } from '../../../utils/infra/console-capture';\n` +
          content.slice(firstImport.index);
        stats.importsFixed++;
      }
    }

    // FIX 2: Initialize capture in beforeEach if missing
    if (content.includes('capture = new ConsoleCapture') && !content.includes('let capture:')) {
      const beforeEachMatch = content.match(/test\.beforeEach\s*\(\s*async\s*\(\s*\{\s*page\s*\}\s*\)/);
      if (beforeEachMatch) {
        // Check if capture is already initialized
        const beforeEachBody = content.substring(beforeEachMatch.index);
        if (!beforeEachBody.includes('capture = new ConsoleCapture')) {
          // Add let capture declaration
          const letMatch = content.match(/^let\s+\w+/m);
          if (letMatch) {
            content = content.slice(0, letMatch.index) +
              'let capture: ConsoleCapture;\n' +
              content.slice(letMatch.index);
            stats.captureFixed++;
          }
        }
      }
    }

    // FIX 3: Fix attachConsoleCapture signature
    // Change from: await attachConsoleCapture(page, testInfo, errors, warnings);
    // To:         await attachConsoleCapture(testInfo, errors, warnings);
    if (content.includes('attachConsoleCapture(page, testInfo')) {
      content = content.replace(
        /await\s+attachConsoleCapture\s*\(\s*page\s*,\s*testInfo\s*,\s*errors\s*,\s*warnings\s*\)/g,
        'await attachConsoleCapture(testInfo, errors, warnings)'
      );
      stats.signatureFixed++;
    }

    // FIX 4: Fix annotateEnvironment signature
    // Change from: await annotateEnvironment(page, testInfo);
    // To:         await annotateEnvironment(testInfo);
    if (content.includes('annotateEnvironment(page, testInfo)')) {
      content = content.replace(
        /await\s+annotateEnvironment\s*\(\s*page\s*,\s*testInfo\s*\)/g,
        'await annotateEnvironment(testInfo)'
      );
      stats.signatureFixed++;
    }

    // FIX 5: Remove broken-image-detector imports (module doesn't exist)
    if (content.includes('broken-image-detector')) {
      content = content.replace(
        /import\s*\{\s*[^}]*\}\s*from\s*['"][^'"]*broken-image-detector['"];\n/g,
        ''
      );
      stats.importsFixed++;
    }

    // FIX 6: Fix wrong import paths
    // Change content-fixture-deployer import path
    if (content.includes(`from '../../utils/infra/content-fixture-deployer`)) {
      const depth = path.relative(SPEC_DIR, specFile).split(path.sep).length;
      const correctPath = depth > 1 ? '../../../' : '../../';
      content = content.replace(
        /from\s*['"]\.\.\/\.\.\/utils\/infra\/content-fixture-deployer['"]/g,
        `from '${correctPath}utils/infra/content-fixture-deployer'`
      );
      stats.importsFixed++;
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
console.log(`${colors.bright}📊 TYPESCRIPT ERROR FIX RESULTS${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.cyan}Files:${colors.reset}`);
console.log(`  Processed:                  ${stats.filesProcessed}/${specFiles.length}`);
console.log(`  Fixed:                      ${stats.filesChanged}`);
console.log(`  Errors:                     ${stats.errors.length}`);

console.log(`\n${colors.cyan}Fixes Applied:${colors.reset}`);
console.log(`  Capture variable issues:    ${stats.captureFixed}`);
console.log(`  Missing imports added:      ${stats.importsFixed}`);
console.log(`  Function signatures fixed:  ${stats.signatureFixed}`);

if (stats.errors.length > 0) {
  console.log(`\n${colors.red}Errors:${colors.reset}`);
  stats.errors.forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
}

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}✅ TypeScript Error Fixes Complete!${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.yellow}Next Steps:${colors.reset}`);
console.log(`  1. Check TypeScript: npx tsc --noEmit`);
console.log(`  2. Fix remaining errors manually if needed`);
console.log(`  3. Commit: git commit -m "fix: Resolve TypeScript errors across specs"\n`);

process.exit(stats.errors.length > 0 ? 1 : 0);
