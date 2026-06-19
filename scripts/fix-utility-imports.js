#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

const UTILS_DIR = path.join(__dirname, '../tests/utils');
const files = findFiles(UTILS_DIR, /\.ts$/);

console.log(`\n${'='.repeat(80)}`);
console.log(`🔧 FIX UTILITY FILE IMPORT PATHS`);
console.log(`${'='.repeat(80)}\n`);
console.log(`Processing ${files.length} utility files...\n`);

const stats = {
  processed: 0,
  modified: 0,
  fixed: 0,
  errors: [],
};

files.forEach((file) => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const original = content;

    // Fix various import paths
    // Pattern 1: ../../src/utils/ should be ../../../src/utils/
    if (content.includes("from '../../src/utils/")) {
      content = content.replace(
        /from ['"]\.\.\/\.\.\/src\/utils\//g,
        "from '../../../src/utils/"
      );
      stats.fixed++;
    }

    // Pattern 2: ../utils/ when it should be in a sibling directory
    if (content.includes("from '../utils/")) {
      content = content.replace(
        /from ['"]\.\.\/utils\//g,
        "from './utils/"
      );
      stats.fixed++;
    }

    // Pattern 3: Fix relative paths that reference non-existent utils directories
    // Check if the import path actually exists
    const imports = content.match(/from\s+['"]([^'"]+)['"]/g) || [];
    for (const imp of imports) {
      const importPath = imp.match(/['"]([^'"]+)['"]/)[1];

      // Skip node_modules and external packages
      if (importPath.startsWith('@') || importPath.startsWith('.')) {
        // This is a relative import, would need to verify existence
        // For now, we'll apply pattern matching
      }
    }

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf-8');
      stats.modified++;
      process.stdout.write('✓');
    } else {
      process.stdout.write('·');
    }

    stats.processed++;
  } catch (error) {
    stats.errors.push({ file: path.basename(file), error: error.message });
    process.stdout.write('✗');
  }
});

console.log(`\n\n${'='.repeat(80)}`);
console.log(`✅ RESULTS`);
console.log(`${'='.repeat(80)}\n`);

console.log(`Import paths fixed: ${stats.fixed}`);
console.log(`Files processed:    ${stats.processed}`);
console.log(`Files modified:     ${stats.modified}`);
console.log(`Errors:             ${stats.errors.length}`);

if (stats.errors.length > 0) {
  console.log(`\nErrors:`);
  stats.errors.slice(0, 5).forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
}

console.log(`\n${'='.repeat(80)}\n`);
