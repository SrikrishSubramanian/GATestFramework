import * as fs from 'fs';
import * as path from 'path';

/**
 * Parses JCR content XML to generate tests for actual authored configurations.
 * Catches: invalid style combos, broken internal links, missing DAM refs, encoding issues.
 */

export interface ContentIssue {
  type: 'invalid-style-combo' | 'broken-link' | 'missing-dam' | 'encoding' | 'missing-property';
  severity: 'error' | 'warning';
  path: string;
  message: string;
  details: Record<string, string>;
}

export interface ContentAnalysis {
  pagePath: string;
  components: ContentComponent[];
  issues: ContentIssue[];
}

export interface ContentComponent {
  nodeName: string;
  resourceType: string;
  styleIds: string[];
  properties: Record<string, string>;
  children: ContentComponent[];
}

/**
 * Analyze a JCR content XML file for test generation.
 */
export function analyzeContentXML(xmlPath: string): ContentAnalysis {
  const xml = fs.readFileSync(xmlPath, 'utf-8');
  const issues: ContentIssue[] = [];

  // Parse components from XML
  const components = extractComponents(xml);

  // Check for issues
  for (const comp of components) {
    // Check for invalid style combos
    checkStyleCombos(comp, issues, xmlPath);

    // Check for broken internal links
    checkInternalLinks(comp, issues, xmlPath);

    // Check for missing DAM references
    checkDAMReferences(comp, issues, xmlPath);

    // Check for encoding issues
    checkEncoding(comp, issues, xmlPath);

    // Check for missing required properties
    checkRequiredProperties(comp, issues, xmlPath);
  }

  return {
    pagePath: xmlPath,
    components,
    issues,
  };
}

/**
 * Extract component nodes from JCR XML content.
 */
function extractComponents(xml: string): ContentComponent[] {
  const components: ContentComponent[] = [];

  // Match JCR nodes with sling:resourceType
  const nodeRegex = /<(\w+)\s[^>]*sling:resourceType="([^"]+)"[^>]*(?:\/>|>([\s\S]*?)<\/\1>)/g;
  let match;

  while ((match = nodeRegex.exec(xml)) !== null) {
    const nodeName = match[1];
    const resourceType = match[2];
    const content = match[0];

    // Extract properties
    const properties: Record<string, string> = {};
    const propRegex = /(\w+(?::\w+)?)="([^"]*)"/g;
    let propMatch;
    while ((propMatch = propRegex.exec(content)) !== null) {
      properties[propMatch[1]] = propMatch[2];
    }

    // Extract style IDs
    const styleIds: string[] = [];
    const styleIdMatch = content.match(/cq:styleIds="\[([^\]]*)\]"/);
    if (styleIdMatch) {
      styleIds.push(...styleIdMatch[1].split(',').map(s => s.trim()));
    }

    components.push({
      nodeName,
      resourceType,
      styleIds,
      properties,
      children: [], // Simplified — no recursive parsing
    });
  }

  return components;
}

function checkStyleCombos(comp: ContentComponent, issues: ContentIssue[], xmlPath: string): void {
  // Dark theme on dark background
  const DARK_BG_IDS = ['granite', 'azul'];
  const DARK_THEME_CLASSES = ['dark-theme'];

  const hasDarkBg = comp.styleIds.some(id => DARK_BG_IDS.some(bg => id.includes(bg)));
  const hasDarkTheme = comp.styleIds.some(id => DARK_THEME_CLASSES.some(cls => id.includes(cls)));

  if (hasDarkBg && hasDarkTheme) {
    issues.push({
      type: 'invalid-style-combo',
      severity: 'warning',
      path: xmlPath,
      message: `${comp.nodeName}: dark-theme on dark background`,
      details: { styleIds: comp.styleIds.join(', '), resourceType: comp.resourceType },
    });
  }
}

function checkInternalLinks(comp: ContentComponent, issues: ContentIssue[], xmlPath: string): void {
  for (const [prop, value] of Object.entries(comp.properties)) {
    if ((prop.includes('link') || prop.includes('url') || prop === 'href') && value.startsWith('/content/')) {
      // Internal link — check format
      if (!value.includes('.html') && !value.includes('/jcr:content')) {
        issues.push({
          type: 'broken-link',
          severity: 'warning',
          path: xmlPath,
          message: `${comp.nodeName}.${prop}: internal link may be missing .html extension`,
          details: { property: prop, value },
        });
      }
    }
  }
}

function checkDAMReferences(comp: ContentComponent, issues: ContentIssue[], xmlPath: string): void {
  for (const [prop, value] of Object.entries(comp.properties)) {
    if (value.startsWith('/content/dam/')) {
      if (value.includes(' ') || value.includes('%20')) {
        issues.push({
          type: 'missing-dam',
          severity: 'warning',
          path: xmlPath,
          message: `${comp.nodeName}.${prop}: DAM path contains spaces`,
          details: { property: prop, value },
        });
      }
    }
  }
}

function checkEncoding(comp: ContentComponent, issues: ContentIssue[], xmlPath: string): void {
  for (const [prop, value] of Object.entries(comp.properties)) {
    // Check for unescaped HTML entities in text properties
    if (prop === 'text' || prop === 'jcr:title' || prop === 'jcr:description') {
      if (value.includes('&') && !value.includes('&amp;') && !value.includes('&lt;') && !value.includes('&gt;')) {
        issues.push({
          type: 'encoding',
          severity: 'warning',
          path: xmlPath,
          message: `${comp.nodeName}.${prop}: possibly unescaped ampersand`,
          details: { property: prop, value: value.slice(0, 100) },
        });
      }
    }
  }
}

function checkRequiredProperties(comp: ContentComponent, issues: ContentIssue[], xmlPath: string): void {
  // Components that typically require certain properties
  const REQUIRED: Record<string, string[]> = {
    'ga/components/content/button': ['linkURL', 'linkText'],
    'ga/components/content/text': ['text'],
    'ga/components/content/image-with-nested-content': ['fileReference'],
  };

  const required = REQUIRED[comp.resourceType];
  if (required) {
    for (const prop of required) {
      if (!comp.properties[prop] && !comp.properties[`./${prop}`]) {
        issues.push({
          type: 'missing-property',
          severity: 'error',
          path: xmlPath,
          message: `${comp.nodeName}: missing required property "${prop}"`,
          details: { resourceType: comp.resourceType, property: prop },
        });
      }
    }
  }
}

/**
 * Generate test assertions from content analysis.
 */
export function generateContentTests(analysis: ContentAnalysis): string[] {
  const tests: string[] = [];

  for (const issue of analysis.issues) {
    const tag = issue.severity === 'error' ? '@regression' : '@negative';
    tests.push(
      `test('${tag} Content: ${issue.message}', async ({ page }) => {\n` +
      `    // Issue type: ${issue.type}\n` +
      `    // Path: ${issue.path}\n` +
      `    // Details: ${JSON.stringify(issue.details)}\n` +
      `    // Verify this issue is handled correctly\n` +
      `  });`
    );
  }

  return tests;
}
