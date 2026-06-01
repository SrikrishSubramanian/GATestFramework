/**
 * Playwright Fixtures for Sprint-Based Testing
 *
 * Usage:
 * test.use({ sprint: 'sprint-16', testType: 'regression' });
 * test('my test', async ({ page, sprintInfo }) => {
 *   console.log(sprintInfo.name); // "Sprint 16"
 * });
 */

import { test as base } from '@playwright/test';
import { SprintManager, getSprintManager } from './sprint-manager';

export interface SprintFixtures {
  sprintManager: SprintManager;
  sprintInfo: {
    key: string;
    name: string;
    tickets: string[];
    ticketCount: number;
  };
  testTypeInfo: {
    type: string;
    tag: string;
    description: string;
  };
  grepPattern: string;
}

export const test = base.extend<SprintFixtures>({
  /**
   * Sprint Manager fixture
   * Provides access to sprint configuration and utilities
   */
  sprintManager: async ({}, use) => {
    const sprintManager = getSprintManager();
    await use(sprintManager);
  },

  /**
   * Sprint Info fixture
   * Provides information about the current sprint
   * Usage: test.use({ sprint: 'sprint-16' })
   */
  sprintInfo: async ({ sprintManager }, use, testInfo) => {
    // Get sprint from environment variable or test fixture
    const sprintKey = process.env.SPRINT || 'sprint-16';

    if (!sprintManager.validateSprint(sprintKey)) {
      throw new Error(`Invalid sprint: ${sprintKey}`);
    }

    const sprintInfo = sprintManager.getSprintInfo(sprintKey);

    await use({
      key: sprintKey,
      name: sprintInfo.name,
      tickets: sprintInfo.tickets,
      ticketCount: sprintInfo.tickets.length
    });
  },

  /**
   * Test Type Info fixture
   * Provides information about the test type (smoke, regression, etc.)
   * Usage: test.use({ testType: 'regression' })
   */
  testTypeInfo: async ({ sprintManager }, use) => {
    const testType = process.env.TEST_TYPE || 'regression';

    const testTypes = sprintManager.getTestTypes();
    if (!testTypes[testType]) {
      throw new Error(`Invalid test type: ${testType}`);
    }

    const typeInfo = testTypes[testType];

    await use({
      type: testType,
      tag: typeInfo.tag,
      description: typeInfo.description
    });
  },

  /**
   * Grep Pattern fixture
   * Provides the grep pattern for filtering tests
   * Combines sprint and test type
   */
  grepPattern: async ({ sprintManager }, use) => {
    const sprintKey = process.env.SPRINT || 'sprint-16';
    const testType = process.env.TEST_TYPE || 'regression';

    const pattern = sprintManager.buildGrepPattern(sprintKey, testType);

    await use(pattern);
  }
});

export { expect } from '@playwright/test';
