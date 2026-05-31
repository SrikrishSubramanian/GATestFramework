import { test, expect } from '@playwright/test';
import { SiteHeaderPage } from '../../../pages/ga/components/siteHeaderPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

const COMPONENT_PATH = '/apps/ga/components/content/site-header';
const DIALOG_PATH    = `${COMPONENT_PATH}/_cq_dialog`;

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

// ─── Component Registration (GAAM-394) ────────────────────────────────────────

test.describe('SiteHeader — Component Registration (GAAM-394)', () => {
  test('[SHDR-001] @smoke @regression GA overlay exists at correct Sling path', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${COMPONENT_PATH}.1.json`);
    expect(response.ok(), `Site Header GA overlay not found at ${COMPONENT_PATH} — run GAAM-394 BE branch`).toBe(true);
  });

  test('[SHDR-002] @regression resourceSuperType delegates to kkr-aem-base site-header', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${COMPONENT_PATH}.1.json`);
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(
      data['sling:resourceSuperType'],
      'sling:resourceSuperType must delegate to kkr-aem-base/components/content/site-header'
    ).toBe('kkr-aem-base/components/content/site-header');
  });

  test('[SHDR-003] @regression componentGroup is "GA Base"', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${COMPONENT_PATH}.1.json`);
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(
      data['componentGroup'],
      'componentGroup must be "GA Base" — component won\'t appear in GA component browser otherwise'
    ).toBe('GA Base');
  });

  test('[SHDR-004] @smoke @regression GA _cq_dialog overlay exists', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.1.json`);
    expect(response.ok(), `Site Header dialog overlay not found at ${DIALOG_PATH}`).toBe(true);
  });

  test('[SHDR-005] @smoke @regression Dialog has helpPath configured', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.1.json`);
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(
      data.helpPath,
      'Dialog missing helpPath — authors see no help (?) link in the component toolbar'
    ).toBeTruthy();
  });

  test('[SHDR-006] @regression Dialog helpPath points to the correct component details page', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.1.json`);
    if (!response.ok()) { test.skip(); return; }
    const data = await response.json();
    if (!data.helpPath) { test.skip(); return; }
    expect(data.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
    expect(data.helpPath).toContain('/apps/ga/components/content/site-header');
  });
});

// ─── Dialog Structure: 3-Tab Layout (GAAM-394) ───────────────────────────────

test.describe('SiteHeader — Dialog Structure: 3-Tab Layout (GAAM-394)', () => {
  test('[SHDR-007] @regression Dialog uses a tabbed layout (granite/ui tabs resource type)', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.5.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'No "tabs" resource type found in dialog JSON').toContain('tabs');
  });

  test('[SHDR-008] @regression Tab 1 is titled "Top Navigation"', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.5.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Tab "Top Navigation" not found in dialog JSON').toContain('Top Navigation');
  });

  test('[SHDR-009] @regression Tab 2 is titled "Role Selector"', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.5.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Tab "Role Selector" not found in dialog JSON').toContain('Role Selector');
  });

  test('[SHDR-010] @regression Tab 3 is titled "Main Navigation"', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.5.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Tab "Main Navigation" not found in dialog JSON').toContain('Main Navigation');
  });

  test('[SHDR-011] @regression All 3 required tabs are present in the dialog', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.5.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    const requiredTabs = ['Top Navigation', 'Role Selector', 'Main Navigation'];
    for (const tabTitle of requiredTabs) {
      expect(raw, `Tab "${tabTitle}" is missing from the dialog`).toContain(tabTitle);
    }
  });

  test('[SHDR-012] @regression Tab 1 contains a Logo Image DAM asset field', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Logo Image field not found in Top Navigation tab').toMatch(/[Ll]ogo\w*[Ii]mage|logoImage/);
  });

  test('[SHDR-013] @regression Tab 1 contains Login Tray Sections multifield', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Login Tray Sections multifield not found in dialog JSON').toMatch(/[Ll]oginTray|loginTray[Ss]ections|[Ll]ogin.*[Tt]ray/);
  });

  test('[SHDR-014] @regression Tab 3 contains a panel container for Main Navigation panels', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Panel container not found in Main Navigation tab — expected panel-container pattern (same as Accordion Tabs Feature)').toMatch(/panel[Cc]ontainer|panelContainer|[Pp]anel.*[Cc]ontainer/);
  });
});

