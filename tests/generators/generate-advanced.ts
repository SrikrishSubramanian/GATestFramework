/**
 * Phases 5-7: Advanced test generation.
 * Generates interaction, state-matrix, visual baseline, broken-image,
 * content-driven, and dispatcher specs for components.
 *
 * Usage:
 *   env=local npx playwright test generate-advanced --config playwright.generators.config.ts --project chromium --workers 1
 *
 * Env vars:
 *   COMPONENTS=button,feature-banner    — target components (default: all)
 *   PHASES=interaction,matrix,visual,content,dispatcher,images  — which phases to run
 *   UPDATE_BASELINE=true                — capture visual baselines
 *   KKR_AEM_ROOT=../kkr-aem            — path to kkr-aem repo (for content-driven)
 */
import { test, expect } from '@playwright/test';
import { detectInteractions, InteractionContext, getExpectedChildTheme, isDarkBackground, BackgroundType } from '../utils/generation/interaction-detector';
import { generateStateMatrix, generateMatrixSpec, KNOWN_VARIANTS, StateMatrix } from '../utils/generation/state-matrix-generator';
import { scanImages, ImageScanResult } from '../utils/generation/broken-image-detector';
import { captureComponentBaseline, captureResponsiveBaselines } from '../utils/generation/baseline-manager';
import { analyzeContentXML, generateContentTests, ContentAnalysis } from '../utils/generation/content-driven-generator';
import { generateDispatcherSpec } from '../utils/generation/dispatcher-tester';
import { formatCoverageReport, updateComponentCoverage } from '../utils/generation/coverage-matrix-reporter';
import { generateVisualSpec } from '../utils/generation/visual-assertion-generator';
import { FigmaDesignSpec } from '../utils/generation/requirements-merger';
import { setupMocks, clearMocks, initMockData, MockConfig } from '../utils/infra/api-mock-helper';
import { TestLogger, TestRunResult } from '../utils/infra/test-logger';
import { testInfoToLogResult, attachConsoleCapture, annotateEnvironment } from '../utils/infra/report-enhancer';
import { ConsoleCapture } from '../utils/infra/console-capture';
import { TestCategory } from '../utils/infra/test-tagger';
import * as fs from 'fs';
import * as path from 'path';

const AUTHOR_URL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const AUTH = {
  username: process.env.AEM_AUTHOR_USERNAME || 'admin',
  password: process.env.AEM_AUTHOR_PASSWORD || 'admin',
};

const SPECS_DIR = path.resolve(__dirname, '../specFiles/ga');
const COMPONENTS_DIR = path.resolve(__dirname, '..', 'pages', 'ga', 'components');
const KKR_AEM_ROOT = process.env.KKR_AEM_ROOT || path.resolve(__dirname, '..', '..', '..', 'kkr-aem');

// Components with known style guide pages
const AVAILABLE_COMPONENTS = [
  { name: 'button', rootSelector: '.button' },
  { name: 'feature-banner', rootSelector: '.feature-banner' },
  { name: 'statistic', rootSelector: '.cmp-statistic' },
];

function getTargetComponents() {
  const env = process.env.COMPONENTS;
  if (env) {
    const names = env.split(',').map(s => s.trim());
    return AVAILABLE_COMPONENTS.filter(c => names.includes(c.name));
  }
  return AVAILABLE_COMPONENTS;
}

function getPhases(): string[] {
  const env = process.env.PHASES;
  if (env) return env.split(',').map(s => s.trim());
  return ['interaction', 'matrix', 'images', 'visual', 'figma', 'mocks', 'content', 'dispatcher'];
}

// ─── Test Logger (Phase 6) ─────────────────────────────────────────
const logger = new TestLogger(process.env.env || 'local', 'chromium');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir(SPECS_DIR);

/** Get the component-specific spec output directory (e.g., ga/button/) */
function compSpecDir(component: string): string {
  const dir = path.join(SPECS_DIR, component);
  ensureDir(dir);
  return dir;
}

function toPascalCase(str: string): string {
  return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}
