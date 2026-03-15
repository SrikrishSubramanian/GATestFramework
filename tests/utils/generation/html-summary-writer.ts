import * as fs from 'fs';
import * as path from 'path';

export interface SummaryTest {
  id: string;
  scenario: string;
  viewport?: string;
  whatItChecks: string;
  tags: string[];
}

export interface SummarySection {
  name: string;
  specFile: string;
  tests: SummaryTest[];
}

export interface SummaryMetadata {
  component: string;
  displayName: string;
  description?: string;
  jiraTickets?: string[];
  figmaLinks?: { label: string; url: string }[];
  sources?: string[];
  specFiles: string[];
}

export interface HTMLSummaryOptions {
  metadata: SummaryMetadata;
  sections: SummarySection[];
  outputPath: string;
}

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  smoke:       { bg: '#D4EDDA', color: '#155724' },
  regression:  { bg: '#E2E3F1', color: '#383D6E' },
  negative:    { bg: '#F8D7DA', color: '#721C24' },
  mobile:      { bg: '#D1ECF1', color: '#0C5460' },
  a11y:        { bg: '#FFF3CD', color: '#856404' },
  wcag22:      { bg: '#FFF3CD', color: '#856404' },
  visual:      { bg: '#E8DAEF', color: '#6C3483' },
  interaction: { bg: '#D6EAF8', color: '#1B4F72' },
  matrix:      { bg: '#FADBD8', color: '#78281F' },
};

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderTag(tag: string): string {
  const key = tag.replace(/^@/, '');
  const style = TAG_STYLES[key] || { bg: '#E9ECEF', color: '#495057' };
  return `<span class="tag" style="background:${style.bg};color:${style.color}">${escapeHtml(key)}</span>`;
}

function renderTags(tags: string[]): string {
  if (tags.length === 0) return '';
  return `<div class="tags">${tags.map(renderTag).join('')}</div>`;
}

/**
 * Parse a test title string like "[BTN-001] @smoke @regression Button renders correctly"
 * into structured data.
 */
export function parseTestTitle(title: string): { id: string; tags: string[]; description: string } {
  const idMatch = title.match(/^\[([A-Z0-9_-]+)\]\s*/);
  const id = idMatch ? idMatch[1] : '';
  let rest = idMatch ? title.slice(idMatch[0].length) : title;

  const tags: string[] = [];
  const tagRe = /^@(\S+)\s*/;
  let m: RegExpMatchArray | null;
  while ((m = rest.match(tagRe))) {
    tags.push(`@${m[1]}`);
    rest = rest.slice(m[0].length);
  }

  return { id, tags, description: rest.trim() };
}

/**
 * Infer viewport from test title/tags.
 */
function inferViewport(test: SummaryTest): string {
  if (test.viewport) return test.viewport;
  const title = test.scenario.toLowerCase();
  if (title.includes('mobile') || test.tags.includes('@mobile')) return 'Mobile';
  if (title.includes('tablet')) return 'Tablet';
  if (title.includes('desktop') && title.includes('1440')) return '1440 x 900';
  if (title.includes('390')) return '390 x 844';
  if (title.includes('1024')) return '1024 x 1366';
  return 'Desktop';
}

/**
 * Extract tests from a spec file by parsing test() calls.
 */
export function extractTestsFromSpec(specPath: string): SummarySection[] {
  if (!fs.existsSync(specPath)) return [];
  const content = fs.readFileSync(specPath, 'utf-8');
  const sections: SummarySection[] = [];
  const specFile = path.basename(specPath);

  // Split by test.describe blocks
  const describeRe = /test\.describe\(\s*'([^']+)'/g;
  const testRe = /test\(\s*'([^']+)'/g;

  // Find all describe blocks and their positions
  const describes: { name: string; start: number }[] = [];
  let dm: RegExpExecArray | null;
  while ((dm = describeRe.exec(content))) {
    describes.push({ name: dm[1], start: dm.index });
  }

  if (describes.length === 0) {
    // No describe blocks — collect all tests as one section
    const tests: SummaryTest[] = [];
    let tm: RegExpExecArray | null;
    while ((tm = testRe.exec(content))) {
      const parsed = parseTestTitle(tm[1]);
      tests.push({
        id: parsed.id,
        scenario: parsed.description,
        tags: parsed.tags,
        whatItChecks: parsed.description,
      });
    }
    if (tests.length > 0) {
      sections.push({ name: specFile.replace(/\.spec\.ts$/, ''), specFile, tests });
    }
    return sections;
  }

  // For each describe, find tests between this describe and the next
  for (let i = 0; i < describes.length; i++) {
    const start = describes[i].start;
    const end = i + 1 < describes.length ? describes[i + 1].start : content.length;
    const block = content.slice(start, end);

    const tests: SummaryTest[] = [];
    const blockTestRe = /test\(\s*'([^']+)'/g;
    let tm: RegExpExecArray | null;
    while ((tm = blockTestRe.exec(block))) {
      const parsed = parseTestTitle(tm[1]);
      const test: SummaryTest = {
        id: parsed.id,
        scenario: parsed.description,
        tags: parsed.tags,
        whatItChecks: parsed.description,
      };
      test.viewport = inferViewport(test);
      tests.push(test);
    }
    if (tests.length > 0) {
      sections.push({ name: describes[i].name, specFile, tests });
    }
  }

  return sections;
}

