import { test, expect } from '@playwright/test';
import { testDispatcherCache } from '../../utils/generation/dispatcher-tester';
import { loginToAEMAuthor } from '../../utils/infra/auth-fixture';

test.beforeEach(async ({ page }) => {
  await loginToAEMAuthor(page);
});

test.describe('Dispatcher Cache Tests — dev', () => {
  test('@regression Dispatcher: https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/en.html', async ({ page }) => {
    const result = await testDispatcherCache(page, 'https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/en.html');
    expect(result.issues).toEqual([]);
    expect(result.status).toBeLessThan(400);
    expect(result.redirectChain.length).toBeLessThanOrEqual(1);
  });

  test('@regression Dispatcher: https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/en/about.html', async ({ page }) => {
    const result = await testDispatcherCache(page, 'https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/en/about.html');
    expect(result.issues).toEqual([]);
    expect(result.status).toBeLessThan(400);
    expect(result.redirectChain.length).toBeLessThanOrEqual(1);
  });

  test('@regression Dispatcher: https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/en/products.html', async ({ page }) => {
    const result = await testDispatcherCache(page, 'https://author-p101514-e1845752.adobeaemcloud.com/content/global-atlantic/en/products.html');
    expect(result.issues).toEqual([]);
    expect(result.status).toBeLessThan(400);
    expect(result.redirectChain.length).toBeLessThanOrEqual(1);
  });
});
