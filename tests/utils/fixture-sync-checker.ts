/**
 * Fixture Sync Checker
 *
 * Compares fixture-meta.json hashes against the current kkr-aem style guide
 * source files to detect when the style guide has been updated and fixtures
 * need regeneration.
 *
 * Runs during globalSetup. Results are written to a temp file so the custom
 * reporter can include warnings in the final output.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const KKR_AEM_ROOT = path.resolve(__dirname, '..', '..', '..', 'kkr-aem');
const GA_SPECS_DIR = path.resolve(__dirname, '..', 'specFiles', 'ga');
const SYNC_RESULTS_PATH = path.resolve(__dirname, '..', 'data', '.fixture-sync-results.json');

export interface FixtureMeta {
  component: string;
  source: string;
  sourceHash: string;
  generatedAt: string;
  tickets: string[];
  additions: string[];
}

export interface SyncResult {
  component: string;
  status: 'ok' | 'stale' | 'source-missing' | 'meta-missing';
  message: string;
  currentHash?: string;
  expectedHash?: string;
  source?: string;
  generatedAt?: string;
}

export interface SyncReport {
  checkedAt: string;
  kkrAemRoot: string;
  results: SyncResult[];
  hasWarnings: boolean;
}

function md5File(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Scan all component fixture directories and check sync status.
 */
export function checkFixtureSync(): SyncReport {
  const results: SyncResult[] = [];

  if (!fs.existsSync(GA_SPECS_DIR)) {
    return { checkedAt: new Date().toISOString(), kkrAemRoot: KKR_AEM_ROOT, results, hasWarnings: false };
  }

  const componentDirs = fs.readdirSync(GA_SPECS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const comp of componentDirs) {
    const metaPath = path.join(GA_SPECS_DIR, comp, 'content-fixtures', 'fixture-meta.json');

    if (!fs.existsSync(metaPath)) {
      // No fixture for this component — skip silently
      continue;
    }

    let meta: FixtureMeta;
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    } catch {
      results.push({
        component: comp,
        status: 'meta-missing',
        message: `Could not parse fixture-meta.json`,
      });
      continue;
    }

    const sourcePath = path.join(KKR_AEM_ROOT, meta.source);

    if (!fs.existsSync(sourcePath)) {
      results.push({
        component: comp,
        status: 'source-missing',
        message: `Source file not found: ${meta.source} (is kkr-aem repo at ${KKR_AEM_ROOT}?)`,
        expectedHash: meta.sourceHash,
        source: meta.source,
        generatedAt: meta.generatedAt,
      });
      continue;
    }

    const currentHash = md5File(sourcePath);

    if (currentHash === meta.sourceHash) {
      results.push({
        component: comp,
        status: 'ok',
        message: `Fixture in sync`,
        currentHash,
        expectedHash: meta.sourceHash,
        source: meta.source,
        generatedAt: meta.generatedAt,
      });
    } else {
      results.push({
        component: comp,
        status: 'stale',
        message: `Style guide has changed since fixture was generated on ${meta.generatedAt}. Run \`/automate\` to regenerate.`,
        currentHash,
        expectedHash: meta.sourceHash,
        source: meta.source,
        generatedAt: meta.generatedAt,
      });
    }
  }

  const report: SyncReport = {
    checkedAt: new Date().toISOString(),
    kkrAemRoot: KKR_AEM_ROOT,
    results,
    hasWarnings: results.some(r => r.status === 'stale' || r.status === 'source-missing'),
  };

  // Write results for the reporter to pick up
  const dataDir = path.dirname(SYNC_RESULTS_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(SYNC_RESULTS_PATH, JSON.stringify(report, null, 2));

  return report;
}

/**
 * Read saved sync results (called by reporter after test run).
 */
export function loadSyncResults(): SyncReport | null {
  if (!fs.existsSync(SYNC_RESULTS_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(SYNC_RESULTS_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Format sync warnings for console output.
 */
export function formatSyncWarnings(report: SyncReport): string {
  const warnings = report.results.filter(r => r.status !== 'ok');
  if (warnings.length === 0) return '';

  const lines: string[] = [
    '',
    '⚠ FIXTURE SYNC WARNINGS ⚠',
    '═'.repeat(60),
  ];

  for (const w of warnings) {
    lines.push(`  [${w.component}] ${w.message}`);
    if (w.source) lines.push(`    Source: ${w.source}`);
    if (w.expectedHash && w.currentHash) {
      lines.push(`    Expected hash: ${w.expectedHash}`);
      lines.push(`    Current hash:  ${w.currentHash}`);
    }
  }

  lines.push('═'.repeat(60));
  lines.push('  Run /automate for affected components to regenerate fixtures.');
  lines.push('');

  return lines.join('\n');
}
