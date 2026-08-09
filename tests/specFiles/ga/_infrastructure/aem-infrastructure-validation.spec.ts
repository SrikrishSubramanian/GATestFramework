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
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
    capture = new ConsoleCapture(page);
    capture.start();
});
test.afterEach(async ({ page }, testInfo) => {
    if (capture) {
        await attachConsoleCapture(testInfo, capture);
    }
    await annotateEnvironment(testInfo);
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
            const found = // ?? TODO: Replace with measurement-utils
             await page.evaluate((cssClass) => {
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
                    }
                    catch {
                        // Cross-origin stylesheets — skip
                    }
                }
                return false;
            }, mapping.cssClass);
            if (!found) {
                missingClasses.push(`${mapping.component}: styleId="${mapping.styleId}" → .${mapping.cssClass}`);
            }
        }
        expect(missingClasses, `Style system IDs map to CSS classes with no rules in the compiled stylesheet.\nAuthors can select these styles but they will have no visual effect:\n${missingClasses.join('\n')}`).toEqual([]);
    });
    // Also verify per-component that style classes on rendered elements have effect
    test('@regression Section background style classes produce non-transparent backgrounds', async ({ page }) => {
        const url = resolveComponentUrl('accordion');
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        const backgrounds = [
            { selector: '.cmp-section--background-color-granite', expectDark: true },
            { selector: '.cmp-section--background-color-azul', expectDark: true },
        ];
        for (const bg of backgrounds) {
            const section = page.locator(bg.selector).first();
            if (await section.count() === 0)
                continue;
            const bgColor = // ?? TODO: Replace with measurement-utils
             await section.evaluate(el => getComputedStyle(el).backgroundColor);
            // measurement: use measurement-utils for cleaner code
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
