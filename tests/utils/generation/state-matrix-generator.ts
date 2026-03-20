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
  backgrounds?: BackgroundType[],
  viewports: string[] = DEFAULT_VIEWPORTS
): StateMatrix {
  // Use component-specific backgrounds if defined, otherwise default
  const known = KNOWN_VARIANTS[component];
  if (!backgrounds) {
    backgrounds = known?.availableBackgrounds || SECTION_BACKGROUNDS;
  }
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
  const bgStrategy = known?.backgroundStrategy || 'section';

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

  // ── Background selector strategy ─────────────────────────────────
  // 'section': backgrounds on parent .cmp-section--background-color-{bg}
  // 'component': backgrounds as classes on the component wrapper itself

  function bgSelectorCode(bg: string): string {
    if (bgStrategy === 'component') {
      const bgClass = known?.backgroundClasses?.[bg];
      const wrapper = known?.wrapperSelector || `.cmp-${comp}`;
      if (!bgClass) {
        // Default (white) = wrapper without any bg modifier class
        const excludes = Object.values(known?.backgroundClasses || {}).filter(c => c).map(c => `:not(${c})`).join('');
        return `page.locator('${wrapper}${excludes}').first()`;
      }
      return `page.locator('${wrapper}${bgClass}').first()`;
    }
    return `page.locator(sectionSel('${bg}')).first()`;
  }

  // Determine locator strategy for each variant
  function variantLocator(variant: string, bg: string): string {
    if (bgStrategy === 'component') {
      // For component-scoped backgrounds, the component IS the background container
      const inner = known?.innerSelector || `.cmp-${comp}`;
      return `container.locator('${inner}').first()`;
    }
    const wrapperClass = known?.variantClasses?.[variant];
    const disabled = known?.disabledFilter || ':not([aria-disabled="true"])';
    const inner = known?.innerSelector || `.cmp-${comp}`;
    if (wrapperClass) {
      return `container.locator('${wrapperClass}${disabled} ${inner}').first()`;
    }
    return `container.locator('${inner}${disabled}').first()`;
  }

  // First variant for responsive spot-checks
  const firstVariant = matrix.dimensions[0]?.values[0] || 'default';

  // ── Build valid test code ────────────────────────────────────────
  const validTestCode = validDesktop.map(combo => {
    const containerCode = bgSelectorCode(combo.background);
    const locator = variantLocator(combo.variant, combo.background);
    const label = bgStrategy === 'component' ? `${combo.background} background` : `${combo.background} section`;
    return `    test('[${comp.toUpperCase().replace(/-/g, '_')}-V] @matrix @regression ${combo.variant} + ${combo.theme} in ${label}', async ({ page }) => {
      const pom = new ${pomClassName}(page);
      await pom.navigate(BASE());
      const container = ${containerCode};
      await expect(container).toBeVisible();
      const el = ${locator};
      await expect(el).toBeVisible();
    });`;
  }).join('\n\n');

  // ── Build responsive test code ───────────────────────────────────
  const responsiveTestCode = backgrounds.map(bg => {
    const containerCode = bgSelectorCode(bg);
    const locator = variantLocator(firstVariant, bg);
    const label = bgStrategy === 'component' ? `${bg} background` : `${bg} section`;
    return `    test('[${comp.toUpperCase().replace(/-/g, '_')}-R] @matrix @regression @mobile ${comp} in ${label} @ mobile-390', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      const pom = new ${pomClassName}(page);
      await pom.navigate(BASE());
      const container = ${containerCode};
      await expect(container).toBeVisible();
      const el = ${locator};
      await expect(el).toBeVisible();
    });`;
  }).join('\n\n');

  // ── Build invalid test code ──────────────────────────────────────
  const invalidTestCode = invalidDesktop.map(combo => {
    const reason = combo.invalidReason || 'insufficient contrast';
    const dark = isDarkBackground(combo.background as BackgroundType);
    const pairType = dark ? 'dark-on-dark' : 'light-on-light';
    const containerCode = bgSelectorCode(combo.background);
    return `    test('[${comp.toUpperCase().replace(/-/g, '_')}-N] @matrix @negative ${combo.variant} + ${combo.theme} on ${combo.background} (${pairType})', async ({ page }) => {
      // ${reason}
      // Auto-theme should be used instead. Verify container still renders.
      const pom = new ${pomClassName}(page);
      await pom.navigate(BASE());
      const container = ${containerCode};
      await expect(container).toBeVisible();
    });`;
  }).join('\n\n');

  // ── Compute test counts ──────────────────────────────────────────
  const validCount = validDesktop.length;
  const responsiveCount = backgrounds.length;
  const invalidCount = invalidDesktop.length;
  const totalCount = validCount + responsiveCount + invalidCount;

  // ── Section selector helper (only for section strategy) ──────────
  const sectionSelHelper = bgStrategy === 'section' ? `
/** Section CSS class for a given background (from live AEM DOM) */
function sectionSel(bg: string) {
  return \`.${SECTION_BG_CLASS_PREFIX}\${bg}\`;
}
` : '';

  const strategyComment = bgStrategy === 'component'
    ? `Background: component-level classes on ${known?.wrapperSelector || `.cmp-${comp}`}`
    : `Section: .${SECTION_BG_CLASS_PREFIX}{bg}`;

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
 *   ${strategyComment}
 *   Disabled overlays excluded via ${known?.disabledFilter || ':not([aria-disabled="true"])'}
 */
${sectionSelHelper}
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
/**
 * Background strategy for matrix tests.
 *
 * 'section' (default): backgrounds are on parent section elements
 *   → selector: `.cmp-section--background-color-{bg}`
 *
 * 'component': backgrounds are style-system classes on the component wrapper itself
 *   → selector uses `backgroundClasses` map, e.g., `.cmp-feature-banner-granite`
 *   → default (white) is the absence of any bg class
 */
export type BackgroundStrategy = 'section' | 'component';

export const KNOWN_VARIANTS: Record<string, {
  variants: string[];
  themes: string[];
  /** Maps variant name → CSS wrapper class (from DOM probe) */
  variantClasses?: Record<string, string>;
  /** CSS filter to exclude disabled overlays (default: :not([aria-disabled="true"])) */
  disabledFilter?: string;
  /** Inner BEM element selector (default: .cmp-{component}) */
  innerSelector?: string;
  /**
   * How backgrounds are applied: 'section' = parent section wrappers (default),
   * 'component' = style-system classes on the component wrapper itself.
   */
  backgroundStrategy?: BackgroundStrategy;
  /**
   * For 'component' strategy: maps background name → CSS class on the wrapper.
   * Use empty string for the default/white background (no class needed).
   */
  backgroundClasses?: Record<string, string>;
  /**
   * Override which backgrounds are available on the style guide page.
   * Defaults to SECTION_BACKGROUNDS if not specified.
   */
  availableBackgrounds?: BackgroundType[];
  /**
   * The outer wrapper selector (e.g., '.feature-banner').
   * Used by component-scoped background strategy.
   */
  wrapperSelector?: string;
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
    backgroundStrategy: 'component',
    wrapperSelector: '.feature-banner',
    availableBackgrounds: ['white', 'slate', 'granite'],
    backgroundClasses: {
      'white': '',  // default — no bg class
      'slate': '.cmp-feature-banner-slate',
      'granite': '.cmp-feature-banner-granite',
    },
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
    variants: ['drop-down', 'multi-drop-down'],
    themes: ['light-theme', 'dark-theme'],
  },
  'accordion-tabs-feature': {
    variants: ['behavior-accordion', 'behavior-scroll'],
    themes: ['default'],
    variantClasses: {
      'behavior-accordion': '.cmp-accordion-tabs-feature',
      'behavior-scroll': '.cmp-accordion-tabs-feature',
    },
    innerSelector: '.cmp-accordion-tabs-feature',
  },
};

function toPascalCase(str: string): string {
  return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}
