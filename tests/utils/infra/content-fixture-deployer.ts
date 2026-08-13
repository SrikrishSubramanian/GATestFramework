/**
 * Content Fixture Deployer
 *
 * Deploys fixture XML content to AEM via Sling POST servlet.
 * Used in local/dev environments (Option A) to push test fixtures
 * to a dedicated path before tests run.
 *
 * In QA/UAT/prod (Option B), fixtures are pre-merged into kkr-aem
 * and deployed via Maven — this deployer is not used.
 */
import * as fs from 'fs';
import * as path from 'path';
import { Page } from '@playwright/test';
import { XMLParser } from 'fast-xml-parser';
import ENV from './env';
import { loginToAEMAuthor } from './auth-fixture';

// __dirname is tests/utils/infra — fixtures live at tests/data/content-fixtures,
// not tests/utils/data/content-fixtures. This was off by one directory level,
// which silently made deployFixture() and checkFixtureSync() no-op against a
// nonexistent directory for every component.
const GA_FIXTURES_DIR = path.resolve(__dirname, '..', '..', 'data', 'content-fixtures');

/** Environments where fixtures are auto-deployed to AEM */
const AUTO_DEPLOY_ENVS = ['local', 'dev'];

/** Environments where fixtures are expected to be pre-merged in kkr-aem */
const PRE_MERGED_ENVS = ['qa', 'uat', 'prod'];

/** AEM paths */
const STYLE_GUIDE_BASE = '/content/global-atlantic/style-guide/components';
const TEST_FIXTURES_BASE = '/content/global-atlantic/test-fixtures';

export interface DeployResult {
  component: string;
  deployed: boolean;
  path: string;
  message: string;
}

/**
 * Get the current environment name.
 */
function getCurrentEnv(): string {
  return process.env.env || 'local';
}

/**
 * Check if current env should auto-deploy fixtures.
 */
export function shouldAutoDeploy(): boolean {
  return AUTO_DEPLOY_ENVS.includes(getCurrentEnv());
}

/**
 * Resolve the correct component URL based on environment.
 *
 * - local/dev: Uses test-fixtures path (auto-deployed)
 * - qa/uat/prod: Uses standard style guide path (pre-merged)
 *
 * @param component - Component name (e.g., 'button', 'form-text', 'spacer')
 * @param options.mode - 'author' or 'publish'
 * @param options.forceStyleGuide - Always use style guide path regardless of env
 */
export function resolveComponentUrl(
  component: string,
  options?: { mode?: 'author' | 'publish'; forceStyleGuide?: boolean }
): string {
  const mode = options?.mode || 'author';
  const baseUrl = mode === 'author'
    ? (ENV.AEM_AUTHOR_URL || 'http://localhost:4502')
    : (ENV.BASE_URL || 'http://localhost:4503');

  const env = getCurrentEnv();
  const hasFixture = fixtureExistsForComponent(component);

  // Determine the content path
  let contentPath: string;

  if (options?.forceStyleGuide || !hasFixture) {
    // No fixture or explicitly requesting style guide — use original
    contentPath = resolveStyleGuidePath(component);
  } else if (AUTO_DEPLOY_ENVS.includes(env)) {
    // local/dev with fixture — use test-fixtures path (auto-deployed)
    contentPath = `${TEST_FIXTURES_BASE}/${component}`;
    console.warn(
      `[fixture-deployer] Using test-fixtures path for "${component}" (env=${env}). ` +
      `If tests fail with timeout, the fixture may not be deployed to AEM. ` +
      `Run deployFixture('${component}', page) first, or use { forceStyleGuide: true } to fall back.`
    );
  } else {
    // qa/uat/prod — use style guide (fixture should be pre-merged)
    contentPath = resolveStyleGuidePath(component);
  }

  const wcmmode = mode === 'author' ? '?wcmmode=disabled' : '';
  return `${baseUrl}${contentPath}.html${wcmmode}`;
}

/**
 * Resolve the style guide path for a component.
 * Handles nested paths like form/form-text.
 */
