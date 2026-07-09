#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(80)}`);
console.log(`🔍 COMPREHENSIVE PATH VALIDATION SCAN`);
console.log(`${'='.repeat(80)}\n`);

// Collect all TypeScript files
function findAllTsFiles(dir) {
  const result = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      result.push(...findAllTsFiles(fullPath));
    } else if (file.endsWith('.ts')) {
      result.push(fullPath);
    }
  }
  return result;
}

const tsFiles = findAllTsFiles('.');
console.log(`📝 Found ${tsFiles.length} TypeScript files to scan\n`);

const issues = {
  brokenPaths: [],
  missingFiles: [],
  incorrectPaths: [],
  correctPaths: [],
};

let checked = 0;

tsFiles.forEach((filePath) => {
  try {
    // Skip node_modules, .git, .next, etc
    if (filePath.includes('node_modules') || filePath.includes('.next') ||
        filePath.includes('.git') || filePath.includes('.claude')) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Find all import statements
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];

      // Skip node_modules, @types, etc
      if (importPath.startsWith('@') || importPath.startsWith('playwright')) {
        issues.correctPaths.push({ file: filePath, path: importPath, type: 'external' });
        continue;
      }

      // Resolve the import path relative to the file
      const fileDir = path.dirname(filePath);
      const resolvedPath = path.resolve(fileDir, importPath);

      // Check if it's a directory (index.ts) or file (.ts)
      let exists = false;
      let actualPath = null;

      if (fs.existsSync(resolvedPath)) {
        exists = true;
        actualPath = resolvedPath;
      } else if (fs.existsSync(resolvedPath + '.ts')) {
        exists = true;
        actualPath = resolvedPath + '.ts';
      } else if (fs.existsSync(resolvedPath + '/index.ts')) {
        exists = true;
        actualPath = resolvedPath + '/index.ts';
      } else if (fs.existsSync(resolvedPath + '.js')) {
        exists = true;
        actualPath = resolvedPath + '.js';
      } else if (fs.existsSync(resolvedPath + '.json')) {
        exists = true;
        actualPath = resolvedPath + '.json';
      }

      if (exists) {
        issues.correctPaths.push({
          file: filePath,
          path: importPath,
          resolved: actualPath,
          type: 'valid'
        });
      } else {
        issues.missingFiles.push({
          file: filePath,
          importPath: importPath,
          attempted: resolvedPath,
          line: content.substring(0, content.indexOf(match[0])).split('\n').length
        });
      }
    }

    checked++;
    process.stdout.write('.');
    if (checked % 50 === 0) {
      process.stdout.write(` ${checked}/${tsFiles.length}\n`);
    }
  } catch (error) {
    // Silently skip files that can't be read
  }
});

console.log(`\n\n${'='.repeat(80)}`);
console.log(`📊 PATH VALIDATION RESULTS`);
console.log(`${'='.repeat(80)}\n`);

console.log(`✅ Valid Paths:        ${issues.correctPaths.length}`);
console.log(`❌ Missing Files:      ${issues.missingFiles.length}`);
console.log(`⚠️  Broken Paths:       ${issues.brokenPaths.length}`);

console.log(`\n${'='.repeat(80)}`);

if (issues.missingFiles.length > 0) {
  console.log(`\n❌ MISSING FILES (${issues.missingFiles.length} issues):\n`);

  const grouped = {};
  issues.missingFiles.forEach(issue => {
    if (!grouped[issue.file]) {
      grouped[issue.file] = [];
    }
    grouped[issue.file].push(issue);
  });

  Object.keys(grouped).slice(0, 20).forEach(file => {
    console.log(`📄 ${file}`);
    grouped[file].forEach(issue => {
      console.log(`   Line ${issue.line}: ${issue.importPath}`);
      console.log(`   ❌ Not found at: ${issue.attempted}`);
    });
    console.log('');
  });

  if (Object.keys(grouped).length > 20) {
    console.log(`... and ${Object.keys(grouped).length - 20} more files with issues\n`);
  }
} else {
  console.log(`\n✅ ALL IMPORT PATHS ARE VALID!\n`);
}

console.log(`${'='.repeat(80)}`);

// Categorize external imports
const externalCount = issues.correctPaths.filter(p => p.type === 'external').length;
const internalCount = issues.correctPaths.filter(p => p.type === 'valid').length;

console.log(`\n📊 IMPORT STATISTICS:\n`);
console.log(`Internal Imports: ${internalCount}`);
console.log(`External Imports: ${externalCount}`);
console.log(`Total Checked:    ${internalCount + externalCount}`);

console.log(`\n${'='.repeat(80)}\n`);

if (issues.missingFiles.length === 0) {
  console.log(`✅ FRAMEWORK PATH VALIDATION: PASSED\n`);
  process.exit(0);
} else {
  console.log(`❌ FRAMEWORK PATH VALIDATION: FAILED\n`);
  console.log(`Total missing file references: ${issues.missingFiles.length}\n`);
  process.exit(1);
}
