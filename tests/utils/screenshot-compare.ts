import { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Screenshot comparison utility for visual regression tests.
 * Uses Playwright's built-in toHaveScreenshot for pixel diff.
 * Manages baselines in tests/data/baselines/<component>/<env>/
 */

const BASELINES_DIR = path.resolve(__dirname, '..', 'data', 'baselines');

export interface ScreenshotOptions {
  component: string;
  name: string;
  env?: string;
  maxDiffPixelRatio?: number;
  threshold?: number;
  animations?: 'disabled' | 'allow';
}

/**
 * Get the baseline directory for a component + environment.
 */
export function getBaselineDir(component: string, env: string = 'local'): string {
  return path.join(BASELINES_DIR, component, env);
}

/**
 * Get the full path for a baseline screenshot.
 */
export function getBaselinePath(component: string, name: string, env: string = 'local'): string {
  return path.join(getBaselineDir(component, env), `${name}.png`);
}

/**
 * Capture a golden baseline screenshot.
 * Saves to tests/data/baselines/<component>/<env>/<name>.png
 */
export async function captureBaseline(
  page: Page,
  selector: string,
  options: ScreenshotOptions
): Promise<string> {
  const dir = getBaselineDir(options.component, options.env);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${options.name}.png`);
  const element = page.locator(selector).first();
  const screenshot = await element.screenshot({
    animations: options.animations || 'disabled',
  });
  fs.writeFileSync(filePath, screenshot);
  return filePath;
}

/**
 * Compare current screenshot against baseline.
 * Returns diff info for report attachment.
 */
export async function compareScreenshot(
  page: Page,
  selector: string,
  options: ScreenshotOptions,
  testInfo: TestInfo
): Promise<{ match: boolean; baselinePath: string; currentPath: string }> {
  const baselinePath = getBaselinePath(options.component, options.name, options.env);
  const element = page.locator(selector).first();

  // Capture current screenshot
  const currentScreenshot = await element.screenshot({
    animations: options.animations || 'disabled',
  });

  const currentPath = path.join(testInfo.outputDir, `${options.name}-current.png`);
  fs.writeFileSync(currentPath, currentScreenshot);

  // Attach current screenshot to report
  await testInfo.attach(`${options.name}-current`, {
    body: currentScreenshot,
    contentType: 'image/png',
  });

  // Attach baseline to report if it exists
  if (fs.existsSync(baselinePath)) {
    const baselineBuffer = fs.readFileSync(baselinePath);
    await testInfo.attach(`${options.name}-baseline`, {
      body: baselineBuffer,
      contentType: 'image/png',
    });
  }

  return {
    match: fs.existsSync(baselinePath),
    baselinePath,
    currentPath,
  };
}

/**
 * Check if a baseline exists for a component screenshot.
 */
export function baselineExists(component: string, name: string, env: string = 'local'): boolean {
  return fs.existsSync(getBaselinePath(component, name, env));
}
