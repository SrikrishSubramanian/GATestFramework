#!/usr/bin/env node
/**
 * Locator Sync Checker
 *
 * Auto-generated POMs (tests/pages/ga/components/*.ts) resolve elements via
 * resolveLocator(page, registry.entries.<key>), where the registry is loaded
 * from a sidecar tests/pages/ga/{components,locators}/<name>.locators.json.
 *
 * The POM and its JSON sidecar are sometimes regenerated independently (e.g.
 * from different DOM scans of the style guide page), which lets them drift:
 * a POM getter can reference a key the JSON no longer has (resolveLocator
 * throws "Cannot read properties of undefined (reading 'strategies')" at
 * runtime), or the JSON can gain elements no getter ever exposes.
 *
 * This script cross-checks every POM against its sidecar and reports both
 * directions of drift. Exits 1 if any orphaned getter is found (the JSON is
 * missing a key the POM will actually try to resolve) so it can gate CI.
 * Orphaned JSON-only entries are reported but do not fail the run — they're
 * missed coverage, not a crash risk.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'tests', 'pages', 'ga', 'components');
const LOCATORS_DIR = path.join(ROOT, 'tests', 'pages', 'ga', 'locators');

function findJsonFor(base) {
  const candidates = [
    path.join(COMPONENTS_DIR, `${base}.locators.json`),
    path.join(LOCATORS_DIR, `${base}.locators.json`),
  ];
  return candidates.find(p => fs.existsSync(p)) || null;
}

function isRootKey(key) {
  return /root$/i.test(key);
}

function main() {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.error(`Components dir not found: ${COMPONENTS_DIR}`);
    process.exit(2);
  }

  const tsFiles = fs.readdirSync(COMPONENTS_DIR)
    .filter(f => f.endsWith('.ts') && !f.includes('.example.'));

  const results = [];
  const filesNoJson = [];
  let totalOrphanGetters = 0;
  let totalOrphanJsonEntries = 0;

  for (const f of tsFiles) {
    const base = f.replace(/\.ts$/, '');
    const jsonPath = findJsonFor(base);
    if (!jsonPath) {
      filesNoJson.push(base);
      continue;
    }

    const tsContent = fs.readFileSync(path.join(COMPONENTS_DIR, f), 'utf-8');
    // A reference like `registry.entries.foo || { strategies: [...] }` has an
    // inline fallback and will NOT throw when the JSON key is missing —
    // don't count it as a crash risk, just note it as unscored coverage.
    const matches = [...tsContent.matchAll(/registry\.entries\.([A-Za-z0-9_]+)(\s*\|\|)?/g)];
    const guardedKeys = new Set(matches.filter(m => m[2]).map(m => m[1]));
    const usedKeys = [...new Set(matches.map(m => m[1]))];
    if (usedKeys.length === 0) continue; // not a registry-based POM

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (e) {
      results.push({ component: base, error: `Invalid JSON: ${e.message}` });
      continue;
    }

    const jsonKeys = Object.keys(jsonData.entries || {});
    const jsonSet = new Set(jsonKeys);
    const usedSet = new Set(usedKeys);

    const orphanGetters = usedKeys.filter(k => !jsonSet.has(k) && !guardedKeys.has(k));
    const guardedOrphans = usedKeys.filter(k => !jsonSet.has(k) && guardedKeys.has(k));
    const orphanJsonEntries = jsonKeys.filter(k => !usedSet.has(k) && !isRootKey(k));

    if (orphanGetters.length > 0 || orphanJsonEntries.length > 0 || guardedOrphans.length > 0) {
      totalOrphanGetters += orphanGetters.length;
      totalOrphanJsonEntries += orphanJsonEntries.length;
      results.push({
        component: base,
        jsonPath: path.relative(ROOT, jsonPath),
        orphanGetters,
        guardedOrphans,
        orphanJsonEntries,
      });
    }
  }

  results.sort((a, b) =>
    ((b.orphanGetters?.length || 0) - (a.orphanGetters?.length || 0))
  );

  console.log(`\n${'='.repeat(70)}`);
  console.log('LOCATOR SYNC CHECK — POM getters vs .locators.json sidecars');
  console.log('='.repeat(70));
  console.log(`Scanned: ${tsFiles.length} POM files`);
  console.log(`Drifted: ${results.filter(r => !r.error).length} components`);
  console.log(`Orphan getters (WILL THROW at runtime): ${totalOrphanGetters}`);
  console.log(`Orphan JSON entries (missed coverage, safe): ${totalOrphanJsonEntries}`);
  if (filesNoJson.length) {
    console.log(`No sidecar JSON found for: ${filesNoJson.join(', ')}`);
  }
  console.log('');

  for (const r of results) {
    if (r.error) {
      console.log(`✗ ${r.component}: ${r.error}`);
      continue;
    }
    if (r.orphanGetters.length > 0) {
      console.log(`✗ ${r.component} (${r.jsonPath}): ${r.orphanGetters.length} orphan getter(s) will throw`);
      console.log(`    ${r.orphanGetters.slice(0, 10).join(', ')}${r.orphanGetters.length > 10 ? ', …' : ''}`);
    }
    if (r.guardedOrphans && r.guardedOrphans.length > 0) {
      console.log(`  · ${r.component}: ${r.guardedOrphans.length} getter(s) missing from JSON but safe (inline || fallback)`);
    }
    if (r.orphanJsonEntries.length > 0) {
      console.log(`  ~ ${r.component}: ${r.orphanJsonEntries.length} JSON entr(y/ies) have no getter`);
    }
  }

  const reportPath = path.join(ROOT, 'tests', 'data', '.locator-sync-report.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ checkedAt: new Date().toISOString(), totalOrphanGetters, totalOrphanJsonEntries, filesNoJson, results }, null, 2));
  console.log(`\nFull report: ${path.relative(ROOT, reportPath)}`);

  if (totalOrphanGetters > 0) {
    console.log(`\nFAIL: ${totalOrphanGetters} POM getter(s) reference locator keys missing from their JSON sidecar.`);
    process.exit(1);
  }
  console.log('\nOK: every POM getter resolves to a JSON entry.');
}

main();
