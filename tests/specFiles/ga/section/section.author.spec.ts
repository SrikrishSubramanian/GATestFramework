import { test, expect } from '@playwright/test';
import { SectionPage } from '../../../pages/ga/components/sectionPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
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
test.describe('Section — CSV Test Cases', () => {
    test('[SCTN-001] @smoke @regression @sanity CMS FE: Bio Content - Hero Card — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: h3. Style System
        test.fixme();
    });
});
test.describe('Section — Happy Path', () => {
    test('[SCTN-002] @smoke @regression Section renders correctly', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-section').first();
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
    test('[SCTN-003] @smoke @regression Section interactive elements are functional', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-section').first();
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
test.describe('Section — Negative & Boundary', () => {
    test('[SCTN-004] @negative @regression Section handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-section').first()).toBeVisible();
    });
    test('[SCTN-005] @negative @regression Section handles missing images', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-section img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('Section — Responsive', () => {
    test('[SCTN-006] @mobile @regression @mobile Section adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-section').first();
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
    test('[SCTN-007] @mobile @regression Section adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-section').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = // 📏 TODO: Replace with measurement-utils
         await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('Section — Console & Resources', () => {
    test('[SCTN-008] @regression Section produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // ⏱️ DEPRECATED: Replace with: await page.locator('selector').waitFor({ state: 'visible' });
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('Section — Broken Images', () => {
    test('[SCTN-009] @regression Section all images load successfully', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-section img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = // 📏 TODO: Replace with measurement-utils
             await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[SCTN-010] @regression Section all images have alt attributes', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-section img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('Section — Accessibility', () => {
});
test.describe('Section — AEM Dialog Configuration', () => {
});
test.describe('Section — CSV Test Cases (GAAM-1456)', () => {
    test('[SCTN-016] @smoke @regression CMS FE: Section Component - Split Left and Right Padding Style Options — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: h3. Style System
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1452)', () => {
    test('[SCTN-017] @smoke @regression CMS FE: Section under a section issue — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: When a section is authored inside a section component, the BG color style of the child section is breaking. 
        // 
        // Test URL: [https://author-p101514-e1845752.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/style-guide/qa-testing/components/decision-tree-component-/decision-tree---gaam-1096.html|https://author-p101514-e1845752.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/style-guide/qa-testing/components/decision-tree-component-/decision-tree---gaam-1096.html|smart-link] 
        // 
        // !image-20260702-054742.png|width=518,alt="image-20260702-054742.png"!
        // 
        // !image-20260702-054816.png|width=521,alt="image-20260702-054816.png"!
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1406)', () => {
    test('[SCTN-018] @smoke @regression CMS: FE: Section – White Background Padding Is Not Applied Across the Entire Section — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: When a *white background* is applied to a Section component, the background color does not extend into the section's padding area. As a result, the padding remains unfilled or displays a different background color, causing an inconsistent appearance.
        // 
        // URL Tested - [https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/test-product.html?wcmmode=disabled|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/style-guide/qa-testing/components/test-product.html?wcmmode=disabled]
        // 
        // *Steps to Reproduce:*
        // 
        // # Navigate to a page containing the *Section* component.
        // # Configure the section with a *white background*.
        // # Add padding (top, bottom, left, or right) to the section.
        // # Save the changes and preview/publish the page.
        // 
        // *Actual Result:*
        // The white background is applied only to the content area. The padding area is not filled with the white background, resulting in visible gaps or a different background color.
        // 
        // *Expected Result:*
        // The white background should extend across the entire Section component, including the configured padding, providing a consistent background throughout.
        // 
        // !20260630-1144-08.2867246.mp4|width=521,alt="20260630-1144-08.2867246.mp4"!
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1404)', () => {
    test('[SCTN-019] @smoke @regression CMS Bug: Section Component – Nested Section Spacing and Corner Radius Issues — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Granite (or other colors) Color Fix*
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1359)', () => {
    test('[SCTN-020] @smoke @regression CMS FE: Section – Remove Left and Right Padding in Desktop — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: The Section component currently applies left and right padding, which prevents content from aligning with the intended full-width layout. The padding should be removed to meet the updated frontend design requirements.
        // 
        // URL tested - [ForeIncome II Fixed Index Annuity | Global Atlantic|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/financial-professionals/main/en/annuities/fixed-index-annuities/foreincome-ii-fixed-index-annuity.html?wcmmode=disabled]
        // 
        // *Current Behavior:*
        // The Section component renders with horizontal padding on both sides.
        // 
        // *Expected Behavior:*
        // The Section component should render without left and right padding, allowing content to span the available width as defined by the design.
        // 
        // *Steps to Reproduce:*
        // 
        // # Open a page containing the Section component.
        // # Inspect the component layout.
        // # Observe the left and right spacing applied to the section content.
        // 
        // *Expected Result:*
        // No left or right padding is applied to the Section component.
        // 
        // *Actual Result:*
        // Left and right padding are present.
        // 
        // !image-20260624-082843.png|width=523,alt="image-20260624-082843.png"!
        // 
        // !image-20260624-082948.png|width=522,alt="image-20260624-082948.png"!
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1347)', () => {
    test('[SCTN-021] @smoke @regression CMS BE: Alert Modal - Dialog Update - Dialog layout & consent alert — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Dialog Structure*
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1326)', () => {
    test('[SCTN-022] @smoke @regression CMS: BE: Embedded Content Fragment - Calculators Not Loading from New Content Fragment Path — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: As part of the recent requirement, Content Fragments (CFs) were moved/added to a new path under the Global Atlantic Financial Professionals section. However, the calculators are not loading on the corresponding pages as expected after the update.
        // 
        // Embedded CF - [ForeCare Calculator | Adobe Experience Manager|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/dam/global-atlantic/financial-professionals/content-fragments/calculators/fore-care-calculator]
        // 
        // Pages Tested - [ForeCare Fixed Annuity Calculator | Adobe Experience Manager|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/calculator/forcare-calculator.html]
        // 
        // *Environment:*
        // 
        // * Application: Global Atlantic
        // * Section: Financial Professionals
        // * Component: Calculators
        // * Content Type: Content Fragments
        // * Environment: [Dev/Staging/UAT/Production]
        // 
        // *Preconditions:*
        // 
        // * Content Fragments have been created and configured in the new path as per the latest requirement.
        // 
        // *Steps to Reproduce:*
        // 
        // # Navigate to the new Content Fragment path configured for calculators.
        // # Verify that the calculator-related Content Fragments exist and are published.
        // # Open a page that references these calculator Content Fragments.
        // # Observe the calculator section on the page.
        // 
        // *Actual Result:*
        // The calculators do not load/display on the page when the Content Fragments are sourced from the new path.
        // 
        // *Expected Result:*
        // The calculators should load and render correctly on the page using the Content Fragments configured in the new path.
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1317)', () => {
    test('[SCTN-023] @smoke @regression CMS FE: Disclosure appearance — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Designs where disclosures appear OTHER than footer
        // 
        // color: var(--Primary-Granite, #1A273C);
        // 
        // /* Desktop/Body/Body XS _/_
        // _font-family: Graphie;_
        // _font-size: 11px;_
        // _font-style: normal;_
        // _font-weight: 400;_
        // _line-height: 140%; /_ 15.4px */
        // letter-spacing: 0.11px;
        // 
        // Disclosure text color is also dependent on light/dark mode
        // 
        // If section is dark - text is white
        // 
        // If section is light - text is granite
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1309)', () => {
    test('[SCTN-024] @smoke @regression DR AEM FE: Need Structured data in Rate table for ForeAccumulation II - All variants — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: 
        // 
        // |*ForeAccumulation II* - *All* and *Premium Enhancement Rider* - Format to be checked for all variants
        // # Structure the API response for Participation Rate basis on rate type and {{strategy}} which should be separated in 2 sections
        // ## One-Year Term
        // ## Two-Year term
        // # {color:#ff991f}ForeAccumulation II Premium Enhancement Rider -{color} Format to be checked
        // ## Participation Rate has separated in 2 section - 1 Year and 2 years|*AEM:*
        // - [AEM Editor | Adobe Experience Manager|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/foreaccumulation-ii-fixed-index-annuity/foraccumulation-ii-all.html]
        // - [ForeAccumulation II - Premium Enhancement Rider | Adobe Experience Manager|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/foreaccumulation-ii-fixed-index-annuity/foreaccumulation-ii-premium-enhancement-rider-all.html]
        // *Live Page:*
        // - [ForeAccumulation II Rates | Global Atlantic | For Financial Professionals|https://professionals.globalatlantic.com/resources/rates/foreaccumulation-ii/all]
        // \\
        // !image-20260617-143752.png|width=621,alt="image-20260617-143752.png"!|
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1305)', () => {
    test('[SCTN-025] @smoke @regression DR AEM FE: Review Feedback - Issues in different Product Rate Table — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Bugs:
        // 
        // ||*Tested on Stage Env*||*Reference File*||*Status*||
        // |{color:#ff991f}ForeIncome II{color} - Superscript is not apllying correctly - e.g. - Apllying superscript on S&P 500 - is also applicable to text in S&P 500 Engle - Which should be only applicable to limited text| |{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}ForeIncome II{color} - With 8 column structure in Rate table - Cap rate column width should be 441px and Preminum Amount column width should be 135px as per Figma - Check other table width as well.|Figma - [https://www.figma.com/design/bGvnz1Z5Yi9ceIWVYNNvcj/GAFG-%7C-Template-Reference-File?node-id=4415-3944&t=6HhIFAhRCUjCXPON-4|https://www.figma.com/design/bGvnz1Z5Yi9ceIWVYNNvcj/GAFG-%7C-Template-Reference-File?node-id=4415-3944&t=6HhIFAhRCUjCXPON-4|smart-link]|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}ForeIncome II{color} - Wells Fargo - Participation Rate table section is appearing which is not valid for ForeIncome - WF variation. It should remain hidden| |{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}In RTE for Rider Charge {color}(where table is authored manually) - Blue Color is little deviated in Table border - Zoom the page to 400% to see it clearly - Part of analysis before fix - Santhosh to highlight if needs a connect with XD team |!image-20260617-125953.png|width=310,alt="image-20260617-125953.png"!|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}ForeAccumulation II{color} - There are no Gaps between the tables. Also check the Table format - it needs to be updated as per current live pdf page - Few fields are not available in spreadsheet that can be skipped.|[ForeAccumulation II Title | Adobe Experience Manager|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/foreaccumulation-ii-fixed-index-annuity/foraccumulation-ii-all.html]|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}Rate Detail Hero section{color} seems to occupy more space - to be analysed if extra padding or gap can be minimized. - Align with Figma Design till 40 px|[ForeAccumulation II Title|https://author-p101514-e947796.adobeaemcloud.com/content/global-atlantic/financial-professionals/main/en/resources/rates/foreaccumulation-ii-fixed-index-annuity/foraccumulation-ii-all.html?wcmmode=disabled&view=shared]|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}SecureFore II - {color}
        // # "Fixed" text is appearing above table - that should be removed
        // # Switch from Current Rates to Effective 07/30/2026 - Cell Values for (>=$100K) are changing but Color and Bold style is not updated - BE verification - IsBold is returning false even the value is changed|[SecureFore II - Generic - NoROP | Adobe Experience Manager|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/securefore-ii-fixed-annuity/securefore-II-fixed-annuity-test.html]|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}SecureFore - Generic - NoROP{color}
        // # "Fixed" text is appearing above table - that should be removed|[AEM Stage Authoring - SecureFore - Generic - NoROP|https://author-p101514-e947796.adobeaemcloud.com/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/securefore-fixed-annuity/securefore---generic---norop.html]
        // [Live DR Page - https://professionals.globalatlantic.com/resources/rates/securefore/norop|https://author-p101514-e947796.adobeaemcloud.com/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/securefore-fixed-annuity/securefore---generic---norop.html]|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}SecureFore - Generic - ROP | SecureFore - WF - NoROP{color}
        // # "Fixed" text is appearing above table - that should be removed
        // # Data is not appearing in table - Even API is returning the data in response for the respective year|AEM Stage - [https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/securefore-fixed-annuity/securefore-generic-ROP.html|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/securefore-fixed-annuity/securefore-generic-ROP.html|smart-link] 
        // Live DR Page - [https://professionals.globalatlantic.com/resources/rates/securefore/rop|https://professionals.globalatlantic.com/resources/rates/securefore/rop|smart-link]|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}ForeStructured Growth II - All {color}- (Other versions to be checked)
        // # Despite of right Index tag selection (sequence can be anything) - value is not populating correctly for "Dual Directional Index Crediting Strategies" table.
        // # Due to the wrong Index sequence selection - Data is not populating for "3-Year Index Strategy Term" and both the "6-Year Index Strategy Term" tables
        // # To be through verified for other variations as well.|AEM Stage - [https://author-p101514-e947796.adobeaemcloud.com/content/global-atlantic/financial-professionals/main/en/resources/rates/forestructured-growth-ii-registered-index-linked-annuity/forestructured-growth-ii-all.html?wcmmode=disabled|https://author-p101514-e947796.adobeaemcloud.com/content/global-atlantic/financial-professionals/main/en/resources/rates/forestructured-growth-ii-registered-index-linked-annuity/forestructured-growth-ii-all.html?wcmmode=disabled]|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}Income 150+ SE - All{color} - (Other versions to be checked)
        // # "Withdrawal Charge Schedule" column is missing and that needs to be added in all the versions.|AEM Stage - [https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/income-150--se-fixed-index-annuity/income-150-se-all.html|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/income-150--se-fixed-index-annuity/income-150-se-all.html|smart-link]|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |{color:#ff991f}ForeCertain Rates - All {color}-
        // # Align "Income Option" value to the Top-left to identify the starting row.|AEM Stage - [https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/forecertain-income-annuity/forecertain-all.html|https://author-p101514-e947796.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/forecertain-income-annuity/forecertain-all.html|smart-link]|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |*In Responsive Mode:*
        // # Rate Table left-right padding is not working as expected on *Dimensions 1247 * 815* - should be fixed|AEM Dev - [ForeIncome II - All|https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/financial-professionals/main/en/resources/rates/foreincome-ii-fixed-index-annuity0/foreincome-ii-all.html?wcmmode=disabled] 
        // !image-20260619-064012.png|width=402,alt="image-20260619-064012.png"!|{color:#00B8D9}*[ IN PROGRESS ]*{color}|
        // |*In windows - Edge Browser* - Rate Table and GA Icon alignment is behaving differently (No Left-Right padding) on *AEM Dev env* - Even page zoom is on 100%
        // AEM Dev Reference:
        // * [ForeAccumulation II Title | Adobe Experience Manager|https://author-p101514-e1845752.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/foreaccumulation-ii-fixed-index-annuity/foraccumulation-ii-all.html]
        // * [ForeIncome II - All | Adobe Experience Manager|https://author-p101514-e1845752.adobeaemcloud.com/ui#/aem/editor.html/content/global-atlantic/financial-professionals/main/en/resources/rates/foreincome-ii-fixed-index-annuity0/foreincome-ii-all.html]|!image-20260622-071823.png|width=389,alt="image-20260622-071823.png"!
        // !image-20260622-071856.png|width=389,alt="image-20260622-071856.png"!|Inprogres|
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1140)', () => {
    test('[SCTN-026] @smoke @regression CMS BE: Gated Section — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Dialog Structure*
        test.fixme();
    });
});
test.describe('Section — CSV Test Cases (GAAM-1096)', () => {
    test('[SCTN-027] @smoke @regression CMS FE: Decision Tree – Desktop Interaction & Rendering — AC1', async ({ page }) => {
        const pom = new SectionPage(page);
        await pom.navigate(BASE());
        // TODO: Implement assertion for: Style System*
        test.fixme();
    });
});
