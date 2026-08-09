import { test, expect } from '@playwright/test';
import { HomepageHeroPage } from '../../../pages/ga/components/homepageHeroPage';
import { scanImages, attachImageScanResults } from '../../../utils/generation/broken-image-detector';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('HomepageHero — Image Health', () => {
    test('@regression No broken images', async ({ page }, testInfo) => {
        const pom = new HomepageHeroPage(page);
        await pom.navigate(BASE());
        const results = await scanImages(page, '.cmp-homepage-hero');
        await attachImageScanResults(testInfo, results);
        expect(results.broken).toBe(0);
    });
});
