#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI colors for output
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
console.log(`${colors.bright}🚀 COMPREHENSIVE CODE REUSE OPTIMIZATION${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);
console.log(`📊 Processing ${specFiles.length} spec files...\n`);

const stats = {
  filesProcessed: 0,
  filesChanged: 0,
  getComputedStyleReplaced: 0,
  pageClickReplaced: 0,
  pageFillReplaced: 0,
  pageGetAttributeReplaced: 0,
  pageInnerTextReplaced: 0,
  hardcodedURLsFixed: 0,
  importsAdded: 0,
  errors: [],
};

specFiles.forEach((specFile, index) => {
  try {
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;
    const fileName = path.basename(specFile);

    // Calculate import depth based on file location
    const relativePath = path.relative(SPEC_DIR, specFile);
    const depth = relativePath.split(path.sep).length;
    const importPrefix = depth > 1 ? '../../../' : '../../';

    // 1. REPLACE HARDCODED URLs WITH resolveComponentUrl()
    if (content.includes('/content/global-atlantic/style-guide/')) {
      const urlMatches = content.match(/await page\.goto\([^)]*\/content\/global-atlantic\/style-guide[^)]*\)/g) || [];
      if (urlMatches.length > 0) {
        // Add import if not present
        if (!content.includes('resolveComponentUrl')) {
          const importPath = `${importPrefix}utils/infra/content-fixture-deployer`;
          const firstImport = content.match(/^import /m);
          if (firstImport) {
            content = content.slice(0, firstImport.index) +
              `import { resolveComponentUrl } from '${importPath}';\n` +
              content.slice(firstImport.index);
            stats.importsAdded++;
          }
        }

        // Replace patterns
        content = content.replace(
          /await page\.goto\(\s*ENV\.AEM_AUTHOR_URL\s*\+\s*['"`]\/content\/global-atlantic\/style-guide\/components\/([^'"`]+)\.html[^'"`]*['"`]\s*\)/g,
          "await page.goto(resolveComponentUrl('$1'))"
        );
        content = content.replace(
          /await page\.goto\(\s*`\${BASE\(\)}\/content\/global-atlantic\/style-guide\/components\/([^`]+)\.html[^`]*`\s*\)/g,
          "await page.goto(resolveComponentUrl('$1'))"
        );
        stats.hardcodedURLsFixed += urlMatches.length;
      }
    }

    // 2. REPLACE page.click() WITH clickElement()
    const clickMatches = (content.match(/await page\.click\(/g) || []).length;
    if (clickMatches > 0) {
      // Add import
      if (!content.includes('clickElement')) {
        const actionUtilsImport = `import { clickElement } from '${importPrefix}src/utils/action-utils';\n`;
        const existingImport = content.match(/^import \{ expect \}/m);
        if (existingImport) {
          content = content.replace(/^import \{ expect \}/m, actionUtilsImport + 'import { expect }');
        } else {
          const firstImport = content.match(/^import /m);
          if (firstImport) {
            content = content.slice(0, firstImport.index) + actionUtilsImport + content.slice(firstImport.index);
          }
        }
        stats.importsAdded++;
      }

      // Replace calls - but carefully to avoid comments and strings
      const lines = content.split('\n');
      const newLines = lines.map(line => {
        // Skip if in comment or string
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
          return line;
        }
        return line.replace(/await page\.click\(([^)]+)\)/g, 'await clickElement($1)');
      });
      content = newLines.join('\n');
      stats.pageClickReplaced += clickMatches;
    }

    // 3. REPLACE page.fill() WITH fill()
    const fillMatches = (content.match(/await page\.fill\(/g) || []).length;
    if (fillMatches > 0) {
      if (!content.includes("import { fill")) {
        const actionUtilsImport = `import { fill } from '${importPrefix}src/utils/action-utils';\n`;
        const firstImport = content.match(/^import /m);
        if (firstImport) {
          content = content.slice(0, firstImport.index) + actionUtilsImport + content.slice(firstImport.index);
        }
        stats.importsAdded++;
      }
      content = content.replace(/await page\.fill\(([^)]+)\)/g, 'await fill($1)');
      stats.pageFillReplaced += fillMatches;
    }

    // 4. REPLACE page.getAttribute() WITH getAttributeOfElement()
    const getAttrMatches = (content.match(/\.getAttribute\(/g) || []).length;
    if (getAttrMatches > 0) {
      if (!content.includes('getAttributeOfElement')) {
        const elementUtilsImport = `import { getAttributeOfElement } from '${importPrefix}src/utils/element-utils';\n`;
        const firstImport = content.match(/^import /m);
        if (firstImport) {
          content = content.slice(0, firstImport.index) + elementUtilsImport + content.slice(firstImport.index);
        }
        stats.importsAdded++;
      }
      // Replace .getAttribute(attr) with getAttributeOfElement(locator, attr)
      content = content.replace(/\.getAttribute\((['"][^'"]+['"])\)/g, ', $1)').replace(/\), \$1\)/g, ')');
      stats.pageGetAttributeReplaced += getAttrMatches;
    }

    // 5. REPLACE .innerText() WITH getTextOfElement()
    const innerTextMatches = (content.match(/\.innerText\(\)/g) || []).length;
    if (innerTextMatches > 0) {
      if (!content.includes('getTextOfElement')) {
        const elementUtilsImport = `import { getTextOfElement } from '${importPrefix}src/utils/element-utils';\n`;
        const firstImport = content.match(/^import /m);
        if (firstImport) {
          content = content.slice(0, firstImport.index) + elementUtilsImport + content.slice(firstImport.index);
        }
        stats.importsAdded++;
      }
      content = content.replace(/\.innerText\(\)/g, ' /* TODO: use getTextOfElement() */');
      stats.pageInnerTextReplaced += innerTextMatches;
    }

    // 6. MARK getComputedStyle() FOR MANUAL REVIEW
    const computedStyleMatches = (content.match(/getComputedStyle\(/g) || []).length;
    if (computedStyleMatches > 0 && !content.includes('TODO: replace with component-assertions')) {
      // Import component-assertions if not present
      if (!content.includes('component-assertions')) {
        const assertImport = `import { assertLayout, assertSpacing, assertTypography, assertBackground } from '${importPrefix}utils/infra/component-assertions';\n`;
        const firstImport = content.match(/^import /m);
        if (firstImport) {
          content = content.slice(0, firstImport.index) + assertImport + content.slice(firstImport.index);
        }
        stats.importsAdded++;
      }

      // Mark for manual review
      const lines = content.split('\n');
      const newLines = lines.map(line => {
        if (line.includes('getComputedStyle(')) {
          return line + ' // TODO: replace with component-assertions (assertLayout, assertSpacing, etc.)';
        }
        return line;
      });
      content = newLines.join('\n');
      stats.getComputedStyleReplaced += computedStyleMatches;
    }

    // 7. REPLACE page.waitForSelector() WITH locator.waitFor()
    const waitForSelectorMatches = (content.match(/page\.waitForSelector\(/g) || []).length;
    if (waitForSelectorMatches > 0) {
      content = content.replace(
        /page\.waitForSelector\((['"][^'"]+['"]),\s*\{\s*timeout:\s*(\d+)\s*\}\s*\)/g,
        "page.locator($1).waitFor({ state: 'visible', timeout: $2 })"
      );
      content = content.replace(
        /page\.waitForSelector\((['"][^'"]+['"])\)/g,
        "page.locator($1).waitFor({ state: 'visible' })"
      );
    }

    // 8. REMOVE UNUSED IMPORTS
    // Remove ConsoleCapture import if not used in code
    if (content.includes('import { ConsoleCapture }') && !content.includes('capture = new ConsoleCapture')) {
      content = content.replace(/import \{ ConsoleCapture \} from ['""][^'"]*['""];\n/g, '');
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
    stats.errors.push({
      file: fileName,
      error: error.message,
    });
    console.log(`${colors.red}✗${colors.reset} ${fileName}: ${error.message}`);
  }
});

// Print summary
console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}📊 OPTIMIZATION RESULTS${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.cyan}Files:${colors.reset}`);
console.log(`  Processed:                  ${stats.filesProcessed}/${specFiles.length}`);
console.log(`  Changed:                    ${stats.filesChanged}`);
console.log(`  Errors:                     ${stats.errors.length}`);

console.log(`\n${colors.cyan}Patterns Fixed:${colors.reset}`);
console.log(`  page.click() replaced:      ${stats.pageClickReplaced}`);
console.log(`  page.fill() replaced:       ${stats.pageFillReplaced}`);
console.log(`  Hardcoded URLs fixed:       ${stats.hardcodedURLsFixed}`);
console.log(`  .getAttribute() marked:     ${stats.pageGetAttributeReplaced}`);
console.log(`  .innerText() marked:        ${stats.pageInnerTextReplaced}`);
console.log(`  getComputedStyle() marked:  ${stats.getComputedStyleReplaced}`);

console.log(`\n${colors.cyan}Imports Added:${colors.reset}`);
console.log(`  Total:                      ${stats.importsAdded}`);

if (stats.errors.length > 0) {
  console.log(`\n${colors.red}Errors:${colors.reset}`);
  stats.errors.forEach(({ file, error }) => {
    console.log(`  ${file}: ${error}`);
  });
}

console.log(`\n${'='.repeat(80)}`);
console.log(`${colors.bright}✅ Optimization Complete!${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.yellow}Next Steps:${colors.reset}`);
console.log(`  1. Review changes: git diff tests/specFiles/`);
console.log(`  2. Check TypeScript: npx tsc --noEmit`);
console.log(`  3. Run specs: env=local npx playwright test tests/specFiles/ga/button/ --project chromium`);
console.log(`  4. Commit: git commit -m "refactor: Apply code reuse optimization to all specs"`);
console.log(`  5. Manual review: Check files marked with TODO comments\n`);

process.exit(stats.errors.length > 0 ? 1 : 0);
