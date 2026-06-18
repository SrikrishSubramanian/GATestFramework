import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

/**
 * Global teardown runs after all tests complete
 * Automatically generates Excel reports for failed test cases
 */
async function globalTeardown(config: FullConfig) {
  console.log('\n⏳ Running Global Teardown...');

  try {
    // Generate Excel report with failed test cases only
    console.log('📊 Generating Excel report for failed test cases...');

    execSync('node scripts/generate-excel-report.js', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../../..')
    });

    console.log('✅ Global Teardown Complete');
  } catch (error: any) {
    console.warn('⚠️  Excel report generation had an issue:', error.message);
    // Don't fail the entire teardown if Excel generation fails
    // Tests have already completed successfully
  }
}

export default globalTeardown;