function toCamelCase(str: string): string {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

function pomImportPath(component: string): string {
  const fileName = toCamelCase(component) + 'Page';
  const compDir = path.join(SPECS_DIR, component);
  return path.relative(compDir, path.join(COMPONENTS_DIR, fileName)).replace(/\\/g, '/');
}

// ─── Shared Auth ───────────────────────────────────────────────────

async function aemLogin(page: any) {
  await page.goto(`${AUTHOR_URL}/libs/granite/core/content/login.html`);
  await page.fill('#username', AUTH.username);
  await page.fill('#password', AUTH.password);
  await page.click('#submit-button');
  await page.waitForLoadState('networkidle');
}

// ─── Phase 5: Component Interaction Tests ──────────────────────────

test.describe('Phase 5 — Interaction Tests', () => {
  const phases = getPhases();
  const components = getTargetComponents();

  for (const comp of components) {
    test(`Interaction detection: ${comp.name}`, async ({ page }) => {
      if (!phases.includes('interaction')) { test.skip(); return; }

      await aemLogin(page);
      const url = `${AUTHOR_URL}/content/global-atlantic/style-guide/components/${comp.name}.html?wcmmode=disabled`;
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const interactions = await detectInteractions(page, comp.rootSelector);
      console.log(`\n[interaction] ${comp.name}: ${interactions.length} interaction contexts found`);

      if (interactions.length === 0) {
        console.log(`  No parent-child interactions detected. Skipping spec generation.`);
        return;
      }

      // Generate interaction spec
      const className = toPascalCase(comp.name) + 'Page';
      const tests = interactions.map((ctx, i) => {
        const parentBg = ctx.parent.background;
        const expectedTheme = ctx.child.expectedTheme;
        return `  test('@interaction @regression ${comp.name} adapts to ${parentBg} parent (#${i + 1})', async ({ page }) => {
    const pom = new ${className}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Parent: ${ctx.parent.component} with ${parentBg} background
    // Expected child theme: ${expectedTheme}
    const child = page.locator('${ctx.child.rootSelector}').first();
    await expect(child).toBeVisible();
  });`;
      });

      const specContent = `import { test, expect } from '@playwright/test';
import { ${className} } from '${pomImportPath(comp.name)}';
import ENV from '../../../utils/infra/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(\`\${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html\`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.describe('${toPascalCase(comp.name)} — Component Interactions', () => {
${tests.join('\n\n')}
});
`;

      const specPath = path.join(compSpecDir(comp.name), `${comp.name}.interaction.spec.ts`);
      fs.writeFileSync(specPath, specContent, 'utf-8');
      console.log(`  Spec: ${specPath} (${interactions.length} tests)`);

      updateComponentCoverage(comp.name, [{
        category: 'interaction' as TestCategory,
        testCount: interactions.length,
        specFile: path.basename(specPath),
        tags: ['@interaction', '@regression'],
      }]);
    });
  }
});

// ─── Phase 5: State Matrix Tests ───────────────────────────────────

test.describe('Phase 5 — State Matrix', () => {
  const phases = getPhases();
  const components = getTargetComponents();

  for (const comp of components) {
    test(`State matrix: ${comp.name}`, async () => {
      if (!phases.includes('matrix')) { test.skip(); return; }

      const known = KNOWN_VARIANTS[comp.name];
      if (!known) {
        console.log(`[matrix] No known variants for ${comp.name}. Skipping.`);
        return;
      }

      const matrix = generateStateMatrix(comp.name, known.variants, known.themes);
      console.log(`\n[matrix] ${comp.name}: ${matrix.combinations.length} combos (${matrix.validCount} valid, ${matrix.invalidCount} invalid)`);

      const className = toPascalCase(comp.name) + 'Page';
      const specContent = generateMatrixSpec(matrix, className, pomImportPath(comp.name));

      // Add auth beforeEach for author mode
      const authBlock = `
// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(\`\${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html\`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});
`;
      const withAuth = specContent.replace(
        "import ENV from '../../../utils/infra/env';",
        "import ENV from '../../../utils/infra/env';\n" + authBlock
      );

      const specPath = path.join(compSpecDir(comp.name), `${comp.name}.matrix.spec.ts`);
      fs.writeFileSync(specPath, withAuth, 'utf-8');
      console.log(`  Spec: ${specPath}`);

      updateComponentCoverage(comp.name, [{
        category: 'state-matrix' as TestCategory,
        testCount: matrix.combinations.length,
        specFile: path.basename(specPath),
        tags: ['@matrix', '@regression'],
      }]);
    });
  }
});

// ─── Phase 5: Visual Baselines ─────────────────────────────────────

test.describe('Phase 5 — Visual Baselines', () => {
  const phases = getPhases();
  const components = getTargetComponents();
  const updateBaseline = process.env.UPDATE_BASELINE === 'true';

  for (const comp of components) {
    test(`Visual baseline: ${comp.name}`, async ({ page }) => {
      if (!phases.includes('visual')) { test.skip(); return; }

      await aemLogin(page);
      const url = `${AUTHOR_URL}/content/global-atlantic/style-guide/components/${comp.name}.html?wcmmode=disabled`;
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      if (updateBaseline) {
        const envName = process.env.env || 'local';
        const baselines = await captureResponsiveBaselines(page, comp.name, envName, comp.rootSelector);
        console.log(`\n[visual] ${comp.name}: ${baselines.length} baseline(s) captured`);
        for (const b of baselines) {
          console.log(`  - ${b}`);
        }
      }

      // Generate visual spec (screenshot comparison)
      const className = toPascalCase(comp.name) + 'Page';
      const specContent = `import { test, expect } from '@playwright/test';
import { ${className} } from '${pomImportPath(comp.name)}';
import ENV from '../../../utils/infra/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(\`\${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html\`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.describe('${toPascalCase(comp.name)} — Visual Regression', () => {
  test('@visual @regression Desktop screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new ${className}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('${comp.rootSelector}').first();
    await expect(el).toHaveScreenshot('${comp.name}-desktop.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression @mobile Mobile screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ${className}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('${comp.rootSelector}').first();
    await expect(el).toHaveScreenshot('${comp.name}-mobile.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });

  test('@visual @regression Tablet screenshot matches baseline', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ${className}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('${comp.rootSelector}').first();
    await expect(el).toHaveScreenshot('${comp.name}-tablet.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });
});
`;
      const specPath = path.join(compSpecDir(comp.name), `${comp.name}.visual.spec.ts`);
      fs.writeFileSync(specPath, specContent, 'utf-8');
      console.log(`[visual] Spec: ${specPath} (3 tests)`);

      updateComponentCoverage(comp.name, [{
        category: 'visual' as TestCategory,
        testCount: 3,
        specFile: path.basename(specPath),
        tags: ['@visual', '@regression'],
      }]);
    });
  }
});

// ─── Phase 6: Broken Image Detection ──────────────────────────────

test.describe('Phase 6 — Broken Image Specs', () => {
  const phases = getPhases();
  const components = getTargetComponents();

  for (const comp of components) {
    test(`Broken image scan: ${comp.name}`, async ({ page }) => {
      if (!phases.includes('images')) { test.skip(); return; }

      await aemLogin(page);
      const url = `${AUTHOR_URL}/content/global-atlantic/style-guide/components/${comp.name}.html?wcmmode=disabled`;
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const results = await scanImages(page, comp.rootSelector);
      console.log(`\n[images] ${comp.name}: ${results.total} images, ${results.broken} broken, ${results.missingAlt} missing alt, ${results.oversized} oversized, ${results.missingDimensions} missing dimensions`);

      // Generate enhanced broken-image spec
      const className = toPascalCase(comp.name) + 'Page';
      const specContent = `import { test, expect } from '@playwright/test';
import { ${className} } from '${pomImportPath(comp.name)}';
import { scanImages, attachImageScanResults } from '../../../utils/generation/broken-image-detector';
import ENV from '../../../utils/infra/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(\`\${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html\`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.describe('${toPascalCase(comp.name)} — Image Health', () => {
  test('@regression No broken images', async ({ page }, testInfo) => {
    const pom = new ${className}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '${comp.rootSelector}');
    await attachImageScanResults(testInfo, results);
    expect(results.broken).toBe(0);
  });

  test('@regression All images have alt text', async ({ page }, testInfo) => {
    const pom = new ${className}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '${comp.rootSelector}');
    await attachImageScanResults(testInfo, results);
    expect(results.missingAlt).toBe(0);
  });

  test('@regression No oversized images (>500KB)', async ({ page }, testInfo) => {
    const pom = new ${className}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '${comp.rootSelector}');
    await attachImageScanResults(testInfo, results);
    expect(results.oversized).toBe(0);
  });

  test('@regression All images have explicit dimensions (CLS prevention)', async ({ page }, testInfo) => {
    const pom = new ${className}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const results = await scanImages(page, '${comp.rootSelector}');
    await attachImageScanResults(testInfo, results);
    expect(results.missingDimensions).toBe(0);
  });
});
`;
      const specPath = path.join(compSpecDir(comp.name), `${comp.name}.images.spec.ts`);
      fs.writeFileSync(specPath, specContent, 'utf-8');
      console.log(`  Spec: ${specPath} (4 tests)`);

      updateComponentCoverage(comp.name, [{
        category: 'broken-images' as TestCategory,
        testCount: 4,
        specFile: path.basename(specPath),
        tags: ['@regression'],
      }]);
    });
  }
});

// ─── Phase 7: Content-Driven Tests ─────────────────────────────────

test.describe('Phase 7 — Content-Driven Tests', () => {
  const phases = getPhases();

  test('Analyze content XML and generate validation specs', async () => {
    if (!phases.includes('content')) { test.skip(); return; }

    const contentRoot = path.resolve(
      KKR_AEM_ROOT,
      'ui.content.ga/src/main/content/jcr_root/content/global-atlantic/style-guide/components'
    );

    if (!fs.existsSync(contentRoot)) {
      console.log(`[content] Content root not found: ${contentRoot}`);
      console.log(`  Set KKR_AEM_ROOT env var to the kkr-aem repo path.`);
      return;
    }

    // Find all .content.xml files
    const xmlFiles: string[] = [];
    function findXml(dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) findXml(fullPath);
        else if (entry.name === '.content.xml') xmlFiles.push(fullPath);
      }
    }
    findXml(contentRoot);

    console.log(`\n[content] Found ${xmlFiles.length} content XML files`);

    const allIssues: string[] = [];
    for (const xmlFile of xmlFiles) {
      const analysis = analyzeContentXML(xmlFile);
      if (analysis.issues.length > 0) {
        console.log(`  ${path.relative(contentRoot, xmlFile)}: ${analysis.issues.length} issue(s)`);
        for (const issue of analysis.issues) {
          console.log(`    [${issue.severity}] ${issue.message}`);
        }
        allIssues.push(...generateContentTests(analysis));
      }
    }

    if (allIssues.length === 0) {
      console.log(`  No content issues found.`);
      return;
    }

    // Generate content validation spec (cross-component, lives at ga/ root)
    const specContent = `import { test, expect } from '@playwright/test';
import ENV from '../../utils/infra/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(\`\${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html\`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.describe('Content-Driven Validation', () => {
${allIssues.join('\n\n')}
});
`;

    const specPath = path.join(SPECS_DIR, 'content-driven.spec.ts');
    fs.writeFileSync(specPath, specContent, 'utf-8');
    console.log(`  Spec: ${specPath} (${allIssues.length} tests)`);
  });
});