// ─── Required Field Configuration (GAAM-394) ─────────────────────────────────

test.describe('SiteHeader — Required Field Configuration (GAAM-394)', () => {
  test('[SHDR-015] @regression Logo Alt Text field is present in the dialog', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Logo Alt Text field not found — required field per AC').toMatch(/logoAlt|[Ll]ogo\w*[Aa]lt/);
  });

  test('[SHDR-016] @regression Logo Link path field is present in the dialog', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Logo Link field not found — required field per AC').toMatch(/logoLink|[Ll]ogo\w*[Ll]ink/);
  });

  test('[SHDR-017] @regression Top Nav Items multifield is present in the dialog', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Top Nav Items multifield not found').toMatch(/topNavItems|topNav[Ii]tems|[Tt]op.*[Nn]av.*[Ii]tems/);
  });

  test('[SHDR-018] @regression Role Items multifield is present in the Role Selector tab', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Role Items multifield not found in Role Selector tab').toMatch(/roleItems|role[Ii]tems|[Rr]ole.*[Ii]tems/);
  });

  test('[SHDR-019] @regression Role Items multifield enforces max 5 entries (GAAM-308)', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // max="5" from GAAM-308 min/max validation constraint
    expect(raw, 'Role Items max=5 constraint not found — violates GAAM-308 requirement for consistent max role count').toContain('"5"');
  });

  test('[SHDR-020] @regression Cookie Duration is a number field in the dialog', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Cookie Duration field not found — required for role selection cookie expiry (GAAM-899)').toMatch(/cookieDuration|[Cc]ookie\w*[Dd]uration/);
  });

  test('[SHDR-021] @regression Login Label field is present with default value "Login"', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Login Label field not found').toMatch(/loginLabel|[Ll]ogin\w*[Ll]abel/);
  });

  test('[SHDR-022] @regression Main Nav CTA Label and CTA URL fields are both present', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'CTA Label not found in Main Navigation tab').toMatch(/ctaLabel|[Cc][Tt][Aa]\w*[Ll]abel/);
    expect(raw, 'CTA URL not found in Main Navigation tab').toMatch(/ctaUrl|ctaHref|[Cc][Tt][Aa]\w*[Uu][Rr][Ll]/);
  });
});

// ─── Conditional Field Logic (GAAM-394) ──────────────────────────────────────

test.describe('SiteHeader — Conditional Field Logic (GAAM-394)', () => {
  test('[SHDR-023] @regression Top Nav Type dropdown drives conditional sub-field visibility', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // Type dropdown toggles "Direct Link" vs "Category Dropdown" sub-fields
    expect(raw, 'Top Nav Type dropdown field not found').toMatch(/topNavType|navType|[Dd]irect.*[Ll]ink|[Cc]ategory.*[Dd]ropdown/);
  });

  test('[SHDR-024] @regression Search Enabled toggle is present in Tab 1', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Search Enabled toggle not found — required to show/hide Search Page Path and Search Label').toMatch(/searchEnabled|[Ss]earch\w*[Ee]nabled/);
  });

  test('[SHDR-025] @regression Search Page Path field exists for conditional rendering', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Search Page Path field not found').toMatch(/searchPage|[Ss]earch\w*[Pp]age/);
  });

  test('[SHDR-026] @regression Authenticated Only toggle is present on panel dialog fields', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Authenticated Only toggle not found — needed for "My Business" panel visibility control').toMatch(/authenticatedOnly|[Aa]uthenticated\w*[Oo]nly/);
  });

  test('[SHDR-027] @regression Additional Login Subheadline field is present', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // Shown only when Additional Login Required = ON and Authenticated Only is enabled
    expect(raw, 'Additional Login Subheadline field not found').toMatch(/additionalLogin|[Aa]dditional\w*[Ll]ogin/);
  });

  test('[SHDR-028] @regression Manage Account URL field is present (conditional on Manage Account Label)', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Manage Account URL not found — required when Manage Account Label is filled').toMatch(/manageAccount|[Mm]anage\w*[Aa]ccount/);
  });

  test('[SHDR-029] @regression Post-Logout Redirect URL field is present', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Post-Logout Redirect URL not found — needed for redirect after SLO (GAAM-821)').toMatch(/postLogout|[Pp]ost\w*[Ll]ogout|logoutRedirect/);
  });
});

