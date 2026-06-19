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
console.log(`🔧 FIX ACTION-UTILS IMPORT PATHS`);
console.log(`${'='.repeat(80)}\n`);
console.log(`Processing ${specFiles.length} spec files...\n`);

const stats = {
  processed: 0,
  modified: 0,
  fixed: 0,
  errors: [],
};

specFiles.forEach((specFile) => {
  try {
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;

    // Calculate correct path depth
    // From tests/specFiles/ga/accordion-tabs-feature/file.spec.ts -> ../../../../src/utils/action-utils
    // From tests/specFiles/ga/file.spec.ts -> ../../../src/utils/action-utils
    const relativeToSpecDir = path.relative(SPEC_DIR, specFile);
    const parts = relativeToSpecDir.split(path.sep);
    // parts.length - 1 = number of directories; add 3 to reach root from ga/
    const depth = (parts.length - 1) + 3;
    const correctPath = '../'.repeat(depth) + 'src/utils/action-utils';

    // Fix any wrong action-utils imports
    if (content.includes('action-utils')) {
      content = content.replace(
        /from ['"][^'"]*action-utils['"]/g,
        `from '${correctPath}'`
      );
      stats.fixed++;
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
console.log(`✅ RESULTS`);
console.log(`${'='.repeat(80)}\n`);

console.log(`Action-utils imports fixed: ${stats.fixed}`);
console.log(`Specs processed: ${stats.processed}/${specFiles.length}`);
console.log(`Specs modified:  ${stats.modified}`);
console.log(`Errors:          ${stats.errors.length}`);

if (stats.errors.length > 0) {
  console.log(`\nErrors:`);
  stats.errors.slice(0, 5).forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
}

console.log(`\n${'='.repeat(80)}\n`);
