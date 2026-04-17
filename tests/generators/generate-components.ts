/**
 * End-to-end component generation script.
 * Connects to live AEM, scans DOM for each component, generates:
 *   - POM class (tests/pages/ga/components/<component>Page.ts)
 *   - Locator sidecar (tests/pages/ga/components/<component>Page.locators.json)
 *   - Spec file (tests/specFiles/ga/<component>.publish.spec.ts)
 *   - Updates coverage-matrix.json
 *
 * Usage:
 *   env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium
 *
 * Or run specific components:
 *   COMPONENTS=button,section env=local npx playwright test generate-components --config playwright.generators.config.ts --project chromium
 */
import { test } from '@playwright/test';
import { scanDOM, DOMSnapshot, loadLatestSnapshot } from '../utils/generation/dom-scanner';
import { writePOMFromDOM, POMWriteResult } from '../utils/generation/pom-writer';
import { writeComponentSpec, SpecWriteResult } from '../utils/generation/spec-writer';
import { getDefaultCategories, TestCategory, A11yLevel } from '../utils/infra/test-tagger';
import * as fs from 'fs';
import * as path from 'path';

const AUTHOR_URL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const PUBLISH_URL = process.env.BASE_URL || 'http://localhost:4503';
const AUTH = {
  username: process.env.AEM_AUTHOR_USERNAME || 'admin',
  password: process.env.AEM_AUTHOR_PASSWORD || 'admin',
};

interface ComponentConfig {
  name: string;
  rootSelector?: string;       // Override .ga-<name> default
  styleGuideUrl?: string;      // Override style guide path
  categories?: TestCategory[]; // Override default categories
  mode?: 'author' | 'publish';
  /** Sling path to the component's _cq_dialog (auto-derived if not set) */
  dialogPath?: string;
  /** Whether this component is a container with an inner parsys */
  isContainer?: boolean;
  /** Expected child component selectors (for parsys-policy tests) */
  expectedChildSelectors?: string[];
  /** Fixture URL for parsys tests (auto-derived if not set) */
  fixtureUrl?: string;
}

const DEFAULT_COMPONENTS: ComponentConfig[] = [
  {
    name: 'button',
    rootSelector: '.button',
  },
  {
    name: 'feature-banner',
    rootSelector: '.feature-banner',
  },
  {
    name: 'statistic',
    rootSelector: '.cmp-statistic',
  },
  {
    name: 'form-options',
    rootSelector: '.cmp-form-options',
    styleGuideUrl: '/content/global-atlantic/style-guide/components/form-options.html',
  },
  {
    name: 'content-trail',
    rootSelector: '.cmp-content-trail',
  },
  {
    name: 'headline-block',
    rootSelector: '.ga-headline-block',
  },
  {
    name: 'grid-container',
    rootSelector: '.cmp-grid-container',
  },
  {
    name: 'navigation',
    rootSelector: '.cmp-navigation',
  },
  {
    name: 'nested-content-carousel',
    rootSelector: '.cmp-nested-content-carousel',
    styleGuideUrl: '/content/global-atlantic/style-guide/components/hero-fifty-fifty.html',
  },
];

const COMPONENTS_DIR = path.resolve(__dirname, '..', 'pages', 'ga', 'components');
const SPECS_DIR = path.resolve(__dirname, '../specFiles/ga');
const COVERAGE_PATH = path.resolve(__dirname, '..', 'data', 'coverage-matrix.json');

// Parse COMPONENTS env var if set
function getTargetComponents(): ComponentConfig[] {
  const envComponents = process.env.COMPONENTS;
  if (envComponents) {
    const names = envComponents.split(',').map(s => s.trim());
    return names.map(name => {
      const existing = DEFAULT_COMPONENTS.find(c => c.name === name);
      return existing || { name };
    });
  }
  return DEFAULT_COMPONENTS;
}

