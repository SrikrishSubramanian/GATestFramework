import { test, expect } from '@playwright/test';
import { WorkbenchPage } from '../../../pages/ga/components/workbenchPage';
import { scanImages, attachImageScanResults } from '../../../utils/generation/broken-image-detector';
import ENV from '../../../utils/infra/env';
import { loginToAEMAuthor } from '../../../utils/infra/auth-fixture';
const BASE = () => ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
test.beforeEach(async ({ page }) => {
    await loginToAEMAuthor(page);
});
test.describe('Workbench — Image Health', () => {
    test('@regression All images have alt text', async ({ page }, testInfo) => {
        const pom = new WorkbenchPage(page);
        await pom.navigate(BASE());
        const results = await scanImages(page, '.cmp-workbench');
        await attachImageScanResults(testInfo, results);
        expect(results.missingAlt).toBe(0);
    });
    test('@regression No oversized images (>500KB)', async ({ page }, testInfo) => {
        const pom = new WorkbenchPage(page);
        await pom.navigate(BASE());
        const results = await scanImages(page, '.cmp-workbench');
        await attachImageScanResults(testInfo, results);
        expect(results.oversized).toBe(0);
    });
});
