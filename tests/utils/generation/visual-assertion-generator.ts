import * as fs from 'fs';
import * as path from 'path';
import { FigmaDesignSpec } from './requirements-merger';

const GA_SPECS_DIR = path.resolve(__dirname, '..', 'specFiles', 'ga');

export interface VisualSpecResult {
  specPath: string;
  testCount: number;
}

/**
 * Generate a visual verification spec from Figma design data.
 */
export function generateVisualSpec(
  figma: FigmaDesignSpec,
  pomClassName: string,
  pomImportPath: string
): VisualSpecResult {
  const compDir = path.join(GA_SPECS_DIR, figma.component);
  ensureDir(compDir);
  const specPath = path.join(compDir, `${figma.component}.visual.spec.ts`);

  const tests: string[] = [];
  const componentSelector = `.cmp-${figma.component}`;

  // Color assertions
  if (Object.keys(figma.colors).length > 0) {
    const colorAssertions = Object.entries(figma.colors)
      .map(([prop, val]) => `      expect(styles['${prop}']).toBe('${hexToRgb(val)}');`)
      .join('\n');

    const styleProps = Object.keys(figma.colors)
      .map(p => `        '${p}': cs.${cssPropToJs(p)},`)
      .join('\n');

    tests.push(`  test('@visual ${figma.component} colors match Figma spec', async ({ page }) => {
    const pom = new ${pomClassName}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('${componentSelector}').first();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
${styleProps}
      };
    });
${colorAssertions}
  });`);
  }

  // Typography assertions
  if (Object.keys(figma.typography).length > 0) {
    const typoAssertions = Object.entries(figma.typography)
      .map(([prop, val]) => `      expect(styles['${prop}']).toBe('${val}');`)
      .join('\n');

    const typoProps = Object.keys(figma.typography)
      .map(p => `        '${p}': cs.${cssPropToJs(p)},`)
      .join('\n');

    tests.push(`  test('@visual ${figma.component} typography matches Figma spec', async ({ page }) => {
    const pom = new ${pomClassName}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('${componentSelector}').first();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
${typoProps}
      };
    });
${typoAssertions}
  });`);
  }

  // Spacing assertions
  if (Object.keys(figma.spacing).length > 0) {
    const spacingAssertions = Object.entries(figma.spacing)
      .map(([prop, val]) => {
        const num = parseInt(val);
        return `      expect(Math.abs(parseInt(styles['${prop}']) - ${num})).toBeLessThanOrEqual(2);`;
      })
      .join('\n');

    const spacingProps = Object.keys(figma.spacing)
      .map(p => `        '${p}': cs.${cssPropToJs(p)},`)
      .join('\n');

    tests.push(`  test('@visual ${figma.component} spacing matches Figma spec (±2px)', async ({ page }) => {
    const pom = new ${pomClassName}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('${componentSelector}').first();
    const styles = await el.evaluate(el => {
      const cs = getComputedStyle(el);
      return {
${spacingProps}
      };
    });
${spacingAssertions}
  });`);
  }

  // Animation assertions
  for (const [trigger, props] of Object.entries(figma.animations)) {
    tests.push(`  test('@visual ${figma.component} ${trigger} animation matches spec', async ({ page }) => {
    const pom = new ${pomClassName}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('${componentSelector}').first();
    const transition = await el.evaluate(el => getComputedStyle(el).transition);
    ${props.property ? `expect(transition).toContain('${props.property}');` : ''}
    ${props.duration ? `expect(transition).toContain('${props.duration}');` : ''}

    // Capture before/after states
    const beforeBg = await el.evaluate(el => getComputedStyle(el).backgroundColor);
    await el.hover();
    await page.waitForTimeout(${parseInt(props.duration || '300') + 50});
    const afterBg = await el.evaluate(el => getComputedStyle(el).backgroundColor);
    ${trigger === 'hover' ? "expect(beforeBg).not.toBe(afterBg);" : ''}
  });`);
  }

  // Responsive assertions
  for (const [breakpoint, props] of Object.entries(figma.breakpoints)) {
    const viewport = breakpoint === 'mobile' ? '{ width: 390, height: 844 }'
      : breakpoint === 'tablet' ? '{ width: 1024, height: 1366 }'
      : '{ width: 1440, height: 900 }';
    const tag = breakpoint === 'mobile' ? '@visual @mobile' : '@visual';

    const dimAssertions = Object.entries(props)
      .filter(([, v]) => v !== 'auto' && v !== 'unset')
      .map(([p, v]) => `    // ${p} should be ${v}`)
      .join('\n');

    tests.push(`  test('${tag} ${figma.component} layout at ${breakpoint}', async ({ page }) => {
    await page.setViewportSize(${viewport});
    const pom = new ${pomClassName}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('${componentSelector}').first();
    await expect(el).toBeVisible();
${dimAssertions}
  });`);
  }

  // Screenshot baseline
  tests.push(`  test('@visual ${figma.component} screenshot matches baseline', async ({ page }) => {
    const pom = new ${pomClassName}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    const el = page.locator('${componentSelector}').first();
    await expect(el).toHaveScreenshot('${figma.component}-baseline.png', {
      maxDiffPixelRatio: 0.001,
      animations: 'disabled',
    });
  });`);

  const content = `import { test, expect } from '@playwright/test';
import { ${pomClassName} } from '${pomImportPath}';
import ENV from '../../../utils/infra/env';

test.describe('${toPascalCase(figma.component)} — Visual Verification', () => {
${tests.join('\n\n')}
});
`;

  fs.writeFileSync(specPath, content, 'utf-8');
  return { specPath, testCount: tests.length };
}

function hexToRgb(hex: string): string {
  if (!hex.startsWith('#')) return hex;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function cssPropToJs(prop: string): string {
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function toPascalCase(str: string): string {
  return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
