import { Page, TestInfo } from '@playwright/test';

export interface BrokenImageResult {
  src: string;
  alt: string | null;
  naturalWidth: number;
  naturalHeight: number;
  isBroken: boolean;
  missingAlt: boolean;
  oversized: boolean;
  fileSize: number;
  missingDimensions: boolean;
}

export interface ImageScanResult {
  total: number;
  broken: number;
  missingAlt: number;
  oversized: number;
  missingDimensions: number;
  images: BrokenImageResult[];
}

const MAX_IMAGE_SIZE_KB = 500;

/**
 * Scan all images within a component for common issues.
 */
export async function scanImages(
  page: Page,
  componentSelector: string
): Promise<ImageScanResult> {
  const images = await page.evaluate(
    ({ selector, maxSizeKb }) => {
      const results: any[] = [];
      const imgs = document.querySelectorAll(`${selector} img`);

      imgs.forEach((img: Element) => {
        const el = img as HTMLImageElement;
        const src = el.src || el.getAttribute('data-src') || '';
        const alt = el.getAttribute('alt');
        const naturalWidth = el.naturalWidth;
        const naturalHeight = el.naturalHeight;

        // Check if image has explicit width/height attributes (CLS prevention)
        const hasWidth = el.hasAttribute('width') || el.style.width !== '';
        const hasHeight = el.hasAttribute('height') || el.style.height !== '';

        results.push({
          src,
          alt,
          naturalWidth,
          naturalHeight,
          isBroken: naturalWidth === 0 || naturalHeight === 0,
          missingAlt: alt === null || alt === undefined,
          oversized: false, // Will check via network
          fileSize: 0,
          missingDimensions: !hasWidth || !hasHeight,
        });
      });

      return results;
    },
    { selector: componentSelector, maxSizeKb: MAX_IMAGE_SIZE_KB }
  );

  // Check file sizes via network requests
  for (const img of images) {
    if (img.src && !img.isBroken) {
      try {
        const response = await page.request.head(img.src);
        const contentLength = response.headers()['content-length'];
        if (contentLength) {
          img.fileSize = parseInt(contentLength);
          img.oversized = img.fileSize > MAX_IMAGE_SIZE_KB * 1024;
        }
      } catch {
        // Network request failed — mark as potentially broken
      }
    }
  }

  const result: ImageScanResult = {
    total: images.length,
    broken: images.filter((i: BrokenImageResult) => i.isBroken).length,
    missingAlt: images.filter((i: BrokenImageResult) => i.missingAlt).length,
    oversized: images.filter((i: BrokenImageResult) => i.oversized).length,
    missingDimensions: images.filter((i: BrokenImageResult) => i.missingDimensions).length,
    images: images as BrokenImageResult[],
  };

  return result;
}

/**
 * Attach image scan results to test report.
 */
export async function attachImageScanResults(
  testInfo: TestInfo,
  results: ImageScanResult
): Promise<void> {
  if (results.total === 0) return;

  const lines: string[] = [
    `Image Scan: ${results.total} images found`,
    `  Broken: ${results.broken}`,
    `  Missing alt: ${results.missingAlt}`,
    `  Oversized (>${MAX_IMAGE_SIZE_KB}KB): ${results.oversized}`,
    `  Missing dimensions (CLS risk): ${results.missingDimensions}`,
    '',
  ];

  const issues = results.images.filter(i => i.isBroken || i.missingAlt || i.oversized || i.missingDimensions);
  for (const img of issues) {
    const flags = [];
    if (img.isBroken) flags.push('BROKEN');
    if (img.missingAlt) flags.push('NO ALT');
    if (img.oversized) flags.push(`OVERSIZED ${Math.round(img.fileSize / 1024)}KB`);
    if (img.missingDimensions) flags.push('NO DIMENSIONS');
    lines.push(`  [${flags.join(', ')}] ${img.src.slice(0, 100)}`);
  }

  await testInfo.attach('image-scan-results', {
    body: Buffer.from(lines.join('\n'), 'utf-8'),
    contentType: 'text/plain',
  });
}