// ─── Phase 7: Dispatcher Tests ─────────────────────────────────────

test.describe('Phase 7 — Dispatcher Tests', () => {
  const phases = getPhases();

  test('Generate dispatcher cache specs', async () => {
    if (!phases.includes('dispatcher')) { test.skip(); return; }

    const envName = process.env.env || 'local';
    if (envName === 'local') {
      console.log(`[dispatcher] Skipping dispatcher tests on local (requires deployed env).`);
      return;
    }

    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      console.log(`[dispatcher] No BASE_URL set. Skipping.`);
      return;
    }

    // Generate dispatcher spec for key GA pages
    const urls = [
      `${baseUrl}/content/global-atlantic/en.html`,
      `${baseUrl}/content/global-atlantic/en/about.html`,
      `${baseUrl}/content/global-atlantic/en/products.html`,
    ];

    const specContent = generateDispatcherSpec(urls, envName);

    // Add auth beforeEach
    const withAuth = specContent.replace(
      "import { testDispatcherCache } from '../../utils/generation/dispatcher-tester';",
      `import { testDispatcherCache } from '../../utils/generation/dispatcher-tester';
import ENV from '../../utils/infra/env';

test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(\`\${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html\`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});`
    );

    const specPath = path.join(SPECS_DIR, 'dispatcher.spec.ts');
    fs.writeFileSync(specPath, withAuth, 'utf-8');
    console.log(`[dispatcher] Spec: ${specPath} (${urls.length} tests)`);
  });
});

