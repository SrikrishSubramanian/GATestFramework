/**
 * Cross-component AEM configuration validation.
 *
 * Tests two classes of bugs that escaped per-component test suites:
 *   1. Missing helpPath on GA dialog overlays (Bug 2 from GAAM-381)
 *   2. Restrictive parsys policies blocking child components (Bug 1 from GAAM-381)
 *
 * These tests run against the AEM Sling API and live rendered pages,
 * catching configuration regressions before they reach authors.
 */
import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
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
// ─── GA Overlay Components ────────────────────────────────────────────────────
// Every GA component with a sling:resourceSuperType should have its own
// _cq_dialog overlay with helpPath set. If the dialog doesn't exist at the GA
// path, the component falls back to the base dialog which may lack helpPath.
interface GAComponent {
    /** Display name */
    name: string;
    /** Sling path to the GA _cq_dialog */
    dialogPath: string;
    /** Whether this is a container component with an inner parsys */
    isContainer?: boolean;
    /** Fixture URL for parsys tests (only for containers) */
    fixtureUrl?: string;
    /** Child component CSS selectors expected inside container parsys */
    expectedChildren?: string[];
}
const GA_COMPONENTS: GAComponent[] = [
    {
        name: 'accordion',
        dialogPath: '/apps/ga/components/content/accordion/_cq_dialog',
        isContainer: true,
        fixtureUrl: '/content/global-atlantic/test-fixtures/accordion.html?wcmmode=disabled',
        expectedChildren: ['.cmp-button', '.cmp-separator', '.cmp-spacer'],
    },
    {
        name: 'accordion-item',
        dialogPath: '/apps/ga/components/content/accordion/accordion-item/_cq_dialog',
    },
    {
        name: 'accordion-tabs-feature',
        dialogPath: '/apps/ga/components/content/accordion-tabs-feature/_cq_dialog',
    },
    {
        name: 'button',
        dialogPath: '/apps/ga/components/content/button/_cq_dialog',
    },
    {
        name: 'feature-banner',
        dialogPath: '/apps/ga/components/content/feature-banner/_cq_dialog',
    },
    {
        name: 'form-options',
        dialogPath: '/apps/ga/components/content/form-options/_cq_dialog',
    },
    {
        name: 'headline-block',
        dialogPath: '/apps/ga/components/content/headline-block/_cq_dialog',
    },
    {
        name: 'hero-fifty-fifty',
        dialogPath: '/apps/ga/components/content/hero-fifty-fifty/_cq_dialog',
    },
    {
        name: 'homepage-hero',
        dialogPath: '/apps/ga/components/content/homepage-hero/_cq_dialog',
    },
    {
        name: 'image-with-nested-content',
        dialogPath: '/apps/ga/components/content/image-with-nested-content/_cq_dialog',
    },
    {
        name: 'navigation',
        dialogPath: '/apps/ga/components/content/navigation/_cq_dialog',
    },
    {
        name: 'rate-sheet-grid',
        dialogPath: '/apps/ga/components/content/rate-sheet-grid/_cq_dialog',
    },
    {
        name: 'section',
        dialogPath: '/apps/ga/components/content/section/_cq_dialog',
    },
    {
        name: 'separator',
        dialogPath: '/apps/ga/components/content/separator/_cq_dialog',
    },
    {
        name: 'spacer',
        dialogPath: '/apps/ga/components/content/spacer/_cq_dialog',
    },
    {
        name: 'statistic',
        dialogPath: '/apps/ga/components/content/statistic/_cq_dialog',
    },
    {
        name: 'text',
        dialogPath: '/apps/ga/components/content/text/_cq_dialog',
    },
];
// ─── Container Parsys Policy Tests ────────────────────────────────────────────
// Container components that accept child components need their parsys policy
// to list all expected content component types. If only the container's own
// sub-type is listed (e.g., accordion_default only allowing accordion-item),
// authors can't add text, buttons, images, etc. inside the container.
const CONTAINERS = GA_COMPONENTS.filter(c => c.isContainer);