test.describe('Component Generation', () => {
  const components = getTargetComponents();
  const a11yLevel: A11yLevel = (process.env.A11Y_LEVEL as A11yLevel) || 'wcag22';
  const mode = (process.env.MODE as 'author' | 'publish') || 'author';
  const update = process.env.UPDATE === 'true';

  for (const config of components) {
    test(`Generate POM + spec for: ${config.name}`, async ({ page }) => {
      const componentMode = config.mode || mode;
      const baseUrl = componentMode === 'author' ? AUTHOR_URL : PUBLISH_URL;
      const styleGuideUrl = config.styleGuideUrl ||
        `/content/global-atlantic/style-guide/components/${config.name}.html`;
      const fullUrl = `${baseUrl}${styleGuideUrl}?wcmmode=disabled`;

      // Authenticate for author mode
      if (componentMode === 'author') {
        await page.goto(`${AUTHOR_URL}/libs/granite/core/content/login.html`);
        await page.fill('#username', AUTH.username);
        await page.fill('#password', AUTH.password);
        await page.click('#submit-button');
        await page.waitForLoadState('networkidle');
      }

      console.log(`\n=== Scanning: ${config.name} ===`);
      console.log(`URL: ${fullUrl}`);

      // Navigate to the style guide page
      await page.goto(fullUrl);
      await page.waitForLoadState('networkidle');
      // Extra wait for AEM rendering
      await page.waitForTimeout(2000);

      // Scan the DOM
      let snapshot: DOMSnapshot;
      try {
        snapshot = await scanDOM(page, config.name, config.rootSelector);
        console.log(`Found ${snapshot.elements.length} elements`);
      } catch (err) {
        console.error(`DOM scan failed for ${config.name}, trying broader selector...`);
        // Fallback: scan the main content area
        snapshot = await scanDOM(page, config.name, `[class*="${config.name}"], .main-par`);
        console.log(`Fallback found ${snapshot.elements.length} elements`);
      }

      if (snapshot.elements.length === 0) {
        console.warn(`WARNING: No elements found for ${config.name}. Check if the component exists on the style guide page.`);
        console.log(`Page title: ${snapshot.pageTitle}`);
        // Take a screenshot for debugging
        await page.screenshot({
          path: path.join(__dirname, '..', 'data', '.snapshots', `${config.name}-debug.png`),
          fullPage: true,
        });
        return;
      }

      // Log extracted elements
      console.log(`\nExtracted elements for ${config.name}:`);
      for (const el of snapshot.elements.slice(0, 15)) {
        const strats = el.isInteractive ? ' [interactive]' : '';
        console.log(`  - ${el.name} <${el.tag}> classes=[${el.classes.slice(0, 3).join(', ')}]${strats}`);
      }
      if (snapshot.elements.length > 15) {
        console.log(`  ... and ${snapshot.elements.length - 15} more`);
      }

      // Generate POM + locator sidecar
      const pomResult: POMWriteResult = writePOMFromDOM(snapshot, {
        component: config.name,
        outputDir: COMPONENTS_DIR,
        mode: update ? 'update' : 'create',
        styleGuideUrl: `${styleGuideUrl}?wcmmode=disabled`,
      });

      console.log(`\nPOM generated:`);
      console.log(`  Class: ${pomResult.className}`);
      console.log(`  File: ${pomResult.pomPath}`);
      console.log(`  Sidecar: ${pomResult.sidecarPath}`);
      console.log(`  Elements: ${pomResult.elementCount}`);
      console.log(`  Updated: ${pomResult.isUpdate}`);

      // Generate spec file
      const categories = config.categories || getDefaultCategories(a11yLevel);
      const compSpecDir = path.join(SPECS_DIR, config.name);
      const pomRelativePath = path.relative(compSpecDir, pomResult.pomPath).replace(/\\/g, '/').replace(/\.ts$/, '');
      const specResult: SpecWriteResult = writeComponentSpec({
        component: config.name,
        pomClassName: pomResult.className,
        pomImportPath: pomRelativePath,
        mode: componentMode,
        a11yLevel,
        categories: config.isContainer
          ? [...categories, 'parsys-policy']
          : categories,
        outputDir: SPECS_DIR,
        rootSelector: config.rootSelector,
        dialogPath: config.dialogPath,
        isContainer: config.isContainer,
        expectedChildSelectors: config.expectedChildSelectors,
        fixtureUrl: config.fixtureUrl,
      });

      console.log(`\nSpec generated:`);
      console.log(`  File: ${specResult.specPath}`);
      console.log(`  Tests: ${specResult.testCount}`);
      console.log(`  Categories: ${specResult.categories.join(', ')}`);

      // Update coverage matrix
      updateCoverageMatrix(config.name, pomResult, specResult, categories);
      console.log(`\nCoverage matrix updated for ${config.name}`);
      console.log(`=== Done: ${config.name} ===\n`);
    });
  }
});

function updateCoverageMatrix(
  component: string,
  pom: POMWriteResult,
  spec: SpecWriteResult,
  categories: TestCategory[]
): void {
  let matrix: Record<string, any> = {};
  if (fs.existsSync(COVERAGE_PATH)) {
    matrix = JSON.parse(fs.readFileSync(COVERAGE_PATH, 'utf-8'));
  }

  matrix[component] = {
    pomClass: pom.className,
    pomPath: path.relative(path.dirname(COVERAGE_PATH), pom.pomPath).replace(/\\/g, '/'),
    sidecarPath: path.relative(path.dirname(COVERAGE_PATH), pom.sidecarPath).replace(/\\/g, '/'),
    specPath: path.relative(path.dirname(COVERAGE_PATH), spec.specPath).replace(/\\/g, '/'),
    elementCount: pom.elementCount,
    testCount: spec.testCount,
    categories: spec.categories,
    generatedAt: new Date().toISOString(),
    source: 'dom',
  };

  fs.writeFileSync(COVERAGE_PATH, JSON.stringify(matrix, null, 2), 'utf-8');
}
