/**
 * One-off: refresh locator sidecars ONLY (no spec regeneration) for a list of
 * components, writing to whatever path each POM's loadLocators() call actually
 * points to. Avoids the two bugs hit when using the full generate-components
 * orchestrator: (1) sidecar written to the wrong directory when a POM imports
 * from ../locators/, and (2) duplicate spec blocks from title-format mismatches.
 *
 * Usage:
 *   COMPONENTS=accordion,login,... env=local npx playwright test refresh-sidecars-only --config playwright.generators.config.ts --project chromium --workers 1
 */
import { test } from '@playwright/test';
import { scanDOM, elementToLocatorEntry } from '../utils/generation/dom-scanner';
import { loginToAEMAuthor } from '../utils/infra/auth-fixture';
import * as fs from 'fs';
import * as path from 'path';

const AUTHOR_URL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const AUTH = {
  username: process.env.AEM_AUTHOR_USERNAME || 'admin',
  password: process.env.AEM_AUTHOR_PASSWORD || 'admin',
};
const COMPONENTS_DIR = path.resolve(__dirname, '..', 'pages', 'ga', 'components');

function toPascalCase(str: string): string {
  return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}
function toCamelCase(str: string): string {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

/** Find the exact sidecar path a POM actually reads, by parsing its loadLocators() call. */
function resolveActualSidecarPath(component: string): string | null {
  const fileName = toCamelCase(component) + 'Page';
  const pomPath = path.join(COMPONENTS_DIR, `${fileName}.ts`);
  if (!fs.existsSync(pomPath)) return null;
  const content = fs.readFileSync(pomPath, 'utf-8');
  const m = content.match(/loadLocators\(path\.join\(__dirname,\s*(.+?)\)\)/);
  if (!m) return null;
  // m[1] is a comma-separated list of string literal path segments, e.g. "'../locators', 'accordionPage.locators.json'"
  const segments = m[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
  return path.resolve(COMPONENTS_DIR, ...segments);
}

function mergeEntries(existing: Record<string, any>, incoming: Record<string, any>): Record<string, any> {
  const merged = { ...existing };
  for (const [name, entry] of Object.entries(incoming) as [string, any][]) {
    if (merged[name]) {
      const existingStrategies = new Map(
        merged[name].strategies.map((s: any) => [`${s.type}:${s.value}`, s.confidence])
      );
      for (const strategy of entry.strategies) {
        const key = `${strategy.type}:${strategy.value}`;
        if (existingStrategies.has(key)) strategy.confidence = existingStrategies.get(key);
      }
      merged[name] = { ...merged[name], strategies: entry.strategies, lastVerified: new Date().toISOString() };
    } else {
      merged[name] = entry;
    }
  }
  return merged;
}

const componentsArg = process.env.COMPONENTS || '';
const components = componentsArg.split(',').map(s => s.trim()).filter(Boolean);

test.describe('Refresh sidecars only', () => {
  for (const component of components) {
    test(`refresh: ${component}`, async ({ page }) => {
      const sidecarPath = resolveActualSidecarPath(component);
      if (!sidecarPath) {
        console.log(`[SKIP] ${component}: could not resolve POM/sidecar path`);
        return;
      }

      await loginToAEMAuthor(page, { authorUrl: AUTHOR_URL, username: AUTH.username, password: AUTH.password });
      const url = `${AUTHOR_URL}/content/global-atlantic/style-guide/components/${component}.html?wcmmode=disabled`;
      const resp = await page.goto(url);
      if (!resp || resp.status() >= 400) {
        console.log(`[BLOCKED] ${component}: style guide page returned ${resp ? resp.status() : 'no response'}`);
        return;
      }
      await page.waitForTimeout(1500);

      const snapshot = await scanDOM(page, component);
      if (snapshot.elements.length === 0) {
        console.log(`[SKIP] ${component}: no elements found on style guide page`);
        return;
      }

      let incoming: Record<string, any> = {};
      for (const element of snapshot.elements) {
        const entry = elementToLocatorEntry(element, component);
        if (entry.strategies.length > 0) incoming[entry.name] = entry;
      }

      let existing: any = { entries: {} };
      if (fs.existsSync(sidecarPath)) {
        existing = JSON.parse(fs.readFileSync(sidecarPath, 'utf-8'));
      }
      const mergedEntries = mergeEntries(existing.entries || {}, incoming);
      const merged = {
        component,
        generatedAt: new Date().toISOString(),
        source: 'dom',
        entries: mergedEntries,
      };
      fs.mkdirSync(path.dirname(sidecarPath), { recursive: true });
      fs.writeFileSync(sidecarPath, JSON.stringify(merged, null, 2), 'utf-8');
      console.log(`[OK] ${component}: merged ${Object.keys(incoming).length} fresh entries into ${sidecarPath} (total: ${Object.keys(mergedEntries).length})`);
    });
  }
});