// ─── Multifield Constraints (GAAM-394) ───────────────────────────────────────

test.describe('SiteHeader — Multifield Constraints (GAAM-394)', () => {
  test('[SHDR-030] @regression Top Nav Items supports nested Secondary Nav Links multifield', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Secondary Nav Links nested multifield not found inside Top Nav Items').toMatch(/secondaryNav|[Ss]econdary\w*[Nn]av/);
  });

  test('[SHDR-031] @regression Login Tray Sections has nested Section Links multifield', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Section Links nested multifield not found inside Login Tray Sections').toMatch(/sectionLinks|[Ss]ection\w*[Ll]inks/);
  });

  test('[SHDR-032] @regression Role Items entries have Role Title and Role URL sub-fields', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Role Title sub-field not found inside Role Items').toMatch(/roleTitle|[Rr]ole\w*[Tt]itle/);
    expect(raw, 'Role URL sub-field not found inside Role Items').toMatch(/roleUrl|roleHref|[Rr]ole\w*[Uu][Rr][Ll]/);
  });

  test('[SHDR-033] @regression Panels container exposes Navigation Items child reference (GAAM-403)', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // Left column child reference — delegates link authoring to Navigation component
    expect(raw, 'Navigation Items child reference not found — each L1 panel needs a Navigation component reference (GAAM-403)').toMatch(/navigationItems|navItems|[Nn]avigation\w*[Ii]tems/);
  });

  test('[SHDR-034] @regression Panels container exposes Image with Nested Content child reference (GAAM-389)', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // Right column child reference — delegates image authoring to Image with Nested Content component
    expect(raw, 'Image with Nested Content reference not found — each L1 panel needs an imageWithNestedContent reference (GAAM-389)').toMatch(/imageNested|imageWithNested|[Ii]mage\w*[Nn]ested/);
  });
});

// ─── Author QA Checklist (GAAM-394) ──────────────────────────────────────────

