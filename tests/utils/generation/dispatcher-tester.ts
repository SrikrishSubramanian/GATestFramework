import { Page } from '@playwright/test';

export interface DispatcherTestResult {
  url: string;
  cacheControl: string | null;
  contentType: string | null;
  status: number;
  redirectChain: string[];
  issues: string[];
}

/**
 * Test dispatcher cache behavior for a URL.
 * Non-local environments only.
 */
export async function testDispatcherCache(
  page: Page,
  url: string
): Promise<DispatcherTestResult> {
  const issues: string[] = [];
  const redirectChain: string[] = [];

  // Track redirects via response interception
  const responses: Array<{ url: string; status: number; headers: Record<string, string> }> = [];
  const responseHandler = (response: any) => {
    responses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
    });
  };
  page.on('response', responseHandler);

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Build redirect chain
    for (const r of responses) {
      if (r.status >= 300 && r.status < 400) {
        redirectChain.push(r.url);
      }
    }

    const finalResponse = responses[responses.length - 1];
    const cacheControl = finalResponse?.headers['cache-control'] || null;
    const contentType = finalResponse?.headers['content-type'] || null;
    const status = finalResponse?.status || 0;

    // Validate Cache-Control
    if (!cacheControl) {
      issues.push('Missing Cache-Control header');
    } else if (cacheControl.includes('no-cache') || cacheControl.includes('no-store')) {
      // Acceptable for personalized content
    } else if (!cacheControl.includes('max-age')) {
      issues.push('Cache-Control missing max-age directive');
    }

    // Validate Content-Type
    if (url.endsWith('.html') && contentType && !contentType.includes('text/html')) {
      issues.push(`Unexpected Content-Type for .html: ${contentType}`);
    }

    // Validate redirect chain (max 1 hop)
    if (redirectChain.length > 1) {
      issues.push(`Redirect chain too long: ${redirectChain.length} hops (max 1)`);
    }

    // Validate .html resolution
    if (url.endsWith('.html') && status === 404) {
      issues.push('.html URL returned 404 — possible dispatcher rewrite issue');
    }

    return { url, cacheControl, contentType, status, redirectChain, issues };
  } finally {
    page.removeListener('response', responseHandler);
  }
}

/**
 * Test that personalized content is excluded from cache.
 */
export async function testPersonalizedContentExclusion(
  page: Page,
  url: string,
  personalizedSelectors: string[]
): Promise<{ excluded: boolean; issues: string[] }> {
  const issues: string[] = [];

  const response = await page.goto(url, { waitUntil: 'networkidle' });
  const headers = response?.headers() || {};
  const cacheControl = headers['cache-control'] || '';

  // If page has personalized content, cache should be disabled
  for (const selector of personalizedSelectors) {
    const count = await page.locator(selector).count();
    if (count > 0) {
      if (!cacheControl.includes('no-cache') && !cacheControl.includes('no-store') && !cacheControl.includes('private')) {
        issues.push(`Personalized content found (${selector}) but page is publicly cached: ${cacheControl}`);
      }
    }
  }

  return { excluded: issues.length === 0, issues };
}

/**
 * Generate dispatcher test spec content.
 */
export function generateDispatcherSpec(
  urls: string[],
  envName: string
): string {
  const tests = urls.map(url => {
    return `  test('@regression Dispatcher: ${url}', async ({ page }) => {
    const result = await testDispatcherCache(page, '${url}');
    expect(result.issues).toEqual([]);
    expect(result.status).toBeLessThan(400);
    expect(result.redirectChain.length).toBeLessThanOrEqual(1);
  });`;
  }).join('\n\n');

  return `import { test, expect } from '@playwright/test';
import { testDispatcherCache } from '../../utils/generation/dispatcher-tester';

test.describe('Dispatcher Cache Tests — ${envName}', () => {
${tests}
});
`;
}
