#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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
console.log(`🔧 FIXING ALL IMPORT & SYNTAX ISSUES`);
console.log(`${'='.repeat(80)}\n`);
console.log(`Processing ${specFiles.length} spec files...\n`);

const stats = {
  processed: 0,
  modified: 0,
  duplicateImportsFixed: 0,
  missingImportsFixed: 0,
  consoleCaptureMissing: 0,
  errors: [],
};

specFiles.forEach((specFile) => {
  try {
    const fileName = path.basename(specFile);
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;
    let modified = false;

    // Fix 1: Remove duplicate scanImages imports
    const scanImagesMatches = (content.match(/import.*scanImages/g) || []).length;
    if (scanImagesMatches > 1) {
      // Keep first import, remove duplicates
      const lines = content.split('\n');
      let seenScanImages = false;
      let filteredLines = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('scanImages')) {
          if (!seenScanImages) {
            filteredLines.push(lines[i]);
            seenScanImages = true;
          }
          // else skip duplicate
        } else {
          filteredLines.push(lines[i]);
        }
      }

      content = filteredLines.join('\n');
      stats.duplicateImportsFixed++;
      modified = true;
    }

    // Fix 2: Add missing ConsoleCapture import if needed
    if (content.includes('let capture: ConsoleCapture') && !content.includes('ConsoleCapture')) {
      // This means ConsoleCapture is used but not imported
      const lines = content.split('\n');
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ') && lines[i].includes('from')) {
          lastImportIndex = i;
        } else if (lastImportIndex >= 0 && !lines[i].trim().startsWith('import')) {
          break;
        }
      }

      if (lastImportIndex >= 0 && !content.includes('ConsoleCapture')) {
        lines.splice(
          lastImportIndex + 1,
          0,
          `import { ConsoleCapture } from '../../../utils/infra/console-capture';`
        );
        content = lines.join('\n');
        stats.consoleCaptureMissing++;
        modified = true;
      }
    }

    // Fix 3: Ensure all files using action utilities have the import
    if ((content.includes('clickElement') || content.includes('await fill(') ||
         content.includes('await hover(') || content.includes('await doubleClick(')) &&
        !content.includes('from') || !content.includes('action-utils')) {

      // Check if import exists
      if (!content.includes('clickElement, fill, hover, doubleClick')) {
        const lines = content.split('\n');
        let lastImportIndex = -1;
        let hasActionImport = false;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('action-utils')) {
            hasActionImport = true;
            break;
          }
          if (lines[i].trim().startsWith('import ') && lines[i].includes('from')) {
            lastImportIndex = i;
          } else if (lastImportIndex >= 0 && !lines[i].trim().startsWith('import')) {
            break;
          }
        }

        if (!hasActionImport && lastImportIndex >= 0) {
          const depth = specFile.split(path.sep).length - specFile.split(path.sep).findIndex(p => p === 'ga');
          const pathPrefix = '../'.repeat(depth) + 'src/utils/action-utils';

          lines.splice(
            lastImportIndex + 1,
            0,
            `import { clickElement, fill, hover, doubleClick } from '${pathPrefix}';`
          );
          content = lines.join('\n');
          stats.missingImportsFixed++;
          modified = true;
        }
      }
    }

    if (content !== original) {
      fs.writeFileSync(specFile, content, 'utf-8');
      stats.modified++;
      process.stdout.write('✓');
    } else {
      process.stdout.write('·');
    }

    stats.processed++;
  } catch (error) {
    stats.errors.push({ file: path.basename(specFile), error: error.message });
    process.stdout.write('✗');
  }
});

console.log(`\n\n${'='.repeat(80)}`);
console.log(`✅ FIX RESULTS`);
console.log(`${'='.repeat(80)}\n`);

console.log(`Issues Fixed:`);
console.log(`  Duplicate imports removed:    ${stats.duplicateImportsFixed}`);
console.log(`  Missing imports added:        ${stats.missingImportsFixed}`);
console.log(`  ConsoleCapture imports added: ${stats.consoleCaptureMissing}`);

console.log(`\nSummary:`);
console.log(`  Specs processed: ${stats.processed}/${specFiles.length}`);
console.log(`  Specs modified:  ${stats.modified}`);
console.log(`  Errors:          ${stats.errors.length}`);

if (stats.errors.length > 0) {
  console.log(`\nErrors:`);
  stats.errors.slice(0, 5).forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
}

console.log(`\n${'='.repeat(80)}\n`);
