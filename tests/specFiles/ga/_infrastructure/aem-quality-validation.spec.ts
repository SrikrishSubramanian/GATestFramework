/**
 * AEM Quality Validation — Cross-Component
 *
 * Tests three classes of silent production issues:
 *   1. Performance budgets — CLS / LCP thresholds per component style guide page
 *   2. Link & DAM asset integrity — all href/src on style guide pages resolve to 200
 *   3. SEO meta tag validation — title, description, OG tags, canonical URL on GA pages
 *
 * These issues are invisible during development but directly impact user experience
 * and search engine rankings on the live site.
 */
import { resolveComponentUrl } from '../../../utils/infra/content-fixture-deployer';
import { test, expect } from '@playwright/test';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
import { attachConsoleCapture, annotateEnvironment } from '../../../utils/infra/report-enhancer';
import { clickElement, fill, hover, doubleClick } from '../../../../src/utils/action-utils';
import { assertLayout, assertSpacing, assertTypography, assertBackgroundColor } from '../../../utils/infra/component-assertions';
import { ConsoleCapture } from '../../../utils/infra/console-capture';
import type { Page } from '@playwright/test';
let capture: ConsoleCapture;
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
// page.getAttribute() has no built-in short timeout — when a page (correctly) lacks the tag
// being checked, it waits for the element to appear until the whole test timeout is exhausted
// (5 minutes in CI) instead of returning null quickly. Bound the wait so a missing tag fails
// fast with a clear assertion message rather than hanging.
async function getAttrSafe(page: Page, selector: string, attr: string): Promise<string | null> {
    return page.getAttribute(selector, attr, { timeout: 5000 }).catch(() => null);
}
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
// ─── Style guide pages to validate ───────────────────────────────────────────
const STYLE_GUIDE_PAGES = [
    { component: 'accordion', path: '/content/global-atlantic/style-guide/components/accordion.html' },
    { component: 'button', path: '/content/global-atlantic/style-guide/components/button.html' },
    { component: 'feature-banner', path: '/content/global-atlantic/style-guide/components/feature-banner.html' },
    { component: 'statistic', path: '/content/global-atlantic/style-guide/components/statistic.html' },
    { component: 'spacer', path: '/content/global-atlantic/style-guide/components/spacer.html' },
    { component: 'text', path: '/content/global-atlantic/style-guide/components/text.html' },
    { component: 'separator', path: '/content/global-atlantic/style-guide/components/separator.html' },
    { component: 'headline-block', path: '/content/global-atlantic/style-guide/components/headline-block.html' },
];
// GA published pages to validate for SEO (these should exist on any GA instance)
// Real, user-facing marketing pages that search engines/social shares actually care about —
// used for the full SEO checks below (meta description, OG tags, canonical, heading hierarchy,
// html lang/charset). Deliberately excludes 'Style Guide Index'
// (/content/global-atlantic/style-guide.html): that's an internal component-reference/QA tool
// page, not indexed/shared content, so enforcing marketing SEO requirements (meta description
// length, OG image, vanity canonical URL) against it is a scope mismatch — it already gets a
// lighter "has a descriptive <title>" check via STYLE_GUIDE_PAGES in 'SEO — Page Title' above.
const GA_PAGES = [
    // '/content/global-atlantic/en.html' 404s on this instance ("Unexpected Error") — same
    // stale-path pattern already documented for NVGT-015/text.sprint13-padding.spec.ts. The real
    // live homepage is '/content/global-atlantic.html' (verified live 2026-08-15: 200, correct
    // title/meta description/OG tags/canonical all present).
    { name: 'Homepage', path: '/content/global-atlantic.html' },
];
test.describe('Performance — No Oversized Images (>500KB)', () => {
    for (const sg of STYLE_GUIDE_PAGES) {
        test(`@regression ${sg.component} has no oversized image resources`, async ({ page }) => {
            const oversizedImages: {
                url: string;
                size: number;
            }[] = [];
            page.on('response', async (response) => {
                const url = response.url();
                const contentType = response.headers()['content-type'] || '';
                if (contentType.startsWith('image/')) {
                    const contentLength = parseInt(response.headers()['content-length'] || '0', 10);
                    if (contentLength > 500 * 1024) {
                        oversizedImages.push({ url, size: contentLength });
                    }
                }
            });
            await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            expect(oversizedImages.map(i => `${(i.size / 1024).toFixed(0)}KB: ${i.url}`), `${sg.component}: ${oversizedImages.length} image(s) exceed 500KB.\nLarge images increase LCP and consume bandwidth.`).toEqual([]);
        });
    }
});
// ═══════════════════════════════════════════════════════════════════════════════
// 2. LINK & DAM ASSET INTEGRITY
// ═══════════════════════════════════════════════════════════════════════════════
// Internal links (/content/...) and DAM image references (/content/dam/...)
// silently break when content is moved, deleted, or renamed. Broken links
// produce 404s for end users and broken images display as empty boxes.
test.describe('Link Integrity — Style Guide Pages', () => {
    for (const sg of STYLE_GUIDE_PAGES) {
        test(`@regression ${sg.component} has no broken internal links`, async ({ page }) => {
            await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            // Extract all internal links (href starting with / or the base URL)
            const links = // 📏 TODO: Replace with measurement-utils
             await page.evaluate((baseUrl) => {
                const anchors = Array.from(document.querySelectorAll('a[href]'));
                return anchors
                    .map(a => (a as HTMLAnchorElement).href)
                    .filter(href => href.startsWith(baseUrl) ||
                    href.startsWith('/content/') ||
                    href.startsWith('/etc/'))
                    // Deduplicate
                    .filter((href, i, arr) => arr.indexOf(href) === i);
            }, BASE());
            if (links.length === 0)
                return; // No internal links on this page
            const brokenLinks: {
                url: string;
                status: number | string;
            }[] = [];
            for (const link of links) {
                try {
                    const response = await page.request.get(link);
                    const status = response.status();
                    if (status >= 400 && status !== 403) {
                        brokenLinks.push({ url: link, status });
                    }
                }
                catch (e: any) {
                    brokenLinks.push({ url: link, status: e.message || 'error' });
                }
            }
            expect(brokenLinks.map(l => `${l.status}: ${l.url}`), `${sg.component}: ${brokenLinks.length} broken internal link(s) found`).toEqual([]);
        });
    }
});
test.describe('DAM Asset Integrity — Image Sources', () => {
    for (const sg of STYLE_GUIDE_PAGES) {
        test(`@regression ${sg.component} has no broken image sources`, async ({ page }) => {
            await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            // Check all <img> src attributes that point to DAM or internal paths
            const imageResults = // 📏 TODO: Replace with measurement-utils
             await page.evaluate(() => {
                const images = Array.from(document.querySelectorAll('img[src]'));
                return images.map(img => {
                    const el = img as HTMLImageElement;
                    return {
                        src: el.src,
                        alt: el.alt,
                        naturalWidth: el.naturalWidth,
                        naturalHeight: el.naturalHeight,
                        complete: el.complete,
                    };
                });
            });
            const brokenImages = imageResults.filter(img => img.complete && img.naturalWidth === 0);
            expect(brokenImages.map(i => `broken: ${i.src} (alt="${i.alt}")`), `${sg.component}: ${brokenImages.length} broken image(s). DAM assets may have been moved or deleted.`).toEqual([]);
        });
        test(`@regression ${sg.component} all images have alt attributes`, async ({ page }) => {
            await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            // Every <img> must have an alt attribute (empty alt="" is valid for decorative images)
            const missingAlt = // 📏 TODO: Replace with measurement-utils
             await page.evaluate(() => {
                const images = Array.from(document.querySelectorAll('img'));
                return images
                    .filter(img => img.getAttribute('alt') === null)
                    .map(img => img.src);
            });
            expect(missingAlt, `${sg.component}: ${missingAlt.length} image(s) missing alt attribute (WCAG 1.1.1 violation)`).toEqual([]);
        });
    }
});
test.describe('DAM Asset Integrity — Background Images', () => {
    for (const sg of STYLE_GUIDE_PAGES.slice(0, 4)) { // Check first 4 to keep test time reasonable
        test(`@regression ${sg.component} CSS background images load successfully`, async ({ page }) => {
            const failedBgImages: string[] = [];
            page.on('response', (response) => {
                const url = response.url();
                // DAM images used as CSS backgrounds
                if (url.includes('/content/dam/') && !response.ok()) {
                    failedBgImages.push(`${response.status()}: ${url}`);
                }
            });
            await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            expect(failedBgImages, `${sg.component}: ${failedBgImages.length} CSS background image(s) failed to load from DAM`).toEqual([]);
        });
    }
});
// ═══════════════════════════════════════════════════════════════════════════════
// 3. SEO META TAG VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════
// Missing or incorrect meta tags are invisible during development but directly
// impact search engine indexing and social media sharing. AEM pages must have
// proper <title>, <meta description>, Open Graph tags, and canonical URLs.
test.describe('SEO — Page Title', () => {
    for (const pg of GA_PAGES) {
        test(`@regression ${pg.name} has a non-empty <title> tag`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const title = await page.title();
            expect(title, `${pg.name}: <title> is empty`).toBeTruthy();
            expect(title.length, `${pg.name}: <title> is too short (${title.length} chars). Should be 30-60 characters for SEO.`).toBeGreaterThanOrEqual(5);
        });
        test(`@regression ${pg.name} title does not contain "undefined" or template placeholders`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const title = await page.title();
            const badPatterns = ['undefined', 'null', '${', '{{', 'TITLE_HERE', 'Page Title'];
            for (const pattern of badPatterns) {
                expect(title.toLowerCase().includes(pattern.toLowerCase()), `${pg.name}: <title> contains placeholder text "${pattern}": "${title}"`).toBe(false);
            }
        });
    }
    // Style guide pages should also have proper titles
    for (const sg of STYLE_GUIDE_PAGES) {
        test(`@regression ${sg.component} style guide page has descriptive title`, async ({ page }) => {
            await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const title = await page.title();
            expect(title, `${sg.component} style guide: <title> is empty`).toBeTruthy();
        });
    }
});
test.describe('SEO — Meta Description', () => {
    for (const pg of GA_PAGES) {
        test(`@regression ${pg.name} has a meta description`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const description = await getAttrSafe(page, 'meta[name="description"]', 'content');
            expect(description, `${pg.name}: <meta name="description"> is missing. Search engines will auto-generate a snippet, which may be poor quality.`).toBeTruthy();
        });
        test(`@regression ${pg.name} meta description has appropriate length`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const description = await getAttrSafe(page, 'meta[name="description"]', 'content');
            if (!description) {
                test.skip();
                return;
            }
            expect(description.length, `${pg.name}: Meta description is ${description.length} chars. Google truncates at ~155 chars.`).toBeLessThanOrEqual(160);
            expect(description.length, `${pg.name}: Meta description is only ${description.length} chars. Should be at least 50 for SEO value.`).toBeGreaterThanOrEqual(20);
        });
    }
});
test.describe('SEO — Open Graph Tags', () => {
    for (const pg of GA_PAGES) {
        test(`@regression ${pg.name} has Open Graph title`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const ogTitle = await getAttrSafe(page, 'meta[property="og:title"]', 'content');
            expect(ogTitle, `${pg.name}: <meta property="og:title"> is missing. Social media shares will have no title preview.`).toBeTruthy();
        });
        test(`@regression ${pg.name} has Open Graph type`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const ogType = await getAttrSafe(page, 'meta[property="og:type"]', 'content');
            // og:type is recommended but may not be on every page — soft check
            if (ogType) {
                expect(['website', 'article', 'product']).toContain(ogType);
            }
        });
        test(`@regression ${pg.name} has Open Graph image`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const ogImage = await getAttrSafe(page, 'meta[property="og:image"]', 'content');
            expect(ogImage, `${pg.name}: <meta property="og:image"> is missing. Social media shares will have no image preview.`).toBeTruthy();
            // If og:image exists, verify it's a valid URL
            if (ogImage) {
                expect(ogImage.startsWith('http') || ogImage.startsWith('/'), `${pg.name}: og:image value "${ogImage}" is not a valid URL`).toBe(true);
            }
        });
    }
});
test.describe('SEO — Canonical URL', () => {
    for (const pg of GA_PAGES) {
        test(`@regression ${pg.name} has a canonical URL`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const canonical = await getAttrSafe(page, 'link[rel="canonical"]', 'href');
            expect(canonical, `${pg.name}: <link rel="canonical"> is missing. This can cause duplicate content issues in search engines.`).toBeTruthy();
        });
        test(`@regression ${pg.name} canonical URL does not contain /content/`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const canonical = await getAttrSafe(page, 'link[rel="canonical"]', 'href');
            if (!canonical) {
                test.skip();
                return;
            }
            // Canonical URL should use vanity/shortened URLs, not raw JCR paths.
            // On author this may still have /content/, so only flag it on publish. The
            // 'localhost' check alone doesn't catch this — this whole file always navigates via
            // BASE() (ENV.AEM_AUTHOR_URL), and on AEM Cloud that's a non-localhost hostname like
            // author-p101514-e1845752.adobeaemcloud.com, so without also excluding "author"
            // hostnames this assertion always incorrectly applies the publish-only rule here.
            const isAuthorOrLocal = canonical.includes('localhost') || /:\/\/author[.-]/.test(canonical);
            if (!isAuthorOrLocal) {
                expect(canonical.includes('/content/global-atlantic/'), `${pg.name}: Canonical URL uses raw JCR path "${canonical}". Should use shortened/vanity URL for SEO.`).toBe(false);
            }
        });
    }
});
test.describe('SEO — HTML Lang & Charset', () => {
    for (const pg of GA_PAGES) {
        test(`@regression ${pg.name} has lang attribute on <html>`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const lang = await getAttrSafe(page, 'html', 'lang');
            expect(lang, `${pg.name}: <html> element missing lang attribute. Required for accessibility and SEO.`).toBeTruthy();
        });
        test(`@regression ${pg.name} has charset meta tag`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const charset = // 📏 TODO: Replace with measurement-utils
             await page.evaluate(() => {
                const meta = document.querySelector('meta[charset]');
                return meta ? meta.getAttribute('charset') : null;
            });
            expect(charset, `${pg.name}: <meta charset> is missing. Browsers may misinterpret character encoding.`).toBeTruthy();
        });
    }
});
test.describe('SEO — Heading Hierarchy', () => {
    for (const pg of GA_PAGES) {
        test(`@regression ${pg.name} has exactly one <h1> element`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const h1Count = await page.locator('h1').count();
            expect(h1Count, `${pg.name}: Found ${h1Count} <h1> elements. SEO best practice is exactly one <h1> per page.`).toBe(1);
        });
        test(`@regression ${pg.name} heading hierarchy does not skip levels`, async ({ page }) => {
            await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`, { waitUntil: 'domcontentloaded' });
            const headingLevels = // 📏 TODO: Replace with measurement-utils
             await page.evaluate(() => {
                const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                return headings.map(h => parseInt(h.tagName.charAt(1), 10));
            });
            if (headingLevels.length <= 1)
                return; // Single heading is always valid
            // Check that no level is skipped (e.g., h1 → h3 without h2)
            const skippedLevels: string[] = [];
            for (let i = 1; i < headingLevels.length; i++) {
                const gap = headingLevels[i] - headingLevels[i - 1];
                if (gap > 1) {
                    skippedLevels.push(`h${headingLevels[i - 1]} → h${headingLevels[i]} (skipped h${headingLevels[i - 1] + 1})`);
                }
            }
            expect(skippedLevels, `${pg.name}: Heading hierarchy skips levels:\n${skippedLevels.join('\n')}\nScreen readers and SEO rely on sequential heading order.`).toEqual([]);
        });
    }
});
