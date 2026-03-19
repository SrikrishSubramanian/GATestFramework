/**
 * AEM Infrastructure Validation — Cross-Component
 *
 * Tests four classes of silent CMS configuration bugs:
 *   1. Template policy mappings — container policies point to correct policy definitions
 *   2. Style system ID → CSS class — authored styleIds have corresponding CSS rules in compiled stylesheets
 *   3. Component resourceType chain — GA overlays correctly extend base components
 *   4. Clientlib loading integrity — GA CSS/JS resources are present in the page
 *
 * These tests catch configuration regressions that produce no JS errors
 * and no visible rendering failures — the component simply silently breaks
 * for authors or renders without expected styling.
 */
import { test, expect } from '@playwright/test';
import ENV from '../../utils/infra/env';
import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ═══════════════════════════════════════════════════════════════════════════════
// 1. TEMPLATE POLICY MAPPING VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════
// Verifies that critical policy definitions exist at their expected Sling paths.
// Bug class: accordion_item_content policy was missing → authors couldn't add
// components inside accordion items. The template mapped to accordion_default
// which only allowed accordion-item as a child.

/** Policy paths that MUST exist for GA to function correctly. */
const REQUIRED_POLICIES = [
  {
    name: 'all-components (layout container)',
    path: '/conf/global-atlantic/settings/wcm/policies/wcm/foundation/components/responsivegrid/all-components',
    description: 'Master policy for the freeform page layout container — lists all allowed GA components',
  },
  {
    name: 'accordion default',
    path: '/conf/global-atlantic/settings/wcm/policies/ga/components/content/accordion/accordion_default',
    description: 'Accordion container policy — controls which sub-components are allowed',
  },
  {
    name: 'accordion-item content',
    path: '/conf/global-atlantic/settings/wcm/policies/ga/components/content/accordion/accordion_item_content',
    description: 'Accordion-item inner parsys policy — must allow text, button, image, etc.',
  },
  {
    name: 'button default',
    path: '/conf/global-atlantic/settings/wcm/policies/ga/components/content/button/button_default',
    description: 'Button component policy with style system variants',
  },
  {
    name: 'section default',
    path: '/conf/global-atlantic/settings/wcm/policies/ga/components/content/section/section_default',
    description: 'Section component policy with background style system',
  },
  {
    name: 'text default',
    path: '/conf/global-atlantic/settings/wcm/policies/ga/components/content/text/text_default',
    description: 'Text component policy with RTE configuration',
  },
  {
    name: 'spacer default',
    path: '/conf/global-atlantic/settings/wcm/policies/ga/components/content/spacer/spacer_default',
    description: 'Spacer component policy with size variants',
  },
  {
    name: 'statistic default',
    path: '/conf/global-atlantic/settings/wcm/policies/ga/components/content/statistic/statistic_default',
    description: 'Statistic component policy with alignment and theme variants',
  },
  {
    name: 'feature-banner default',
    path: '/conf/global-atlantic/settings/wcm/policies/ga/components/content/feature-banner/feature-banner_default',
    description: 'Feature banner component policy with layout and background variants',
  },
  {
    name: 'form container default',
    path: '/conf/global-atlantic/settings/wcm/policies/ga/components/form/container/form-container-default',
    description: 'Form container policy — controls allowed form field components',
  },
];

test.describe('Template Policy Mapping — Policy Definitions Exist', () => {
  for (const policy of REQUIRED_POLICIES) {
    test(`@author @regression ${policy.name} policy exists`, async ({ page }) => {
      const url = `${BASE()}${policy.path}.1.json`;
      const response = await page.request.get(url);
      expect(
        response.ok(),
        `Policy not found: ${policy.name}\nPath: ${policy.path}\nPurpose: ${policy.description}\nThis may cause components to be blocked from authoring.`
      ).toBe(true);
    });
  }
});

