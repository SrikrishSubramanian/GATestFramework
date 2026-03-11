import * as fs from 'fs';
import * as path from 'path';

/**
 * Deletes test run logs older than 7 days.
 * Run via: npx ts-node scripts/cleanup-logs.ts
 * Or:      npm run cleanup:logs
 */

const LOGS_DIR = path.resolve(__dirname, '..', 'logs');
const MAX_AGE_DAYS = 7;

function cleanup(): void {
  if (!fs.existsSync(LOGS_DIR)) {
    console.log('No logs directory found. Nothing to clean.');
    return;
  }

  const now = Date.now();
  const maxAgeMs = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  let deletedFiles = 0;
  let deletedDirs = 0;

  const dateDirs = fs.readdirSync(LOGS_DIR);
  for (const dateDir of dateDirs) {
    const dirPath = path.join(LOGS_DIR, dateDir);
    const stat = fs.statSync(dirPath);

    if (!stat.isDirectory()) continue;

    // Check if directory name is a date (YYYY-MM-DD)
    const dirDate = Date.parse(dateDir);
    if (isNaN(dirDate)) continue;

    if (now - dirDate > maxAgeMs) {
      // Delete all files in this date directory
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        fs.unlinkSync(path.join(dirPath, file));
        deletedFiles++;
      }
      fs.rmdirSync(dirPath);
      deletedDirs++;
      console.log(`Deleted: ${dateDir}/ (${files.length} files)`);
    }
  }

  console.log(`Cleanup complete. Removed ${deletedDirs} directories, ${deletedFiles} files.`);
}

cleanup();
