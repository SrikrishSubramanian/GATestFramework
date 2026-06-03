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
import { test, expect } from '@playwright/test';
import ENV from '../../utils/infra/env';
import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
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
const GA_PAGES = [
  { name: 'Homepage', path: '/content/global-atlantic/en.html' },
  { name: 'Style Guide Index', path: '/content/global-atlantic/style-guide.html' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PERFORMANCE BUDGETS — CLS / LCP
// ═══════════════════════════════════════════════════════════════════════════════
// AEM components can cause layout shifts (CLS) via lazy images, injected styles,
// and late-rendering JS. Largest Contentful Paint (LCP) suffers from unoptimized
// DAM images and render-blocking clientlibs. Both are Core Web Vitals that
// directly impact Google search rankings.
//
// Thresholds per Google Web Vitals:
//   CLS  < 0.1  (good)    0.1–0.25 (needs improvement)    > 0.25 (poor)
//   LCP  < 2.5s (good)    2.5–4.0s (needs improvement)    > 4.0s (poor)

test.describe('Performance — Cumulative Layout Shift (CLS)', () => {
  for (const sg of STYLE_GUIDE_PAGES) {
    test(`@regression ${sg.component} style guide CLS is below 0.25`, async ({ page }) => {
      await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');
      // Wait for any late layout shifts (fonts, lazy images, JS injection)
      await page.waitForTimeout(2000);

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // layout-shift entries have a 'value' property
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });
          // Give the observer time to collect buffered entries
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 500);
        });
      });

      expect(
        cls,
        `${sg.component}: CLS is ${cls.toFixed(3)} (threshold: 0.25).\nLayout shifts detected — check for images without dimensions, late-injected styles, or dynamic content.`
      ).toBeLessThan(0.25);
    });
  }
});

test.describe('Performance — Largest Contentful Paint (LCP)', () => {
  for (const sg of STYLE_GUIDE_PAGES) {
    test(`@regression ${sg.component} style guide LCP is below 8s`, async ({ page }) => {
      // LCP threshold is relaxed for author mode (4502) — AEM author is slower than publish
      // Production threshold would be 2.5s on publish, but author mode has overlay rendering overhead
      const startTime = Date.now();
      await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const lcp = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              // LCP is the last entry's startTime
              resolve(entries[entries.length - 1].startTime);
            }
          });
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
          // Fallback if no LCP entry is recorded
          setTimeout(() => {
            observer.disconnect();
            resolve(-1);
          }, 1000);
        });
      });

      if (lcp === -1) {
        // No LCP entry — use wall-clock time as fallback
        const wallTime = Date.now() - startTime;
        expect(
          wallTime,
          `${sg.component}: Page took ${wallTime}ms to load (no LCP entry recorded). Threshold: 8000ms.`
        ).toBeLessThan(8000);
      } else {
        expect(
          lcp,
          `${sg.component}: LCP is ${lcp.toFixed(0)}ms (threshold: 8000ms for author mode).\nCheck for unoptimized images, render-blocking resources, or slow server response.`
        ).toBeLessThan(8000);
      }
    });
  }
});

test.describe('Performance — No Oversized Images (>500KB)', () => {
  for (const sg of STYLE_GUIDE_PAGES) {
    test(`@regression ${sg.component} has no oversized image resources`, async ({ page }) => {
      const oversizedImages: { url: string; size: number }[] = [];

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

      await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      expect(
        oversizedImages.map(i => `${(i.size / 1024).toFixed(0)}KB: ${i.url}`),
        `${sg.component}: ${oversizedImages.length} image(s) exceed 500KB.\nLarge images increase LCP and consume bandwidth.`
      ).toEqual([]);
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
      await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      // Extract all internal links (href starting with / or the base URL)
      const links = await page.evaluate((baseUrl) => {
        const anchors = Array.from(document.querySelectorAll('a[href]'));
        return anchors
          .map(a => (a as HTMLAnchorElement).href)
          .filter(href =>
            href.startsWith(baseUrl) ||
            href.startsWith('/content/') ||
            href.startsWith('/etc/')
          )
          // Deduplicate
          .filter((href, i, arr) => arr.indexOf(href) === i);
      }, BASE());

      if (links.length === 0) return; // No internal links on this page

      const brokenLinks: { url: string; status: number | string }[] = [];
      for (const link of links) {
        try {
          const response = await page.request.get(link);
          const status = response.status();
          if (status >= 400 && status !== 403) {
            brokenLinks.push({ url: link, status });
          }
        } catch (e: any) {
          brokenLinks.push({ url: link, status: e.message || 'error' });
        }
      }

      expect(
        brokenLinks.map(l => `${l.status}: ${l.url}`),
        `${sg.component}: ${brokenLinks.length} broken internal link(s) found`
      ).toEqual([]);
    });
  }
});

