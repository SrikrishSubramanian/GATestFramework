import * as fs from 'fs';
import * as path from 'path';

/**
 * Deletes test run logs and reports older than 7 days.
 * Run via: npx ts-node scripts/cleanup-logs.ts
 * Or:      npm run cleanup:logs
 *
 * Cleans:
 *   - logs/YYYY-MM-DD/          (JSON run logs)
 *   - playwright-report/YYYY-MM-DD/  (HTML reports + results.json)
 */

const ROOT = path.resolve(__dirname, '..');
const CLEANUP_DIRS = [
  path.join(ROOT, 'logs'),
  path.join(ROOT, 'playwright-report'),
];
const MAX_AGE_DAYS = 7;

function removeDirRecursive(dirPath: string): number {
  let count = 0;
  if (!fs.existsSync(dirPath)) return count;

  for (const entry of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      count += removeDirRecursive(fullPath);
    } else {
      fs.unlinkSync(fullPath);
      count++;
    }
  }
  fs.rmdirSync(dirPath);
  return count;
}

function cleanup(): void {
  const now = Date.now();
  const maxAgeMs = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  let totalFiles = 0;
  let totalDirs = 0;

  for (const baseDir of CLEANUP_DIRS) {
    if (!fs.existsSync(baseDir)) continue;

    const dateDirs = fs.readdirSync(baseDir);
    for (const dateDir of dateDirs) {
      const dirPath = path.join(baseDir, dateDir);
      if (!fs.statSync(dirPath).isDirectory()) continue;

      // Only process YYYY-MM-DD named directories
      const dirDate = Date.parse(dateDir);
      if (isNaN(dirDate)) continue;

      if (now - dirDate > maxAgeMs) {
        const filesRemoved = removeDirRecursive(dirPath);
        totalFiles += filesRemoved;
        totalDirs++;
        const relPath = path.relative(ROOT, dirPath);
        console.log(`Deleted: ${relPath}/ (${filesRemoved} files)`);
      }
    }
  }

  console.log(`Cleanup complete. Removed ${totalDirs} directories, ${totalFiles} files.`);
}

cleanup();
