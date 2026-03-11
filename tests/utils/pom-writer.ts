import * as fs from 'fs';
import * as path from 'path';
import { LocatorRegistry, LocatorEntry } from './locator-registry';
import { DOMSnapshot, DOMElement, elementToLocatorEntry } from './dom-scanner';
import { SourceComponentData, inferElementsFromSource, sourceElementToStrategies } from './source-scanner';

const GA_COMPONENTS_DIR = path.resolve(__dirname, '..', 'pages', 'ga', 'components');
const GA_PAGES_DIR = path.resolve(__dirname, '..', 'pages', 'ga', 'pages');

export interface POMWriterOptions {
  component: string;
  outputDir?: string;
  mode?: 'create' | 'update';
  styleGuideUrl?: string;
}

export interface POMWriteResult {
  pomPath: string;
  sidecarPath: string;
  className: string;
  elementCount: number;
  isUpdate: boolean;
}

/**
 * Generate a POM class and locator sidecar from a DOM snapshot.
 */
export function writePOMFromDOM(
  snapshot: DOMSnapshot,
  options: POMWriterOptions
): POMWriteResult {
  const dir = options.outputDir || GA_COMPONENTS_DIR;
  ensureDir(dir);

  const className = toPascalCase(options.component) + 'Page';
  const fileName = toCamelCase(options.component) + 'Page';
  const pomPath = path.join(dir, `${fileName}.ts`);
  const sidecarPath = path.join(dir, `${fileName}.locators.json`);

  // Build locator entries from DOM elements
  let entries: Record<string, LocatorEntry> = {};
  for (const element of snapshot.elements) {
    const entry = elementToLocatorEntry(element, options.component);
    if (entry.strategies.length > 0) {
      entries[entry.name] = entry;
    }
  }

  // Handle update mode — merge with existing sidecar
  if (options.mode === 'update' && fs.existsSync(sidecarPath)) {
    const existing = JSON.parse(fs.readFileSync(sidecarPath, 'utf-8')) as LocatorRegistry;
    entries = mergeEntries(existing.entries, entries);
  }

  // Write sidecar JSON
  const registry: LocatorRegistry = {
    component: options.component,
    generatedAt: new Date().toISOString(),
    source: 'dom',
    entries,
  };
  fs.writeFileSync(sidecarPath, JSON.stringify(registry, null, 2), 'utf-8');

  // Write POM TypeScript class
  const styleGuideUrl = options.styleGuideUrl ||
    `/content/global-atlantic/style-guide/components/${options.component}.html?wcmmode=disabled`;
  const pomContent = generatePOMClass(className, fileName, entries, styleGuideUrl, dir);

  // In update mode, only write POM if it doesn't exist (preserve manual edits)
  if (options.mode === 'update' && fs.existsSync(pomPath)) {
    // Don't overwrite existing POM — only update sidecar
  } else {
    fs.writeFileSync(pomPath, pomContent, 'utf-8');
  }

  return {
    pomPath,
    sidecarPath,
    className,
    elementCount: Object.keys(entries).length,
    isUpdate: options.mode === 'update' && fs.existsSync(pomPath),
  };
}

/**
 * Generate a POM class and locator sidecar from source scan data.
 */
export function writePOMFromSource(
  data: SourceComponentData,
  options: POMWriterOptions
): POMWriteResult {
  const dir = options.outputDir || GA_COMPONENTS_DIR;
  ensureDir(dir);

  const className = toPascalCase(options.component) + 'Page';
  const fileName = toCamelCase(options.component) + 'Page';
  const pomPath = path.join(dir, `${fileName}.ts`);
  const sidecarPath = path.join(dir, `${fileName}.locators.json`);

  // Infer elements from source
  const inferredElements = inferElementsFromSource(data);
  const entries: Record<string, LocatorEntry> = {};
  for (const el of inferredElements) {
    entries[el.name] = {
      name: el.name,
      component: options.component,
      strategies: sourceElementToStrategies(el),
    };
  }

  // Write sidecar
  const registry: LocatorRegistry = {
    component: options.component,
    generatedAt: new Date().toISOString(),
    source: 'kkr-aem',
    entries,
  };
  fs.writeFileSync(sidecarPath, JSON.stringify(registry, null, 2), 'utf-8');

  // Write POM
  const styleGuideUrl = options.styleGuideUrl ||
    `/content/global-atlantic/style-guide/components/${options.component}.html?wcmmode=disabled`;
  const pomContent = generatePOMClass(className, fileName, entries, styleGuideUrl, dir);
  fs.writeFileSync(pomPath, pomContent, 'utf-8');

  return {
    pomPath,
    sidecarPath,
    className,
    elementCount: Object.keys(entries).length,
    isUpdate: false,
  };
}

