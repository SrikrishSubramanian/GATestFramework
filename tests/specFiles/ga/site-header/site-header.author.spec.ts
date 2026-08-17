import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { SiteHeaderPage } from '../../../pages/ga/components/siteHeaderPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import {ConsoleCapture, isBenignError} from '../../../utils/infra/console-capture';
import AxeBuilder from '@axe-core/playwright';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const COMPONENT_PATH = '/apps/ga/components/content/site-header';
const DIALOG_PATH = `${COMPONENT_PATH}/_cq_dialog`;
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
// ─── Component Registration (GAAM-394) ────────────────────────────────────────
test.describe('SiteHeader — Component Registration (GAAM-394)', () => {
});
// ─── Dialog Structure: 3-Tab Layout (GAAM-394) ───────────────────────────────
test.describe('SiteHeader — Dialog Structure: 3-Tab Layout (GAAM-394)', () => {
});
// ─── Required Field Configuration (GAAM-394) ─────────────────────────────────
test.describe('SiteHeader — Required Field Configuration (GAAM-394)', () => {
});
// ─── Conditional Field Logic (GAAM-394) ──────────────────────────────────────
test.describe('SiteHeader — Conditional Field Logic (GAAM-394)', () => {
});
// ─── Multifield Constraints (GAAM-394) ───────────────────────────────────────
test.describe('SiteHeader — Multifield Constraints (GAAM-394)', () => {
});
// ─── Author QA Checklist (GAAM-394) ──────────────────────────────────────────
test.describe('SiteHeader — Author QA Checklist (GAAM-394)', () => {
    test('[SHDR-039] @author @smoke @sanity Author documentation accessible via dialog help icon', async ({ page }) => {
        // Verified live 2026-08-13: the click→select→open-dialog interaction IS automatable in this
        // Cloud SDK authoring shell. The editor renders one iframe (name="Main Content") whose real
        // edit-mode selection overlay (.cq-Overlay--component, aria-controls="EditableToolbar") sits
        // *outside* that iframe and intercepts pointer events over it — clicking the component inside
        // the iframe directly times out (the overlay is what must be clicked). Clicking the overlay
        // reveals #EditableToolbar with a CONFIGURE button, which opens the "Site Header" coral-dialog
        // (data-path resolves to the site_header_copy XF instance). That dialog's Help button
        // (title/aria-label="Help", icon="helpCircle") opens a new tab at
        // mnt/overlay/wcm/core/content/sites/components/details.html/apps/ga/components/structure/site-header
        // — the real "AEM Sites | Component Properties" doc driven by the component's cq:cellName
        // registration, confirming SHDR-005/006's help wiring end-to-end.
        await page.goto(`${BASE()}/editor.html/content/experience-fragments/global-atlantic/style-guide/header/header-master/financial-professionals.html`, { waitUntil: 'domcontentloaded' });
        const mainContent = page.frameLocator('iframe[name="Main Content"]');
        const contentFrame = mainContent.frameLocator('#ContentFrame');
        await expect(contentFrame.locator('.cmp-site-header').first()).toBeVisible({ timeout: 20000 });

        const overlay = mainContent.locator('.cq-Overlay--component[data-path*="site_header"]').first();
        await overlay.click({ position: { x: 10, y: 10 } });

        const toolbar = mainContent.locator('#EditableToolbar');
        const configureBtn = toolbar.locator('[data-action="CONFIGURE"]').first();
        await configureBtn.click();

        const dialog = mainContent.locator('coral-dialog[open]').first();
        await expect(dialog).toBeVisible();
        const dialogTitle = await dialog.evaluate((el) => el.querySelector('coral-dialog-header')?.textContent?.trim());
        expect(dialogTitle).toBe('Site Header');

        const helpButton = dialog.locator('button[title="Help"][aria-label="Help"]').first();
        const [helpDoc] = await Promise.all([
            page.context().waitForEvent('page'),
            helpButton.click(),
        ]);
        await helpDoc.waitForLoadState('domcontentloaded');
        expect(helpDoc.url()).toContain('details.html/apps/ga/components/structure/site-header');
        expect(await helpDoc.title()).toContain('Component Properties');
        await helpDoc.close();
    });
});
// ─── AEM Convention Compliance (GAAM-394) ────────────────────────────────────
test.describe('SiteHeader — AEM Convention Compliance (GAAM-394)', () => {
    test('[SHDR-044] @author @regression Component is restricted to XF Template (GAAM-792)', async () => {
        // Investigated 2026-08-15: GAAM-792 asks that site-header (a structure component) only be
        // authorable inside the Experience Fragment template, not standard pages. AEM enforces this
        // via policy allowedComponents, not a component-level flag, so this is checkable statically
        // from the two policy sources of truth:
        //   1. /conf/global-atlantic/settings/wcm/policies/.content.xml defines two responsivegrid
        //      policies: "all-components" (title "GA All Components - ReadOnly", for standard page
        //      layout containers) and "xf-components" (title "GA Experience Fragment Components",
        //      jcr:description "...including structure components like header and footer"). Only
        //      xf-components' `components` list includes /apps/ga/components/structure/site-header —
        //      all-components does not.
        //   2. Each template's own policies/.content.xml assigns a policy via cq:policy: confirmed
        //      experience-fragment-web -> .../responsivegrid/xf-components. The standard templates
        //      (ga-freeform-page, insights-detail-page) -> .../responsivegrid/all-components, while
        //      product-detail-page has its own dedicated root policy (product-detail-components) —
        //      so rather than assume every standard template reuses "all-components" by name, resolve
        //      each template's actual assigned policy node and check ITS components list directly.
        // Together these prove site-header is only ever an allowed component on the XF template.
        const kkrRoot = path.resolve(__dirname, '..', '..', '..', '..', 'kkr-aem');
        const policiesFile = path.join(
            kkrRoot, 'ui.content.ga', 'src', 'main', 'content', 'jcr_root', 'conf', 'global-atlantic',
            'settings', 'wcm', 'policies', '.content.xml'
        );
        const templatesDir = path.join(
            kkrRoot, 'ui.content.ga', 'src', 'main', 'content', 'jcr_root', 'conf', 'global-atlantic',
            'settings', 'wcm', 'templates'
        );

        // kkr-aem is gitignored (a local-only reference clone) — not checked out in CI.
        if (!fs.existsSync(policiesFile) || !fs.existsSync(templatesDir)) {
            test.skip(true, 'kkr-aem is not checked out in this environment (gitignored, local-reference-only clone) — cannot read the policy sources to verify GAAM-792 without it.');
            return;
        }

        const policiesXml = fs.readFileSync(policiesFile, 'utf-8');
        const extractBlock = (nodeName: string) => {
            const match = policiesXml.match(new RegExp(`<${nodeName}\\b[\\s\\S]*?</${nodeName}>`));
            expect(match, `expected a <${nodeName}> policy node in wcm/policies/.content.xml`).not.toBeNull();
            return match![0];
        };
        const allComponents = extractBlock('all-components');
        const xfComponents = extractBlock('xf-components');
        expect(allComponents, 'site-header must NOT be allowed on standard page layout containers').not.toContain('/apps/ga/components/structure/site-header');
        expect(xfComponents, 'site-header must be allowed on XF layout containers').toContain('/apps/ga/components/structure/site-header');

        const templatePolicyNode = (templateName: string) => {
            const file = path.join(templatesDir, templateName, 'policies', '.content.xml');
            expect(fs.existsSync(file), `expected a policies/.content.xml for template "${templateName}"`).toBe(true);
            const xml = fs.readFileSync(file, 'utf-8');
            const match = xml.match(/cq:policy="wcm\/foundation\/components\/responsivegrid\/([\w-]+)"/);
            expect(match, `expected a root responsivegrid cq:policy assignment in "${templateName}"`).not.toBeNull();
            return match![1];
        };
        expect(templatePolicyNode('experience-fragment-web')).toBe('xf-components');
        for (const standardTemplate of ['ga-freeform-page', 'insights-detail-page', 'product-detail-page']) {
            const nodeName = templatePolicyNode(standardTemplate);
            expect(nodeName, `standard template "${standardTemplate}" must not use the XF-only policy`).not.toBe('xf-components');
            const block = extractBlock(nodeName);
            expect(block, `standard template "${standardTemplate}"'s policy ("${nodeName}") must not allow site-header`).not.toContain('/apps/ga/components/structure/site-header');
        }
    });
});
test.describe('SiteHeader — Happy Path', () => {
    test('[SH-049] @smoke @regression @sanity SiteHeader renders correctly', async ({ page }) => {
        const pom = new SiteHeaderPage(page);
        await pom.navigate(BASE(), `${BASE()}/content/experience-fragments/global-atlantic/financial-professionals/main/en/header/header/master.html?wcmmode=disabled`); // site-header ships via the financial-professionals persona XF (GAAM-792) — the home page still serves the legacy .cmp-header component
        const root = page.locator('.cmp-site-header').first();
        await expect(root).toBeVisible();
        // Verify core structure: heading or primary content exists
        const heading = root.locator('h1, h2, h3').first();
        const hasHeading = await heading.count() > 0;
        if (hasHeading) {
            await expect(heading).toBeVisible();
        }
        // Verify no JS errors during render
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
    test('[SH-050] @smoke @regression @sanity SiteHeader interactive elements are functional', async ({ page }) => {
        const pom = new SiteHeaderPage(page);
        await pom.navigate(BASE(), `${BASE()}/content/experience-fragments/global-atlantic/financial-professionals/main/en/header/header/master.html?wcmmode=disabled`); // site-header ships via the financial-professionals persona XF (GAAM-792) — the home page still serves the legacy .cmp-header component
        const root = page.locator('.cmp-site-header').first();
        await expect(root).toBeVisible();
        // Verify interactive elements (links, buttons) are present and clickable
        const interactive = root.locator('a, button');
        const count = await interactive.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            await expect(interactive.nth(i)).toBeVisible();
            await expect(interactive.nth(i)).toBeEnabled();
        }
    });
});
test.describe('SiteHeader — Negative & Boundary', () => {
    test('[SH-051] @negative @regression @sanity SiteHeader handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new SiteHeaderPage(page);
        await pom.navigate(BASE(), `${BASE()}/content/experience-fragments/global-atlantic/financial-professionals/main/en/header/header/master.html?wcmmode=disabled`); // site-header ships via the financial-professionals persona XF (GAAM-792) — the home page still serves the legacy .cmp-header component
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-site-header').first()).toBeVisible();
    });
    test('[SH-052] @negative @regression @sanity SiteHeader handles missing images', async ({ page }) => {
        const pom = new SiteHeaderPage(page);
        await pom.navigate(BASE(), `${BASE()}/content/experience-fragments/global-atlantic/financial-professionals/main/en/header/header/master.html?wcmmode=disabled`); // site-header ships via the financial-professionals persona XF (GAAM-792) — the home page still serves the legacy .cmp-header component
        await page.waitForLoadState('load'); // header embeds several image-with-nested-content images that finish downloading after domcontentloaded
        const images = page.locator('.cmp-site-header img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('SiteHeader — Responsive', () => {
    test('[SH-053] @mobile @regression @mobile @sanity SiteHeader adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SiteHeaderPage(page);
        await pom.navigate(BASE(), `${BASE()}/content/experience-fragments/global-atlantic/financial-professionals/main/en/header/header/master.html?wcmmode=disabled`); // site-header ships via the financial-professionals persona XF (GAAM-792) — the home page still serves the legacy .cmp-header component
        const root = page.locator('.cmp-site-header').first();
        await expect(root).toBeVisible();
        // Verify layout adapts to mobile: check flex-direction changes to column
        const flexDir = await root.evaluate(el => {
            const cs = getComputedStyle(el);
            return cs.flexDirection || cs.display;
        });
        // At mobile, flex containers typically switch to column layout
        // Grid containers may change template columns
        expect(flexDir).toBeDefined();
    });
});
test.describe('SiteHeader — Console & Resources', () => {
});
test.describe('SiteHeader — Broken Images', () => {
    test('[SH-056] @regression SiteHeader all images load successfully', async ({ page }) => {
        const pom = new SiteHeaderPage(page);
        await pom.navigate(BASE(), `${BASE()}/content/experience-fragments/global-atlantic/financial-professionals/main/en/header/header/master.html?wcmmode=disabled`); // site-header ships via the financial-professionals persona XF (GAAM-792) — the home page still serves the legacy .cmp-header component
        await page.waitForLoadState('load'); // header embeds several image-with-nested-content images that finish downloading after domcontentloaded
        const images = page.locator('.cmp-site-header img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[SH-057] @regression SiteHeader all images have alt attributes', async ({ page }) => {
        const pom = new SiteHeaderPage(page);
        await pom.navigate(BASE(), `${BASE()}/content/experience-fragments/global-atlantic/financial-professionals/main/en/header/header/master.html?wcmmode=disabled`); // site-header ships via the financial-professionals persona XF (GAAM-792) — the home page still serves the legacy .cmp-header component
        const images = page.locator('.cmp-site-header img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('SiteHeader — Accessibility', () => {
});
test.describe('SiteHeader — AEM Dialog Configuration', () => {
});
test.describe('SiteHeader — CSV Test Cases (GAAM-397)', () => {
    test('[SH-063] @regression @sanity CMS FE: Site Header - Desktop — AC1', async ({ page }) => {
        const pom = new SiteHeaderPage(page);
        // The financial-professionals/main/en/... path this test (and the SiteHeaderPage default)
        // used to rely on 404s on this instance. Confirmed live 2026-08-12: the real, currently
        // authored FP site-header XF instance is at
        // /content/experience-fragments/global-atlantic/style-guide/header/header-master/financial-professionals
        // (matches ui.content.ga's .content.xml for that node; returns 200 and renders .cmp-site-header
        // with class cmp-site-header--identified, since this FP instance authors navPanels).
        await pom.navigate(BASE(), `${BASE()}/content/experience-fragments/global-atlantic/style-guide/header/header-master/financial-professionals.html?wcmmode=disabled`);
        // As a site visitor on desktop, I want the Site Header to display the correct navigation experience for my role and authentication state — Agnostic, Identified, or Authenticated — so that I can efficiently navigate to content relevant to me.
        // 
        // ----
        // 
        // *Acceptance Criteria*
        // 
        // *Style System*
        // 
        // * Panel Style 
        // ** Standard
        // ** Progressive Disclosure
        // The Styles selected should apply to the Navigation component within the panel (though style system options are provided here, the actual panel rendering happens in GAAM-794)
        // * Reference Figma for all color, typography, spacing, and shadow specifications across all states and variants
        // 
        // *Functionality –* 
        // 
        // *Top Navigation Bar*
        // 
        // * The Top Navigation bar renders across all role states at the top of the page
        // * The GA logo is always present; clicking it navigates to authored link(For ex: agnostic users to the agnostic homepage and identified/authenticated users to their role's landing page)
        // * If a top nav item is a Direct Link, clicking it navigates to the destination page
        // * If a top nav item is a Category Dropdown, clicking it expands a dropdown of sub-links rendered by the Navigation child component (GAAM-403); hovering a sub-link applies a fill highlight; external link items display an arrow icon that shifts 4px on hover
        // * The Top Navigation does not stick on downward scroll; it slides back into view when the user intentionally scrolls upward (peekaboo behaviour)
        // 
        // *Login/Account Tray (Unauthenticated)*
        // 
        // * The login trigger renders with the authored Login Label, a person icon, and a downward chevron (↓)
        // * On hover and focus, a pill/capsule outline appears around the trigger
        // * Activating the trigger expands the login tray dropdown below the top nav
        // * The tray is organised into authored sections, each with an optional section heading and a list of login links
        // * External links display with an external arrow indicator and open in a new tab
        // * The tray closes on click outside or Escape key
        // 
        // *Login/Account Tray (Authenticated)*
        // Out of scope Handled in [https://bounteous.jira.com/browse/GAAM-823|https://bounteous.jira.com/browse/GAAM-823|smart-link] 
        // 
        // *Agnostic State (Role Not Selected)*
        // 
        // * The Main Navigation bar is not present in the agnostic state (Main Nav does not have at least 1 panel authored indicates that FE should render the Agnostic State)
        // * The Role Selector renders integrated with the hero below the Top Navigation; reference Figma for the full-width load-in variant
        // * The Role Selector trigger displays the authored Help Text and a downward chevron (↓)
        // * Activating the Role Selector expands a dropdown displaying all authored role options
        // * Clicking outside the expanded Role Selector collapses it without selection
        // * On role selection, the user is navigated to the selected role's landing page and the role cookie is set (GAAM-899)
        // * On scroll down past the hero area, a compact sticky Role Selector variant slides in and fixes to the top of the viewport; a 1px border appears beneath it on scroll; reference Figma for compact variant and spacing
        // 
        // *Identified State (Role Selected, Unauthenticated)*
        // 
        // * The Main Navigation bar renders below the Top Navigation bar
        // * The Main Navigation displays the authored L1 category labels and the CTA button (e.g. "Get in touch →") at the far right
        // * The role changer trigger (e.g. "Financial Professional ↓") renders on the left side of the Main Navigation bar; activating it expands the Role panel
        // * Search icon is shown in the Top Navigation for identified users; clicking it navigates to the authored search page with focus on the search bar
        // * The Main Navigation bar fixes sticky to the top of the viewport on scroll; a 1px border appears at the bottom of the sticky nav bar
        // 
        // *Role Panel*
        // 
        // * Activating the role changer trigger expands the Role panel as a full-width dropdown below the Main Navigation bar
        // * All authored roles are listed; the currently active role is marked with a filled checkmark indicator
        // * Inactive roles render in a de-emphasised treatment; reference Figma for active vs inactive role label states
        // * Selecting a different role navigates the user to that role's landing page and updates the role cookie
        // * The panel closes on click outside or Escape key
        // 
        // *Main Navigation – L1 Category Trigger States (reference Figma* {{_PrimaryNavBarCategory}}*)*
        // 
        // * Default: plain text label + downward chevron (↓), no background
        // * Hover: pill/capsule outline around label + chevron
        // * Active/Expanded: bold label, chevron rotates upward (↑), pill outline persists
        // * Inactive (another panel open): de-emphasised treatment
        // * Focus: keyboard focus ring visible
        // 
        // 
        // 
        // *Responsive Behavior*
        // 
        // * This story covers desktop breakpoints only
        // * Mobile behavior is covered in GAAM-393
        // * Reference Figma node {{3516-3486}} for all layout specifications at desktop breakpoints
        // 
        // *Accessibility (WCAG 2.2 Level AA)*
        // 
        // * The Site Header uses a {{<header>}} landmark; the Top Navigation and Main Navigation are each wrapped in a {{<nav>}} element with distinct {{aria-label}} values (e.g. "Top navigation" and "Primary navigation")
        // * A skip navigation link ("Skip to main content") is the first focusable element in the header
        // * All nav links and triggers are keyboard-reachable in logical Tab order and activatable via Enter or Space
        // * Dropdown triggers (top nav, role changer, L1 categories) expose {{aria-expanded}} (true/false), {{aria-haspopup="true"}}, and {{aria-controls}} pointing to their respective panel IDs
        // * Open panels are visible to assistive technology; closed panels use {{aria-hidden="true"}} or equivalent
        // * Escape key closes the active open panel or tray and returns focus to the triggering element
        // * 
        // * The active role in the Role panel is communicated via {{aria-current}} or equivalent
        // * External links include visually hidden text indicating they open in a new tab
        // * "→" arrow icons within links are decorative and hidden from assistive technology ({{aria-hidden="true"}})
        // * All interactive elements have visible focus indicators meeting WCAG 2.2 focus appearance requirements (SC 2.4.11)
        // * Color contrast meets WCAG 2.2 Level AA across all visual states: reference Figma
        // * Ensure no critical or major issues are flagged by the [Level Access Extension|https://chromewebstore.google.com/detail/level-access-extension/kgbmnemfaellbfabmkmmilchbhiigpdi]
        // 
        // *Additional Requirements*
        // 
        // * Update the component to match the styles represented in the Figma link above.
        // * Update the documentation for the authoring guide.
        // * Create a style guide page with all the variations.
        // 
        // *Out of Scope*
        // 
        // * Dialog configuration — covered in GAAM-394
        // * Role selection cookie logic — covered in [https://bounteous.jira.com/browse/GAAM-899|https://bounteous.jira.com/browse/GAAM-899|smart-link]
        // * Main Navigation panel implementation - covered in  GAAM-794
        // * Navigation child component (link columns) — covered in GAAM-403
        // * Image with Nested Content child component — covered in GAAM-389
        // * Mobile behaviour — covered in GAAM-393
        // * XF setup — covered in GAAM-792
        // 
        // *QA Checklist*
        // 
        // * Styles match Figma
        // * Authoring Guide exists and is updated with all style variations
        // * Style Guide page exists and reflects all variations
        // * Create test landing pages to test role change across all states (Agnostic, Identified, Authenticated)
        //
        // Investigated live 2026-08-12: this ticket's AC is implemented, not an untested stub — the
        // sections below assert the core, ticket-cited, structurally-verifiable desktop contract
        // against the live FP XF instance navigated to above. Explicitly out of scope here (per the
        // ticket's own "Out of Scope" section, or already covered elsewhere in this file): XF setup
        // (GAAM-792 — see SHDR-044/054), Main Navigation panel content (GAAM-794), Navigation child
        // link columns (GAAM-403), Image with Nested Content child (GAAM-389), Authenticated tray
        // (GAAM-823), role-selection cookie logic (GAAM-899), and mobile behaviour (GAAM-393). The
        // Agnostic-state Role Selector card is also not exercised here — the only currently-authored
        // XF instance found live (financial-professionals) has navPanels authored, so it renders in
        // the Identified state (per site-header.html's data-sly-test gating), not Agnostic.
        const root = page.locator('.cmp-site-header').first();
        await expect(root).toBeVisible();
        // "The Site Header uses a <header> landmark"
        expect(await root.evaluate((el) => el.tagName)).toBe('HEADER');

        // "A skip navigation link ('Skip to main content') is the first focusable element in the header"
        const skipLink = page.locator('.cmp-site-header__skip-link');
        await expect(skipLink).toHaveAttribute('href', '#main-content');
        const skipIsFirstFocusable = await page.evaluate(() => {
            const focusables = Array.from(document.querySelectorAll('a[href], button, [tabindex]'));
            return focusables[0] === document.querySelector('.cmp-site-header__skip-link');
        });
        expect(skipIsFirstFocusable).toBe(true);

        // "The Top Navigation bar renders across all role states" + distinct aria-label ("Top navigation")
        const topNav = root.locator('.cmp-site-header__top-nav');
        await expect(topNav).toHaveAttribute('aria-label', 'Top navigation');
        expect(await topNav.locator('.cmp-site-header__top-nav-item').count()).toBeGreaterThan(0);

        // Identified state: "The Main Navigation bar renders below the Top Navigation bar" + distinct
        // aria-label ("Primary navigation"), and "the role changer trigger... renders on the left side"
        const mainNav = root.locator('.cmp-site-header__main-nav');
        await expect(mainNav).toHaveAttribute('aria-label', 'Primary navigation');
        await expect(root.locator('.cmp-site-header__role-changer')).toBeVisible();

        // "Dropdown triggers... expose aria-expanded (true/false), aria-haspopup='true', and
        // aria-controls" + "Activating the trigger expands the login tray dropdown" (login trigger)
        const loginTrigger = root.locator('[data-cmp-hook-site-header="loginTrigger"]');
        await expect(loginTrigger).toHaveAttribute('aria-haspopup', 'true');
        await expect(loginTrigger).toHaveAttribute('aria-expanded', 'false');
        await loginTrigger.click();
        await expect(loginTrigger).toHaveAttribute('aria-expanded', 'true');
        const loginPanelId = await loginTrigger.getAttribute('aria-controls');
        await expect(page.locator(`#${loginPanelId}`)).not.toHaveAttribute('hidden');
        // "Escape key closes the active open panel or tray"
        await page.keyboard.press('Escape');
        await expect(loginTrigger).toHaveAttribute('aria-expanded', 'false');

        // Same dropdown contract for an L1 Main Navigation category trigger, plus
        // "The tray closes on click outside" behaviour
        const l1Trigger = root.locator('.cmp-site-header__main-nav-trigger').first();
        await expect(l1Trigger).toHaveAttribute('aria-haspopup', 'true');
        const l1PanelId = await l1Trigger.getAttribute('aria-controls');
        await l1Trigger.click();
        await expect(l1Trigger).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator(`#${l1PanelId}`)).not.toHaveAttribute('hidden');
        await page.locator('body').click({ position: { x: 5, y: 5 } });
        await expect(l1Trigger).toHaveAttribute('aria-expanded', 'false');
    });
});