// ─── Phase 5: Figma Visual Verification ───────────────────────────

test.describe('Phase 5 — Figma Visual Spec', () => {
  const phases = getPhases();

  test('Generate visual verification from Figma data', async () => {
    if (!phases.includes('figma')) { test.skip(); return; }

    const figmaPath = process.env.FIGMA_DATA;
    if (!figmaPath) {
      console.log(`[figma] No FIGMA_DATA env var set. Provide a JSON file path with FigmaDesignSpec data.`);
      console.log(`  Example: FIGMA_DATA=tests/data/figma/button.json`);
      console.log(`  Or use: /automate component <name> --figma <url> to extract from Figma API.`);
      return;
    }

    if (!fs.existsSync(figmaPath)) {
      console.log(`[figma] File not found: ${figmaPath}`);
      return;
    }

    const figmaData: FigmaDesignSpec = JSON.parse(fs.readFileSync(figmaPath, 'utf-8'));
    const className = toPascalCase(figmaData.component) + 'Page';

    const result = generateVisualSpec(figmaData, className, pomImportPath(figmaData.component));
    console.log(`\n[figma] Generated: ${result.specPath} (${result.testCount} visual tests)`);
    console.log(`  Tests: colors, typography, spacing, animations, responsive, screenshot baseline`);

    updateComponentCoverage(figmaData.component, [{
      category: 'visual' as TestCategory,
      testCount: result.testCount,
      specFile: path.basename(result.specPath),
      tags: ['@visual'],
    }]);
  });
});

