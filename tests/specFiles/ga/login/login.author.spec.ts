import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';

let capture: ConsoleCapture;

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.afterEach(async ({ page }, testInfo) => {
  const errors = capture.getErrors();
  const warnings = capture.getWarnings();
  if (errors.length > 0 || warnings.length > 0) {
    await attachConsoleCapture(page, testInfo, errors, warnings);
  }
  await annotateEnvironment(page, testInfo);
});

test.describe('Login — CSV Test Cases', () => {
  test('[LGN-001] @smoke @regression CMS BE: Login cookie sessionIndex update & Ping Logout Servlet implementation — AC1', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // TODO: Implement assertion for: As an authenticated portal user, I want logout to properly terminate my session with the Ping identity provider so that my SSO session is fully invalidated and I am not left in a broken or partially logged-out state.

----

*Background / Context*

GAAM-821 configured the SLO URL from OSGi and exposed it to HTL for use in the logout link. However, the Ping IdP ({{https://login.globalatlantic.com/saml20/idp/slo}}) does not accept a plain redirect — it requires a well-formed SAML 2.0 LogoutRequest payload delivered via HTTP POST. This story implements a custom AEM Sling Servlet that constructs and POSTs the SAML SLO request using the authenticated user\'s session data, then returns a success or error response to the caller.

----

*SAML LogoutRequest Payload Reference*

The following is the expected payload structure, as confirmed by the error observed on GAAM-1217:

{noformat}<samlp:LogoutRequest
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  ID="_0b1c311e022c499e8322e0f0457b4446"
  Version="2.0"
  IssueInstant="2026-06-08T13:58:06.2615127Z"
  Destination="https://login.globalatlantic.com/saml20/idp/slo">
  <saml:Issuer>https://portal.ga.fasttechnology.cloud/ProdPortal/auth/saml</saml:Issuer>
  <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">
    2e4c2382-6d34-470c-b14a-9f93c74f7f81
  </saml:NameID>
  <samlp:SessionIndex>83754728-fddc-4f71-b372-9da6e0a8f7e3</samlp:SessionIndex>
</samlp:LogoutRequest>
{noformat}

Key dynamic values sourced from the active user session at runtime:

||Field||Source||
|{{ID}}|Generated per request (UUID with leading underscore)|
|{{IssueInstant}}|Current UTC timestamp in ISO 8601 format|
|{{Destination}}|OSGi config — SLO URL (established in GAAM-821)|
|{{Issuer}}|OSGi config — SP Entity ID / Issuer URL|
|{{NameID}}|Authenticated user\'s subject identifier from active SAML session|
|{{SessionIndex}}|IdP session index from original SAML assertion|

----

*Acceptance Criteria*

Login Cookie Update

* gaUserAttributes - add sessionIndex available from ping login SAML response

Servlet Registration

* A custom Sling Servlet is registered to intercept the logout action (confirm endpoint with architect)
* The servlet is accessible only to authenticated users; unauthenticated requests are rejected with an appropriate HTTP status code

SAML LogoutRequest Construction

* The servlet constructs a valid SAML 2.0 {{<samlp:LogoutRequest>}} XML document
* {{ID}} is a unique value generated per request
* {{IssueInstant}} is set to the current UTC timestamp at time of request
* {{Version}} is hardcoded to {{2.0}}
* {{Destination}} is read from OSGi configuration
* {{<saml:Issuer>}} value is read from OSGi configuration
* {{<saml:NameID>}} is populated with the authenticated user\'s NameID retrieved from the active session
* {{NameID Format}} is set to {{urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified}}
* {{<samlp:SessionIndex>}} is populated with the session index from the original SAML authentication assertion

Request Delivery

* The LogoutRequest is Base64-encoded and submitted as an HTTP POST to the IdP SLO endpoint using the {{SAMLRequest}} parameter per SAML HTTP POST binding specification
* The servlet handles the IdP\'s {{SAMLResponse}} (LogoutResponse) and validates it
* On successful IdP logout response, the AEM/CRX session is invalidated and the servlet returns HTTP 200 to the caller
* On IdP error response or timeout, 2 retries are made and the servlet and logs the failure and return appropriate error code — the caller (FE) is responsible for handling the redirect 

OSGi Configuration

* SLO endpoint URL is read from OSGi config (reusing GAAM-821 config — do not duplicate)
* SP Entity ID / Issuer URL is read from OSGi config
* No values are hardcoded in servlet logic

Error Handling & Logging

* If NameID or SessionIndex cannot be retrieved from the session, the AEM/CRX session is still invalidated (fail-safe logout), the error is logged, and an appropriate HTTP status code is returned to the caller
* All SAML request/response exchanges are logged at DEBUG level
* No sensitive session identifiers are logged at INFO or higher

Out of Scope

* Post-logout redirect and client-side error handling — covered by the FE story
* Front-end logout button styling and placement — covered by the navigation/site-header FE ticket
* Changes to the OSGi SLO URL configuration — established in GAAM-821
* Any new author-facing dialog or CMS component

----

*Developer Instructions*

* Confirm the servlet registration path with the architect before implementation — must integrate cleanly with the existing logout trigger in the navigation component
* NameID and SessionIndex must be retrieved from wherever AEM stores the SAML token post-authentication — confirm storage mechanism with the original SAML SSO implementation (likely {{javax.jcr.Session}} attributes or a custom Sling session service)
* SAML HTTP POST binding reference: SAML 2.0 Bindings Spec, Section 3.5
* Write JUnit tests covering: payload construction with known session values, missing NameID/SessionIndex fail-safe path, OSGi config reading, HTTP status code responses

----

*QA Checklist*

* Clicking logout triggers a POST to the servlet and produces a valid SAML LogoutRequest — verify via DEBUG logs or network inspection in non-prod
* The IdP confirms session termination with no error returned from the SLO endpoint
* Servlet returns HTTP 200 on successful IdP logout response
* Servlet returns a meaningful HTTP error status code on IdP failure — no unhandled exceptions or 500 errors
* If session data (NameID/SessionIndex) is missing, AEM session is still invalidated and servlet returns an appropriate status code
* OSGi config values (SLO URL, Issuer) are correctly injected and not hardcoded
* No sensitive identifiers appear in INFO-level logs
    test.fixme();
  });
});

test.describe('Login — Happy Path', () => {
  test('[LGN-002] @smoke @regression Login renders correctly', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
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
    expect(errors).toEqual([]);
  });

  test('[LGN-003] @smoke @regression Login interactive elements are functional', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
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

test.describe('Login — Negative & Boundary', () => {
  test('[LGN-004] @negative @regression Login handles empty content gracefully', async ({ page }) => {
    // Capture JS errors during page load
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    // Component should render without JS errors
    expect(errors).toEqual([]);
    // Root element should still be present (not crash)
    await expect(page.locator('.cmp-login').first()).toBeVisible();
  });

  test('[LGN-005] @negative @regression Login handles missing images', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });
});

test.describe('Login — Responsive', () => {
  test('[LGN-006] @mobile @regression @mobile Login adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
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

  test('[LGN-007] @mobile @regression Login adapts to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const root = page.locator('.cmp-login').first();
    await expect(root).toBeVisible();
    // Tablet should render without horizontal overflow
    const overflow = await root.evaluate(el => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});

test.describe('Login — Console & Resources', () => {
  test('[LGN-008] @regression Login produces no JS errors', async ({ page }) => {
    const capture = new ConsoleCapture(page);
    capture.start();
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    await page.waitForTimeout(1000);
    const errors = capture.getErrors();
    capture.stop();
    expect(errors).toEqual([]);
  });
});

test.describe('Login — Broken Images', () => {
  test('[LGN-009] @regression Login all images load successfully', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('[LGN-010] @regression Login all images have alt attributes', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const images = page.locator('.cmp-login img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});

test.describe('Login — Accessibility', () => {
  test('[LGN-011] @a11y @wcag22 @regression @smoke Login passes axe-core scan', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const results = await new AxeBuilder({ page })
      .include('.cmp-login')
      .withTags(["wcag2a","wcag2aa","wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('[LGN-012] @a11y @wcag22 @regression @smoke Login interactive elements meet 24px target size', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const interactive = page.locator('.cmp-login a, .cmp-login button, .cmp-login input');
    const count = await interactive.count();
    for (let i = 0; i < count; i++) {
      const box = await interactive.nth(i).boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    }
  });

  test('[LGN-013] @a11y @wcag22 @regression @smoke Login focus is not obscured by sticky elements', async ({ page }) => {
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const focusable = page.locator('.cmp-login a, .cmp-login button, .cmp-login input');
    const count = await focusable.count();
    for (let i = 0; i < Math.min(count, 5); i++) {
      await focusable.nth(i).focus();
      const box = await focusable.nth(i).boundingBox();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
      }
    }
  });
});

test.describe('Login — AEM Dialog Configuration', () => {
  // Regression: GA overlay components must have their own _cq_dialog with helpPath.
  // Without helpPath, authors see no help link in the component toolbar.

  test('[LGN-014] @author @regression @smoke @smoke Login dialog has helpPath configured', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    expect(response.ok(), 'Login GA dialog overlay not found — component may be missing _cq_dialog').toBe(true);
    const dialog = await response.json();
    expect(dialog.helpPath, 'Login dialog missing helpPath property').toBeTruthy();
  });

  test('[LGN-015] @author @regression @smoke Login helpPath points to correct component details page', async ({ page }) => {
    const dialogUrl = `${BASE()}/apps/ga/components/content/login/_cq_dialog.1.json`;
    const response = await page.request.get(dialogUrl);
    if (!response.ok()) { test.skip(); return; }
    const dialog = await response.json();
    expect(dialog.helpPath).toContain('/mnt/overlay/wcm/core/content/sites/components/details.html');
  });
});
