import * as fs from 'fs';
import * as path from 'path';
import { ParsedTestCase, ParsedTestGroup } from './csv-test-parser';
import { TestCategory, A11yLevel, getTagsForTest, formatTags, getAxeTags } from './test-tagger';

const GA_SPECS_DIR = path.resolve(__dirname, '..', 'specFiles', 'ga');

export interface SpecWriterOptions {
  component: string;
  pomClassName: string;
  pomImportPath: string;
  mode: 'author' | 'publish';
  a11yLevel: A11yLevel;
  categories: TestCategory[];
  outputDir?: string;
  /** CSS selector for the component root element (defaults to '${sel}') */
  rootSelector?: string;
  /** Starting test ID number (defaults to 1). IDs are auto-incremented. */
  startTestId?: number;
}

/**
 * Generate a short uppercase prefix from a component name.
 * e.g., "button" → "BTN", "feature-banner" → "FB", "statistic" → "STAT"
 */
function componentToPrefix(component: string): string {
  const parts = component.split(/[-_]/);
  if (parts.length === 1) {
    const name = parts[0].toUpperCase();
    // Short names get abbreviated: button→BTN, section→SEC, text→TXT, spacer→SPC
    if (name.length <= 4) return name;
    // Longer single words: take first 3-4 consonant-heavy chars
    return name.replace(/[AEIOU]/g, '').slice(0, 4) || name.slice(0, 4);
  }
  // Multi-word: take first letter of each part
  return parts.map(p => p.charAt(0).toUpperCase()).join('');
}

/** Format a test ID as [PREFIX-NNN] */
function formatTestId(prefix: string, num: number): string {
  return `[${prefix}-${String(num).padStart(3, '0')}]`;
}

export interface SpecWriteResult {
  specPath: string;
  testCount: number;
  categories: string[];
}

/**
 * Generate a spec file from parsed CSV test cases.
 */
export function writeSpecFromCSV(
  group: ParsedTestGroup,
  options: SpecWriterOptions
): SpecWriteResult {
  const baseDir = options.outputDir || GA_SPECS_DIR;
  const dir = path.join(baseDir, group.component);
  ensureDir(dir);

  const specPath = path.join(dir, `${group.component}.${options.mode}.spec.ts`);
  let testCount = 0;
  const usedCategories = new Set<string>();
  const prefix = componentToPrefix(group.component);
  let idCounter = options.startTestId || 1;

  const imports = buildImports(options);
  const describes: string[] = [];

  // Generate tests from CSV test cases
  if (group.testCases.length > 0) {
    const tests = group.testCases.map(tc => {
      testCount++;
      const testId = formatTestId(prefix, idCounter++);
      usedCategories.add('csv');
      const tags = tc.tags.length > 0
        ? tc.tags.map(t => t.startsWith('@') ? t : `@${t}`).join(' ')
        : formatTags(getTagsForTest('happy-path', tc.priority, options.a11yLevel));

      const stepsCode = tc.steps
        .map((s, i) => `    // Step ${i + 1}: ${s}`)
        .join('\n');

      return `  test('${testId} ${tags} ${escapeString(tc.title)}', async ({ page }) => {
    const pom = new ${options.pomClassName}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || ENV.BASE_URL || '');
${stepsCode}
    // Expected: ${escapeString(tc.expected)}
  });`;
    });

    describes.push(`test.describe('${toPascalCase(group.component)} — CSV Test Cases', () => {
${tests.join('\n\n')}
});`);
  }

  // Generate category-based tests
  for (const category of options.categories) {
    const catTests = generateCategoryTests(group.component, category, options, prefix, idCounter);
    if (catTests) {
      testCount += catTests.count;
      idCounter += catTests.count;
      usedCategories.add(category);
      describes.push(catTests.code);
    }
  }

  const content = `${imports}\n\n${describes.join('\n\n')}\n`;
  fs.writeFileSync(specPath, content, 'utf-8');

  return { specPath, testCount, categories: Array.from(usedCategories) };
}

/**
 * Generate a full component spec with all categories (no CSV input needed).
 */
export function writeComponentSpec(options: SpecWriterOptions): SpecWriteResult {
  const baseDir = options.outputDir || GA_SPECS_DIR;
  const dir = path.join(baseDir, options.component);
  ensureDir(dir);

  const specPath = path.join(dir, `${options.component}.${options.mode}.spec.ts`);
  let testCount = 0;
  const usedCategories: string[] = [];
  const prefix = componentToPrefix(options.component);
  let idCounter = options.startTestId || 1;

  const imports = buildImports(options);
  const describes: string[] = [];

  for (const category of options.categories) {
    const catTests = generateCategoryTests(options.component, category, options, prefix, idCounter);
    if (catTests) {
      testCount += catTests.count;
      idCounter += catTests.count;
      usedCategories.push(category);
      describes.push(catTests.code);
    }
  }

  // Add auth setup for author mode
  const authSetup = options.mode === 'author' ? `
// Authenticate with AEM Author before each test
test.beforeEach(async ({ page }) => {
  if (ENV.AEM_AUTHOR_URL && ENV.AEM_AUTHOR_USERNAME) {
    const loginUrl = \`\${ENV.AEM_AUTHOR_URL}/libs/granite/core/content/login.html\`;
    await page.goto(loginUrl);
    await page.fill('#username', ENV.AEM_AUTHOR_USERNAME || 'admin');
    await page.fill('#password', ENV.AEM_AUTHOR_PASSWORD || 'admin');
    await page.click('#submit-button');
    await page.waitForLoadState('networkidle');
  }
});
` : '';

  const content = `${imports}\n${authSetup}\n${describes.join('\n\n')}\n`;
  fs.writeFileSync(specPath, content, 'utf-8');

  return { specPath, testCount, categories: usedCategories };
}

