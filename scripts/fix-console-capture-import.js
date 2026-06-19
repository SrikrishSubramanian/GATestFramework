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
console.log(`🔧 FIX CONSOLE-CAPTURE IMPORT PATHS`);
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

    // Calculate correct path depth for console-capture
    // From tests/specFiles/ga/button/button.spec.ts -> ../../../utils/infra/console-capture
    // From tests/specFiles/ga/button/button.images.spec.ts (in subdir) -> ../../../utils/infra/console-capture
    const relativeToSpecDir = path.relative(SPEC_DIR, specFile);
    const parts = relativeToSpecDir.split(path.sep);
    // For console-capture, we need (parts.length - 1) + 2 levels (to reach specFiles level, then go to utils)
    const depth = (parts.length - 1) + 2;
    const correctPath = '../'.repeat(depth) + 'utils/infra/console-capture';

    // Fix any wrong console-capture imports
    if (content.match(/import.*ConsoleCapture.*from\s+['"][^'"]*console-capture['"]/)) {
      content = content.replace(
        /from ['"][^'"]*console-capture['"]/g,
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

console.log(`Console-capture imports fixed: ${stats.fixed}`);
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
