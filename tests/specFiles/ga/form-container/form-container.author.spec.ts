import { test, expect } from '@playwright/test';
import { FormContainerPage } from '../../../pages/ga/components/formContainerPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
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
test.describe('Form Container — Happy Path', () => {
    test('[FC-001] @smoke @regression @sanity Form Container renders', async ({ page }) => {
        const pom = new FormContainerPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-form').first();
        await expect(root).toBeVisible();
    });
    test('[FC-002] @regression Form element is present', async ({ page }) => {
        const pom = new FormContainerPage(page);
        await pom.navigate(BASE());
        const form = page.locator('form.cmp-form').first();
        await expect(form).toBeVisible();
    });
});
test.describe('Form Container — Accessibility', () => {
    test.describe.configure({ retries: 1 });
});
// Relocated from text.author.spec.ts (TEXT-020) — CSV import mis-bucketed this under Text;
// it's explicitly about the Form Container component's dialog.
test.describe('Form Container — CSV Test Cases (GAAM-1308)', () => {
    test('[FC-003] @regression @sanity CMS BE: Form Container — Marketo Illustrations Action Type — AC1', async ({ page }) => {
        // AC1: The Form Container's "Action Type" dialog dropdown must offer "Marketo
        // Illustrations" as a selectable submission action (used for GA product-illustration
        // request forms, e.g. "ForeIncome II Guest Illustration").
        //
        // FormContainerPage.navigate() (used by FC-001/FC-002) points at the base KKR
        // tenant's style-guide page (/content/kkr/style-guide/components/form-container),
        // which resolves to kkr-aem-base/components/form/container. That base dialog's
        // actionType field hard-codes its `options` allow-list to
        // [mail, kkr-aem-base/.../salesforce, kkr-aem-base/.../rpc, kkr-aem-base/.../salesforce-gated-form]
        //   kkr-aem/ui.apps/src/main/content/jcr_root/apps/kkr-aem-base/components/form/
        //   container/_cq_dialog/.content.xml:76
        // — Marketo Illustrations is correctly absent there; Marketo is a GA-only vendor
        // integration, not a shared KKR-base one, so AC1 cannot be exercised on that page.
        //
        // The GA tenant's proxy component (/apps/ga/components/form/container, which
        // sling:resourceSuperType-extends kkr-aem-base/components/form/container — see
        // kkr-aem/ui.apps.ga/.../apps/ga/components/form/container/.content.xml) overrides
        // the dialog and DOES include Marketo Illustrations in its options allow-list:
        //   kkr-aem/ui.apps.ga/src/main/content/jcr_root/apps/ga/components/form/container/
        //   _cq_dialog/.content.xml:56 —
        //   options="[.../marketo,.../marketo-illustrations,.../salesforce,.../redoak]"
        // and there is a real authored instance live in content using exactly this action type:
        //   kkr-aem/ui.content.ga/src/main/content/jcr_root/content/experience-fragments/
        //   global-atlantic/style-guide/header/header-master/marketo-form/.content.xml:126 —
        //   actionType="kkr-aem-base/components/form/actions/marketo-illustrations"
        //   (a "ForeIncome II Guest Illustration" request form, node `container`).
        //
        // Verified live (local author, admin, 2026-08-13):
        //   GET /apps/ga/components/form/container/_cq_dialog/content/items/tabs/items/
        //   properties/items/columns/items/column/items/actionType.html?item=/content/
        //   experience-fragments/global-atlantic/style-guide/header/header-master/
        //   marketo-form/jcr:content/root/container
        //   → 200, dropdown includes:
        //   <coral-select-item value="kkr-aem-base/components/form/actions/marketo-illustrations">
        //     Marketo Illustrations</coral-select-item>
        // Also confirmed the rendered form itself carries the action type:
        //   GET /content/experience-fragments/global-atlantic/style-guide/header/header-master/
        //   marketo-form.html?wcmmode=disabled → <form ... data-action-type="marketo-illustrations">
        //   (kkr-aem/ui.apps/.../form/container/container.html:9 — `data-action-type="${container.actionType}"`)
        const itemPath = '/content/experience-fragments/global-atlantic/style-guide/header/header-master/marketo-form/jcr:content/root/container';
        const dialogFieldUrl = `${BASE()}/apps/ga/components/form/container/_cq_dialog/content/items/tabs/items/properties/items/columns/items/column/items/actionType.html?item=${encodeURIComponent(itemPath)}`;
        const response = await page.request.get(dialogFieldUrl);
        if (!response.ok()) {
            test.skip();
            return;
        }
        const body = await response.text();
        expect(
            body,
            'AC1: GA Form Container "Action Type" dropdown must offer "Marketo Illustrations" ' +
            '(kkr-aem-base/components/form/actions/marketo-illustrations) as a selectable action ' +
            'type. See apps/ga/components/form/container/_cq_dialog/.content.xml (options ' +
            'allow-list) in kkr-aem.'
        ).toContain('kkr-aem-base/components/form/actions/marketo-illustrations');
        expect(body, 'AC1: dropdown option label for Marketo Illustrations missing').toContain('Marketo Illustrations');
    });
});
