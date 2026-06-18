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
console.log(`${colors.bright}🚀 PRIORITY 2: Integrate Action Utilities${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);
console.log(`📊 Processing ${specFiles.length} spec files...\n`);

const stats = {
  processed: 0,
  modified: 0,
  clickReplaced: 0,
  fillReplaced: 0,
  hoverReplaced: 0,
  doubleClickReplaced: 0,
  importsAdded: 0,
  errors: [],
};

specFiles.forEach((specFile, index) => {
  try {
    const fileName = path.basename(specFile);
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;

    // Check if file already imports action-utils
    const hasActionImport = content.includes('from') && content.includes('action-utils');

    // Pattern 1: Replace element.click() with clickElement()
    let clickMatches = 0;
    content = content.replace(
      /await\s+(\w+)\.click\(\s*\);/g,
      (match, varName) => {
        clickMatches++;
        return `await clickElement(${varName});`;
      }
    );

    // Pattern 2: Replace element.fill() with fill()
    let fillMatches = 0;
    content = content.replace(
      /await\s+(\w+)\.fill\(\s*['"`]([^'"`]+)['"`]\s*\);/g,
      (match, varName, value) => {
        fillMatches++;
        return `await fill(${varName}, '${value}');`;
      }
    );

    // Pattern 3: Replace element.hover() with hover()
    let hoverMatches = 0;
    content = content.replace(
      /await\s+(\w+)\.hover\(\s*\);/g,
      (match, varName) => {
        hoverMatches++;
        return `await hover(${varName});`;
      }
    );

    // Pattern 4: Replace element.dblClick() with doubleClick()
    let doubleClickMatches = 0;
    content = content.replace(
      /await\s+(\w+)\.dblClick\(\s*\);/g,
      (match, varName) => {
        doubleClickMatches++;
        return `await doubleClick(${varName});`;
      }
    );

    const totalReplaced = clickMatches + fillMatches + hoverMatches + doubleClickMatches;

    // Add import if any replacements were made and not already imported
    if (totalReplaced > 0 && !hasActionImport) {
      // Find the last import statement
      const importLines = content.split('\n');
      let lastImportIndex = -1;
      for (let i = 0; i < importLines.length; i++) {
        if (importLines[i].trim().startsWith('import ')) {
          lastImportIndex = i;
        } else if (lastImportIndex >= 0 && !importLines[i].trim().startsWith('import')) {
          break;
        }
      }

      if (lastImportIndex >= 0) {
        // Get the depth for path calculation
        const depth = specFile.split(path.sep).length - specFile.split(path.sep).findIndex(p => p === 'ga');
        const pathPrefix = '../'.repeat(depth) + 'src/utils/action-utils';

        importLines.splice(
          lastImportIndex + 1,
          0,
          `import { clickElement, fill, hover, doubleClick } from '${pathPrefix}';`
        );
        content = importLines.join('\n');
        stats.importsAdded++;
      }
    }

    stats.clickReplaced += clickMatches;
    stats.fillReplaced += fillMatches;
    stats.hoverReplaced += hoverMatches;
    stats.doubleClickReplaced += doubleClickMatches;

    if (content !== original) {
      fs.writeFileSync(specFile, content, 'utf-8');
      stats.modified++;
      process.stdout.write(colors.green + '✓' + colors.reset);
    } else {
      process.stdout.write(colors.cyan + '·' + colors.reset);
    }

    if ((index + 1) % 50 === 0) {
      process.stdout.write(` ${index + 1}/${specFiles.length}\n`);
    }

    stats.processed++;
  } catch (error) {
    const fileName = path.basename(specFile);
    stats.errors.push({ file: fileName, error: error.message });
    process.stdout.write(colors.red + '✗' + colors.reset);
  }
});

console.log(`\n\n${'='.repeat(80)}`);
console.log(`${colors.bright}📊 PRIORITY 2 RESULTS${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.cyan}Action Replacements:${colors.reset}`);
console.log(`  .click() → clickElement():   ${stats.clickReplaced}`);
console.log(`  .fill() → fill():            ${stats.fillReplaced}`);
console.log(`  .hover() → hover():          ${stats.hoverReplaced}`);
console.log(`  .dblClick() → doubleClick(): ${stats.doubleClickReplaced}`);
console.log(`  Total replacements:          ${stats.clickReplaced + stats.fillReplaced + stats.hoverReplaced + stats.doubleClickReplaced}`);

console.log(`\n${colors.cyan}Summary:${colors.reset}`);
console.log(`  Specs processed:   ${stats.processed}/${specFiles.length}`);
console.log(`  Specs modified:    ${stats.modified}`);
console.log(`  Imports added:     ${stats.importsAdded}`);
console.log(`  Errors:            ${stats.errors.length}`);

if (stats.errors.length > 0) {
  console.log(`\n${colors.red}Errors:${colors.reset}`);
  stats.errors.slice(0, 5).forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
  if (stats.errors.length > 5) {
    console.log(`  ... and ${stats.errors.length - 5} more`);
  }
}

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}✅ Priority 2 Complete!${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.yellow}Benefits:${colors.reset}`);
console.log(`  ✅ Better error handling in click operations`);
console.log(`  ✅ Automatic retry logic for flaky operations`);
console.log(`  ✅ Consistent action patterns across specs`);
console.log(`  ✅ Improved debugging messages`);

process.exit(stats.errors.length > 0 ? 1 : 0);
