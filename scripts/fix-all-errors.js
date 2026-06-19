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
console.log(`🔧 FIX ALL TYPESCRIPT ERRORS IN FRAMEWORK`);
console.log(`${'='.repeat(80)}\n`);
console.log(`Processing ${specFiles.length} spec files...\n`);

const stats = {
  processed: 0,
  modified: 0,
  actionUtilsPathFixed: 0,
  consoleCaptureMissing: 0,
  pathsFixed: 0,
  errors: [],
};

specFiles.forEach((specFile) => {
  try {
    const fileName = path.basename(specFile);
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;
    let modified = false;

    // Fix 1: Fix wrong action-utils path from src/utils to utils/infra
    if (content.includes("from '../../../src/utils/action-utils'")) {
      content = content.replace(
        /from ['"]\.\.\/\.\.\/\.\.\/src\/utils\/action-utils['"]/g,
        "from '../../../utils/infra/action-utils'"
      );
      stats.actionUtilsPathFixed++;
      modified = true;
    }

    if (content.includes("from '../../src/utils/action-utils'")) {
      content = content.replace(
        /from ['"]\.\.\/\.\.\/src\/utils\/action-utils['"]/g,
        "from '../../utils/infra/action-utils'"
      );
      stats.actionUtilsPathFixed++;
      modified = true;
    }

    // Fix 2: Add missing ConsoleCapture import if used but not imported
    if (content.includes('let capture: ConsoleCapture') &&
        !content.includes('ConsoleCapture') ||
        (content.match(/ConsoleCapture/g) || []).length === 1) {

      const lines = content.split('\n');
      let hasConsoleImport = false;
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('ConsoleCapture')) {
          hasConsoleImport = true;
          break;
        }
        if (lines[i].trim().startsWith('import ') && lines[i].includes('from')) {
          lastImportIndex = i;
        } else if (lastImportIndex >= 0 && !lines[i].trim().startsWith('import')) {
          break;
        }
      }

      if (!hasConsoleImport && lastImportIndex >= 0) {
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

    // Fix 3: Fix other wrong import paths
    if (content.includes("from '../../src/utils/")) {
      content = content.replace(
        /from ['"]\.\.\/\.\.\/src\/utils\//g,
        "from '../../utils/infra/"
      );
      stats.pathsFixed++;
      modified = true;
    }

    if (content.includes('from \'../../../src/utils/')) {
      content = content.replace(
        /from ['"]\.\.\/\.\.\/\.\.\/src\/utils\//g,
        "from '../../../utils/infra/"
      );
      stats.pathsFixed++;
      modified = true;
    }

    // Fix 4: Ensure action-utils import exists where functions are used
    if ((content.includes('clickElement') || content.includes('await fill(') ||
         content.includes('await hover(') || content.includes('await doubleClick(')) &&
        !content.includes('action-utils')) {

      const lines = content.split('\n');
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ') && lines[i].includes('from')) {
          lastImportIndex = i;
        } else if (lastImportIndex >= 0 && !lines[i].trim().startsWith('import')) {
          break;
        }
      }

      if (lastImportIndex >= 0) {
        // Determine correct path depth
        const depth = specFile.split(path.sep).filter(p => p === 'ga').length;
        let pathPrefix;

        if (specFile.includes('specFiles/ga/')) {
          // e.g., tests/specFiles/ga/button/button.spec.ts -> ../../../utils/infra
          const relativeDepth = specFile.substring(specFile.indexOf('specFiles/ga/') + 'specFiles/ga/'.length)
            .split(path.sep).length;
          pathPrefix = '../'.repeat(relativeDepth + 1) + 'utils/infra/action-utils';
        } else {
          pathPrefix = '../../../utils/infra/action-utils';
        }

        lines.splice(
          lastImportIndex + 1,
          0,
          `import { clickElement, fill, hover, doubleClick } from '${pathPrefix}';`
        );
        content = lines.join('\n');
        stats.actionUtilsPathFixed++;
        modified = true;
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
console.log(`  Action-utils paths corrected: ${stats.actionUtilsPathFixed}`);
console.log(`  Console capture imports added: ${stats.consoleCaptureMissing}`);
console.log(`  Other paths fixed:            ${stats.pathsFixed}`);

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

process.exit(stats.errors.length > 0 ? 1 : 0);
