/**
 * Phase 4: Jira/Figma → POM + Spec generation.
 *
 * Reads output from dev-agents-shared requirements-reader agent and generates
 * test specs. Optionally merges with Figma design data for visual tests.
 *
 * Workflow:
 *   1. Run `/read-jira GAAM-XXX` (dev-agents-shared) to get requirements JSON
 *   2. Run this spec with the JSON path to generate tests
 *
 * Usage:
 *   JIRA_JSON=path/to/requirements.json env=local npx playwright test generate-from-jira.spec --project chromium
 *
 * Or fetch directly from Jira REST API:
 *   JIRA_TICKET=GAAM-123 env=local npx playwright test generate-from-jira.spec --project chromium
 *
 * Optional env vars:
 *   FIGMA_DATA=path/to/design-spec.json   — merge Figma visual tests
 *   COMPONENT=button                       — override component detection
 *   A11Y_LEVEL=wcag22|wcag21|none         — accessibility level
 *   MODE=author|publish                    — AEM mode
 */
import { test, expect } from '@playwright/test';
import {
  RequirementsReaderOutput,
  JiraRequirement,
  FigmaDesignSpec,
  fromRequirementsReader,
  jiraToTestCases,
  mergeRequirements,
} from '../utils/requirements-merger';
import { scanDOM } from '../utils/dom-scanner';
import { writePOMFromDOM } from '../utils/pom-writer';
import { writeSpecFromCSV, writeComponentSpec } from '../utils/spec-writer';
import { generateVisualSpec } from '../utils/visual-assertion-generator';
import { getDefaultCategories, TestCategory, A11yLevel } from '../utils/test-tagger';
import { updateComponentCoverage } from '../utils/coverage-matrix-reporter';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const AUTHOR_URL = process.env.AEM_AUTHOR_URL || 'http://localhost:4502';
const AUTH = {
  username: process.env.AEM_AUTHOR_USERNAME || 'admin',
  password: process.env.AEM_AUTHOR_PASSWORD || 'admin',
};

const COMPONENTS_DIR = path.resolve(__dirname, '..', 'pages', 'ga', 'components');
const SPECS_DIR = path.resolve(__dirname, 'ga');