function buildImports(options: SpecWriterOptions): string {
  const lines = [
    `import { test, expect } from '@playwright/test';`,
    `import { ${options.pomClassName} } from '${options.pomImportPath}';`,
    `import ENV from '../../../utils/env';`,
    `import { ConsoleCapture } from '../../../utils/console-capture';`,
    `import { attachConsoleCapture, annotateEnvironment } from '../../../utils/report-enhancer';`,
  ];

  if (options.a11yLevel !== 'none') {
    lines.push(`import AxeBuilder from '@axe-core/playwright';`);
  }

  return lines.join('\n');
}

function generateCategoryTests(
  component: string,
  category: TestCategory,
  options: SpecWriterOptions,
  prefix: string = '',
  startId: number = 1
): { code: string; count: number } | null {
  const name = toPascalCase(component);
  const pom = options.pomClassName;
  const baseUrl = options.mode === 'author' ? 'ENV.AEM_AUTHOR_URL' : 'ENV.BASE_URL';
  const sel = options.rootSelector || `.ga-${component}`;
  const pfx = prefix || componentToPrefix(component);
  let id = startId;

  switch (category) {
    case 'happy-path': {
      const tags = formatTags(getTagsForTest('happy-path', 'high', options.a11yLevel));
      return {
        count: 2,
        code: `test.describe('${name} — Happy Path', () => {
  test('${formatTestId(pfx, id++)} ${tags} ${name} renders correctly', async ({ page }) => {
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    await expect(page.locator('${sel}').first()).toBeVisible();
  });

  test('${formatTestId(pfx, id++)} ${tags} ${name} interactive elements are functional', async ({ page }) => {
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    // Verify primary interactive elements
    const root = page.locator('${sel}').first();
    await expect(root).toBeVisible();
  });
});`,
      };
    }

    case 'negative': {
      const tags = formatTags(getTagsForTest('negative', 'medium', options.a11yLevel));
      return {
        count: 2,
        code: `test.describe('${name} — Negative & Boundary', () => {
  test('${formatTestId(pfx, id++)} ${tags} ${name} handles empty content gracefully', async ({ page }) => {
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    // Component should not throw errors with minimal content
  });

  test('${formatTestId(pfx, id++)} ${tags} ${name} handles missing images', async ({ page }) => {
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    const images = page.locator('${sel} img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});`,
      };
    }

    case 'responsive': {
      const tags = formatTags(getTagsForTest('responsive', 'medium', options.a11yLevel));
      return {
        count: 2,
        code: `test.describe('${name} — Responsive', () => {
  test('${formatTestId(pfx, id++)} ${tags} @mobile ${name} adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    await expect(page.locator('${sel}').first()).toBeVisible();
  });

  test('${formatTestId(pfx, id++)} ${tags} ${name} adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    await expect(page.locator('${sel}').first()).toBeVisible();
  });
});`,
      };
    }

    case 'accessibility': {
      if (options.a11yLevel === 'none') return null;
      const tags = formatTags(getTagsForTest('accessibility', 'high', options.a11yLevel));
      const axeTags = JSON.stringify(getAxeTags(options.a11yLevel));
      const tests = [
        `  test('${formatTestId(pfx, id++)} ${tags} ${name} passes axe-core scan', async ({ page }) => {
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    const results = await new AxeBuilder({ page })
      .include('${sel}')
      .withTags(${axeTags})
      .analyze();
    expect(results.violations).toEqual([]);
  });`,
        `  test('${formatTestId(pfx, id++)} ${tags} ${name} interactive elements meet 24px target size', async ({ page }) => {
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    const interactive = page.locator('${sel} a, ${sel} button, ${sel} input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });`,
      ];

      if (options.a11yLevel === 'wcag22') {
        tests.push(`  test('${formatTestId(pfx, id++)} ${tags} ${name} focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    const focusable = page.locator('${sel} a, ${sel} button, ${sel} input');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
      }
    }
  });`);
      }

      return {
        count: tests.length,
        code: `test.describe('${name} — Accessibility', () => {\n${tests.join('\n\n')}\n});`,
      };
    }

    case 'console-errors': {
      const tags = formatTags(getTagsForTest('console-errors', 'medium', options.a11yLevel));
      return {
        count: 1,
        code: `test.describe('${name} — Console & Resources', () => {
  test('${formatTestId(pfx, id++)} ${tags} ${name} produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});`,
      };
    }

    case 'broken-images': {
      const tags = formatTags(getTagsForTest('broken-images', 'medium', options.a11yLevel));
      return {
        count: 2,
        code: `test.describe('${name} — Broken Images', () => {
  test('${formatTestId(pfx, id++)} ${tags} ${name} all images load successfully', async ({ page }) => {
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    const images = page.locator('${sel} img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('${formatTestId(pfx, id++)} ${tags} ${name} all images have alt attributes', async ({ page }) => {
    const pom = new ${pom}(page);
    await pom.navigate(${baseUrl} || '');
    const images = page.locator('${sel} img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});`,
      };
    }

    default:
      return null;
  }
}

function toPascalCase(str: string): string {
  return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}

function escapeString(str: string): string {
  return str.replace(/'/g, "\\'").replace(/\n/g, ' ');
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
