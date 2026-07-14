import * as path from 'path';
import {
  buildChecklistRows,
  writeExistenceReportHTML,
  writeExistenceReportExcel,
} from '../tests/utils/generation/existence-report-writer';

/**
 * Cross-references the master component checklist against real, generated
 * test coverage and writes a combined HTML + Excel report.
 * Run via: npx ts-node scripts/generate-existence-report.ts
 */
async function main() {
  const rows = buildChecklistRows();
  const outDir = path.resolve(__dirname, '..', 'tests', 'data', 'reports');

  const htmlPath = writeExistenceReportHTML(rows, path.join(outDir, 'component-existence-report.html'));
  const xlsxPath = await writeExistenceReportExcel(rows, path.join(outDir, 'component-existence-report.xlsx'));

  const automated = rows.filter(r => r.status === 'automated').length;
  const ambiguous = rows.filter(r => r.status === 'ambiguous').length;
  const missing = rows.filter(r => r.status === 'missing').length;
  const totalTests = rows.reduce((sum, r) => sum + r.testCount, 0);

  console.log(`\n=== Component Existence & Coverage Report ===`);
  console.log(`  Items: ${rows.length}  (automated: ${automated}, ambiguous: ${ambiguous}, missing: ${missing})`);
  console.log(`  Total tests across automated components: ${totalTests}`);
  console.log(`  HTML: ${htmlPath}`);
  console.log(`  Excel: ${xlsxPath}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
