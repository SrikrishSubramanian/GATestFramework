import { TestInfo } from '@playwright/test';
import ENV from './env';

/**
 * Backward-compatible annotateEnvironment wrapper.
 * Specs call this with just testInfo, but the original function expects 3 args.
 * This wrapper provides sensible defaults.
 *
 * @param testInfo - Playwright TestInfo object
 * @param env - Optional environment name (defaults to ENV.ENV_NAME or 'local')
 * @param mode - Optional mode (defaults to 'author')
 */
export function annotateEnvironmentCompat(
  testInfo: TestInfo,
  env?: string,
  mode: 'author' | 'publish' = 'author'
): void {
  const envName = env || (ENV.ENV_NAME as string) || 'local';

  testInfo.annotations.push(
    { type: 'environment', description: envName },
    { type: 'mode', description: mode }
  );
}

/**
 * Export as alias for backward compatibility
 */
export { annotateEnvironmentCompat as annotateEnvironment };
