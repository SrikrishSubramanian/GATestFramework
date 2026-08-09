/**
 * One-off: fully resync POM + locator sidecar together, from a single live
 * DOM scan, for components whose POM is pure generated boilerplate (only
 * `navigate()` + `get <name>()/click<Name>()` pairs — no hand-authored
 * logic). Unlike refresh-sidecars-only.ts (JSON-only, additive merge) this
 * REPLACES both files from the fresh scan so POM getters and JSON keys can
 * never drift apart again for these components.
 *
 * Guardrail: before touching a component, verifies the existing POM matches
 * the pure-template shape exactly. If it contains anything else (custom
 * methods, hardcoded fallback locators, etc.) it is skipped, not overwritten.
 *
 * Usage:
 *   COMPONENTS=accordion:accordion,nested-content-carousel:hero-fifty-fifty \
 *     env=local npx playwright test resync-track-a --config playwright.generators.config.ts --project chromium --workers 1
 *
 *   Each entry is "slug" or "slug:pageSlug" when the component is scanned
 *   from a different style-guide page (nested demo).
 */
import { test } from '@playwright/test';
import { scanDOM, elementToLocatorEntry } from '../utils/generation/dom-scanner';
import { loginToAEMAuthor } from '../utils/infra/auth-fixture';
import { LocatorEntry } from '../utils/infra/locator-registry';
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

interface Resolved {
  pomPath: string;
  sidecarPath: string;
  sidecarImportSegments: string[]; // segments to pass to path.join(__dirname, ...) in the POM
  className: string;
  fileName: string;
}

/** Locate the POM and the exact sidecar path it currently imports. */
function resolvePaths(component: string): Resolved | null {
  const fileName = toCamelCase(component) + 'Page';
  const className = toPascalCase(component) + 'Page';
  const pomPath = path.join(COMPONENTS_DIR, `${fileName}.ts`);
  if (!fs.existsSync(pomPath)) return null;
  const content = fs.readFileSync(pomPath, 'utf-8');
  const m = content.match(/loadLocators\(path\.join\(__dirname,\s*(.+?)\)\)/);
  if (!m) return null;
  const segments = m[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
  const sidecarPath = path.resolve(COMPONENTS_DIR, ...segments);
  return { pomPath, sidecarPath, sidecarImportSegments: segments, className, fileName };
}

/**
 * Verify the POM is pure generated boilerplate: only imports + navigate() +
 * `get <name>(): Promise<Locator>` / `async click<Name>()` pairs. Returns
 * false (skip) if anything else is found so hand-authored logic is never
 * silently destroyed.
 */
function isPureTemplate(pomContent: string): boolean {
  const body = pomContent
    .replace(/import[^\n]*\n/g, '')
    .replace(/const registry[^\n]*\n/g, '')
    .replace(/export class \w+ \{/, '')
    .replace(/constructor\(private page: Page\) \{\}/, '')
    .replace(/\/\*\*[\s\S]*?\*\//g, '') // doc comments
    .replace(/async navigate\(baseUrl: string\)[^{]*\{[\s\S]*?\n {2}\}/, '')
    .replace(/\/\/ --- Actions ---/, '');

  const getterPattern = /get \w+\(\): Promise<Locator> \{\s*return resolveLocator\(this\.page, registry\.entries\.\w+\);\s*\}/g;
  const clickPattern = /async click\w+\(\) \{\s*const el = await this\.\w+;\s*await el\.click\(\);\s*\}/g;

  const remaining = body
    .replace(getterPattern, '')
    .replace(clickPattern, '')
    .replace(/\}\s*$/, '')
    .trim();

  return remaining.length === 0;
}

function generatePOM(className: string, fileName: string, sidecarImportSegments: string[], entries: Record<string, LocatorEntry>, styleGuideUrl: string): string {
  const entryNames = Object.keys(entries);
  const getters = entryNames.map(name => {
    let getter = `  /** Locator for ${name} */\n`;
    getter += `  get ${name}(): Promise<Locator> {\n`;
    getter += `    return resolveLocator(this.page, registry.entries.${name});\n`;
    getter += `  }`;
    return getter;
  }).join('\n\n');

  const actions = entryNames
    .slice(0, 10)
    .map(name => {
      const actionName = `click${toPascalCase(name)}`;
      return `  /** Click ${name} */\n  async ${actionName}() {\n    const el = await this.${name};\n    await el.click();\n  }`;
    })
    .join('\n\n');

  const utilsDir = path.resolve(__dirname, '..', 'utils');
  const relativeUtils = path.relative(COMPONENTS_DIR, utilsDir).replace(/\\/g, '/');
  const importSegs = sidecarImportSegments.map(s => `'${s}'`).join(', ');

  return `import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '${relativeUtils}/infra/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, ${importSegs}));

export class ${className} {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(\`\${baseUrl}${styleGuideUrl}\`, { waitUntil: 'domcontentloaded' });
  }

${getters}

${actions ? `  // --- Actions ---\n\n${actions}` : ''}
}
`;
}

const componentsArg = process.env.COMPONENTS || '';
const components = componentsArg.split(',').map(s => s.trim()).filter(Boolean).map(spec => {
  const [slug, pageSlug] = spec.split(':');
  return { slug, pageSlug: pageSlug || slug };
});

test.describe('Resync Track A (pure-generated) components', () => {
  for (const { slug, pageSlug } of components) {
    test(`resync: ${slug}`, async ({ page }) => {
      const resolved = resolvePaths(slug);
      if (!resolved) {
        console.log(`[SKIP] ${slug}: could not resolve POM/sidecar path`);
        return;
      }

      const existingPomContent = fs.readFileSync(resolved.pomPath, 'utf-8');
      if (!isPureTemplate(existingPomContent)) {
        console.log(`[SKIP] ${slug}: POM contains non-template code — needs manual review, not touched`);
        return;
      }

      await loginToAEMAuthor(page, { authorUrl: AUTHOR_URL, username: AUTH.username, password: AUTH.password });
      const styleGuideUrl = `/content/global-atlantic/style-guide/components/${pageSlug}.html?wcmmode=disabled`;
      const resp = await page.goto(`${AUTHOR_URL}${styleGuideUrl}`);
      if (!resp || resp.status() >= 400) {
        console.log(`[BLOCKED] ${slug}: style guide page returned ${resp ? resp.status() : 'no response'}`);
        return;
      }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      const snapshot = await scanDOM(page, slug);
      if (snapshot.elements.length === 0) {
        console.log(`[SKIP] ${slug}: no elements found on style guide page`);
        return;
      }

      const entries: Record<string, LocatorEntry> = {};
      for (const element of snapshot.elements) {
        const entry = elementToLocatorEntry(element, slug);
        if (entry.strategies.length > 0) entries[entry.name] = entry;
      }

      const registry = {
        component: slug,
        generatedAt: new Date().toISOString(),
        source: 'dom',
        entries,
      };
      fs.writeFileSync(resolved.sidecarPath, JSON.stringify(registry, null, 2), 'utf-8');

      const pomContent = generatePOM(
        resolved.className,
        resolved.fileName,
        resolved.sidecarImportSegments,
        entries,
        `/content/global-atlantic/style-guide/components/${slug === pageSlug ? slug : pageSlug}.html?wcmmode=disabled`
      );
      fs.writeFileSync(resolved.pomPath, pomContent, 'utf-8');

      console.log(`[OK] ${slug}: regenerated ${Object.keys(entries).length} entries in ${resolved.sidecarPath} + POM ${resolved.pomPath}`);
    });
  }
});
