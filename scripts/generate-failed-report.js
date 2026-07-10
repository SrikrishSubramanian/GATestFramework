const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

/**
 * Extract failed test cases from the latest Playwright JSON results and write
 * an Excel report. Playwright's JSON reporter nests tests as:
 *   suite.suites[] (recursive) and suite.specs[].tests[].results[]
 * A spec's outer test.status is "expected" | "unexpected" | "flaky" | "skipped".
 * "unexpected" is what actually failed.
 */

const OUTPUT_DIR = process.argv[2] || 'C:\\documention';

function findLatestResultsJson(dir) {
  let latestPath = null;
  let latestMtime = 0;

  function walk(current) {
    for (const item of fs.readdirSync(current)) {
      const itemPath = path.join(current, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        walk(itemPath);
      } else if (item === 'results.json') {
        if (stat.mtimeMs > latestMtime) {
          latestMtime = stat.mtimeMs;
          latestPath = itemPath;
        }
      }
    }
  }

  walk(dir);
  return latestPath;
}

function collectFailedTests(suite, failedTests, parentTitles) {
  const titlePath = suite.title ? [...parentTitles, suite.title] : parentTitles;

  if (Array.isArray(suite.suites)) {
    suite.suites.forEach(child => collectFailedTests(child, failedTests, titlePath));
  }

  if (Array.isArray(suite.specs)) {
    suite.specs.forEach(spec => {
      (spec.tests || []).forEach(test => {
        if (test.status !== 'unexpected' && test.status !== 'flaky') return;

        const lastResult = test.results && test.results[test.results.length - 1];
        const status = lastResult ? lastResult.status : test.status;
        if (test.status === 'unexpected' && status !== 'failed' && status !== 'timedOut' && status !== 'interrupted') {
          return;
        }

        const error = lastResult && lastResult.errors && lastResult.errors[0];
        const errorMessage = error ? (error.message || '').replace(/\x1b\[[0-9;]*m/g, '') : '';

        failedTests.push({
          suitePath: titlePath.join(' > '),
          title: spec.title,
          file: spec.file || suite.file || '',
          line: spec.line || '',
          project: test.projectName || 'unknown',
          status,
          outcome: test.status,
          duration: lastResult ? lastResult.duration : 0,
          retries: (test.results || []).length - 1,
          error: errorMessage.slice(0, 2000),
        });
      });
    });
  }
}

async function main() {
  const reportDir = path.join(__dirname, '..', 'playwright-report');
  if (!fs.existsSync(reportDir)) {
    console.error('No playwright-report directory found.');
    process.exit(1);
  }

  const resultsPath = findLatestResultsJson(reportDir);
  if (!resultsPath) {
    console.error('No results.json found under playwright-report/.');
    process.exit(1);
  }
  console.log(`Reading: ${resultsPath}`);

  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
  console.log('Run stats:', results.stats);

  const failedTests = [];
  (results.suites || []).forEach(suite => collectFailedTests(suite, failedTests, []));

  console.log(`Found ${failedTests.length} failed/flaky test case(s).`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Failed Tests');

  sheet.columns = [
    { header: 'Suite', key: 'suitePath', width: 45 },
    { header: 'Test Name', key: 'title', width: 45 },
    { header: 'File', key: 'file', width: 45 },
    { header: 'Line', key: 'line', width: 8 },
    { header: 'Browser', key: 'project', width: 14 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Outcome', key: 'outcome', width: 12 },
    { header: 'Duration (ms)', key: 'duration', width: 14 },
    { header: 'Retries', key: 'retries', width: 10 },
    { header: 'Error Message', key: 'error', width: 80 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDC3545' } };
  sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  failedTests.forEach((test, index) => {
    const row = sheet.addRow(test);
    if (index % 2 === 0) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
    }
    row.getCell('status').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: test.status === 'timedOut' ? 'FFFF9900' : 'FFFF6B6B' },
    };
    ['suitePath', 'title', 'file', 'error'].forEach(key => {
      row.getCell(key).alignment = { wrapText: true, vertical: 'top' };
    });
  });

  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Value', key: 'value', width: 40 },
  ];
  summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0066CC' } };

  const byProject = {};
  failedTests.forEach(t => { byProject[t.project] = (byProject[t.project] || 0) + 1; });

  summarySheet.addRow({ metric: 'Source results.json', value: resultsPath });
  summarySheet.addRow({ metric: 'Total Expected', value: results.stats?.expected || 0 });
  summarySheet.addRow({ metric: 'Total Skipped', value: results.stats?.skipped || 0 });
  summarySheet.addRow({ metric: 'Total Unexpected (Failed)', value: results.stats?.unexpected || 0 });
  summarySheet.addRow({ metric: 'Total Flaky', value: results.stats?.flaky || 0 });
  summarySheet.addRow({ metric: 'Report Generated', value: new Date().toLocaleString() });
  Object.entries(byProject).forEach(([project, count]) => {
    summarySheet.addRow({ metric: `Failed - ${project}`, value: count });
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = path.join(OUTPUT_DIR, `failed-tests-${timestamp}.xlsx`);
  await workbook.xlsx.writeFile(outPath);

  console.log(`\nExcel report written: ${outPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