/**
 * Merge new entries into existing ones, preserving manual confidence overrides.
 */
function mergeEntries(
  existing: Record<string, LocatorEntry>,
  incoming: Record<string, LocatorEntry>
): Record<string, LocatorEntry> {
  const merged = { ...existing };

  for (const [name, entry] of Object.entries(incoming)) {
    if (merged[name]) {
      // Preserve existing strategies' manual confidence scores
      const existingStrategies = new Map(
        merged[name].strategies.map(s => [`${s.type}:${s.value}`, s.confidence])
      );
      // Add new strategies that don't exist, keep existing confidence
      for (const strategy of entry.strategies) {
        const key = `${strategy.type}:${strategy.value}`;
        if (existingStrategies.has(key)) {
          strategy.confidence = existingStrategies.get(key)!;
        }
      }
      merged[name] = {
        ...merged[name],
        strategies: entry.strategies,
        lastVerified: new Date().toISOString(),
      };
    } else {
      merged[name] = entry;
    }
  }

  return merged;
}

/**
 * Generate the TypeScript POM class content.
 */
function generatePOMClass(
  className: string,
  fileName: string,
  entries: Record<string, LocatorEntry>,
  styleGuideUrl: string,
  outputDir?: string
): string {
  const entryNames = Object.keys(entries);
  const getters = entryNames.map(name => {
    const entry = entries[name];
    const isInteractive = entry.strategies.some(s =>
      s.type === 'role' && ['button', 'link', 'textbox', 'combobox', 'checkbox'].some(r => s.value.startsWith(r))
    );

    let getter = `  /** Locator for ${name} */\n`;
    getter += `  get ${name}(): Promise<Locator> {\n`;
    getter += `    return resolveLocator(this.page, registry.entries.${name});\n`;
    getter += `  }`;

    return getter;
  }).join('\n\n');

  // Generate action methods for interactive elements
  const actions = entryNames
    .filter(name => {
      const entry = entries[name];
      return entry.strategies.some(s =>
        s.type === 'role' && ['button', 'link'].some(r => s.value.startsWith(r))
      ) || entries[name].component; // fallback: generate click for all
    })
    .slice(0, 10) // Limit to avoid bloat
    .map(name => {
      const actionName = `click${toPascalCase(name)}`;
      return `  /** Click ${name} */\n  async ${actionName}() {\n    const el = await this.${name};\n    await el.click();\n  }`;
    })
    .join('\n\n');

  // Compute relative path from output dir to utils dir
  const utilsDir = path.resolve(__dirname);
  const resolvedOutputDir = outputDir || GA_COMPONENTS_DIR;
  const relativeUtils = path.relative(resolvedOutputDir, utilsDir).replace(/\\/g, '/');

  return `import { Page, Locator } from '@playwright/test';
import { loadLocators, resolveLocator } from '${relativeUtils}/locator-registry';
import path from 'path';

const registry = loadLocators(path.join(__dirname, '${fileName}.locators.json'));

export class ${className} {
  constructor(private page: Page) {}

  /** Navigate to the component style guide page */
  async navigate(baseUrl: string) {
    await this.page.goto(\`\${baseUrl}${styleGuideUrl}\`);
    await this.page.waitForLoadState('networkidle');
  }

${getters}

${actions ? `  // --- Actions ---\n\n${actions}` : ''}
}
`;
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join('');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