function toPascalCase(str: string): string {
  return str.split(/[-_\s]+/).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join('');
}
function toCamelCase(str: string): string {
  const p = toPascalCase(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

test.describe('Jira/Figma Test Generation', () => {
  const a11yLevel: A11yLevel = (process.env.A11Y_LEVEL as A11yLevel) || 'wcag22';
  const mode = (process.env.MODE as 'author' | 'publish') || 'author';
  const categories: TestCategory[] = getDefaultCategories(a11yLevel);

  test('Generate tests from Jira requirements', async ({ page }) => {
    // ── Step 1: Get requirements JSON ──────────────────────────────

    let reqOutput: RequirementsReaderOutput;

    const jiraJsonPath = process.env.JIRA_JSON;
    const jiraTicket = process.env.JIRA_TICKET;

    if (jiraJsonPath) {
      // Path A: Pre-fetched JSON from requirements-reader agent
      expect(fs.existsSync(jiraJsonPath), `JSON not found: ${jiraJsonPath}`).toBe(true);
      reqOutput = JSON.parse(fs.readFileSync(jiraJsonPath, 'utf-8'));
      console.log(`\n=== Loaded requirements from: ${jiraJsonPath} ===`);
    } else if (jiraTicket) {
      // Path B: Fetch directly from Jira REST API
      console.log(`\n=== Fetching Jira ticket: ${jiraTicket} ===`);
      reqOutput = fetchFromJiraApi(jiraTicket);
    } else {
      console.log('No JIRA_JSON or JIRA_TICKET provided.');
      console.log('  Option 1: Run `/read-jira GAAM-XXX` first, then set JIRA_JSON=<output-path>');
      console.log('  Option 2: Set JIRA_TICKET=GAAM-XXX with JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN env vars');
      test.skip();
      return;
    }

    console.log(`  Ticket: ${reqOutput.ticket_key}`);
    console.log(`  Title: ${reqOutput.title}`);
    console.log(`  ACs: ${reqOutput.acceptance_criteria.length}`);
    console.log(`  User Stories: ${reqOutput.user_stories.length}`);
    console.log(`  References: ${reqOutput.references.length}`);

    // ── Step 2: Convert to our JiraRequirement format ──────────────

    const componentOverride = process.env.COMPONENT;
    const jiraReq: JiraRequirement = fromRequirementsReader(reqOutput, componentOverride);
    console.log(`\n  Component: ${jiraReq.component}`);
    console.log(`  Priority: ${jiraReq.priority}`);
    console.log(`  Labels: ${jiraReq.labels.join(', ') || 'none'}`);

    // ── Step 3: Load Figma data if available ────────────────────────

    let figmaData: FigmaDesignSpec | undefined;
    const figmaPath = process.env.FIGMA_DATA;
    if (figmaPath && fs.existsSync(figmaPath)) {
      figmaData = JSON.parse(fs.readFileSync(figmaPath, 'utf-8'));
      console.log(`\n  Figma data loaded: ${figmaPath}`);
    } else {
      // Check if requirements-reader found Figma URLs
      const figmaRefs = reqOutput.references.filter(r => r.includes('figma.com'));
      if (figmaRefs.length > 0) {
        console.log(`\n  Figma URLs found in ticket (run /read-figma to extract):`);
        for (const ref of figmaRefs) {
          console.log(`    - ${ref}`);
        }
      }
    }

    // ── Step 4: Merge requirements ──────────────────────────────────

    const merged = mergeRequirements(jiraReq, figmaData);
    console.log(`\n  Test cases generated: ${merged.testCases.length}`);
    console.log(`  Source: ${merged.source}`);

    // ── Step 5: Ensure POM exists ──────────────────────────────────

    const className = toPascalCase(jiraReq.component) + 'Page';
    const fileName = toCamelCase(jiraReq.component) + 'Page';
    const pomPath = path.join(COMPONENTS_DIR, `${fileName}.ts`);

    if (!fs.existsSync(pomPath)) {
      console.log(`\n  POM not found, scanning DOM for ${jiraReq.component}...`);

      // Authenticate
      if (mode === 'author') {
        await page.goto(`${AUTHOR_URL}/libs/granite/core/content/login.html`);
        await page.fill('#username', AUTH.username);
        await page.fill('#password', AUTH.password);
        await page.click('#submit-button');
        await page.waitForLoadState('networkidle');
      }

      const baseUrl = mode === 'author' ? AUTHOR_URL : (process.env.BASE_URL || 'http://localhost:4503');
      const styleGuideUrl = `${baseUrl}/content/global-atlantic/style-guide/components/${jiraReq.component}.html?wcmmode=disabled`;
      await page.goto(styleGuideUrl);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const snapshot = await scanDOM(page, jiraReq.component);
      if (snapshot.elements.length > 0) {
        const pomResult = writePOMFromDOM(snapshot, {
          component: jiraReq.component,
          outputDir: COMPONENTS_DIR,
          mode: 'create',
        });
        console.log(`  POM generated: ${pomResult.className} (${pomResult.elementCount} elements)`);
      } else {
        console.warn(`  WARNING: No DOM elements found for ${jiraReq.component}. Style guide page may not exist.`);
      }
    } else {
      console.log(`\n  POM exists: ${pomPath}`);
    }

    // ── Step 6: Generate spec from requirements ─────────────────────

    const compSpecDir = path.join(SPECS_DIR, jiraReq.component);
    const pomImportPath = path.relative(compSpecDir, pomPath).replace(/\\/g, '/').replace(/\.ts$/, '');

    // Generate the spec using CSV writer (works with ParsedTestCase[])
    const specResult = writeSpecFromCSV(
      { component: jiraReq.component, testCases: merged.testCases },
      {
        component: jiraReq.component,
        pomClassName: className,
        pomImportPath,
        mode,
        a11yLevel,
        categories,
        outputDir: SPECS_DIR,
      }
    );

    console.log(`\n  Spec generated: ${specResult.specPath}`);
    console.log(`  Tests: ${specResult.testCount} across ${specResult.categories.join(', ')}`);

    // ── Step 7: Generate visual spec from Figma (if available) ──────

    if (figmaData) {
      const visualResult = generateVisualSpec(figmaData, className, pomImportPath);
      console.log(`  Visual spec: ${visualResult.specPath} (${visualResult.testCount} tests)`);
    }

    // ── Step 8: Update coverage matrix ──────────────────────────────

    updateComponentCoverage(jiraReq.component, specResult.categories.map(cat => ({
      category: cat as TestCategory,
      testCount: specResult.testCount,
      specFile: path.basename(specResult.specPath),
      tags: jiraReq.labels,
    })));

    console.log(`\n=== Jira generation complete: ${reqOutput.ticket_key} ===`);
  });
});

/**
 * Fetch ticket directly from Jira REST API.
 * Requires JIRA_URL, JIRA_USERNAME, JIRA_API_TOKEN env vars.
 */
function fetchFromJiraApi(ticketKey: string): RequirementsReaderOutput {
  const jiraUrl = process.env.JIRA_URL;
  const username = process.env.JIRA_USERNAME;
  const apiToken = process.env.JIRA_API_TOKEN;

  if (!jiraUrl || !username || !apiToken) {
    throw new Error(
      'Missing Jira credentials. Set JIRA_URL, JIRA_USERNAME, and JIRA_API_TOKEN env vars.\n' +
      'Or use JIRA_JSON with pre-fetched requirements from /read-jira command.'
    );
  }

  const fields = 'summary,description,status,issuetype,priority,labels,components,comment,issuelinks,assignee';
  const url = `${jiraUrl}/rest/api/2/issue/${ticketKey}?fields=${fields}`;
  const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');

  const result = execSync(
    `curl -s -H "Authorization: Basic ${auth}" -H "Accept: application/json" "${url}"`,
    { encoding: 'utf-8', timeout: 30000 }
  );

  const data = JSON.parse(result);
  if (data.errorMessages) {
    throw new Error(`Jira API error: ${data.errorMessages.join(', ')}`);
  }

  const f = data.fields;
  const desc = f.description || '';

  // Extract acceptance criteria from description
  const acMatches = desc.match(/(?:acceptance criteria|ac)[:\s]*\n([\s\S]*?)(?:\n\n|\n(?=[A-Z#*])|\z)/i);
  const acs: string[] = [];
  if (acMatches) {
    const lines = acMatches[1].split('\n').filter((l: string) => l.trim());
    for (const line of lines) {
      acs.push(line.replace(/^[-*\d.)\s]+/, '').trim());
    }
  }

  // Extract user stories
  const storyMatches = desc.match(/as a .+?, I want .+?, so that .+/gi) || [];

  // Extract references (URLs)
  const urlMatches = desc.match(/https?:\/\/[^\s)]+/g) || [];

  return {
    ticket_key: ticketKey,
    title: f.summary || '',
    status: f.status?.name || '',
    priority: f.priority?.name || '',
    assignee: f.assignee?.displayName || '',
    user_stories: storyMatches,
    acceptance_criteria: acs,
    technical_requirements: [],
    non_functional_requirements: [],
    dependencies: (f.issuelinks || []).map((l: any) =>
      l.outwardIssue?.key || l.inwardIssue?.key || ''
    ).filter(Boolean),
    references: urlMatches,
    raw_description: desc,
  };
}
