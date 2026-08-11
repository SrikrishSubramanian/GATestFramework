const ExcelJS = require('exceljs');
const path = require('path');

const OUTPUT_PATH = path.resolve(__dirname, '..', 'tests', 'data', 'reports', 'confirmed-bugs-2026-08-11.xlsx');

const BUGS = [
  {
    num: 1,
    ticket: 'GAAM-1358 (see GAAM-397 AC)',
    component: 'Site Header / Main Nav',
    testId: 'NVGT-066',
    summary: 'Once a role is selected (e.g. Financial Professional), the site header does not stick to the top of the viewport on scroll — it stays position:static and scrolls off-screen.',
    evidence: 'On /content/global-atlantic/financial-professionals/main/en.html, dismissed the first-visit consent modal, scrolled 900px: header position stayed "static", getBoundingClientRect().top went to -75 (scrolled fully off top). Now encoded as a real (currently failing) assertion in navigation.author.spec.ts — will auto-pass once fixed.',
    confidence: 'High',
    confidenceNote: 'Directly reproduced, matches ticket\'s reported symptom exactly.',
  },
  {
    num: 2,
    ticket: 'GAAM-675 (Sprint 13 Padding)',
    component: 'Text',
    testId: 'GAAM-675-003, GAAM-675-011',
    summary: 'Text component (.cmp-text) padding is 0px 20px on desktop but drops to 0px (all sides) on mobile (375px) — no horizontal padding at all on small viewports.',
    evidence: 'Confirmed on the deployed text fixture page: desktop padding: 0px 20px, same element at 375px width padding: 0px. Parent .aem-GridColumn also has 0px padding at both widths, so nothing upstream compensates.',
    confidence: 'Medium',
    confidenceNote: 'Real, reproducible CSS behavior, but unconfirmed whether zero mobile padding is intentional (page-level gutter elsewhere) or a regression. Needs design/PM confirmation.',
  },
  {
    num: 3,
    ticket: '(no ticket — found incidentally)',
    component: 'Site Header',
    testId: 'SH-054',
    summary: 'At tablet width (1024px), .cmp-site-header\'s internal scrollWidth (949px) exceeds its clientWidth (874px) by ~75px.',
    evidence: 'Measured directly; however no descendant element\'s bounding box actually exceeds the visible viewport (offenders: []) — no real horizontal scrollbar appears. The adjacent GAAM-397 AC text explicitly scopes Site Header to "desktop breakpoints only," with mobile deferred to GAAM-393 — tablet isn\'t a committed target.',
    confidence: 'Low',
    confidenceNote: 'Likely benign internal box-model quirk, not a user-visible bug. Included for completeness.',
  },
  {
    num: 4,
    ticket: 'GAAM-621',
    component: 'Homepage Hero (Watch Video CTA)',
    testId: 'GAAM-621-001',
    summary: 'The "Watch video" CTA button in the homepage hero becomes permanently covered by the .hero-role-cards__container element ~300ms after being scrolled into view, making it unclickable for real users (not just automated tests).',
    evidence: 'On /content/global-atlantic/style-guide/components/homepage-hero.html, scrolled the button into view and hit-tested its center point every 300ms for 12s: at t=0ms the button resolves correctly (hitOk=true), but from t=300ms through t=11700ms (the full sampled window), document.elementFromPoint at the button\'s exact center consistently resolves to .hero-role-cards__container instead — the overlay never clears. This exactly explains the original CI failure: clickElement() scrolls the button in, but by the time .click() starts its actionability retries the overlay has already landed on top, so every retry fails for the full 5-minute CI timeout ("552 x waiting for element... not visible").',
    confidence: 'High',
    confidenceNote: 'Directly reproduced and timed; overlap is persistent (not transient/animation-in-progress), confirmed via 40 consecutive samples over 12 seconds.',
  },
];

const EXCLUDED = [
  { spec: 'navigation.author.spec.ts', testId: 'NVGT-015', reason: 'Hit an undeployed fixture path (404) instead of the real style-guide page.' },
  { spec: 'role-selector.author.spec.ts', testId: 'all tests', reason: 'Targeted a deprecated standalone .cmp-role-selector that no longer exists; functionality moved into the site header (GAAM-1314).' },
  { spec: 'site-header.author.spec.ts', testId: 'SH-049/050/051/052/054/056/057/063/064', reason: 'Targeted /content/global-atlantic/en.html, which still serves the legacy .cmp-header, not the new .cmp-site-header (GAAM-792 XF).' },
  { spec: 'text.sprint13-padding.spec.ts', testId: '17 of 19 tests', reason: 'Same undeployed-fixture 404 pattern as NVGT-015; were unknowingly asserting against AEM\'s "Unexpected Error" 404 page.' },
];

const CONFIDENCE_FILL = {
  High: 'FFD4EDDA',
  Medium: 'FFFFF3CD',
  Low: 'FFF8D7DA',
};
const CONFIDENCE_FONT = {
  High: 'FF155724',
  Medium: 'FF856404',
  Low: 'FF721C24',
};

async function main() {
  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet('Confirmed Bugs');
  sheet.columns = [
    { header: '#', key: 'num', width: 5 },
    { header: 'Ticket', key: 'ticket', width: 24 },
    { header: 'Component', key: 'component', width: 22 },
    { header: 'Test ID', key: 'testId', width: 20 },
    { header: 'Summary', key: 'summary', width: 55 },
    { header: 'Evidence', key: 'evidence', width: 70 },
    { header: 'Confidence', key: 'confidence', width: 12 },
    { header: 'Confidence Notes', key: 'confidenceNote', width: 50 },
  ];
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003DA5' } };
  sheet.getRow(1).alignment = { vertical: 'middle' };
  sheet.autoFilter = { from: 'A1', to: 'H1' };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  for (const bug of BUGS) {
    const row = sheet.addRow(bug);
    row.getCell('confidence').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CONFIDENCE_FILL[bug.confidence] } };
    row.getCell('confidence').font = { color: { argb: CONFIDENCE_FONT[bug.confidence] }, bold: true };
    row.alignment = { vertical: 'top', wrapText: true };
  }

  const excludedSheet = workbook.addWorksheet('Excluded - Test Bugs');
  excludedSheet.columns = [
    { header: 'Spec File', key: 'spec', width: 32 },
    { header: 'Test ID', key: 'testId', width: 40 },
    { header: 'Reason Excluded', key: 'reason', width: 90 },
  ];
  excludedSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  excludedSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6C757D' } };
  excludedSheet.getRow(1).alignment = { vertical: 'middle' };
  excludedSheet.autoFilter = { from: 'A1', to: 'C1' };
  excludedSheet.views = [{ state: 'frozen', ySplit: 1 }];

  for (const item of EXCLUDED) {
    const row = excludedSheet.addRow(item);
    row.alignment = { vertical: 'top', wrapText: true };
  }

  await workbook.xlsx.writeFile(OUTPUT_PATH);
  console.log('Written to', OUTPUT_PATH);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