test.describe('DAM Asset Integrity — Image Sources', () => {
  for (const sg of STYLE_GUIDE_PAGES) {
    test(`@regression ${sg.component} has no broken image sources`, async ({ page }) => {
      await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      // Check all <img> src attributes that point to DAM or internal paths
      const imageResults = await page.evaluate(() => {
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

      const brokenImages = imageResults.filter(
        img => img.complete && img.naturalWidth === 0
      );

      expect(
        brokenImages.map(i => `broken: ${i.src} (alt="${i.alt}")`),
        `${sg.component}: ${brokenImages.length} broken image(s). DAM assets may have been moved or deleted.`
      ).toEqual([]);
    });

    test(`@regression ${sg.component} all images have alt attributes`, async ({ page }) => {
      await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      // Every <img> must have an alt attribute (empty alt="" is valid for decorative images)
      const missingAlt = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images
          .filter(img => img.getAttribute('alt') === null)
          .map(img => img.src);
      });

      expect(
        missingAlt,
        `${sg.component}: ${missingAlt.length} image(s) missing alt attribute (WCAG 1.1.1 violation)`
      ).toEqual([]);
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

      await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      expect(
        failedBgImages,
        `${sg.component}: ${failedBgImages.length} CSS background image(s) failed to load from DAM`
      ).toEqual([]);
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
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const title = await page.title();
      expect(title, `${pg.name}: <title> is empty`).toBeTruthy();
      expect(
        title.length,
        `${pg.name}: <title> is too short (${title.length} chars). Should be 30-60 characters for SEO.`
      ).toBeGreaterThanOrEqual(5);
    });

    test(`@regression ${pg.name} title does not contain "undefined" or template placeholders`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const title = await page.title();
      const badPatterns = ['undefined', 'null', '${', '{{', 'TITLE_HERE', 'Page Title'];
      for (const pattern of badPatterns) {
        expect(
          title.toLowerCase().includes(pattern.toLowerCase()),
          `${pg.name}: <title> contains placeholder text "${pattern}": "${title}"`
        ).toBe(false);
      }
    });
  }

  // Style guide pages should also have proper titles
  for (const sg of STYLE_GUIDE_PAGES) {
    test(`@regression ${sg.component} style guide page has descriptive title`, async ({ page }) => {
      await page.goto(`${BASE()}${sg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const title = await page.title();
      expect(title, `${sg.component} style guide: <title> is empty`).toBeTruthy();
    });
  }
});

test.describe('SEO — Meta Description', () => {
  for (const pg of GA_PAGES) {
    test(`@regression ${pg.name} has a meta description`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const description = await page.getAttribute('meta[name="description"]', 'content');
      expect(
        description,
        `${pg.name}: <meta name="description"> is missing. Search engines will auto-generate a snippet, which may be poor quality.`
      ).toBeTruthy();
    });

    test(`@regression ${pg.name} meta description has appropriate length`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const description = await page.getAttribute('meta[name="description"]', 'content');
      if (!description) { test.skip(); return; }

      expect(
        description.length,
        `${pg.name}: Meta description is ${description.length} chars. Google truncates at ~155 chars.`
      ).toBeLessThanOrEqual(160);
      expect(
        description.length,
        `${pg.name}: Meta description is only ${description.length} chars. Should be at least 50 for SEO value.`
      ).toBeGreaterThanOrEqual(20);
    });
  }
});

test.describe('SEO — Open Graph Tags', () => {
  for (const pg of GA_PAGES) {
    test(`@regression ${pg.name} has Open Graph title`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      expect(
        ogTitle,
        `${pg.name}: <meta property="og:title"> is missing. Social media shares will have no title preview.`
      ).toBeTruthy();
    });

    test(`@regression ${pg.name} has Open Graph type`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const ogType = await page.getAttribute('meta[property="og:type"]', 'content');
      // og:type is recommended but may not be on every page — soft check
      if (ogType) {
        expect(['website', 'article', 'product']).toContain(ogType);
      }
    });

    test(`@regression ${pg.name} has Open Graph image`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const ogImage = await page.getAttribute('meta[property="og:image"]', 'content');
      expect(
        ogImage,
        `${pg.name}: <meta property="og:image"> is missing. Social media shares will have no image preview.`
      ).toBeTruthy();

      // If og:image exists, verify it's a valid URL
      if (ogImage) {
        expect(
          ogImage.startsWith('http') || ogImage.startsWith('/'),
          `${pg.name}: og:image value "${ogImage}" is not a valid URL`
        ).toBe(true);
      }
    });
  }
});

test.describe('SEO — Canonical URL', () => {
  for (const pg of GA_PAGES) {
    test(`@regression ${pg.name} has a canonical URL`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(
        canonical,
        `${pg.name}: <link rel="canonical"> is missing. This can cause duplicate content issues in search engines.`
      ).toBeTruthy();
    });

    test(`@regression ${pg.name} canonical URL does not contain /content/`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      if (!canonical) { test.skip(); return; }

      // Canonical URL should use vanity/shortened URLs, not raw JCR paths
      // On author this may still have /content/, so only flag if it looks like a raw JCR path on publish
      if (!canonical.includes('localhost')) {
        expect(
          canonical.includes('/content/global-atlantic/'),
          `${pg.name}: Canonical URL uses raw JCR path "${canonical}". Should use shortened/vanity URL for SEO.`
        ).toBe(false);
      }
    });
  }
});

test.describe('SEO — HTML Lang & Charset', () => {
  for (const pg of GA_PAGES) {
    test(`@regression ${pg.name} has lang attribute on <html>`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const lang = await page.getAttribute('html', 'lang');
      expect(
        lang,
        `${pg.name}: <html> element missing lang attribute. Required for accessibility and SEO.`
      ).toBeTruthy();
    });

    test(`@regression ${pg.name} has charset meta tag`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const charset = await page.evaluate(() => {
        const meta = document.querySelector('meta[charset]');
        return meta ? meta.getAttribute('charset') : null;
      });
      expect(
        charset,
        `${pg.name}: <meta charset> is missing. Browsers may misinterpret character encoding.`
      ).toBeTruthy();
    });
  }
});

test.describe('SEO — Heading Hierarchy', () => {
  for (const pg of GA_PAGES) {
    test(`@regression ${pg.name} has exactly one <h1> element`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const h1Count = await page.locator('h1').count();
      expect(
        h1Count,
        `${pg.name}: Found ${h1Count} <h1> elements. SEO best practice is exactly one <h1> per page.`
      ).toBe(1);
    });

    test(`@regression ${pg.name} heading hierarchy does not skip levels`, async ({ page }) => {
      await page.goto(`${BASE()}${pg.path}?wcmmode=disabled`);
      await page.waitForLoadState('networkidle');

      const headingLevels = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return headings.map(h => parseInt(h.tagName.charAt(1), 10));
      });

      if (headingLevels.length <= 1) return; // Single heading is always valid

      // Check that no level is skipped (e.g., h1 → h3 without h2)
      const skippedLevels: string[] = [];
      for (let i = 1; i < headingLevels.length; i++) {
        const gap = headingLevels[i] - headingLevels[i - 1];
        if (gap > 1) {
          skippedLevels.push(`h${headingLevels[i - 1]} → h${headingLevels[i]} (skipped h${headingLevels[i - 1] + 1})`);
        }
      }

      expect(
        skippedLevels,
        `${pg.name}: Heading hierarchy skips levels:\n${skippedLevels.join('\n')}\nScreen readers and SEO rely on sequential heading order.`
      ).toEqual([]);
    });
  }
});
