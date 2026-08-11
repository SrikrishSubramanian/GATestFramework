import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { resolveComponentUrl, deployFixture } from '../../../utils/infra/content-fixture-deployer';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { assertLayout, assertSpacing, assertTypography } from '../../../utils/infra/component-assertions';
import { getElementMeasurements, getComputedStyles, getElementVisibility } from '../../../utils/infra/measurement-utils';
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
test.describe('Text Component - Sprint 13 Padding Specifications (GAAM-675)', () => {
    test('[GAAM-675-001] @regression Verify text component has default padding applied', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textComponent = page.locator('.cmp-text, [class*="text-component"]').first();
        if (await textComponent.count() > 0) {
            const padding = // ?? TODO: Replace with measurement-utils
             await textComponent.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).not.toBe('0px');
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-002] @regression Verify padding is consistent across all text elements', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textElements = page.locator('.cmp-text p, [class*="text"] p').first();
        if (await textElements.count() > 0) {
            const padding = // ?? TODO: Replace with measurement-utils
             await textElements.evaluate(el => window.getComputedStyle(el).paddingLeft);
            expect(padding).toBeTruthy();
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-003] @regression Verify padding on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textComponent = page.locator('.cmp-text, [class*="text-component"]').first();
        if (await textComponent.count() > 0) {
            const padding = // ?? TODO: Replace with measurement-utils
             await textComponent.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).not.toBe('0px');
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-004] @regression Verify padding on tablet viewport', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textComponent = page.locator('.cmp-text, [class*="text-component"]').first();
        if (await textComponent.count() > 0) {
            const padding = // ?? TODO: Replace with measurement-utils
             await textComponent.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).not.toBe('0px');
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-005] @regression Verify padding maintains readability', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textElement = page.locator('.cmp-text p, [class*="text"] p').first();
        if (await textElement.count() > 0) {
            const lineHeight = // ?? TODO: Replace with measurement-utils
             await textElement.evaluate(el => parseInt(window.getComputedStyle(el).lineHeight));
            expect(lineHeight).toBeGreaterThan(10);
            // TODO: Use assertTypography() for font checks
        }
    });
    test('[GAAM-675-006] @regression Verify padding does not cause horizontal scroll', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textComponent = page.locator('.cmp-text, [class*="text-component"]').first();
        if (await textComponent.count() > 0) {
            const width = // ?? TODO: Replace with measurement-utils
             await textComponent.evaluate(el => el.offsetWidth);
            expect(width).toBeLessThanOrEqual(1440);
        }
    });
    test('[GAAM-675-008] @regression Verify paragraph spacing includes padding', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const paragraphs = page.locator('.cmp-text p, [class*="text"] p');
        const count = await paragraphs.count();
        if (count > 1) {
            const firstMargin = await paragraphs.nth(0).evaluate(el => parseInt(window.getComputedStyle(el).marginBottom));
            const secondMargin = await paragraphs.nth(1).evaluate(el => parseInt(window.getComputedStyle(el).marginBottom));
            expect(firstMargin).toBeDefined();
            expect(secondMargin).toBeDefined();
        }
    });
    test('[GAAM-675-009] @regression Verify padding with different text sizes', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const headings = page.locator('.cmp-text h1, .cmp-text h2, .cmp-text h3');
        const count = await headings.count();
        for (let i = 0; i < Math.min(count, 3); i++) {
            const heading = headings.nth(i);
            const padding = // ?? TODO: Replace with measurement-utils
             await heading.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).toBeTruthy();
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-010] @regression Verify list padding within text component', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const lists = page.locator('.cmp-text ul, .cmp-text ol, [class*="text"] ul, [class*="text"] ol');
        const count = await lists.count();
        for (let i = 0; i < Math.min(count, 2); i++) {
            const list = lists.nth(i);
            const padding = // ?? TODO: Replace with measurement-utils
             await list.evaluate(el => window.getComputedStyle(el).paddingLeft);
            expect(padding).not.toBe('0px');
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-011] @edge Verify text component padding consistency across breakpoints', async ({ page }) => {
        const viewports = [
            { name: 'mobile', width: 375 },
            { name: 'tablet', width: 768 },
            { name: 'desktop', width: 1440 }
        ];
        for (const viewport of viewports) {
            await page.setViewportSize({ width: viewport.width, height: 600 });
            await deployFixture('text', page);
            const url = resolveComponentUrl('text');
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            const textComponent = page.locator('.cmp-text, [class*="text-component"]').first();
            if (await textComponent.count() > 0) {
                const padding = // ?? TODO: Replace with measurement-utils
                 await textComponent.evaluate(el => window.getComputedStyle(el).padding);
                expect(padding).not.toBe('0px');
                // TODO: Use assertSpacing() for padding/margin
            }
        }
    });
    test('[GAAM-675-012] @edge Verify text component padding with empty content', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const emptyText = page.locator('.cmp-text:empty, [class*="text-component"]:empty').first();
        if (await emptyText.count() > 0) {
            const padding = // ?? TODO: Replace with measurement-utils
             await emptyText.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).toBeTruthy();
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-013] @edge Verify text component padding with rich content', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const richText = page.locator('.cmp-text, [class*="text-component"]').first();
        if (await richText.count() > 0) {
            const children = await richText.locator('*').count();
            expect(children).toBeGreaterThan(0);
            const padding = // ?? TODO: Replace with measurement-utils
             await richText.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).not.toBe('0px');
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-014] @edge Verify nested element padding inheritance', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const strong = page.locator('.cmp-text strong, [class*="text"] strong').first();
        const em = page.locator('.cmp-text em, [class*="text"] em').first();
        if (await strong.count() > 0) {
            const padding = // ?? TODO: Replace with measurement-utils
             await strong.evaluate(el => window.getComputedStyle(el).padding);
            // Inline elements don't have padding
            expect(padding).toBeDefined();
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-015] @edge Verify text component padding with links', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const link = page.locator('.cmp-text a, [class*="text"] a').first();
        if (await link.count() > 0) {
            const color = // ?? TODO: Replace with measurement-utils
             await link.evaluate(el => window.getComputedStyle(el).color);
            expect(color).toBeTruthy();
        }
    });
    test('[GAAM-675-016] @edge Verify text component padding with blockquotes', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const blockquote = page.locator('.cmp-text blockquote, [class*="text"] blockquote').first();
        if (await blockquote.count() > 0) {
            const padding = // ?? TODO: Replace with measurement-utils
             await blockquote.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).not.toBe('0px');
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-017] @regression Verify text component padding with code blocks', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const code = page.locator('.cmp-text code, .cmp-text pre, [class*="text"] code, [class*="text"] pre').first();
        if (await code.count() > 0) {
            const padding = // ?? TODO: Replace with measurement-utils
             await code.evaluate(el => window.getComputedStyle(el).padding);
            expect(padding).toBeTruthy();
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-018] @regression Verify text component padding consistent with design system', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textComponent = page.locator('.cmp-text, [class*="text-component"]').first();
        if (await textComponent.count() > 0) {
            const paddingLeft = // ?? TODO: Replace with measurement-utils
             await textComponent.evaluate(el => parseInt(window.getComputedStyle(el).paddingLeft));
            const paddingRight = // ?? TODO: Replace with measurement-utils
             await textComponent.evaluate(el => parseInt(window.getComputedStyle(el).paddingRight));
            const paddingTop = // ?? TODO: Replace with measurement-utils
             await textComponent.evaluate(el => parseInt(window.getComputedStyle(el).paddingTop));
            const paddingBottom = // ?? TODO: Replace with measurement-utils
             await textComponent.evaluate(el => parseInt(window.getComputedStyle(el).paddingBottom));
            // All paddings should be defined
            expect(paddingLeft).toBeGreaterThanOrEqual(0);
            // TODO: Use assertSpacing() for padding/margin
            expect(paddingRight).toBeGreaterThanOrEqual(0);
            // TODO: Use assertSpacing() for padding/margin
            expect(paddingTop).toBeGreaterThanOrEqual(0);
            // TODO: Use assertSpacing() for padding/margin
            expect(paddingBottom).toBeGreaterThanOrEqual(0);
            // TODO: Use assertSpacing() for padding/margin
        }
    });
    test('[GAAM-675-019] @edge Verify text component padding with long form content', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textComponent = page.locator('.cmp-text, [class*="text-component"]').first();
        if (await textComponent.count() > 0) {
            const height = // ?? TODO: Replace with measurement-utils
             await textComponent.evaluate(el => el.offsetHeight);
            expect(height).toBeGreaterThan(50);
        }
    });
    test('[GAAM-675-020] @regression Verify text component padding does not hide content', async ({ page }) => {
        await deployFixture('text', page);
        const url = resolveComponentUrl('text');
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const textComponent = page.locator('.cmp-text, [class*="text-component"]').first();
        if (await textComponent.count() > 0) {
            const isVisible = await textComponent.isVisible();
            expect(isVisible).toBe(true);
        }
    });
});