/**
 * Write an HTML test summary file.
 */
export function writeHTMLSummary(options: HTMLSummaryOptions): string {
  const { metadata, sections, outputPath } = options;

  const totalTests = sections.reduce((sum, s) => sum + s.tests.length, 0);
  const totalSections = sections.length;
  const uniqueSpecFiles = Array.from(new Set(sections.map(s => s.specFile)));

  // Collect all unique tags
  const allTags = new Set<string>();
  for (const s of sections) {
    for (const t of s.tests) {
      for (const tag of t.tags) allTags.add(tag.replace(/^@/, ''));
    }
  }

  const jiraHtml = (metadata.jiraTickets || [])
    .map(t => `<span class="jira-tag">${escapeHtml(t)}</span>`)
    .join('');

  const figmaHtml = (metadata.figmaLinks || [])
    .map(f => `<a href="${escapeHtml(f.url)}" target="_blank">${escapeHtml(f.label)}</a>`)
    .join(', ');

  const sourcesHtml = (metadata.sources || [])
    .map(s => `<span class="source-tag">${escapeHtml(s)}</span>`)
    .join('');

  const specFilesHtml = metadata.specFiles
    .map(f => escapeHtml(f))
    .join(', ');

  const metaItems: string[] = [];
  if (jiraHtml) {
    metaItems.push(`<div class="meta-item"><strong>Jira Tickets</strong>${jiraHtml}</div>`);
  }
  metaItems.push(`<div class="meta-item"><strong>Spec Files</strong>${specFilesHtml}</div>`);
  if (figmaHtml) {
    metaItems.push(`<div class="meta-item"><strong>Figma</strong>${figmaHtml}</div>`);
  }
  if (sourcesHtml) {
    metaItems.push(`<div class="meta-item"><strong>Sources</strong>${sourcesHtml}</div>`);
  }

  const sectionsHtml = sections.map(section => {
    const hasViewport = section.tests.some(t => t.viewport && t.viewport !== 'Desktop');
    const rows = section.tests.map(t => {
      const viewportCell = hasViewport
        ? `<td class="viewport">${escapeHtml(t.viewport || 'Desktop')}</td>`
        : '';
      return `            <tr>
              <td class="test-id">${escapeHtml(t.id)}</td>
              <td>${escapeHtml(t.scenario)}</td>
              ${viewportCell}
              <td>${escapeHtml(t.whatItChecks)}</td>
              <td>${renderTags(t.tags)}</td>
            </tr>`;
    }).join('\n');

    const viewportHeader = hasViewport ? '<th style="width:100px">Viewport</th>' : '';

    return `    <div class="section">
      <div class="section-header" onclick="this.parentElement.classList.toggle('collapsed')">
        <h2>${escapeHtml(section.name)}</h2>
        <span class="section-count">${section.tests.length}</span>
        <span class="chevron">&#9660;</span>
      </div>
      <div class="section-body">
        <table>
          <thead>
            <tr>
              <th style="width:90px">ID</th>
              <th>Test Scenario</th>
              ${viewportHeader}
              <th>What It Checks</th>
              <th style="width:140px">Tags</th>
            </tr>
          </thead>
          <tbody>
${rows}
          </tbody>
        </table>
      </div>
    </div>`;
  }).join('\n\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(metadata.displayName)} — Test Case Summary</title>
  <style>
    :root {
      --azul: #003DA5;
      --granite: #2D3138;
      --slate: #F0F1F2;
      --white: #FFFFFF;
      --border: #DEE2E6;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: var(--granite);
      background: var(--slate);
      line-height: 1.6;
    }
    .header {
      background: var(--azul);
      color: var(--white);
      padding: 32px 40px;
    }
    .header h1 { font-size: 28px; font-weight: 600; margin-bottom: 4px; }
    .header p { opacity: 0.85; font-size: 14px; }
    .meta-bar { display: flex; gap: 24px; margin-top: 16px; flex-wrap: wrap; }
    .meta-item {
      background: rgba(255,255,255,0.15);
      border-radius: 6px;
      padding: 8px 14px;
      font-size: 13px;
    }
    .meta-item strong { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.7; margin-bottom: 2px; }
    .meta-item a { color: var(--white); text-decoration: underline; }
    .jira-tag, .source-tag {
      display: inline-block;
      background: rgba(255,255,255,0.25);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin: 2px 4px 2px 0;
    }
    .stats {
      display: flex;
      gap: 0;
      background: var(--white);
      border-bottom: 1px solid var(--border);
    }
    .stat-box {
      flex: 1;
      text-align: center;
      padding: 18px 12px;
      border-right: 1px solid var(--border);
    }
    .stat-box:last-child { border-right: none; }
    .stat-box .num { font-size: 28px; font-weight: 700; color: var(--azul); }
    .stat-box .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6C757D; margin-top: 2px; }
    .content { max-width: 1100px; margin: 0 auto; padding: 24px 20px 60px; }
    .section {
      background: var(--white);
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid var(--border);
      overflow: hidden;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      background: #F8F9FA;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      user-select: none;
    }
    .section-header:hover { background: #EEF0F2; }
    .section-header h2 { font-size: 16px; font-weight: 600; }
    .section-count {
      background: var(--azul);
      color: var(--white);
      font-size: 12px;
      font-weight: 600;
      padding: 2px 10px;
      border-radius: 12px;
    }
    table { width: 100%; border-collapse: collapse; }
    thead th {
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6C757D;
      padding: 10px 16px;
      border-bottom: 2px solid var(--border);
      background: #FDFDFE;
    }
    tbody td {
      padding: 12px 16px;
      border-bottom: 1px solid #F0F1F2;
      font-size: 14px;
      vertical-align: top;
    }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #F8FAFC; }
    .test-id {
      font-family: 'Cascadia Code', 'Fira Code', monospace;
      font-size: 13px;
      font-weight: 600;
      color: var(--azul);
      white-space: nowrap;
    }
    .tags { display: flex; gap: 4px; flex-wrap: wrap; }
    .tag {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 500;
      white-space: nowrap;
    }
    .viewport { font-size: 12px; color: #6C757D; white-space: nowrap; }
    .expected-value { font-weight: 600; color: var(--granite); }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
    .section-body { display: block; }
    .section.collapsed .section-body { display: none; }
    .chevron { transition: transform 0.2s; font-size: 12px; color: #999; }
    .section.collapsed .chevron { transform: rotate(-90deg); }
  </style>
</head>
<body>

  <div class="header">
    <h1>${escapeHtml(metadata.displayName)} — Test Summary</h1>
    ${metadata.description ? `<p>${escapeHtml(metadata.description)}</p>` : ''}
    <div class="meta-bar">
      ${metaItems.join('\n      ')}
    </div>
  </div>

  <div class="stats">
    <div class="stat-box"><div class="num">${totalTests}</div><div class="label">Total Tests</div></div>
    <div class="stat-box"><div class="num">${totalSections}</div><div class="label">Sections</div></div>
    <div class="stat-box"><div class="num">${uniqueSpecFiles.length}</div><div class="label">Spec Files</div></div>
    <div class="stat-box"><div class="num">${Array.from(allTags).length}</div><div class="label">Tag Types</div></div>
  </div>

  <div class="content">

${sectionsHtml}

  </div>

  <div class="footer">
    Generated from ${uniqueSpecFiles.map(f => `<code>${escapeHtml(f)}</code>`).join(', ')}
    &mdash; ${escapeHtml(metadata.component)} &mdash; Global Atlantic Test Framework
  </div>

</body>
</html>`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf-8');
  return outputPath;
}

/**
 * Generate an HTML summary by scanning all spec files in a component directory.
 */
export function generateHTMLSummaryFromSpecs(
  componentDir: string,
  metadata: SummaryMetadata
): string {
  const specFiles = fs.readdirSync(componentDir).filter(f => f.endsWith('.spec.ts'));
  const allSections: SummarySection[] = [];

  for (const file of specFiles) {
    const sections = extractTestsFromSpec(path.join(componentDir, file));
    allSections.push(...sections);
  }

  metadata.specFiles = specFiles;
  const outputPath = path.join(componentDir, `${metadata.component}-test-summary.html`);
  return writeHTMLSummary({ metadata, sections: allSections, outputPath });
}
