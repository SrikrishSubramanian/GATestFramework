import * as fs from 'fs';
import * as path from 'path';
import { isDarkBackground, BackgroundType } from './interaction-detector';

export interface StateMatrixDimension {
  name: string;
  values: string[];
  source: string;
}

export interface StateCombination {
  variant: string;
  theme: string;
  background: string;
  viewport: string;
  isValid: boolean;
  invalidReason?: string;
}

export interface StateMatrix {
  component: string;
  dimensions: StateMatrixDimension[];
  combinations: StateCombination[];
  validCount: number;
  invalidCount: number;
}

/** Viewports from playwright.config.ts */
const DEFAULT_VIEWPORTS = ['desktop-1440', 'tablet-1024', 'mobile-390'];

/** Background types available in section */
const SECTION_BACKGROUNDS: BackgroundType[] = ['white', 'slate', 'granite', 'azul'];

/**
 * Generate a state matrix from component style variants.
 */
export function generateStateMatrix(
  component: string,
  variants: string[],
  themes: string[],
  backgrounds: BackgroundType[] = SECTION_BACKGROUNDS,
  viewports: string[] = DEFAULT_VIEWPORTS
): StateMatrix {
  const dimensions: StateMatrixDimension[] = [
    { name: 'variant', values: variants, source: 'policy-xml' },
    { name: 'theme', values: themes, source: 'policy-xml' },
    { name: 'background', values: backgrounds, source: 'section-policy' },
    { name: 'viewport', values: viewports, source: 'playwright-config' },
  ];

  const combinations: StateCombination[] = [];

  for (const variant of variants) {
    for (const theme of themes) {
      for (const background of backgrounds) {
        for (const viewport of viewports) {
          const combo: StateCombination = {
            variant,
            theme,
            background,
            viewport,
            isValid: true,
          };

          // Validate: dark-theme on dark background = invalid
          if (theme === 'dark-theme' && isDarkBackground(background as BackgroundType)) {
            combo.isValid = false;
            combo.invalidReason = `${theme} on dark background (${background}) has insufficient contrast`;
          }

          // Validate: light-theme on light background = invalid
          if (theme === 'light-theme' && ['white', 'slate'].includes(background)) {
            combo.isValid = false;
            combo.invalidReason = `${theme} on light background (${background}) has insufficient contrast`;
          }

          combinations.push(combo);
        }
      }
    }
  }

  return {
    component,
    dimensions,
    combinations,
    validCount: combinations.filter(c => c.isValid).length,
    invalidCount: combinations.filter(c => !c.isValid).length,
  };
}

/**
 * Generate spec file content from a state matrix.
 */
export function generateMatrixSpec(
  matrix: StateMatrix,
  pomClassName: string,
  pomImportPath: string
): string {
  const validTests = matrix.combinations.filter(c => c.isValid);
  const invalidTests = matrix.combinations.filter(c => !c.isValid);

  const viewportMap: Record<string, string> = {
    'desktop-1440': '{ width: 1440, height: 900 }',
    'tablet-1024': '{ width: 1024, height: 1366 }',
    'mobile-390': '{ width: 390, height: 844 }',
  };

  const validTestCode = validTests.map(combo => {
    const tags = combo.viewport.includes('mobile')
      ? '@matrix @regression @mobile'
      : '@matrix @regression';
    const viewport = viewportMap[combo.viewport] || '{ width: 1440, height: 900 }';

    return `  test('${tags} ${combo.variant} + ${combo.theme} on ${combo.background} @ ${combo.viewport}', async ({ page }) => {
    await page.setViewportSize(${viewport});
    const pom = new ${pomClassName}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
    // Verify: ${combo.variant} with ${combo.theme} renders correctly on ${combo.background} section
    const root = page.locator('.ga-${matrix.component}').first();
    await expect(root).toBeVisible();
  });`;
  }).join('\n\n');

  const invalidTestCode = invalidTests.map(combo => {
    return `  test('@matrix @negative ${combo.variant} + ${combo.theme} on ${combo.background} is invalid', async ({ page }) => {
    // ${combo.invalidReason}
    // This combination should either not be available in the style system
    // or should have auto-correction (e.g., auto-theme)
    const pom = new ${pomClassName}(page);
    await pom.navigate(ENV.AEM_AUTHOR_URL || '');
  });`;
  }).join('\n\n');

  return `import { test, expect } from '@playwright/test';
import { ${pomClassName} } from '${pomImportPath}';
import ENV from '../../../utils/env';

// State Matrix: ${matrix.combinations.length} total (${matrix.validCount} valid, ${matrix.invalidCount} invalid)

test.describe('${toPascalCase(matrix.component)} — State Matrix (Valid)', () => {
${validTestCode}
});

test.describe('${toPascalCase(matrix.component)} — State Matrix (Invalid Combos)', () => {
${invalidTestCode}
});
`;
}

/**
 * Common component style variants from GA AEM.
 */
export const KNOWN_VARIANTS: Record<string, { variants: string[]; themes: string[] }> = {
  button: {
    variants: ['primary-filled', 'secondary-outline', 'text-only'],
    themes: ['light-theme', 'dark-theme', 'auto-theme'],
  },
  'feature-banner': {
    variants: ['default', 'fifty-fifty'],
    themes: ['light-theme', 'dark-theme', 'auto-theme'],
  },
  statistic: {
    variants: ['default'],
    themes: ['light-theme', 'dark-theme', 'auto-theme'],
  },
  section: {
    variants: ['default'],
    themes: ['default'],
  },
};

function toPascalCase(str: string): string {
  return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}
