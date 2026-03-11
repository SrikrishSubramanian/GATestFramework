/**
 * Phase 3: CSV → POM + Spec generation.
 *
 * Usage:
 *   CSV_PATH=path/to/tests.csv env=local npx playwright test generate-from-csv.spec --project chromium
 *
 * Optional env vars:
 *   CSV_MAP="steps=Action Steps,expected=Pass Criteria"  — override column detection
 *   CATEGORIES=happy-path,negative,accessibility          — filter categories
 *   A11Y_LEVEL=wcag22|wcag21|none                        — accessibility level
 *   MODE=author|publish                                   — AEM mode
 */
import { test, expect } from '@playwright/test';
import { parseCSV, parseMapFlag, ParsedTestGroup } from '../utils/csv-test-parser';
import { scanDOM } from '../utils/dom-scanner';
import { writePOMFromDOM } from '../utils/pom-writer';
import { writeSpecFromCSV, writeComponentSpec } from '../utils/spec-writer';
import { getDefaultCategories, TestCategory, A11yLevel } from '../utils/test-tagger';
import { updateComponentCoverage } from '../utils/coverage-matrix-reporter';
import * as fs from 'fs';
import * as path from 'path';

const AUTHOR_URL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const AUTH = {
  username: process.env.AEM_AUTHOR_USERNAME || 'admin',
  password: process.env.AEM_AUTHOR_PASSWORD || 'admin',
};

const COMPONENTS_DIR = path.resolve(__dirname, '..', 'pages', 'ga', 'components');
const SPECS_DIR = path.resolve(__dirname, 'ga');

test.describe('CSV Test Generation', () => {
  const csvPath = process.env.CSV_PATH;
  const mapOverride = process.env.CSV_MAP ? parseMapFlag(process.env.CSV_MAP) : undefined;
  const a11yLevel: A11yLevel = (process.env.A11Y_LEVEL as A11yLevel) || 'wcag22';
  const mode = (process.env.MODE as 'author' | 'publish') || 'author';
  const categoriesEnv = process.env.CATEGORIES;
  const categories: TestCategory[] = categoriesEnv
    ? categoriesEnv.split(',').map(s => s.trim()) as TestCategory[]
    : getDefaultCategories(a11yLevel);

  test('Parse CSV and generate specs', async ({ page }) => {
    if (!csvPath) {
      console.log('No CSV_PATH provided. Set CSV_PATH env var to a CSV file path.');
      test.skip();
      return;
    }

    expect(fs.existsSync(csvPath), `CSV file not found: ${csvPath}`).toBe(true);

    // Parse CSV
    console.log(`\n=== Parsing CSV: ${csvPath} ===`);
    const groups: ParsedTestGroup[] = await parseCSV(csvPath, mapOverride);
    console.log(`Found ${groups.length} component group(s):`);
    for (const g of groups) {
      console.log(`  - ${g.component}: ${g.testCases.length} test cases`);
    }

    // Authenticate for author mode
    if (mode === 'author') {
      await page.goto(`${AUTHOR_URL}/libs/granite/core/content/login.html`);
      await page.fill('#username', AUTH.username);
      await page.fill('#password', AUTH.password);
      await page.click('#submit-button');
      await page.waitForLoadState('networkidle');
    }

    for (const group of groups) {
      console.log(`\n--- Processing: ${group.component} ---`);

      // Check if POM exists, generate if missing
      const className = toPascalCase(group.component) + 'Page';
      const fileName = toCamelCase(group.component) + 'Page';
      const pomPath = path.join(COMPONENTS_DIR, `${fileName}.ts`);

      if (!fs.existsSync(pomPath)) {
        console.log(`POM not found, scanning DOM for ${group.component}...`);

        const styleGuideUrl = `/content/global-atlantic/style-guide/components/${group.component}.html?wcmmode=disabled`;
        const baseUrl = mode === 'author' ? AUTHOR_URL : (process.env.BASE_URL || 'http://localhost:4503');
        await page.goto(`${baseUrl}${styleGuideUrl}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        const snapshot = await scanDOM(page, group.component);
        if (snapshot.elements.length > 0) {
          const pomResult = writePOMFromDOM(snapshot, {
            component: group.component,
            outputDir: COMPONENTS_DIR,
            mode: 'create',
          });
          console.log(`  POM generated: ${pomResult.className} (${pomResult.elementCount} elements)`);
        } else {
          console.warn(`  WARNING: No DOM elements found for ${group.component}. Creating minimal POM.`);
        }
      } else {
        console.log(`  POM exists: ${pomPath}`);
      }

      // Generate spec from CSV test cases (spec goes into ga/<component>/ subfolder)
      const compSpecDir = path.join(SPECS_DIR, group.component);
      const pomImportPath = path.relative(compSpecDir, pomPath).replace(/\\/g, '/').replace(/\.ts$/, '');
      const specResult = writeSpecFromCSV(group, {
        component: group.component,
        pomClassName: className,
        pomImportPath,
        mode,
        a11yLevel,
        categories,
        outputDir: SPECS_DIR,
      });

      console.log(`  Spec generated: ${specResult.specPath}`);
      console.log(`  Tests: ${specResult.testCount} across ${specResult.categories.join(', ')}`);

      // Update coverage matrix
      updateComponentCoverage(group.component, specResult.categories.map(cat => ({
        category: cat as TestCategory,
        testCount: specResult.testCount,
        specFile: path.basename(specResult.specPath),
        tags: [],
      })));
    }

    console.log(`\n=== CSV generation complete ===`);
  });
});

function toPascalCase(str: string): string {
  return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}
function toCamelCase(str: string): string {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}