function resolveStyleGuidePath(component: string): string {
  // Check fixture-meta.json for the source path to derive the style guide path
  const metaPath = path.join(GA_FIXTURES_DIR, component, 'fixture-meta.json');
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      // Extract the style guide path from the source field
      // e.g., "ui.content.ga/.../style-guide/components/form/form-text/.content.xml"
      const match = meta.source.match(/style-guide\/components\/(.+?)\/.content\.xml$/);
      if (match) {
        return `${STYLE_GUIDE_BASE}/${match[1]}`;
      }
    } catch { /* fall through */ }
  }

  // Default: simple component name
  return `${STYLE_GUIDE_BASE}/${component}`;
}

/**
 * Check if a fixture XML exists for a component.
 */
function fixtureExistsForComponent(component: string): boolean {
  const fixturePath = path.join(GA_FIXTURES_DIR, component, `${component}-fixtures.xml`);
  return fs.existsSync(fixturePath);
}

/**
 * Coerces a raw DocView attribute string into its JS-typed value.
 * Handles AEM's `{Type}value` type hints and `[a,b,c]` multi-value arrays.
 */
function parseTypedValue(raw: string): unknown {
  const typedMatch = raw.match(/^\{(\w+)\}([\s\S]*)$/);
  const typeHint = typedMatch ? typedMatch[1] : null;
  const value = typedMatch ? typedMatch[2] : raw;

  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1);
    return inner.length ? inner.split(',').map(v => coerceScalar(v, typeHint)) : [];
  }
  return coerceScalar(value, typeHint);
}

function coerceScalar(value: string, typeHint: string | null): unknown {
  if (typeHint === 'Boolean') return value === 'true';
  if (typeHint === 'Long' || typeHint === 'Double' || typeHint === 'Decimal') return Number(value);
  return value;
}

/** Recursively converts a fast-xml-parser node into Sling JSON-import shape (props + child nodes as sibling keys). */
function convertDocViewNode(node: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('xmlns:') || key === '#text') continue;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = convertDocViewNode(value as Record<string, unknown>);
    } else {
      result[key] = parseTypedValue(String(value));
    }
  }
  return result;
}

/**
 * Converts AEM DocView-format XML (jcr:root, element-name-as-nodename, attributes-as-properties)
 * into the nested JSON object Sling's :operation=import (:contentType=json) expects.
 *
 * NOTE: this is NOT the same dialect as JCR System View XML (sv:node/sv:property) — Sling's
 * :contentType=xml import expects SysView, so posting these DocView fixtures with :contentType=xml
 * silently no-ops (Sling falls back to creating an empty default-typed node). JSON avoids that
 * dialect mismatch entirely.
 */
function docViewXmlToJson(xml: string): Record<string, unknown> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: false,
    ignoreDeclaration: true,
    trimValues: true,
  });
  const parsed = parser.parse(xml) as Record<string, unknown>;
  const root = parsed['jcr:root'] as Record<string, unknown>;
  return convertDocViewNode(root);
}

/**
 * Deploy a single component's fixture XML to AEM via Sling POST.
 *
 * Creates the page at /content/global-atlantic/test-fixtures/<component>
 * by importing the JCR content XML.
 */
