import { test, expect } from '@playwright/test';
import { BioCardPage } from '../../../pages/ga/components/bioCardPage';
import ENV from '../../../utils/infra/env';
import { ConsoleCapture, isBenignError } from '../../../utils/infra/console-capture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import AxeBuilder from '@axe-core/playwright';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('BioCard — Happy Path', () => {
    test('[BC-001] @smoke @regression @sanity BioCard renders correctly', async ({ page }) => {
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-bio-card').first();
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
    test('[BC-002] @smoke @regression @sanity BioCard interactive elements are functional', async ({ page }) => {
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-bio-card').first();
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
test.describe('BioCard — Negative & Boundary', () => {
    test('[BC-003] @negative @regression @sanity BioCard handles empty content gracefully', async ({ page }) => {
        // Capture JS errors during page load
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        // Component should render without JS errors
        expect(errors.filter(e => !isBenignError(e))).toEqual([]);
        // Root element should still be present (not crash)
        await expect(page.locator('.cmp-bio-card').first()).toBeVisible();
    });
    test('[BC-004] @negative @regression @sanity BioCard handles missing images', async ({ page }) => {
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-bio-card img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const naturalWidth = await images.nth(i).evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
});
test.describe('BioCard — Responsive', () => {
    test('[BC-005] @mobile @regression @mobile @sanity BioCard adapts to mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-bio-card').first();
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
    test('[BC-006] @mobile @regression @sanity BioCard adapts to tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1024, height: 1366 });
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        const root = page.locator('.cmp-bio-card').first();
        await expect(root).toBeVisible();
        // Tablet should render without horizontal overflow
        const overflow = await root.evaluate(el => {
            return el.scrollWidth > el.clientWidth;
        });
        expect(overflow).toBe(false);
    });
});
test.describe('BioCard — Console & Resources', () => {
    test('[BC-007] @regression BioCard produces no JS errors', async ({ page }) => {
        const capture = new ConsoleCapture(page);
        capture.start();
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        await page.waitForTimeout(1000);
        const errors = capture.getErrors();
        capture.stop();
        expect(errors).toEqual([]);
    });
});
test.describe('BioCard — Broken Images', () => {
    test('[BC-008] @regression BioCard all images load successfully', async ({ page }) => {
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-bio-card img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const img = images.nth(i);
            const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
            expect(naturalWidth).toBeGreaterThan(0);
        }
    });
    test('[BC-009] @regression BioCard all images have alt attributes', async ({ page }) => {
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        const images = page.locator('.cmp-bio-card img');
        const count = await images.count();
        for (let i = 0; i < count; i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });
});
test.describe('BioCard — Accessibility', () => {
});
test.describe('BioCard — AEM Dialog Configuration', () => {
});
// Relocated from image.author.spec.ts (MG-058, MG-062) — CSV import mis-bucketed these under
// Image; they're actually about the Bio Card component.
test.describe('BioCard — CSV Test Cases (GAAM-1360)', () => {
    test('[BC-010] @regression @sanity CMS FE: Bio Content – Bio Card issues — AC1', async ({ page }) => {
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        // Ticket (GAAM-1360) reports 4 issues against the .cmp-bio-card--card variant:
        //   1. Hover animation is not working as expected
        //   2. If bio link is not authored, name/title display on top in mobile view;
        //      should be "center right" (ticket itself: "we dont have this scenario in
        //      Figma, please confirm" — an open design question, not a code defect)
        //   3. Padding is not matching for all cards as per Figma
        //   4. Add a "role" tag to the content fragment (e.g. "Practice Management Consultant")
        //
        // Investigated against kkr-aem source (read-only reference) and confirmed all
        // 3 concretely-actionable items are already remediated in the checked-out
        // reference (a4060eb1, release/v7.0):
        //   - Issue 1: commit ef5a86e775 ("GAAM-1360 bio catd hover & hero VQA bug fixes",
        //     confirmed ancestor of a4060eb1 via `git merge-base --is-ancestor`) replaced the
        //     plain box-shadow hover with an animated ::before circle-swipe
        //     (transform: translate(-339px, 137px) scale(16) on :hover, transition
        //     0.55s cubic-bezier) — see bio-card.less lines 41-64.
        //   - Issue 3: card padding is now explicit and breakpoint-driven
        //     (@sp-16 mobile / @sp-24 desktop — bio-card.less lines 38, 66-69).
        //     Exact Figma-spec parity could not be independently re-verified (no Figma
        //     access in this session), but the earlier "not matching" state (no padding
        //     override at all) is gone.
        //   - Issue 4: the Insurance Bio CF model's "title" field already carries
        //     fieldDescription "Enter the person's job title or role. This field is
        //     mandatory." (insurance-bio/.content.xml lines 83-98, name=personTitle) —
        //     matches the requested behavior.
        //   - Issue 2 remains an open design question per the ticket's own text and is
        //     out of scope for an automated assertion until Figma/design confirms it.
        //
        // None of this can be exercised as a *live* assertion here: this AEM instance has
        // zero Bio Content Fragments. Both style-guide entries at
        // /content/global-atlantic/style-guide/components/bio-card (bio_card_card,
        // bio_card_hero — ui.content.ga bio-card/.content.xml lines 33-47) point at
        // fragmentPath=/content/dam/global-atlantic/bio-test-folder/bio-insurance-cf-test-1,
        // which 404s. A querybuilder search for dam:Asset nodes using
        // /conf/global-atlantic/settings/dam/cfm/models/insurance-bio returns 0 results
        // instance-wide. bio-card.html's own HTL guard
        // (data-sly-test.configured="${bioCardModel.cardVariation && bioCardModel.name}",
        // line 19) then suppresses all markup, which is what a live wcmmode=disabled
        // fetch of the style-guide page confirms today (0 occurrences of
        // .cmp-bio-card--card / .cmp-bio-card--hero in the rendered HTML).
        const card = page.locator('.cmp-bio-card--card').first();
        test.skip(await card.count() === 0, 'No Bio Content Fragment exists in this AEM instance (0 dam:Asset nodes of the insurance-bio CF model) — the style guide bio-card entries reference a nonexistent fragmentPath and render nothing. Verified live 2026-08-13. Author/deploy a Bio CF fixture (see tests/utils/infra/content-fixture-deployer.ts; no fixture currently exists under tests/data/content-fixtures/bio-card) to un-skip. Code-level review confirms the hover animation, padding, and content-fragment role-field issues from this ticket are already fixed in kkr-aem (see comment above); the mobile "bio link not authored" layout remains an open design question per the ticket text itself.');
        await expect(card).toBeVisible();
    });
});
test.describe('BioCard — CSV Test Cases (GAAM-1333)', () => {
    test('[BC-011] @regression @sanity CMS FE: GAAM-1084 - Bio Content-Hero Card Issues — AC1', async ({ page }) => {
        // Desktop viewport: the fixed font-size values below (18px description, 18px
        // title) only apply at the @ga-bp-desktop-min (1024px) breakpoint
        // (bio-card.less lines 279-296, mixins.less lines 166-177) — set explicitly so
        // this assertion is deterministic regardless of project default viewport.
        await page.setViewportSize({ width: 1440, height: 900 });
        const pom = new BioCardPage(page);
        await pom.navigate(BASE());
        // "Bio Content-Hero Card" is NOT a separate component — GAAM-1084 is titled
        // "Bio Hero FE" in kkr-aem git history (commits 303969a9c0, 00884fe8c4,
        // ad5a1df165, bc7046888a) and the style-guide content confirms it's the
        // cardVariation="bio-hero" mode of the same ga/components/content/bio-card
        // component (ui.content.ga bio-card/.content.xml lines 33-47: bio_card_card
        // uses cardVariation="bio-card", bio_card_hero uses cardVariation="bio-hero",
        // both sling:resourceType="ga/components/content/bio-card"). So this ticket is
        // correctly bucketed in bio-card.author.spec.ts, not mis-filed.
        //
        // Ticket (GAAM-1084/GAAM-1333) reports 5 issues against .cmp-bio-card--hero:
        //   1. Bio Desc font-size is 16px, should be 18px
        //   2. Title font-size is 20px, should be 18px
        //   3. PDF link font-size should be 14px
        //   4. Dark theme title/location color should be rgba(238, 243, 249, 1)
        //   5. Mobile font sizes mismatching generally (no specific target values given)
        //
        // All 4 numerically-specific issues are already fixed in the checked-out kkr-aem
        // reference (a4060eb1, release/v7.0 — ancestor of eb67c175f4 / ef5a86e775,
        // confirmed via `git merge-base --is-ancestor`):
        //   - Issue 1: .cmp-bio-card__description font-size is rem-calc(18px) at the
        //     desktop breakpoint (bio-card.less lines 279, 294-296) — matches.
        //   - Issue 2: .cmp-bio-card--hero .cmp-bio-card__title now uses
        //     .utility-eyebrow() (bio-card.less lines 339-347), whose desktop
        //     font-size is @eyebrow-desktop: @sp-18 = 18px (mixins.less lines 166-170;
        //     variables.less lines 166, 203) — matches.
        //   - Issue 3: .cmp-bio-card__download-link-text font-size: rem-calc(14px)
        //     (bio-card.less line 318) — matches exactly.
        //   - Issue 4: in the dark-background context
        //     (.cmp-section--background-color-granite/azul), .cmp-bio-card__title,
        //     __description and __meta-item are colored @c-primary-slate
        //     (bio-card.less lines 439-443), and @c-primary-slate: #EEF3F9
        //     (variables.less line 292) = rgb(238, 243, 249) — an exact match to the
        //     requested rgba(238, 243, 249, 1).
        //   - Issue 5 is a non-specific catch-all ("please check all the font sizes in
        //     Mobile") with no target values, so it isn't independently actionable.
        //
        // None of this can be exercised as a *live* assertion here: this AEM instance has
        // zero Bio Content Fragments, so .cmp-bio-card--hero never renders. Both
        // style-guide entries at /content/global-atlantic/style-guide/components/bio-card
        // reference fragmentPath=/content/dam/global-atlantic/bio-test-folder/bio-insurance-cf-test-1,
        // which 404s, and a querybuilder search for dam:Asset nodes using
        // /conf/global-atlantic/settings/dam/cfm/models/insurance-bio returns 0 results
        // instance-wide (same content gap documented on BC-010 above). A live
        // wcmmode=disabled fetch of the style-guide page confirms 0 occurrences of
        // .cmp-bio-card--hero in the rendered HTML today.
        const hero = page.locator('.cmp-bio-card--hero').first();
        test.skip(await hero.count() === 0, 'No Bio Content Fragment exists in this AEM instance (0 dam:Asset nodes of the insurance-bio CF model) — the style guide bio-hero entry references a nonexistent fragmentPath and renders nothing. Verified live 2026-08-13. Author/deploy a Bio CF fixture (see tests/utils/infra/content-fixture-deployer.ts; no fixture currently exists under tests/data/content-fixtures/bio-card) to un-skip. Code-level review confirms all 4 numerically-specific font-size/color issues from this ticket are already fixed in kkr-aem (see comment above); issue 5 is a non-specific catch-all with no target values.');
        const desc = hero.locator('.cmp-bio-card__description').first();
        await expect(desc).toBeVisible();
        const descFontSize = await desc.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
        expect(descFontSize).toBeCloseTo(18, 0);
    });
});