// ─── Phase 7: API Mock Setup ──────────────────────────────────────

test.describe('Phase 7 — API Mocking', () => {
  const phases = getPhases();
  const components = getTargetComponents();

  test('Initialize mock data files and generate mock spec', async ({ page }) => {
    if (!phases.includes('mocks')) { test.skip(); return; }

    for (const comp of components) {
      initMockData(comp.name);
      console.log(`\n[mocks] Initialized mock data for ${comp.name} (success/empty/error)`);
    }

    // Generate a sample API mock spec (cross-component, lives at ga/ root)
    const specContent = `import { test, expect } from '@playwright/test';
import { setupMocks, clearMocks, MockConfig } from '../../utils/infra/api-mock-helper';
import ENV from '../../utils/infra/env';

// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    await page.goto(\`\${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html\`);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});

test.afterEach(async ({ page }) => {
  await clearMocks(page);
});

test.describe('API Mocking — Error States', () => {
  test('@regression Component handles API error gracefully', async ({ page }) => {
    const mocks: MockConfig[] = [{
      urlPattern: '**/api/**',
      scenario: 'error',
      component: 'button',
      status: 500,
    }];
    await setupMocks(page, mocks);
    await page.goto(ENV.AEM_AUTHOR_URL + '/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled');
    await page.waitForLoadState('networkidle');
    // Component should not crash on API errors
    await expect(page.locator('.button').first()).toBeVisible();
  });

  test('@regression Component handles empty API response', async ({ page }) => {
    const mocks: MockConfig[] = [{
      urlPattern: '**/api/**',
      scenario: 'empty',
      component: 'button',
    }];
    await setupMocks(page, mocks);
    await page.goto(ENV.AEM_AUTHOR_URL + '/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled');
    await page.waitForLoadState('networkidle');
    // Component should handle empty state
    await expect(page.locator('.button').first()).toBeVisible();
  });
});
`;

    const specPath = path.join(SPECS_DIR, 'api-mock.spec.ts');
    fs.writeFileSync(specPath, specContent, 'utf-8');
    console.log(`[mocks] Spec: ${specPath} (2 tests)`);
  });
});

// ─── Phase 6: Coverage Report ──────────────────────────────────────

test.describe('Phase 6 — Coverage Report', () => {
  test('Print coverage matrix', async () => {
    const report = formatCoverageReport();
    console.log(`\n${report}`);
  });
});

// ─── Phase 6: Logger — Save Run Log ───────────────────────────────

test.describe('Phase 6 — Test Run Logger', () => {
  test('Save test run log', async () => {
    const logFile = logger.save();
    console.log(`\n[logger] Run log saved: ${logFile}`);
  });
});
