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
 * AEM section background CSS class (from live DOM probe).
 * Style system IDs like `background-white` render as `cmp-section--background-color-white`.
 */
const SECTION_BG_CLASS_PREFIX = 'cmp-section--background-color-';

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
 *
 * Produces properly scoped tests:
 *   - Each background section targeted via `.cmp-section--background-color-{bg}`
 *   - Each variant targeted via component-specific wrapper class (from KNOWN_VARIANTS)
 *   - Disabled editor overlays excluded
 *   - Viewport triplication collapsed: one desktop test per combo + mobile spot-checks
 *   - Auth via loginToAEMAuthor
 */
export function generateMatrixSpec(
  matrix: StateMatrix,
  pomClassName: string,
  pomImportPath: string
): string {
  const comp = matrix.component;
  const known = KNOWN_VARIANTS[comp];

  // Deduplicate: collapse viewport dimension — keep only desktop combos
  const seen = new Set<string>();
  const validDesktop: StateCombination[] = [];
  const invalidDesktop: StateCombination[] = [];

  for (const combo of matrix.combinations) {
    const key = `${combo.variant}|${combo.theme}|${combo.background}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (combo.isValid) validDesktop.push(combo);
    else invalidDesktop.push(combo);
  }

  // Unique backgrounds for responsive spot-checks
  const backgrounds = Array.from(new Set(matrix.combinations.map(c => c.background)));

  // Determine locator strategy for each variant
  function variantLocator(variant: string): string {
    const wrapperClass = known?.variantClasses?.[variant];
    const disabled = known?.disabledFilter || ':not([aria-disabled="true"])';
    const inner = known?.innerSelector || `.cmp-${comp}`;
    if (wrapperClass) {
      return `section.locator('${wrapperClass}${disabled} ${inner}').first()`;
    }
    return `section.locator('${inner}${disabled}').first()`;
  }

  // First variant for responsive spot-checks
  const firstVariant = matrix.dimensions[0]?.values[0] || 'default';

  // ── Build valid test code ────────────────────────────────────────
  const validTestCode = validDesktop.map(combo => {
    const locator = variantLocator(combo.variant);
    return `    test('[${comp.toUpperCase().replace(/-/g, '_')}-V] @matrix @regression ${combo.variant} + ${combo.theme} in ${combo.background} section', async ({ page }) => {
      const pom = new ${pomClassName}(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel('${combo.background}')).first();
      await expect(section).toBeVisible();
      const btn = ${locator};
      await expect(btn).toBeVisible();
    });`;
  }).join('\n\n');

  // ── Build responsive test code ───────────────────────────────────
  const responsiveTestCode = backgrounds.map(bg => {
    const locator = variantLocator(firstVariant);
    return `    test('[${comp.toUpperCase().replace(/-/g, '_')}-R] @matrix @regression @mobile buttons in ${bg} section @ mobile-390', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const pom = new ${pomClassName}(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel('${bg}')).first();
      await expect(section).toBeVisible();
      const btn = ${locator};
      await expect(btn).toBeVisible();
    });`;
  }).join('\n\n');

  // ── Build invalid test code ──────────────────────────────────────
  const invalidTestCode = invalidDesktop.map(combo => {
    const reason = combo.invalidReason || 'insufficient contrast';
    const dark = isDarkBackground(combo.background as BackgroundType);
    const pairType = dark ? 'dark-on-dark' : 'light-on-light';
    return `    test('[${comp.toUpperCase().replace(/-/g, '_')}-N] @matrix @negative ${combo.variant} + ${combo.theme} on ${combo.background} (${pairType})', async ({ page }) => {
      // ${reason}
      // Auto-theme should be used instead. Verify section still renders.
      const pom = new ${pomClassName}(page);
      await pom.navigate(BASE());
      const section = page.locator(sectionSel('${combo.background}')).first();
      await expect(section).toBeVisible();
    });`;
  }).join('\n\n');

  // ── Compute test counts ──────────────────────────────────────────
  const validCount = validDesktop.length;
  const responsiveCount = backgrounds.length;
  const invalidCount = invalidDesktop.length;
  const totalCount = validCount + responsiveCount + invalidCount;

  return `import { test, expect } from '../../../utils/infra/persistent-context';
import { ${pomClassName} } from '${pomImportPath}';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

/*
 * ${toPascalCase(comp)} State Matrix
 *
 * ${totalCount} tests (${validCount} valid + ${responsiveCount} responsive + ${invalidCount} invalid).
 * Generated by state-matrix-generator.ts — viewport triplication collapsed.
 *
 * Selectors (from DOM probe):
 *   Section: .${SECTION_BG_CLASS_PREFIX}{bg}
 *   Disabled overlays excluded via ${known?.disabledFilter || ':not([aria-disabled="true"])'}
 */

/** Section CSS class for a given background (from live AEM DOM) */
function sectionSel(bg: string) {
  return \`.${SECTION_BG_CLASS_PREFIX}\${bg}\`;
}

// ── Valid: variant × theme × background at desktop (${validCount} tests) ──

test.describe('${toPascalCase(comp)} — State Matrix (Valid)', () => {
${validTestCode}
});

// ── Responsive: one spot-check per background at mobile (${responsiveCount} tests) ──

test.describe('${toPascalCase(comp)} — State Matrix (Responsive)', () => {
${responsiveTestCode}
});

// ── Invalid: contrast concerns (${invalidCount} tests) ──

test.describe('${toPascalCase(comp)} — State Matrix (Invalid Combos)', () => {
${invalidTestCode}
});
`;
}

/**
 * Common component style variants from GA AEM.
 *
 * variantClasses:  Maps variant name → CSS class on the component wrapper div.
 *                  Discovered via DomProbe utility against live AEM DOM.
 * disabledFilter:  CSS selector to exclude disabled editor overlays.
 * innerSelector:   The inner BEM element selector (default: .cmp-{component}).
 */
export const KNOWN_VARIANTS: Record<string, {
  variants: string[];
  themes: string[];
  /** Maps variant name → CSS wrapper class (from DOM probe) */
  variantClasses?: Record<string, string>;
  /** CSS filter to exclude disabled overlays (default: :not([aria-disabled="true"])) */
  disabledFilter?: string;
  /** Inner BEM element selector (default: .cmp-{component}) */
  innerSelector?: string;
}> = {
  button: {
    variants: ['primary-filled', 'secondary-outline', 'text-only'],
    themes: ['light-theme', 'dark-theme', 'auto-theme'],
    variantClasses: {
      'primary-filled': '.ga-button--primary',
      'secondary-outline': '.ga-button--secondary',
      'text-only': '.ga-button--icon-text',
    },
    disabledFilter: ':not(.ga-button--disabled)',
    innerSelector: '.cmp-button',
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
  'form-options': {
    // type dialog values: drop-down, multi-drop-down
    // wrapper: .cmp-form-options; type classes: .cmp-form-options--drop-down, .cmp-form-options--multi-drop-down
    // no style system IDs — theme is inherited from parent section background
    // states: default, hover, focus, filled, disabled, error-default, error-focus, error-filled
    variants: ['drop-down', 'multi-drop-down'],
    themes: ['light-theme', 'dark-theme'],
  },
};

function toPascalCase(str: string): string {
  return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}