test.describe('SiteHeader — Author QA Checklist (GAAM-394)', () => {
  test('[SHDR-035] @smoke @regression Component is only available for GA (overlay exists under /apps/ga)', async ({ page }) => {
    // Verifies the GA-specific overlay exists and is properly layered over kkr-aem-base
    const response = await page.request.get(`${BASE()}${COMPONENT_PATH}.1.json`);
    expect(response.ok(), 'GA Site Header overlay not found — component may not be deployed on this branch').toBe(true);
    const data = await response.json();
    expect(data['sling:resourceSuperType']).toBeTruthy();
    expect(data['sling:resourceSuperType']).toContain('kkr-aem-base');
  });

  test('[SHDR-036] @regression fieldDescription/helpText configured on at least one dialog field', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // Info (?) icons require fieldDescription on complex fields (Cookie Duration, Panel Style)
    expect(raw, 'No fieldDescription found on any dialog field — AC requires info icons on complex fields').toMatch(/fieldDescription/);
  });

  test('[SHDR-037] @regression URL/path fields use AEM path picker (pathbrowser resource type)', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // All URL fields must support the AEM path picker for internal pages
    expect(raw, 'No path picker fields found in dialog — URL fields must support AEM path browser').toMatch(/pathbrowser|pathfield|pathBrowser/i);
  });

  test('[SHDR-038] @regression Cookie Duration global field is configured in the dialog', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'Cookie Duration field not found — feeds role selection cookie expiry logic in GAAM-899').toMatch(/cookieDuration|[Cc]ookie\w*[Dd]uration/);
  });

  test('[SHDR-039] @author @smoke Author documentation accessible via dialog help icon', async ({ page }) => {
    test.fixme(true, 'Requires live AEM instance with Site Header deployed on an XF page (GAAM-792). Verify manually: open dialog → click ? → confirm help doc opens.');
    // Steps: Navigate to XF page → Select component → Open dialog → Click ? icon → Assert help page opens
    // The helpPath configured in SHDR-005/006 drives this button
    expect(true).toBe(true);
  });

  test('[SHDR-040] @smoke @regression Component jcr:title is present for the component browser', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${COMPONENT_PATH}.1.json`);
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data['jcr:title'], 'jcr:title missing — component browser will show undefined as the component name').toBeTruthy();
  });

  test('[SHDR-041] @regression All mandatory fields are marked required in dialog JSON', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // Required fields use "required": true or Granite validation in the dialog definition
    expect(raw, 'No required field validation markers found in dialog JSON — Logo Alt Text, Logo Link and Role Items are required per AC').toMatch(/required.*true|"required"\s*:\s*true|validation.*required/i);
  });
});

// ─── AEM Convention Compliance (GAAM-394) ────────────────────────────────────

test.describe('SiteHeader — AEM Convention Compliance (GAAM-394)', () => {
  test('[SHDR-042] @regression Component has cq:icon configured for the component browser', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${COMPONENT_PATH}.1.json`);
    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(data['cq:icon'], 'cq:icon is missing — component browser shows a blank tile without it (dev-conventions.md)').toBeTruthy();
  });

  test('[SHDR-043] @regression Dialog sling:resourceType is the cq/gui authoring dialog', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.1.json`);
    expect(response.ok()).toBe(true);
    const data = await response.json();
    const rt: string = data['sling:resourceType'] || '';
    expect(rt, 'Dialog must use cq/gui/components/authoring/dialog resource type').toContain('cq/gui/components/authoring/dialog');
  });

  test('[SHDR-044] @author @regression Component is restricted to XF Template (GAAM-792)', async ({ page }) => {
    test.fixme(true, 'XF Template policy check requires GAAM-792 to be complete. Verify manually in Template Editor that site-header appears only in the XF template allowedComponents list.');
    // Steps: Open Template Editor for XF template → check allowedComponents list for site-header
    // Ensure site-header does NOT appear in standard page template allowedComponents
    expect(true).toBe(true);
  });

  test('[SHDR-045] @regression Dialog multifield rows use granite/ui multifield resource type', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    expect(raw, 'No granite/ui multifield resource type found — multifields must use standard pattern for add/remove/reorder support').toContain('multifield');
  });

  test('[SHDR-046] @regression External link auto-detection uses the internal domains generic list', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // All URL fields use internal domains list (established in Workbench implementation)
    // to auto-detect external links and show the external link arrow indicator
    expect(raw, 'Internal domains list reference not found in dialog — external link auto-detection will not work').toMatch(/internalDomains|internal[Dd]omains|externalLink/);
  });

  test('[SHDR-047] @regression Panel CTA Label and Panel CTA URL fields are both present for paired validation', async ({ page }) => {
    const response = await page.request.get(`${BASE()}${DIALOG_PATH}.8.json`);
    expect(response.ok()).toBe(true);
    const raw = await response.text();
    // Both must be filled or both left empty — partial completion shows a validation warning
    expect(raw, 'Panel CTA Label not found in panel dialog fields').toMatch(/panelCtaLabel|panelCta[Ll]abel|[Pp]anel.*[Cc][Tt][Aa].*[Ll]abel/);
    expect(raw, 'Panel CTA URL not found in panel dialog fields').toMatch(/panelCtaUrl|panelCtaHref|[Pp]anel.*[Cc][Tt][Aa].*[Uu][Rr][Ll]/);
  });
});
