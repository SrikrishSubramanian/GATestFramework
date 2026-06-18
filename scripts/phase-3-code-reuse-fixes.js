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
console.log(`${colors.bright}🔧 PHASE 3 & 4: Comprehensive Code Reuse Fixes${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);
console.log(`📊 Processing ${specFiles.length} spec files...\n`);

const stats = {
  processed: 0,
  modified: 0,
  fixes: {
    brokenImports: 0,
    inlineLogin: 0,
    waitForSelector: 0,
    missingReportEnhancer: 0,
    styleGuideUrls: 0,
    actionUtilities: 0,
  },
  errors: [],
};

specFiles.forEach((specFile, index) => {
  try {
    const fileName = path.basename(specFile);
    let content = fs.readFileSync(specFile, 'utf-8');
    const original = content;
    let modified = false;

    // FIX 1: Replace broken import in general.author.spec.ts
    // import { loginToAEMAuthor } from '../../../src/utils/auth-utils';
    // → import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';
    if (content.includes("from '../../../src/utils/auth-utils'")) {
      content = content.replace(
        "from '../../../src/utils/auth-utils'",
        "from '../../utils/infra/auth-fixture'"
      );
      stats.fixes.brokenImports++;
      modified = true;
    }

    // FIX 2: Replace inline AEM form login in api-mock.spec.ts and content-driven.spec.ts
    // Pattern: Direct username/password form filling for AEM login
    if (fileName === 'api-mock.spec.ts' || fileName === 'content-driven.spec.ts') {
      // Look for the inline form login pattern and replace
      if (content.includes('#j_username') && content.includes('#j_password')) {
        // Remove the inline login code
        content = content.replace(
          /\/\/ .*?\n\s*await page\.fill\(['"`]#j_username['"`],.*?\n\s*await page\.fill\(['"`]#j_password['"`],.*?\n\s*await page\.click\(['"`]#submit['"`]\);?\n\s*await page\.waitForNavigation\(\);?\n\s*\/\/ Verify logged in/g,
          `// Centralized login via auth-fixture
    await loginToAEMAuthor(page);`
        );

        // Also add the import if not present
        if (!content.includes("from '../../utils/infra/auth-fixture'")) {
          const importLines = content.split('\n');
          let lastImportIndex = -1;
          for (let i = 0; i < importLines.length; i++) {
            if (importLines[i].trim().startsWith('import ') && importLines[i].includes('from')) {
              lastImportIndex = i;
            } else if (lastImportIndex >= 0 && !importLines[i].trim().startsWith('import')) {
              break;
            }
          }
          if (lastImportIndex >= 0) {
            importLines.splice(
              lastImportIndex + 1,
              0,
              `import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';`
            );
            content = importLines.join('\n');
          }
        }
        stats.fixes.inlineLogin++;
        modified = true;
      }
    }

    // FIX 3: Replace page.waitForSelector() with page.locator().waitFor()
    if (content.includes('page.waitForSelector')) {
      content = content.replace(
        /page\.waitForSelector\(['"`]([^'"`]+)['"`]\)/g,
        (match, selector) => {
          stats.fixes.waitForSelector++;
          return `page.locator('${selector}').waitFor({ state: 'visible' })`;
        }
      );
      modified = true;
    }

    // FIX 4: Add missing report-enhancer imports to specs that use ConsoleCapture
    if (
      content.includes('new ConsoleCapture') &&
      !content.includes('attachConsoleCapture') &&
      !content.includes('from') ||
      !content.includes('report-enhancer')
    ) {
      // Check if afterEach is wiring up the report enhancer
      if (!content.includes('await attachConsoleCapture(testInfo, capture)')) {
        // Add import
        const importLines = content.split('\n');
        let lastImportIndex = -1;
        for (let i = 0; i < importLines.length; i++) {
          if (importLines[i].trim().startsWith('import ') && importLines[i].includes('from')) {
            lastImportIndex = i;
          } else if (lastImportIndex >= 0 && !importLines[i].trim().startsWith('import')) {
            break;
          }
        }
        if (lastImportIndex >= 0 && !content.includes('report-enhancer')) {
          importLines.splice(
            lastImportIndex + 1,
            0,
            `import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';`
          );
          content = importLines.join('\n');
        }

        // Add to afterEach hook
        if (content.includes('test.afterEach')) {
          content = content.replace(
            /test\.afterEach\(\s*async\s*\(\s*{\s*page\s*},\s*testInfo\s*\)\s*=>\s*\{([^}]*)if\s*\(\s*capture\s*\)\s*\{([^}]*)\}/,
            (match, p1, p2) => {
              if (!p2.includes('attachConsoleCapture')) {
                return match.replace(
                  'if (capture) {',
                  `if (capture) {
    await attachConsoleCapture(testInfo, capture);
    await annotateEnvironment(testInfo);`
                );
              }
              return match;
            }
          );
          stats.fixes.missingReportEnhancer++;
          modified = true;
        }
      }
    }

    // FIX 5: Consolidate hardcoded style guide URLs
    // Replace patterns like: ${BASE()}/content/global-atlantic/style-guide/components/button.html
    // with: resolveComponentUrl('button')
    if (content.includes('style-guide/components')) {
      content = content.replace(
        /\$\{BASE\(\)\}\/content\/global-atlantic\/style-guide\/components\/(\w+)\.html\?wcmmode=disabled/g,
        (match, component) => {
          if (!content.includes('from') || !content.includes('content-fixture-deployer')) {
            stats.fixes.styleGuideUrls++;
          }
          return `resolveComponentUrl('${component}')`;
        }
      );

      // Add import if needed
      if (
        content.includes('resolveComponentUrl') &&
        !content.includes('content-fixture-deployer')
      ) {
        const importLines = content.split('\n');
        let lastImportIndex = -1;
        for (let i = 0; i < importLines.length; i++) {
          if (importLines[i].trim().startsWith('import ') && importLines[i].includes('from')) {
            lastImportIndex = i;
          } else if (lastImportIndex >= 0 && !importLines[i].trim().startsWith('import')) {
            break;
          }
        }
        if (lastImportIndex >= 0) {
          importLines.splice(
            lastImportIndex + 1,
            0,
            `import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';`
          );
          content = importLines.join('\n');
        }
        stats.fixes.styleGuideUrls++;
        modified = true;
      }
    }

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
console.log(`${colors.bright}📊 PHASE 3 & 4 RESULTS${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.cyan}Code Reuse Fixes Applied:${colors.reset}`);
console.log(`  Broken imports fixed:          ${stats.fixes.brokenImports}`);
console.log(`  Inline login replaced:         ${stats.fixes.inlineLogin}`);
console.log(`  waitForSelector replaced:      ${stats.fixes.waitForSelector}`);
console.log(`  Report enhancer added:         ${stats.fixes.missingReportEnhancer}`);
console.log(`  Style guide URLs centralized:  ${stats.fixes.styleGuideUrls}`);

console.log(`\n${colors.cyan}Summary:${colors.reset}`);
console.log(`  Specs processed: ${stats.processed}/${specFiles.length}`);
console.log(`  Specs modified:  ${stats.modified}`);
console.log(`  Errors:          ${stats.errors.length}`);

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
console.log(`${colors.bright}✅ Phase 3 & 4 Complete!${colors.reset}`);
console.log(`${'='.repeat(80)}\n`);

console.log(`${colors.yellow}Code Reuse Improvements:${colors.reset}`);
console.log(`  ✅ Centralized authentication (replaced inline login)`);
console.log(`  ✅ Fixed broken imports`);
console.log(`  ✅ Modern Playwright patterns (locator.waitFor)`);
console.log(`  ✅ Centralized URLs (resolveComponentUrl)`);
console.log(`  ✅ Better report enrichment`);

console.log(`\n${colors.yellow}Next Steps:${colors.reset}`);
console.log(`  1. Run tests to verify no regressions`);
console.log(`  2. Review Phase 2 assertion migrations`);
console.log(`  3. Commit all changes`);

process.exit(stats.errors.length > 0 ? 1 : 0);
