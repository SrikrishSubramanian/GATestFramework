import { Locator, TestInfo } from '@playwright/test';

/**
 * Scan images for broken images, missing alt text, etc.
 * @param images - Locator for image elements
 * @returns Promise with scan results
 */
export async function scanImages(images: Locator): Promise<{
  broken: Array<{ src: string; alt?: string }>;
  missingAlt: Array<{ src: string }>;
  total: number;
}> {
  const count = await images.count();
  const broken = [];
  const missingAlt = [];

  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);

    if (src) {
      if (naturalWidth === 0) {
        broken.push({ src, alt: alt || undefined });
      }
      if (!alt) {
        missingAlt.push({ src });
      }
    }
  }

  return { broken, missingAlt, total: count };
}

/**
 * Attach image scan results to Playwright test report
 * @param testInfo - Playwright TestInfo object
 * @param results - Results from scanImages()
 */
export async function attachImageScanResults(
  testInfo: TestInfo,
  results: {
    broken: Array<{ src: string; alt?: string }>;
    missingAlt: Array<{ src: string }>;
    total: number;
  }
): Promise<void> {
  const report = `Image Scan Report
================

Total images: ${results.total}
Broken images: ${results.broken.length}
Missing alt text: ${results.missingAlt.length}

${results.broken.length > 0 ? `Broken Images:\n${results.broken.map(img => `- ${img.src}`).join('\n')}\n` : ''}
${results.missingAlt.length > 0 ? `Missing Alt Text:\n${results.missingAlt.map(img => `- ${img.src}`).join('\n')}` : ''}
`;

  await testInfo.attach('image-scan-report', {
    body: Buffer.from(report, 'utf-8'),
    contentType: 'text/plain',
  });

  if (results.broken.length > 0) {
    testInfo.annotations.push({
      type: 'broken-images',
      description: `${results.broken.length} broken image(s) detected`,
    });
  }

  if (results.missingAlt.length > 0) {
    testInfo.annotations.push({
      type: 'missing-alt-text',
      description: `${results.missingAlt.length} image(s) missing alt text`,
    });
  }
}