test.describe('Template Policy Mapping — Container Policies Allow Expected Components', () => {
  test('@author @regression @smoke Layout container policy includes all GA content components', async ({ page }) => {
    // The all-components policy on the responsivegrid must list all GA content components
    const url = `${BASE()}/conf/global-atlantic/settings/wcm/policies/wcm/foundation/components/responsivegrid/all-components.infinity.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const policy = await response.json();

    // Extract the components property (may be nested)
    const policyText = JSON.stringify(policy);

    // These GA components must be allowed in the layout container
    const requiredComponents = [
      'ga/components/content/button',
      'ga/components/content/text',
      'ga/components/content/section',
      'ga/components/content/spacer',
      'ga/components/content/separator',
      'ga/components/content/statistic',
      'ga/components/content/accordion',
      'ga/components/content/feature-banner',
      'ga/components/content/headline-block',
    ];

    for (const comp of requiredComponents) {
      expect(
        policyText.includes(comp),
        `Layout container policy does not list ${comp} — authors cannot add this component to pages`
      ).toBe(true);
    }
  });

  test('@author @regression Accordion-item policy allows content components', async ({ page }) => {
    // The accordion_item_content policy must allow diverse child types, not just accordion-item
    const url = `${BASE()}/conf/global-atlantic/settings/wcm/policies/ga/components/content/accordion/accordion_item_content.infinity.json`;
    const response = await page.request.get(url);
    if (!response.ok()) { test.skip(); return; }
    const policy = await response.json();
    const policyText = JSON.stringify(policy);

    // These must be allowed inside accordion items (the exact bug from GAAM-381)
    const requiredChildren = [
      'ga/components/content/text',
      'ga/components/content/button',
      'ga/components/content/separator',
      'ga/components/content/spacer',
    ];

    for (const comp of requiredChildren) {
      expect(
        policyText.includes(comp),
        `Accordion-item policy does not allow ${comp} — authors cannot add this inside accordion items`
      ).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. STYLE SYSTEM ID → CSS CLASS EXISTENCE
// ═══════════════════════════════════════════════════════════════════════════════
// Verifies that cq:styleId values authored in content XML have corresponding
// CSS rules in the compiled GA stylesheet. If a style ID maps to a CSS class
// that doesn't exist, the component renders without the expected styling.

interface StyleMapping {
  component: string;
  styleId: string;
  cssClass: string;
}

/** Known style ID → CSS class mappings from the GA policies XML. */
const STYLE_MAPPINGS: StyleMapping[] = [
  // Button
  { component: 'button', styleId: 'primary-filled', cssClass: 'ga-button--primary' },
  { component: 'button', styleId: 'secondary-outline', cssClass: 'ga-button--secondary' },
  { component: 'button', styleId: 'medium-button', cssClass: 'ga-button--md' },
  { component: 'button', styleId: 'small-button', cssClass: 'ga-button--sm' },
  { component: 'button', styleId: 'disabled-button', cssClass: 'ga-button--disabled' },
  // Section backgrounds
  { component: 'section', styleId: 'background-white', cssClass: 'cmp-section--background-color-white' },
  { component: 'section', styleId: 'background-slate', cssClass: 'cmp-section--background-color-slate' },
  { component: 'section', styleId: 'background-granite', cssClass: 'cmp-section--background-color-granite' },
  { component: 'section', styleId: 'background-azul', cssClass: 'cmp-section--background-color-azul' },
  // Spacer sizes
  { component: 'spacer', styleId: 'size-small', cssClass: 'cmp-spacer--small' },
  { component: 'spacer', styleId: 'size-medium', cssClass: 'cmp-spacer--medium' },
  { component: 'spacer', styleId: 'size-large', cssClass: 'cmp-spacer--large' },
  // Statistic
  { component: 'statistic', styleId: 'stat-align-left', cssClass: 'cmp-statistic--align-left' },
  { component: 'statistic', styleId: 'stat-align-center', cssClass: 'cmp-statistic--align-center' },
  { component: 'statistic', styleId: 'stat-theme-granite', cssClass: 'cmp-statistic--theme-granite' },
  // Text
  { component: 'text', styleId: 'text-white', cssClass: 'cmp-text--text-white' },
  { component: 'text', styleId: 'site-width', cssClass: 'cmp-text--site-width' },
  // Headline block
  { component: 'headline-block', styleId: 'headline-block-center-alignment', cssClass: 'cmp-section--center' },
];

test.describe('Style System — CSS Class Existence', () => {
  // Load a style guide page once — all GA component styles should be in the compiled stylesheet
  const STYLE_GUIDE_URL = '/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled';

  test('@regression @smoke Style system CSS classes exist in compiled GA stylesheet', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    // Search all loaded stylesheets for each expected CSS class
    const missingClasses: string[] = [];

    for (const mapping of STYLE_MAPPINGS) {
      const found = await page.evaluate((cssClass) => {
        const sheets = Array.from(document.styleSheets);
        for (const sheet of sheets) {
          try {
            const rules = sheet.cssRules || sheet.rules;
            for (let i = 0; i < rules.length; i++) {
              const rule = rules[i] as CSSStyleRule;
              if (rule.selectorText && rule.selectorText.includes(cssClass)) {
                return true;
              }
            }
          } catch {
            // Cross-origin stylesheets — skip
          }
        }
        return false;
      }, mapping.cssClass);

      if (!found) {
        missingClasses.push(`${mapping.component}: styleId="${mapping.styleId}" → .${mapping.cssClass}`);
      }
    }

    expect(
      missingClasses,
      `Style system IDs map to CSS classes with no rules in the compiled stylesheet.\nAuthors can select these styles but they will have no visual effect:\n${missingClasses.join('\n')}`
    ).toEqual([]);
  });

  // Also verify per-component that style classes on rendered elements have effect
  test('@regression Section background style classes produce non-transparent backgrounds', async ({ page }) => {
    await page.goto(`${BASE()}/content/global-atlantic/style-guide/components/accordion.html?wcmmode=disabled`);
    await page.waitForLoadState('networkidle');

    const backgrounds = [
      { selector: '.cmp-section--background-color-granite', expectDark: true },
      { selector: '.cmp-section--background-color-azul', expectDark: true },
    ];

    for (const bg of backgrounds) {
      const section = page.locator(bg.selector).first();
      if (await section.count() === 0) continue;
      const bgColor = await section.evaluate(el => getComputedStyle(el).backgroundColor);
      // Should not be transparent or white on dark backgrounds
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(bgColor).not.toBe('rgb(255, 255, 255)');
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. COMPONENT RESOURCETYPE CHAIN VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════
// Verifies that GA component overlays have correct sling:resourceSuperType
// pointing to their base component. If this chain breaks, the component
// silently falls back or fails to render.

interface ComponentOverlay {
  name: string;
  gaPath: string;
  expectedSuperType: string;
}

const GA_OVERLAYS: ComponentOverlay[] = [
  { name: 'accordion', gaPath: '/apps/ga/components/content/accordion', expectedSuperType: 'kkr-aem-base/components/content/accordion' },
  { name: 'button', gaPath: '/apps/ga/components/content/button', expectedSuperType: 'kkr-aem-base/components/content/button' },
  { name: 'feature-banner', gaPath: '/apps/ga/components/content/feature-banner', expectedSuperType: 'kkr-aem-base/components/content/feature-banner' },
  { name: 'headline-block', gaPath: '/apps/ga/components/content/headline-block', expectedSuperType: 'kkr-aem-base/components/content/headline-block' },
  { name: 'homepage-hero', gaPath: '/apps/ga/components/content/homepage-hero', expectedSuperType: 'kkr-aem-base/components/content/homepage-hero' },
  { name: 'image-with-nested-content', gaPath: '/apps/ga/components/content/image-with-nested-content', expectedSuperType: 'kkr-aem-base/components/content/image-with-nested-content' },
  { name: 'navigation', gaPath: '/apps/ga/components/content/navigation', expectedSuperType: 'kkr-aem-base/components/content/navigation' },
  { name: 'rate-sheet-grid', gaPath: '/apps/ga/components/content/rate-sheet-grid', expectedSuperType: 'kkr-aem-base/components/content/rate-sheet-grid' },
  { name: 'section', gaPath: '/apps/ga/components/content/section', expectedSuperType: 'kkr-aem-base/components/content/section' },
  { name: 'separator', gaPath: '/apps/ga/components/content/separator', expectedSuperType: 'kkr-aem-base/components/content/separator' },
  { name: 'spacer', gaPath: '/apps/ga/components/content/spacer', expectedSuperType: 'kkr-aem-base/components/content/spacer' },
  { name: 'statistic', gaPath: '/apps/ga/components/content/statistic', expectedSuperType: 'kkr-aem-base/components/content/statistic' },
  { name: 'text', gaPath: '/apps/ga/components/content/text', expectedSuperType: 'kkr-aem-base/components/content/text' },
];

test.describe('Component ResourceType Chain — GA Overlays', () => {
  for (const overlay of GA_OVERLAYS) {
    test(`@author @regression ${overlay.name} overlay exists at GA path`, async ({ page }) => {
      const url = `${BASE()}${overlay.gaPath}.1.json`;
      const response = await page.request.get(url);
      expect(
        response.ok(),
        `GA component overlay not found at ${overlay.gaPath} — the component may not be registered`
      ).toBe(true);
    });

    test(`@author @regression ${overlay.name} overlay extends correct base component`, async ({ page }) => {
      const url = `${BASE()}${overlay.gaPath}.1.json`;
      const response = await page.request.get(url);
      if (!response.ok()) { test.skip(); return; }
      const component = await response.json();
      expect(
        component['sling:resourceSuperType'],
        `${overlay.name}: sling:resourceSuperType is missing or wrong.\nExpected: ${overlay.expectedSuperType}\nGot: ${component['sling:resourceSuperType']}\nThis breaks HTL/JS inheritance from the base component.`
      ).toBe(overlay.expectedSuperType);
    });
  }

  test('@author @regression All GA overlays have componentGroup="GA Base"', async ({ page }) => {
    const mismatched: string[] = [];
    for (const overlay of GA_OVERLAYS) {
      const url = `${BASE()}${overlay.gaPath}.1.json`;
      const response = await page.request.get(url);
      if (!response.ok()) continue;
      const component = await response.json();
      if (component.componentGroup !== 'GA Base') {
        mismatched.push(`${overlay.name}: componentGroup="${component.componentGroup}" (expected "GA Base")`);
      }
    }
    expect(
      mismatched,
      `Components with wrong componentGroup won't appear in the GA component browser:\n${mismatched.join('\n')}`
    ).toEqual([]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. CLIENTLIB LOADING INTEGRITY
// ═══════════════════════════════════════════════════════════════════════════════
// Verifies that the GA clientlib (ga.site) CSS and JS are loaded on GA pages.
// If the clientlib category is misconfigured or a LESS import fails, styles
// silently don't load and components render unstyled.

test.describe('Clientlib Loading — GA Stylesheets and Scripts', () => {
  const STYLE_GUIDE_URL = '/content/global-atlantic/style-guide/components/button.html?wcmmode=disabled';

  test('@regression @smoke GA clientlib CSS is loaded on the page', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    // Check for ga.site clientlib proxy CSS (AEM serves via /etc.clientlibs/ proxy)
    const cssLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(l => (l as HTMLLinkElement).href);
    });

    const hasGaCSS = cssLinks.some(href =>
      href.includes('clientlib-site') && href.includes('/ga/') ||
      href.includes('ga.site') ||
      href.includes('/etc.clientlibs/ga/')
    );

    expect(
      hasGaCSS,
      `GA clientlib CSS not found in page <link> tags.\nLoaded stylesheets:\n${cssLinks.join('\n')}\nExpected a stylesheet containing "ga" clientlib path.`
    ).toBe(true);
  });

  test('@regression GA clientlib CSS loads without HTTP errors', async ({ page }) => {
    const failedResources: string[] = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.css') && url.includes('/ga/') && !response.ok()) {
        failedResources.push(`${response.status()} ${url}`);
      }
    });

    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    expect(
      failedResources,
      `GA CSS resources failed to load:\n${failedResources.join('\n')}`
    ).toEqual([]);
  });

  test('@regression GA clientlib JS loads without HTTP errors', async ({ page }) => {
    const failedResources: string[] = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') && url.includes('/ga/') && !response.ok()) {
        failedResources.push(`${response.status()} ${url}`);
      }
    });

    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    expect(
      failedResources,
      `GA JS resources failed to load:\n${failedResources.join('\n')}`
    ).toEqual([]);
  });

  test('@regression Page has non-zero GA-specific CSS rules loaded', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    // Count CSS rules that reference GA component selectors
    const gaRuleCount = await page.evaluate(() => {
      let count = 0;
      const gaPatterns = ['.cmp-', '.ga-', '.cmp-section--', '.cmp-button', '.cmp-text'];
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = sheet.cssRules || sheet.rules;
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i] as CSSStyleRule;
            if (rule.selectorText && gaPatterns.some(p => rule.selectorText.includes(p))) {
              count++;
            }
          }
        } catch {
          // Cross-origin — skip
        }
      }
      return count;
    });

    expect(
      gaRuleCount,
      `Only ${gaRuleCount} GA-specific CSS rules found. The clientlib may not be compiling correctly.`
    ).toBeGreaterThan(50); // GA has hundreds of component rules
  });

  test('@regression @smoke Compiled CSS is not empty or trivially small', async ({ page }) => {
    await page.goto(`${BASE()}${STYLE_GUIDE_URL}`);
    await page.waitForLoadState('networkidle');

    // Find the GA clientlib stylesheet and check its size
    const cssInfo = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      for (const link of links) {
        const href = (link as HTMLLinkElement).href;
        if (href.includes('/ga/') || href.includes('ga.site')) {
          return { href, found: true };
        }
      }
      return { href: '', found: false };
    });

    if (!cssInfo.found) {
      test.skip();
      return;
    }

    // Fetch the CSS file and check it's not empty
    const response = await page.request.get(cssInfo.href);
    expect(response.ok()).toBe(true);
    const body = await response.text();
    // GA compiled CSS should be at least several KB
    expect(
      body.length,
      `GA clientlib CSS at ${cssInfo.href} is suspiciously small (${body.length} bytes). LESS compilation may have failed.`
    ).toBeGreaterThan(5000);
  });
});
