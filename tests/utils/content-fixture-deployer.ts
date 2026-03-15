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
import ENV from './env';

const GA_SPECS_DIR = path.resolve(__dirname, '..', 'specFiles', 'ga');

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
  const metaPath = path.join(GA_SPECS_DIR, component, 'content-fixtures', 'fixture-meta.json');
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
  const fixturePath = path.join(GA_SPECS_DIR, component, 'content-fixtures', `${component}-fixtures.xml`);
  return fs.existsSync(fixturePath);
}

/**
 * Deploy a single component's fixture XML to AEM via Sling POST.
 *
 * Creates the page at /content/global-atlantic/test-fixtures/<component>
 * by importing the JCR content XML.
 */
export async function deployFixture(component: string, page: Page): Promise<DeployResult> {
  const fixturePath = path.join(GA_SPECS_DIR, component, 'content-fixtures', `${component}-fixtures.xml`);

  if (!fs.existsSync(fixturePath)) {
    return {
      component,
      deployed: false,
      path: '',
      message: `No fixture file found at ${fixturePath}`,
    };
  }

  const authorUrl = ENV.AEM_AUTHOR_URL || 'http://localhost:4502';
  const username = ENV.AEM_AUTHOR_USERNAME || 'admin';
  const password = ENV.AEM_AUTHOR_PASSWORD || 'admin';
  const targetPath = `${TEST_FIXTURES_BASE}/${component}`;

  const fixtureContent = fs.readFileSync(fixturePath, 'utf-8');

  try {
    // Step 1: Ensure parent path exists
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    await page.request.post(`${authorUrl}${TEST_FIXTURES_BASE}`, {
      headers: { Authorization: authHeader },
      form: {
        'jcr:primaryType': 'sling:OrderedFolder',
        ':operation': 'import',
        ':contentType': 'json',
        ':content': '{"jcr:primaryType":"sling:OrderedFolder"}',
      },
      ignoreHTTPSErrors: true,
    });

    // Step 2: Import the fixture XML
    await page.request.post(`${authorUrl}${targetPath}`, {
      headers: { Authorization: authHeader },
      form: {
        ':operation': 'import',
        ':contentType': 'xml',
        ':content': fixtureContent,
        ':replace': 'true',
        ':replaceProperties': 'true',
      },
      ignoreHTTPSErrors: true,
    });

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

  if (!fs.existsSync(GA_SPECS_DIR)) return results;

  const componentDirs = fs.readdirSync(GA_SPECS_DIR, { withFileTypes: true })
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
