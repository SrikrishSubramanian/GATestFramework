import * as fs from 'fs';
import * as path from 'path';
import ExcelJS from 'exceljs';
import { extractTestsFromSpec } from './html-summary-writer';

export type ExistenceStatus = 'automated' | 'ambiguous' | 'missing';

export interface ChecklistItem {
  name: string;
  component: string | null;
  status: ExistenceStatus;
  reason?: string;
}

/**
 * The master checklist cross-referenced against the live repo + live AEM
 * instance this session. `component` is the resolved spec-directory slug
 * (null when nothing was generated). Update this list as components are
 * authored/automated so re-running the report reflects current reality.
 */
export const CHECKLIST: ChecklistItem[] = [
  { name: 'CMS: Feature Banner', component: 'feature-banner', status: 'automated' },
  { name: 'CMS: Homepage Hero', component: 'homepage-hero', status: 'automated' },
  { name: 'CMS: Ratings Card', component: 'ratings-card', status: 'automated' },
  { name: 'CMS Headline Block Component', component: 'headline-block', status: 'automated' },
  { name: 'CMS Brand Relationship', component: 'brand-relationship', status: 'automated' },
  { name: 'CMS Statistic Component', component: 'statistic', status: 'automated' },
  { name: 'CMS: Image with Nested Content.', component: 'image-with-nested-content', status: 'automated' },
  { name: 'CMS: Accordion Tabs Component', component: 'accordion-tabs-feature', status: 'automated' },
  { name: 'CMS: 50/50 Page Hero', component: 'hero-fifty-fifty', status: 'automated' },
  { name: 'CMS: Promo Banner', component: 'promo-banner', status: 'automated' },
  { name: 'CMS: Nested Carousel', component: 'nested-content-carousel', status: 'automated' },
  { name: 'CMS: Workbench', component: 'workbench', status: 'automated' },
  { name: 'CMS: Product Comparison Card', component: 'product-comparison-card', status: 'automated' },
  { name: 'CMS: Product Path Summary Card', component: 'product-path-summary-card', status: 'automated' },
  { name: 'CMS: Benefits Table', component: 'benefits-table', status: 'automated' },
  {
    name: 'CMS: Section Updates: Overlay Capabilities',
    component: null,
    status: 'missing',
    reason: 'Not a standalone component — an enhancement to the existing `section` component.',
  },
  { name: 'CMS: Detail Hero', component: 'detail-hero', status: 'automated' },
  { name: 'CMS: Navigation Component', component: 'navigation', status: 'automated' },
  { name: 'CMS Section Component', component: 'section', status: 'automated' },
  { name: 'CMS: Buttons', component: 'button', status: 'automated' },
  { name: 'CMS: Rich Text Component', component: 'formatted-rte', status: 'automated' },
  { name: 'CMS Content Trail', component: 'content-trail', status: 'automated' },
  { name: 'CMS Spacer', component: 'spacer', status: 'automated' },
  { name: 'CMS Breadcrumb', component: 'breadcrumb', status: 'automated' },
  {
    name: 'CMS: RTE Table',
    component: 'rte-table',
    status: 'missing',
    reason: 'Style-guide page exists and renders, but has no authored demo content — nothing to scan yet.',
  },
  { name: 'CMS Content Highlight', component: 'content-highlight', status: 'automated' },
  { name: 'CMS Accordion', component: 'accordion', status: 'automated' },
  { name: 'CMS Grid Component', component: 'grid-container', status: 'automated' },
  { name: 'CMS: Separator Component', component: 'separator', status: 'automated' },
  { name: 'CMS: Tabs Component', component: 'tabs', status: 'automated' },
  { name: 'CMS: Video Component', component: 'video-external', status: 'automated' },
  { name: 'CMS: Teaser', component: 'teaser-card', status: 'automated' },
  {
    name: 'CMS Form Field Styling',
    component: 'form-field-text',
    status: 'ambiguous',
    reason: "form-field-text/form-field-dropdown exist, but there's no dedicated 'styling' spec — unclear if this names a distinct requirement.",
  },
  { name: 'Role selector', component: 'role-selector', status: 'automated' },
  {
    name: 'DR',
    component: null,
    status: 'ambiguous',
    reason: 'Unclear what this item refers to — never resolved with the requester.',
  },
  { name: 'Header', component: 'header', status: 'automated' },
  { name: 'Footer', component: 'footer', status: 'automated' },
  { name: 'Enhanced related content', component: 'enhanced-related-content', status: 'automated' },
  {
    name: 'embed html',
    component: 'embedhtml',
    status: 'missing',
    reason: 'Component code exists in kkr-aem source, but no style-guide demo page has been authored.',
  },
  { name: 'Rate list Accordion', component: 'rate-table', status: 'automated' },
  { name: 'Product path Detail card', component: 'product-path-detail-card', status: 'automated' },
  {
    name: 'Alert Banner',
    component: 'alert-banner',
    status: 'missing',
    reason: 'Style-guide page exists and renders, but has no authored demo content.',
  },
  {
    name: 'Alert Model',
    component: 'alert-modal',
    status: 'missing',
    reason: "Component code exists (as 'alert-modal'), but no style-guide demo page has been authored.",
  },
  {
    name: 'Bio card',
    component: 'bio-card',
    status: 'missing',
    reason: 'Style-guide page exists and renders, but has no authored demo content — matches an active Jira bug (GAAM-1474) with no test coverage.',
  },
  { name: 'Decision tree', component: 'decision-tree', status: 'automated' },
  {
    name: 'Disclosure list',
    component: 'disclosure-list',
    status: 'missing',
    reason: 'Style-guide page exists and renders, but has no authored demo content.',
  },
  {
    name: 'Gated Section',
    component: 'gated-section',
    status: 'missing',
    reason: 'Component code exists, but no style-guide demo page has been authored.',
  },
  { name: 'Image', component: 'image', status: 'automated' },
  { name: 'In-Brief', component: 'in-brief', status: 'automated' },
  { name: 'Insight Detail Hero', component: 'insights-detail-hero', status: 'automated' },
  { name: 'Insight listing', component: 'insights-listing', status: 'automated' },
  { name: 'Login', component: 'login', status: 'automated' },
  { name: 'Navigation', component: 'navigation', status: 'automated' },
  { name: 'Quote', component: 'quote', status: 'automated' },
];

