import { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASELINES_DIR = path.resolve(__dirname, '..', 'data', 'baselines');

export interface BaselineInfo {
  component: string;
  name: string;
  env: string;
  path: string;
  capturedAt: string;
  viewport: { width: number; height: number };
}

export interface BaselineManifest {
  component: string;
  env: string;
  baselines: BaselineInfo[];
  lastUpdated: string;
}

/**
 * Capture a baseline screenshot for a component.
 */
export async function captureComponentBaseline(
  page: Page,
  componentSelector: string,
  component: string,
  env: string = 'local'
): Promise<BaselineInfo> {
  const dir = path.join(BASELINES_DIR, component, env);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const viewport = page.viewportSize() || { width: 1280, height: 720 };
  const name = `${component}-${viewport.width}x${viewport.height}`;
  const filePath = path.join(dir, `${name}.png`);

  const element = page.locator(componentSelector).first();
  const buffer = await element.screenshot({ animations: 'disabled' });
  fs.writeFileSync(filePath, buffer);

  const info: BaselineInfo = {
    component,
    name,
    env,
    path: filePath,
    capturedAt: new Date().toISOString(),
    viewport,
  };

  updateManifest(component, env, info);
  return info;
}

/**
 * Capture baselines at multiple viewports.
 */
export async function captureResponsiveBaselines(
  page: Page,
  componentSelector: string,
  component: string,
  env: string = 'local'
): Promise<BaselineInfo[]> {
  const viewports = [
    { width: 1440, height: 900, label: 'desktop' },
    { width: 1024, height: 1366, label: 'tablet' },
    { width: 390, height: 844, label: 'mobile' },
  ];

  const results: BaselineInfo[] = [];
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(500); // Allow reflow
    const info = await captureComponentBaseline(page, componentSelector, component, env);
    results.push(info);
  }

  return results;
}

/**
 * Get the baseline path for comparison.
 */
export function getBaselineForViewport(
  component: string,
  viewport: { width: number; height: number },
  env: string = 'local'
): string | null {
  const name = `${component}-${viewport.width}x${viewport.height}`;
  const filePath = path.join(BASELINES_DIR, component, env, `${name}.png`);
  return fs.existsSync(filePath) ? filePath : null;
}

/**
 * Compare current screenshot against baseline, attaching both to test report.
 */
export async function compareWithBaseline(
  page: Page,
  componentSelector: string,
  component: string,
  testInfo: TestInfo,
  env: string = 'local'
): Promise<{ match: boolean; baselinePath: string | null; diffAttached: boolean }> {
  const viewport = page.viewportSize() || { width: 1280, height: 720 };
  const baselinePath = getBaselineForViewport(component, viewport, env);

  // Capture current
  const element = page.locator(componentSelector).first();
  const currentBuffer = await element.screenshot({ animations: 'disabled' });

  // Attach current
  await testInfo.attach(`${component}-current-${viewport.width}x${viewport.height}`, {
    body: currentBuffer,
    contentType: 'image/png',
  });

  if (!baselinePath) {
    return { match: false, baselinePath: null, diffAttached: false };
  }

  // Attach baseline
  const baselineBuffer = fs.readFileSync(baselinePath);
  await testInfo.attach(`${component}-baseline-${viewport.width}x${viewport.height}`, {
    body: baselineBuffer,
    contentType: 'image/png',
  });

  return { match: true, baselinePath, diffAttached: true };
}

/**
 * List all baselines for a component.
 */
export function listBaselines(component: string, env?: string): BaselineInfo[] {
  const manifestPath = getManifestPath(component, env || 'local');
  if (!fs.existsSync(manifestPath)) return [];
  const manifest: BaselineManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  return manifest.baselines;
}

/**
 * Delete all baselines for a component/env.
 */
export function clearBaselines(component: string, env: string = 'local'): void {
  const dir = path.join(BASELINES_DIR, component, env);
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(f => fs.unlinkSync(path.join(dir, f)));
    fs.rmdirSync(dir);
  }
}

function getManifestPath(component: string, env: string): string {
  return path.join(BASELINES_DIR, component, env, 'manifest.json');
}

function updateManifest(component: string, env: string, info: BaselineInfo): void {
  const manifestPath = getManifestPath(component, env);
  let manifest: BaselineManifest;

  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    // Replace or add
    const idx = manifest.baselines.findIndex(b => b.name === info.name);
    if (idx >= 0) {
      manifest.baselines[idx] = info;
    } else {
      manifest.baselines.push(info);
    }
  } else {
    manifest = { component, env, baselines: [info], lastUpdated: '' };
  }

  manifest.lastUpdated = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
}
