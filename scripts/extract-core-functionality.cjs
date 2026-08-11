const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ExcelJS = require('exceljs');

const files = glob.sync('tests/specFiles/ga/**/*.spec.ts').sort();

// Matches: test('[ID] @tag @tag Description', ...  OR  test(`[ID] @tag Description ${expr}`, ...
// Also matches test.skip(...) the same way, and tests with no [ID] bracket at all.
const TEST_LINE_RE = /test(?:\.skip)?\(\s*['`](.*)['`]\s*,/;
const DESCRIBE_RE = /test\.describe(?:\.serial)?\(\s*['"`](.*?)['"`]/;
const TAG_RE = /@[\w-]+/g;
const ID_RE = /^\[([^\]]*)\]\s*/;

const EXCLUDE_TAGS = new Set(['@negative', '@mobile', '@visual', '@matrix', '@a11y']);

const EXCLUDE_PATTERNS = [
  /\brenders?\b/i,
  /\bloads?\b/i,
  /adapts? to (mobile|tablet)/i,
  /handles (empty content|missing images)/i,
  /images? (load|have alt)/i,
  /no (js|javascript) errors?/i,
  /visually distinguish/i,
  /aria-|role="|contrast|keyboard.*(tab|focus)|wcag|screen reader|focus (indicator|visible|order)/i,
  /style guide/i,
  /at least (one|\d+)/i,
  /class(es)? (applied|present)|bem\b|css class/i,
  /spacing|padding|margin|typography|font (size|weight)/i,
  /viewport|breakpoint|desktop spacing|mobile spacing/i,
  /instances? (render|visible)/i,
  /exists? and/i,
];

// Verb-based signals only — bare nouns that double as component names
// (dropdown, modal, navigation, login, session, carousel, accordion, tabs)
// are deliberately excluded because they match every test in that file
// regardless of whether the test is functional or purely structural/visual.
const INCLUDE_PATTERNS = [
  /interactive elements are functional/i,
  /\bis functional\b|\bare functional\b/i,
  /\btriggers?\b/i,
  /\bclicks? (on|the|to)\b|\bclicking\b|\bon click\b/i,
  /\btoggles?\b|\btoggling\b/i,
  /\bexpands?\b|\bcollapses?\b|\bexpanding\b|\bcollapsing\b/i,
  /changes? content\b/i,
  /\bsubmits?\b|\bsubmission\b|\baccepts? input\b/i,
  /\bnavigates?\b|\bredirects?\b/i,
  /\bfilters? (results|content|list|items)\b/i,
  /\bsearches? (for|returns|triggers)\b|\btriggers? a search\b|\bsearch results?\b/i,
  /\bselection changes\b|\bselecting\b|\bselects? (an?|the)\b/i,
  /\bswitches? (to|between)\b/i,
  /\bopens? (a |the |up\b|in |on )/i,
  /\bcloses? (a |the |on |in )/i,
  /\bclose (button|icon)\b/i,
  /\b(modal|dialog|dropdown menu|menu|panel|window|tab|page|item|section|accordion|link)\b[^.,]{0,20}\b(opens?|closes?)\b/i,
  /\bdismisses?\b/i,
  /\bappears? (on|when|after|upon)\b/i,
  /\bpersists? (after|across)\b|\bsession (expir|timeout|persist)/i,
  /\blogs? (in|out)\b|\bauthenticat/i,
  /\bcalculat/i,
  /\bvalidat(es|ion|ing)\b/i,
  /carousel.*(advance|rotate|swipe|next|prev)/i,
  /\bapi (error|response|call)\b|\bdispatcher\b|\bmock(ed)? (api|response|data)\b/i,
  /tabs? (switch|activat)/i,
  /content (changes|updates|adapts) (based on|when)/i,
  /\bfullscreen\b/i,
  /\badvances?\b|\bloops? back\b|\bresumes?\b|\bstops? advancing\b/i,
  /\bplays? and\b|\bplays? (a|the)\b/i,
  /\bincreases?\b|\bdecreases?\b/i,
];

const rows = [];

for (const filePath of files) {
  const rel = filePath.replace(/\\/g, '/');
  const parts = rel.split('/'); // tests/specFiles/ga/<component>/<file> OR tests/specFiles/ga/<file>
  const fileName = parts[parts.length - 1];
  const component = parts.length > 4 ? parts[3] : fileName.replace('.spec.ts', '');
  const specType = fileName.replace('.spec.ts', '').split('.').slice(1).join('.') || 'other';

  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  let describeTitle = '';

  lines.forEach((line, idx) => {
    const dMatch = DESCRIBE_RE.exec(line);
    if (dMatch) {
      describeTitle = dMatch[1];
      return;
    }

    const tMatch = TEST_LINE_RE.exec(line);
    if (!tMatch) return;

    let raw = tMatch[1];
    const idMatch = ID_RE.exec(raw);
    const id = idMatch ? idMatch[1] : '';
    const withoutId = idMatch ? raw.slice(idMatch[0].length) : raw;

    const tags = (withoutId.match(TAG_RE) || []).map((t) => t.toLowerCase());
    const description = withoutId.replace(TAG_RE, '').trim().replace(/\s+/g, ' ');
    const isSkipped = /test\.skip\(/.test(line);

    const searchText = `${describeTitle} ${description}`;

    let isCore = true;
    let reason = '';

    if (isSkipped) {
      isCore = false;
      reason = 'skipped test';
    } else if (tags.some((t) => EXCLUDE_TAGS.has(t))) {
      isCore = false;
      reason = 'excluded tag: ' + tags.find((t) => EXCLUDE_TAGS.has(t));
    } else if (/accessibility|console & resources|images?( &| and)? (resources|alt)/i.test(describeTitle)) {
      isCore = false;
      reason = 'excluded describe block: ' + describeTitle;
    } else {
      const excludeHit = EXCLUDE_PATTERNS.find((re) => re.test(searchText));
      const includeHit = INCLUDE_PATTERNS.find((re) => re.test(description));
      if (includeHit && !excludeHit) {
        isCore = true;
        reason = 'functional keyword: ' + includeHit.source;
      } else if (includeHit && excludeHit) {
        isCore = true;
        reason = 'functional keyword (overrides ' + excludeHit.source + '): ' + includeHit.source;
      } else if (excludeHit) {
        isCore = false;
        reason = 'non-functional pattern: ' + excludeHit.source;
      } else {
        isCore = false;
        reason = 'no functional signal found';
      }
    }

    rows.push({
      component,
      specType,
      file: rel,
      line: idx + 1,
      id,
      tags: tags.join(' '),
      describeTitle,
      description,
      isCore,
      reason,
    });
  });
}

console.log(`Extracted ${rows.length} total test cases`);
const core = rows.filter((r) => r.isCore);
console.log(`Classified ${core.length} as core functionality`);

async function writeExcel() {
  const wb = new ExcelJS.Workbook();

  const baseColumns = () => [
    { header: 'Component', key: 'component', width: 28 },
    { header: 'Spec Type', key: 'specType', width: 14 },
    { header: 'Test ID', key: 'id', width: 16 },
    { header: 'Tags', key: 'tags', width: 22 },
    { header: 'Describe Block', key: 'describeTitle', width: 30 },
    { header: 'Test Description', key: 'description', width: 70 },
    { header: 'Match Reason', key: 'reason', width: 40 },
    { header: 'File', key: 'file', width: 55 },
    { header: 'Line', key: 'line', width: 8 },
  ];

  const coreSheet = wb.addWorksheet('Core Functionality');
  coreSheet.columns = baseColumns();
  coreSheet.getRow(1).font = { bold: true };
  core.forEach((r) => coreSheet.addRow(r));
  coreSheet.autoFilter = { from: 'A1', to: 'I1' };

  const allSheet = wb.addWorksheet('All Test Cases');
  allSheet.columns = [...baseColumns(), { header: 'Is Core', key: 'isCore', width: 10 }];
  allSheet.getRow(1).font = { bold: true };
  rows.forEach((r) => allSheet.addRow({ ...r, isCore: r.isCore ? 'Yes' : 'No' }));
  allSheet.autoFilter = { from: 'A1', to: 'J1' };

  const summarySheet = wb.addWorksheet('Summary');
  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 40 },
    { header: 'Count', key: 'count', width: 12 },
  ];
  summarySheet.getRow(1).font = { bold: true };
  summarySheet.addRow({ metric: 'Total test cases scanned', count: rows.length });
  summarySheet.addRow({ metric: 'Classified as core functionality', count: core.length });
  summarySheet.addRow({ metric: 'Excluded (non-core)', count: rows.length - core.length });

  const byComponent = {};
  core.forEach((r) => {
    byComponent[r.component] = (byComponent[r.component] || 0) + 1;
  });
  summarySheet.addRow({});
  summarySheet.addRow({ metric: 'Core tests by component', count: '' });
  Object.entries(byComponent)
    .sort((a, b) => b[1] - a[1])
    .forEach(([comp, count]) => summarySheet.addRow({ metric: comp, count }));

  const outPath = 'tests/data/core-functionality-testcases.xlsx';
  await wb.xlsx.writeFile(outPath);
  console.log('Wrote ' + outPath);
}

writeExcel();
