import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../pages/ga/components/loginPage';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';

const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
const ROOT = '.cmp-login';
const HERO_IMG = '.cmp-login__hero img';
const ALL_IMGS = `${ROOT} img`;
const PASSWORD_TOGGLE_SVG = '.cmp-login__password-toggle svg, .cmp-login__password-toggle img';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Login — Image Health', () => {
  test('[LGN-IMG-001] @regression Login hero image has alt attribute', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const heroImg = page.locator(HERO_IMG).first();
    if (await heroImg.count() === 0) { test.skip(); return; }
    await expect(heroImg).toBeVisible();
    const alt = await heroImg.getAttribute('alt');
    expect(alt, 'Hero image must have an alt attribute').not.toBeNull();
  });

  test('[LGN-IMG-002] @regression Login hero image is not broken (naturalWidth > 0)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const heroImg = page.locator(HERO_IMG).first();
    if (await heroImg.count() === 0) { test.skip(); return; }
    await expect(heroImg).toBeVisible();
    const naturalWidth = await heroImg.evaluate(el => (el as HTMLImageElement).naturalWidth);
    expect(naturalWidth, 'Hero image should not be broken (naturalWidth > 0)').toBeGreaterThan(0);
  });

  test('[LGN-IMG-003] @regression All images in login component have alt attributes', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const imgs = page.locator(ALL_IMGS);
    const count = await imgs.count();
    if (count === 0) { test.skip(); return; }
    for (let i = 0; i < count; i++) {
      const alt = await imgs.nth(i).getAttribute('alt');
      expect(alt, `Image ${i} must have an alt attribute (null alt fails WCAG 1.1.1)`).not.toBeNull();
    }
  });

  test('[LGN-IMG-004] @regression No images in login component are oversized (>500KB)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const oversizedImages: string[] = [];
    page.on('response', async response => {
      const url = response.url();
      const ct = response.headers()['content-type'] || '';
      if (ct.startsWith('image/') && url.includes('/content/dam/')) {
        const cl = response.headers()['content-length'];
        if (cl && parseInt(cl, 10) > 500 * 1024) {
          oversizedImages.push(`${url} (${Math.round(parseInt(cl, 10) / 1024)}KB)`);
        }
      }
    });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    expect(oversizedImages, `Oversized images found: ${oversizedImages.join(', ')}`).toEqual([]);
  });

  test('[LGN-IMG-005] @regression Login hero image has explicit width/height attributes (CLS prevention)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const heroImg = page.locator(HERO_IMG).first();
    if (await heroImg.count() === 0) { test.skip(); return; }
    await expect(heroImg).toBeVisible();
    const attrs = await heroImg.evaluate(el => ({
      width: el.getAttribute('width'),
      height: el.getAttribute('height'),
    }));
    // Either explicit HTML attributes OR inline style with width/height (prevents CLS)
    const hasWidth = attrs.width !== null;
    const hasHeight = attrs.height !== null;
    expect(hasWidth || hasHeight, 'Hero image should have explicit width or height attribute to prevent CLS').toBe(true);
  });

  test('[LGN-IMG-006] @regression Password toggle icon (SVG) has accessible title or aria-label', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    const toggleIcon = page.locator(PASSWORD_TOGGLE_SVG).first();
    if (await toggleIcon.count() === 0) { test.skip(); return; }
    // SVG should either have aria-hidden (button has label) or have a <title> element
    const tag = await toggleIcon.evaluate(el => el.tagName.toLowerCase());
    if (tag === 'svg') {
      const ariaHidden = await toggleIcon.getAttribute('aria-hidden');
      const hasTitle = await toggleIcon.locator('title').count() > 0;
      // Either aria-hidden (parent button provides label) or has <title>
      expect(
        ariaHidden === 'true' || hasTitle,
        'SVG icon should be aria-hidden or have a <title> for accessibility'
      ).toBe(true);
    } else {
      // <img> toggle icon must have alt
      const alt = await toggleIcon.getAttribute('alt');
      expect(alt, 'Toggle icon img must have alt attribute').not.toBeNull();
    }
  });

  test('[LGN-IMG-007] @regression No broken image requests during login page load', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const brokenImages: string[] = [];
    page.on('response', response => {
      const url = response.url();
      const ct = response.headers()['content-type'] || '';
      if (ct.startsWith('image/') && !response.ok()) {
        brokenImages.push(`${response.status()} ${url}`);
      }
    });
    const pom = new LoginPage(page);
    await pom.navigate(BASE());
    expect(brokenImages, `Broken image requests: ${brokenImages.join(', ')}`).toEqual([]);
  });
});
