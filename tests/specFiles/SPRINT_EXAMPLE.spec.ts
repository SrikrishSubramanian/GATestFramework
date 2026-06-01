/**
 * EXAMPLE: Sprint-Based Testing
 *
 * This example shows how to use the sprint-wise testing system
 *
 * Run with:
 * env=local SPRINT=sprint-16 TEST_TYPE=regression npx playwright test SPRINT_EXAMPLE.spec.ts
 *
 * Or use the automated runner:
 * - run-tests.bat (Windows batch launcher)
 * - run-sprint-automation.ps1 (PowerShell script)
 */

import { test, expect } from '../utils/infra/sprint-fixtures';

/**
 * Before all tests - log sprint information
 */
test.beforeAll(async () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║              SPRINT-WISE TEST EXECUTION                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
});

/**
 * After all tests - show summary
 */
test.afterAll(async ({ sprintInfo, testTypeInfo }, testInfo) => {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║              TEST EXECUTION SUMMARY                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Sprint: ${sprintInfo.name}`);
  console.log(`Test Type: ${testTypeInfo.type}`);
  console.log(`Tickets: ${sprintInfo.ticketCount}`);
  console.log('');
});

/**
 * Example 1: Simple Sprint Test
 * Tag format: [JIRA-TICKET] Test Description
 */
test('[GAAM-1098] Button should render with text', async ({ page, sprintInfo, testTypeInfo }) => {
  console.log(`\n🧪 Running: ${sprintInfo.name}`);
  console.log(`   Type: ${testTypeInfo.type}`);

  // This test will:
  // 1. Be auto-grouped under Sprint 16 (because GAAM-1098 is in Sprint 16)
  // 2. Generate a sprint-wise report
  // 3. Show detailed results organized by sprint

  const button = page.locator('button.primary');
  await expect(button).toBeDefined();
});

/**
 * Example 2: Sprint Test with Detailed Info
 */
test('[GAAM-1091] Feature banner should display', async ({ page, sprintInfo }) => {
  console.log(`\n📋 Sprint Information:`);
  console.log(`   - Name: ${sprintInfo.name}`);
  console.log(`   - Tickets: ${sprintInfo.tickets.join(', ')}`);
  console.log(`   - Total: ${sprintInfo.ticketCount} tickets`);

  const banner = page.locator('[role="banner"]');
  await expect(banner).toBeDefined();
});

/**
 * Example 3: All-Sprint Test
 * When SPRINT=all is set, this runs with all tickets
 */
test('[GAAM-1080] Dropdown should open', async ({ sprintInfo, grepPattern }) => {
  console.log(`\n🎯 Grep Pattern: ${grepPattern}`);
  console.log(`   This pattern filters all tests for the selected sprint`);

  const dropdown = page.locator('[role="combobox"]');
  await expect(dropdown).toBeDefined();
});

/**
 * Example 4: Test Type Specific
 * This test runs only with specific test types
 */
test('[GAAM-1068] Icon component should render @regression', async ({ testTypeInfo }) => {
  console.log(`\n🏷️  Test Type Info:`);
  console.log(`   - Type: ${testTypeInfo.type}`);
  console.log(`   - Tag: ${testTypeInfo.tag}`);
  console.log(`   - Description: ${testTypeInfo.description}`);

  // This test will only run if TEST_TYPE=regression is set
});

/**
 * Example 5: Use Sprint Manager directly
 */
test('[GAAM-1024] Form should validate', async ({ sprintManager }) => {
  // Access sprint information programmatically
  const allSprints = sprintManager.listAllSprints();
  const sprint16Tickets = sprintManager.getSprintTickets('sprint-16');

  console.log(`\n📊 Sprint Manager Info:`);
  console.log(`   - Total Sprints: ${allSprints.length}`);
  console.log(`   - Sprint 16 Tickets: ${sprint16Tickets.length}`);
});

/**
 * Example 6: Multiple tickets in same sprint
 */
test('[GAAM-993] Statistic component should calculate', async ({ sprintInfo, sprintManager }) => {
  // Get all tickets for this sprint
  const sprintKey = sprintInfo.key;
  const tickets = sprintManager.getSprintTickets(sprintKey);

  console.log(`\n📈 Test Statistics:`);
  console.log(`   - Sprint: ${sprintInfo.name}`);
  console.log(`   - Tickets in sprint: ${tickets.join(', ')}`);
});

/**
 * Example 7: Find sprint by ticket
 */
test('[GAAM-983] Search component should filter', async ({ sprintManager }) => {
  const result = sprintManager.findSprintByTicket('GAAM-983');

  if (result) {
    console.log(`\n🔍 Found Ticket:`);
    console.log(`   - Ticket: GAAM-983`);
    console.log(`   - Sprint: ${result.sprint.name}`);
  }
});

/**
 * Example 8: Get sprint statistics
 */
test('[GAAM-982] Modal should close on escape', async ({ sprintManager }) => {
  const stats = sprintManager.getSprintStats('sprint-16');

  console.log(`\n📊 Sprint 16 Statistics:`);
  console.log(`   - Name: ${stats.name}`);
  console.log(`   - Tickets: ${stats.ticketCount}`);
  console.log(`   - Percentage of Total: ${stats.percentage}%`);
});
