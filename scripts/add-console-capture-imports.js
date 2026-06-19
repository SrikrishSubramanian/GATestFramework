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
console.log(`🔧 ADD CONSOLE CAPTURE IMPORTS`);
console.log(`${'='.repeat(80)}\n`);
console.log(`Processing ${specFiles.length} spec files...\n`);

const stats = {
  processed: 0,
  modified: 0,
  importsAdded: 0,
  errors: [],
};

specFiles.forEach((specFile) => {
  try {
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;
    let modified = false;

    // Check if file uses ConsoleCapture but doesn't import it
    const hasUsage = content.includes('let capture: ConsoleCapture') ||
                     content.includes('new ConsoleCapture(');
    const hasImport = content.match(/import\s+\{\s*ConsoleCapture\s*\}/);

    if (hasUsage && !hasImport) {
      const lines = content.split('\n');
      let lastImportIndex = -1;

      // Find the last import statement
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().startsWith('import ') && lines[i].includes('from')) {
          lastImportIndex = i;
        } else if (lastImportIndex >= 0 && !lines[i].trim().startsWith('import')) {
          break;
        }
      }

      if (lastImportIndex >= 0) {
        // Calculate the correct import path based on file depth
        const relativeToSpecDir = path.relative(SPEC_DIR, specFile);
        const parts = relativeToSpecDir.split(path.sep);
        const depth = (parts.length - 1) + 3;
        const importPath = '../'.repeat(depth) + 'utils/infra/console-capture';

        lines.splice(
          lastImportIndex + 1,
          0,
          `import { ConsoleCapture } from '${importPath}';`
        );
        content = lines.join('\n');
        stats.importsAdded++;
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
console.log(`✅ RESULTS`);
console.log(`${'='.repeat(80)}\n`);

console.log(`ConsoleCapture imports added: ${stats.importsAdded}`);
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
