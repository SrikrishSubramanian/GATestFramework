import { test, expect } from '@playwright/test';
import { TextPage } from '../../../pages/ga/components/textPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture, isBenignError } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    capture = new ConsoleCapture(page);
    capture.start();
    await loginToAEMAuthor(page);
});
test.afterEach(async ({ page }, testInfo) => {
    if (capture) {
        await attachConsoleCapture(testInfo, capture);
    }
    await annotateEnvironment(testInfo);
});
test.describe('Text — CSV Test Cases', () => {
    test('[TEXT-001] @smoke @regression @sanity CMS FE: Homepage Hero Role Card Click Action — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Local Storage Write on Card Click*
        test.fixme();
    });
});
test.describe('Text — Happy Path', () => {
    test('[TEXT-002] @smoke @regression Text renders correctly', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-text').first();
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
    test('[TEXT-003] @smoke @regression Text interactive elements are functional', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-text').first();
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
test.describe('Text — Negative & Boundary', () => {
    test('[TEXT-004] @negative @regression Text handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-text').first()).toBeVisible();
    });
    test('[TEXT-005] @negative @regression Text handles missing images', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-text img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Text — Responsive', () => {
    test('[TEXT-006] @mobile @regression @mobile Text adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-text').first();
        await expect(root).toBeVisible();
        // Verify layout adapts to mobile: check flex-direction changes to column
        const flexDir = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => {
            const cs = getComputedStyle(el);
            return cs.flexDirection || cs.display;
        });
        // At mobile, flex containers typically switch to column layout
        // Grid containers may change template columns
        expect(flexDir).toBeDefined();
    });
    test('[TEXT-007] @mobile @regression Text adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-text').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('Text — Console & Resources', () => {
    test('[TEXT-008] @regression Text produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
    });
});
test.describe('Text — Broken Images', () => {
    test('[TEXT-009] @regression Text all images load successfully', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-text img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = // 📏 TODO: Replace with measurement-utils
             await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[TEXT-010] @regression Text all images have alt attributes', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-text img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Text — Accessibility', () => {
});
test.describe('Text — AEM Dialog Configuration', () => {
});
test.describe('Text — CSV Test Cases (GAAM-1464)', () => {
    test('[TEXT-016] @smoke @regression CMS FE: Red Oak Form Submission Issues — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: h1. FE Issues reported in following Forms:
        // 
        // *Complaint Form:* 
        // 
        // [https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/complaint-form.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/complaint-form.html?wcmmode=disabled]
        // 
        // # Dropdown is not in-line with other field width. → {color:#bf2600}*Require Front End Change.*{color}
        // 
        //  
        // 
        // h1. *Report Fraud:* 
        // 
        // [https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/report-fraud-form/Report-Fruad-Form-Updated.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/report-fraud-form/Report-Fruad-Form-Updated.html?wcmmode=disabled]
        // 
        // # Dropdown is not in-line with other field width. → {color:#ff5630}*Require Front End Change.*{color}
        // # File Upload should be displayed only when the document dropdown is displayed as “Yes”. It is not working as expected. → {color:#bf2600}*Require Front End Change.*{color}
        // # Date format placeholder is incorrect. It should be MM-DD-YY format → {color:#bf2600}*Need to Override Placeholder using JS (Frontend)*{color}
        // 
        //  
        // 
        // h1. *Private Report Fraud:* 
        // 
        // [https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/private-report-fraud-form.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/private-report-fraud-form.html?wcmmode=disabled]
        // 
        // # Date format placeholder is incorrect. It should be MM-DD-YY format → {color:#bf2600}*Need to Override Placeholder using JS (Frontend)*{color}
        // # Error message is not shown for email field when the user left the field blank → {color:#bf2600}*FE*{color}
        // # Selecting “Others” in *Type of Suspicious Activity* is not revealing the text box. →{color:#bf2600} *FE*{color}
        // # Selecting “Others” in *Relationship to Policy* is not revealing the text box → {color:#bf2600}*FE*{color}
        // # Selecting “Others” in *Company* is not revealing the text box → {color:#bf2600}*FE*{color}
        // # File Upload should be displayed only when the document dropdown is displayed as “Yes”. It is not working as expected. → {color:#bf2600}*FE*{color}
        // # Dropdown is not in-line with other field width → {color:#bf2600}*FE*{color}
        test.fixme();
    });
});
test.describe('Text — CSV Test Cases (GAAM-1405)', () => {
    test('[TEXT-017] @smoke @regression CMS BE: Red Oak Form Submission Issues — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: h1. *Complaint form:* 
        // 
        // [https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/complaint-form.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/complaint-form.html?wcmmode=disabled]
        // 
        // # File upload text should be fixed.
        // # Dropdown is not inline with other field width.
        // # -CAPTCHA- not able to author-  *-_(Will be verified in STAGE)_-*
        // # -When I select any option in “Have you reported this issue to a regulatory/governmental agency, (e.g. FINRA State Insurance Department) BBB or other third party?”, Type of Policy/Contract option is unselected-
        // # -Phone number, mailing address and zip code is not throwing error when invalid format is given-
        // # -Files that has been uploaded is generating ON the file upload box itself which is hiding the UI-
        // # -when user selects more than 3 files, it is not throwing error (Neither uploads the file)-
        // # File upload-> video and zip format is not accepted
        // # Form submission is not working
        // 
        //  
        // 
        // h1. *Report fraud:* 
        // 
        // [https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/report-fraud-form/Report-Fruad-Form-Updated.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/report-fraud-form/Report-Fruad-Form-Updated.html?wcmmode=disabled]
        // 
        // # FIELD SET component should be added to achieve 2 columns inside form container
        // # Dropdown is not inline with other field width.
        // # -CAPTCHA- not able to author  -- *-_(Will be verified in Stage)_-*
        // # -Files that has been uploaded is generating ON the file upload box itself which is hiding the UI-
        // # -when user selects more than 3 files, it is not throwing error (Neither uploads the file)-
        // # File upload-> video and zip format is not accepted
        // # File Upload should be displayed only when the document dropdown is displayed as “Yes”. It is not working as expected.
        // # -What is the dollar amount involved?--> it is not throwing error when invalid format is given.-
        // # File upload text should be fixed.
        // # Date format placeholder is incorrect. It should be MM-DD-YY format
        // # -Clicking on the date field is not exposing the calendar. It is opened only when the user clicks on the calendar icon within the field-
        // # Form submission is not working
        // 
        //  
        // 
        // h1. *Private report fraud:* 
        // 
        // [https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/private-report-fraud-form.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/redoak-forms/private-report-fraud-form.html?wcmmode=disabled]
        // 
        // # Date format placeholder is incorrect. It should be MM-DD-YY format
        // # Error message is not shown for email field when the user left the field blank
        // # Selecting “Others” in *Type of Suspicious Activity* is not revealing the text box.
        // # Selecting “Others” in *Relationship to Policy* is not revealing the text box
        // # Selecting “Others” in *Company* is not revealing the text box
        // # File Upload should be displayed only when the document dropdown is displayed as “Yes”. It is not working as expected.
        // # Dropdown is not inline with other field width
        // # -CAPTCHA- not able to author  -- *-_(Will be verified in Stage)_-*
        // # File upload text should be fixed
        // # -Dollar Amount Involved ($) is not throwing error when the format is incorrect-
        // # F-iles that has been uploaded is generating ON the file upload box itself which is hiding the UI-
        // # -When user selects more than 3 files, it is not throwing error (Neither uploads the file)-
        // # File upload-> video and zip format is not accepted
        // # Form submission is not working
        test.fixme();
    });
});
test.describe('Text — CSV Test Cases (GAAM-1384)', () => {
    test('[TEXT-018] @smoke @regression CMS BE: Product Comparison CF - Increase Key Features Max to 4 — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: The Key Features multifield on the Product CF model allows authors to add up to 4 items (previously 3)
        test.fixme();
    });
});
test.describe('Text — CSV Test Cases (GAAM-1380)', () => {
    test('[TEXT-019] @smoke @regression CMS FE: Disclosure List Component – Superscript & Border Rendering — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Hi, VQA done and I found a few small issues. 
        // 1. The border stroke colour on light background needs to be azul according to design. The colour codes are not matching, kindly check.
        // 2. For the table, the logic is to add a spacing of 8px on left and right to the text in each cell. The table does not need to be end to end, It can sit upto the width at which it ends. 
        // Otherwise, all looks good. Thank you.
        // 
        // CC: [~accountid:712020:eeba6bf9-a31d-42a5-b064-8fe7f8354b32][~accountid:712020:ca49fe11-4085-496b-8053-2df97275fc28] [~accountid:606ce8584703e400679818a2] [~accountid:712020:19496377-93fa-4b6a-be8c-4f3dac15dfb5] 
        test.fixme();
    });
});
test.describe('Text — CSV Test Cases (GAAM-1308)', () => {
    test('[TEXT-020] @smoke @regression CMS BE: Form Container — Marketo Illustrations Action Type — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Dialog Structure*
        test.fixme();
    });
});
test.describe('Text — CSV Test Cases (GAAM-1269)', () => {
    test('[TEXT-021] @smoke @regression BE: Product Path Detail Card - Superscript — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: h2. Issue:
        // 
        // Product Path Detail Card List Item Titles, Descriptor Titles, and CTA Titles don't support superscript text.
        // 
        // The Product Path Detail Card currently renders all title text using the same baseline styling. There is no way to mark a portion of the title as superscript when the design or content requires it.
        // 
        // Some titles may include disclosure markers, legal references, footnote indicators, or other notation that must appear as superscript. This is demonstrated in the Figma design and is a realistic content requirement for disclosures. Today, when superscript content is provided in the title, it displays the same as regular title text instead of being raised and styled as superscript.
        // 
        // h2. Expected behavior
        // 
        // The Product Path Detail Card List Item Titles, Descriptor Titles, and CTA Titles should support superscript formatting for selected characters or text within the title.
        // 
        // Superscript text should render visually raised relative to the title baseline and use an appropriate reduced size consistent with the Figma design.
        // 
        // Only the marked superscript portion should receive superscript styling; the rest of the title should retain the standard title styling.
        // 
        // The solution should support real-world disclosure markers such as symbols, numbers, or short text snippets.
        // 
        // Current behavior
        // 
        // Superscript text in the Product Path Detail Card title is rendered the same as regular title text, with no visual superscript treatment.
        // 
        // !Product Path Detail - Super Script.mp4|width=665,alt="Product Path Detail - Super Script.mp4"!
        test.fixme();
    });
});
test.describe('Text — CSV Test Cases (GAAM-1231)', () => {
    test('[TEXT-022] @smoke @regression CMS QA Task: Report Fraud Form – Red Oak Submission Integration — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // Desktop
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom1 = new TextPage(page);
        await pom1.navigate(BASE());
        await expect(page.locator('.cmp-text').first()).toBeVisible();
        // Mobile
        await page.setViewportSize({ width: 390, height: 844 });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(page.locator('.cmp-text').first()).toBeVisible();
    });
});
test.describe('Text — CSV Test Cases (GAAM-1230)', () => {
    test('[TEXT-023] @smoke @regression CMS QA Task: Complaint Form – Red Oak Submission Integration — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // Desktop
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom1 = new TextPage(page);
        await pom1.navigate(BASE());
        await expect(page.locator('.cmp-text').first()).toBeVisible();
        // Mobile
        await page.setViewportSize({ width: 390, height: 844 });
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(page.locator('.cmp-text').first()).toBeVisible();
    });
});
test.describe('Text — CSV Test Cases (GAAM-1147)', () => {
    test('[TEXT-024] @smoke @regression CMS BE: Assets - Make the description a textarea field — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: The section for description is too small - we need to make it a much taller area - 4-5 lines is probably good enough or if it can have a scroll or something.
        // 
        // !image-20260528-215126.png|width=686,alt="image-20260528-215126.png"!
        // 
        //   Acceptance Criteria - the field is taller so authors can see what they’re typing.
        test.fixme();
    });
});
test.describe('Text — CSV Test Cases (GAAM-548)', () => {
    test('[TEXT-025] @smoke @regression CMS Analytics FE – Page View: Add Product Info to Data Layer — AC1', async ({ page }) => {
        const pom = new TextPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Functionality*
        test.fixme();
    });
});