export async function deployFixture(component: string, page: Page): Promise<DeployResult> {
  const fixturePath = path.join(GA_FIXTURES_DIR, component, `${component}-fixtures.xml`);

  if (!fs.existsSync(fixturePath)) {
    return {
      component,
      deployed: false,
      path: '',
      message: `No fixture file found at ${fixturePath}`,
    };
  }

  const authorUrl = ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
  const targetPath = `${TEST_FIXTURES_BASE}/${component}`;

  const fixtureContent = fs.readFileSync(fixturePath, 'utf-8');

  try {
    // Step 1: Authenticate via browser login (AEM CSRF filter blocks basic auth headers)
    await loginToAEMAuthor(page);

    // Step 2: Get CSRF token for Sling POST requests
    const tokenRes = await page.request.get(`${authorUrl}/libs/granite/csrf/token.json`);
    let csrfToken: string | undefined;
    if (tokenRes.ok()) {
      const tokenJson = await tokenRes.json();
      csrfToken = tokenJson.token;
    }

    const headers: Record<string, string> = {};
    if (csrfToken) headers['CSRF-Token'] = csrfToken;

    // Step 3: Ensure parent path exists
    await page.request.post(`${authorUrl}${TEST_FIXTURES_BASE}`, {
      headers,
      form: {
        'jcr:primaryType': 'sling:OrderedFolder',
      },
      ignoreHTTPSErrors: true,
    });

    // Step 4: Delete any stale node at the target path first. If a prior deploy ever landed a
    // POST directly at targetPath, Sling auto-vivifies it as a plain resource before any import
    // runs — permanently pinning it to the wrong primaryType, since import can only ever set
    // properties on that already-created node, never its own root type. Starting clean avoids
    // silently merging into that stale resource.
    await page.request.post(`${authorUrl}${targetPath}`, {
      headers,
      form: { ':operation': 'delete' },
      ignoreHTTPSErrors: true,
    });

    // Step 5: Import the fixture as JSON, POSTed to the PARENT with the target keyed by name —
    // NOT posted directly at targetPath. Posting straight at targetPath hits the same
    // auto-vivification problem as step 4 describes: Sling creates the resource before handing
    // off to the import operation, so the imported root's own jcr:primaryType never applies.
    // Keying it under the parent lets the import operation create the child node fresh.
    const fixtureJson = docViewXmlToJson(fixtureContent);
    const payload = { [component]: fixtureJson };

    const importRes = await page.request.post(`${authorUrl}${TEST_FIXTURES_BASE}`, {
      headers,
      form: {
        ':operation': 'import',
        ':contentType': 'json',
        ':content': JSON.stringify(payload),
        ':replace': 'true',
        ':replaceProperties': 'true',
      },
      ignoreHTTPSErrors: true,
    });

    if (!importRes.ok()) {
      return {
        component,
        deployed: false,
        path: targetPath,
        message: `Deploy HTTP ${importRes.status()}: ${(await importRes.text()).substring(0, 200)}`,
      };
    }

    // Step 6: Verify the page actually deployed as a real cq:Page, not a stray auto-vivified node.
    const verifyRes = await page.request.get(
      `${authorUrl}${targetPath}.1.json`,
      { ignoreHTTPSErrors: true }
    );
    if (!verifyRes.ok()) {
      return {
        component,
        deployed: false,
        path: targetPath,
        message: `Import returned ${importRes.status()} but page node not found at ${targetPath}`,
      };
    }
    const verifyJson = await verifyRes.json();
    if (verifyJson['jcr:primaryType'] !== 'cq:Page') {
      return {
        component,
        deployed: false,
        path: targetPath,
        message: `Import succeeded but ${targetPath} has jcr:primaryType="${verifyJson['jcr:primaryType']}" (expected cq:Page) — fixture content did not apply to the root node.`,
      };
    }

    return {
      component,
      deployed: true,
      path: targetPath,
      message: `Fixture deployed to ${targetPath}`,
    };
  } catch (err) {
    return {
      component,
      deployed: false,
      path: targetPath,
      message: `Deploy failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Deploy all component fixtures that have fixture XML files.
 * Only deploys in local/dev environments.
 */
export async function deployAllFixtures(page: Page): Promise<DeployResult[]> {
  if (!shouldAutoDeploy()) {
    return [{
      component: 'all',
      deployed: false,
      path: '',
      message: `Skipping auto-deploy — env=${getCurrentEnv()} uses pre-merged fixtures`,
    }];
  }

  const results: DeployResult[] = [];

  if (!fs.existsSync(GA_FIXTURES_DIR)) return results;

  const componentDirs = fs.readdirSync(GA_FIXTURES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const comp of componentDirs) {
    if (fixtureExistsForComponent(comp)) {
      const result = await deployFixture(comp, page);
      results.push(result);
    }
  }

  return results;
}

/**
 * Check if a fixture is already deployed to AEM at the expected path.
 */
export async function isFixtureDeployed(component: string, page: Page): Promise<boolean> {
  const authorUrl = ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
  const username = ENV.AEM_AUTHOR_USERNAME || 'admin';
  const password = ENV.AEM_AUTHOR_PASSWORD || 'admin';
  const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
  const targetPath = `${TEST_FIXTURES_BASE}/${component}`;

  try {
    const response = await page.request.get(
      `${authorUrl}${targetPath}.json`,
      {
        headers: { Authorization: authHeader },
        ignoreHTTPSErrors: true,
      }
    );
    return response.ok();
  } catch {
    return false;
  }
}
