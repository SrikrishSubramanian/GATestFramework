#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(80)}`);
console.log(`🔍 FRAMEWORK PATH VALIDATION (CORRECTED)`);
console.log(`${'='.repeat(80)}\n`);

// Built-in Node modules to skip
const BUILTIN_MODULES = new Set([
  'fs', 'path', 'os', 'sys', 'util', 'stream', 'events', 'net', 'http', 'https',
  'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'domain', 'assert',
  'buffer', 'console', 'process', 'repl', 'readline', 'perf_hooks', 'vm',
  'zlib', 'querystring', 'url', 'punycode', 'string_decoder', 'tty', 'v8',
  'worker_threads', 'async_hooks', 'module', 'timers', 'inspector'
]);

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
console.log(`📝 Scanning ${tsFiles.length} TypeScript files\n`);

const issues = {
  missingFiles: [],
  validFiles: [],
  externalImports: 0,
  internalImports: 0,
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
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];

      // Skip external packages
      if (importPath.startsWith('@') || importPath.startsWith('playwright') ||
          BUILTIN_MODULES.has(importPath)) {
        issues.externalImports++;
        continue;
      }

      // Skip template strings
      if (importPath.includes('${')) {
        continue;
      }

      issues.internalImports++;

      // Resolve the import path relative to the file
      const fileDir = path.dirname(filePath);
      const resolvedPath = path.resolve(fileDir, importPath);

      let exists = false;

      if (fs.existsSync(resolvedPath)) {
        exists = true;
      } else if (fs.existsSync(resolvedPath + '.ts')) {
        exists = true;
      } else if (fs.existsSync(resolvedPath + '/index.ts')) {
        exists = true;
      } else if (fs.existsSync(resolvedPath + '.js')) {
        exists = true;
      } else if (fs.existsSync(resolvedPath + '.json')) {
        exists = true;
      }

      if (exists) {
        issues.validFiles.push({
          file: filePath,
          path: importPath,
          status: 'valid'
        });
      } else {
        const lineNum = content.substring(0, content.indexOf(match[0])).split('\n').length;
        issues.missingFiles.push({
          file: filePath,
          importPath: importPath,
          attempted: resolvedPath,
          line: lineNum
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

console.log(`✅ Valid Paths:        ${issues.validFiles.length}`);
console.log(`❌ Missing Files:      ${issues.missingFiles.length}`);
console.log(`📦 External Imports:   ${issues.externalImports}`);
console.log(`📍 Internal Imports:   ${issues.internalImports}`);

console.log(`\n${'='.repeat(80)}\n`);

if (issues.missingFiles.length > 0) {
  console.log(`❌ BROKEN IMPORT PATHS (${issues.missingFiles.length} issues):\n`);

  const grouped = {};
  issues.missingFiles.forEach(issue => {
    if (!grouped[issue.file]) {
      grouped[issue.file] = [];
    }
    grouped[issue.file].push(issue);
  });

  Object.keys(grouped).slice(0, 15).forEach(file => {
    console.log(`📄 ${file}`);
    grouped[file].forEach(issue => {
      console.log(`   Line ${issue.line}: ${issue.importPath}`);
      console.log(`   ❌ Missing: ${issue.attempted}`);
    });
    console.log('');
  });

  if (Object.keys(grouped).length > 15) {
    console.log(`... and ${Object.keys(grouped).length - 15} more files\n`);
  }

  console.log(`${'='.repeat(80)}\n`);
  process.exit(1);
} else {
  console.log(`✅ ALL PROJECT IMPORT PATHS ARE VALID!\n`);
  console.log(`${'='.repeat(80)}\n`);
  process.exit(0);
}