export interface ChecklistRow extends ChecklistItem {
  testCount: number;
  specFiles: string[];
  reportLink: string | null;
}

const SPECS_DIR = path.resolve(__dirname, '..', '..', 'specFiles', 'ga');

/** Compute live stats (test count, spec files) for each checklist item by reading its component dir. */
export function buildChecklistRows(): ChecklistRow[] {
  return CHECKLIST.map(item => {
    if (!item.component) {
      return { ...item, testCount: 0, specFiles: [], reportLink: null };
    }
    const compDir = path.join(SPECS_DIR, item.component);
    if (!fs.existsSync(compDir)) {
      return { ...item, testCount: 0, specFiles: [], reportLink: null };
    }
    const specFiles = fs.readdirSync(compDir).filter(f => f.endsWith('.spec.ts'));
    let testCount = 0;
    for (const f of specFiles) {
      const sections = extractTestsFromSpec(path.join(compDir, f));
      testCount += sections.reduce((sum, s) => sum + s.tests.length, 0);
    }
    const summaryPath = path.join(compDir, `${item.component}-test-summary.html`);
    const reportLink = fs.existsSync(summaryPath)
      ? `../../specFiles/ga/${item.component}/${item.component}-test-summary.html`
      : null;
    return { ...item, testCount, specFiles, reportLink };
  });
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const STATUS_STYLE: Record<ExistenceStatus, { bg: string; color: string; label: string }> = {
  automated: { bg: '#D4EDDA', color: '#155724', label: 'Automated' },
  ambiguous: { bg: '#FFF3CD', color: '#856404', label: 'Ambiguous' },
  missing: { bg: '#F8D7DA', color: '#721C24', label: 'Not Automated' },
};

/** Write the master HTML existence + coverage report. */
export function writeExistenceReportHTML(rows: ChecklistRow[], outputPath: string): string {
  const counts = { automated: 0, ambiguous: 0, missing: 0 };
  let totalTests = 0;
  for (const r of rows) {
    counts[r.status]++;
    totalTests += r.testCount;
  }

  const rowsHtml = rows.map(r => {
    const style = STATUS_STYLE[r.status];
    const badge = `<span class="status-badge" style="background:${style.bg};color:${style.color}">${style.label}</span>`;
    const compCell = r.component ? `<code>${escapeHtml(r.component)}</code>` : '<span class="muted">&mdash;</span>';
    const testsCell = r.status === 'automated' ? `<strong>${r.testCount}</strong>` : '<span class="muted">&mdash;</span>';
    const linkCell = r.reportLink
      ? `<a href="${escapeHtml(r.reportLink)}" target="_blank">View report &rarr;</a>`
      : '<span class="muted">&mdash;</span>';
    const reasonCell = r.reason ? escapeHtml(r.reason) : '<span class="muted">&mdash;</span>';
    return `          <tr>
            <td>${badge}</td>
            <td>${escapeHtml(r.name)}</td>
            <td>${compCell}</td>
            <td class="num">${testsCell}</td>
            <td>${reasonCell}</td>
            <td>${linkCell}</td>
          </tr>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Existence &amp; Coverage Report</title>
  <style>
    :root {
      --azul: #003DA5; --granite: #2D3138; --slate: #F0F1F2; --white: #FFFFFF; --border: #DEE2E6;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: var(--granite); background: var(--slate); line-height: 1.6; }
    .header { background: var(--azul); color: var(--white); padding: 32px 40px; }
    .header h1 { font-size: 28px; font-weight: 600; margin-bottom: 4px; }
    .header p { opacity: 0.85; font-size: 14px; }
    .stats { display: flex; background: var(--white); border-bottom: 1px solid var(--border); }
    .stat-box { flex: 1; text-align: center; padding: 18px 12px; border-right: 1px solid var(--border); }
    .stat-box:last-child { border-right: none; }
    .stat-box .num { font-size: 28px; font-weight: 700; color: var(--azul); }
    .stat-box .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6C757D; margin-top: 2px; }
    .content { max-width: 1300px; margin: 0 auto; padding: 24px 20px 60px; }
    .section { background: var(--white); border-radius: 8px; border: 1px solid var(--border); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6C757D; padding: 10px 16px; border-bottom: 2px solid var(--border); background: #FDFDFE; }
    tbody td { padding: 12px 16px; border-bottom: 1px solid #F0F1F2; font-size: 14px; vertical-align: top; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #F8FAFC; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .status-badge { font-size: 11px; padding: 3px 10px; border-radius: 10px; font-weight: 600; white-space: nowrap; }
    .muted { color: #ADB5BD; }
    code { font-family: 'Cascadia Code', 'Fira Code', monospace; font-size: 13px; background: #F5F6F8; padding: 1px 6px; border-radius: 4px; }
    a { color: var(--azul); font-weight: 600; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Component Existence &amp; Coverage Report</h1>
    <p>Cross-reference of the master component checklist against generated, DOM-verified test coverage.</p>
  </div>
  <div class="stats">
    <div class="stat-box"><div class="num">${rows.length}</div><div class="label">Checklist Items</div></div>
    <div class="stat-box"><div class="num">${counts.automated}</div><div class="label">Automated</div></div>
    <div class="stat-box"><div class="num">${counts.ambiguous}</div><div class="label">Ambiguous</div></div>
    <div class="stat-box"><div class="num">${counts.missing}</div><div class="label">Not Automated</div></div>
    <div class="stat-box"><div class="num">${totalTests}</div><div class="label">Total Tests</div></div>
  </div>
  <div class="content">
    <div class="section">
      <table>
        <thead>
          <tr>
            <th style="width:110px">Status</th>
            <th>Checklist Item</th>
            <th style="width:200px">Component</th>
            <th style="width:80px">Tests</th>
            <th>Reason / Notes</th>
            <th style="width:140px">Report</th>
          </tr>
        </thead>
        <tbody>
${rowsHtml}
        </tbody>
      </table>
    </div>
  </div>
  <div class="footer">Generated by GATestFramework &mdash; Component Existence &amp; Coverage Report</div>
</body>
</html>`;

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf-8');
  return outputPath;
}

/** Write the same data as an Excel workbook (one sheet, styled header + status colors). */
export async function writeExistenceReportExcel(rows: ChecklistRow[], outputPath: string): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Component Coverage');

  sheet.columns = [
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Checklist Item', key: 'name', width: 38 },
    { header: 'Component', key: 'component', width: 26 },
    { header: 'Tests', key: 'testCount', width: 10 },
    { header: 'Reason / Notes', key: 'reason', width: 70 },
    { header: 'Spec Files', key: 'specFiles', width: 30 },
  ];
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003DA5' } };
  sheet.getRow(1).alignment = { vertical: 'middle' };
  sheet.autoFilter = { from: 'A1', to: 'F1' };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  const FILL: Record<ExistenceStatus, string> = {
    automated: 'FFD4EDDA',
    ambiguous: 'FFFFF3CD',
    missing: 'FFF8D7DA',
  };
  const FONT: Record<ExistenceStatus, string> = {
    automated: 'FF155724',
    ambiguous: 'FF856404',
    missing: 'FF721C24',
  };

  for (const r of rows) {
    const row = sheet.addRow({
      status: STATUS_STYLE[r.status].label,
      name: r.name,
      component: r.component || '—',
      testCount: r.status === 'automated' ? r.testCount : '—',
      reason: r.reason || '',
      specFiles: r.specFiles.join(', '),
    });
    row.getCell('status').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: FILL[r.status] } };
    row.getCell('status').font = { color: { argb: FONT[r.status] }, bold: true };
    row.alignment = { vertical: 'top', wrapText: true };
  }

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await workbook.xlsx.writeFile(outputPath);
  return outputPath;
}
