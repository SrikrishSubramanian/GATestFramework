/**
 * Sprint Test Runner Utility
 *
 * CLI tool for running sprint-based tests
 *
 * Usage:
 * npx ts-node tests/utils/infra/sprint-test-runner.ts --sprint 16 --type regression --env dev
 *
 * Or with environment variables:
 * SPRINT=sprint-16 TEST_TYPE=regression ENV=dev npx playwright test
 */

import { SprintManager, getSprintManager } from './sprint-manager';
import * as fs from 'fs';
import * as path from 'path';

export class SprintTestRunner {
  private sprintManager: SprintManager;

  constructor() {
    this.sprintManager = getSprintManager();
  }

  /**
   * Parse command line arguments
   */
  parseArgs(args: string[]): {
    sprint: string;
    testType: string;
    environment: string;
    workers: number;
    verbose: boolean;
  } {
    const result = {
      sprint: process.env.SPRINT || 'sprint-16',
      testType: process.env.TEST_TYPE || 'regression',
      environment: process.env.ENV || 'local',
      workers: parseInt(process.env.WORKERS || '2'),
      verbose: process.env.VERBOSE === 'true'
    };

    // Parse command line args
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if ((arg === '--sprint' || arg === '-s') && i + 1 < args.length) {
        result.sprint = args[++i];
        if (!result.sprint.startsWith('sprint-')) {
          result.sprint = `sprint-${result.sprint}`;
        }
      } else if ((arg === '--type' || arg === '-t') && i + 1 < args.length) {
        result.testType = args[++i];
      } else if ((arg === '--env' || arg === '-e') && i + 1 < args.length) {
        result.environment = args[++i];
      } else if ((arg === '--workers' || arg === '-w') && i + 1 < args.length) {
        result.workers = parseInt(args[++i]);
      } else if (arg === '--verbose' || arg === '-v') {
        result.verbose = true;
      }
    }

    return result;
  }

  /**
   * Validate configuration
   */
  validate(config: {
    sprint: string;
    testType: string;
    environment: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.sprintManager.validateSprint(config.sprint)) {
      errors.push(`Invalid sprint: ${config.sprint}`);
    }

    if (!this.sprintManager.validateTestType(config.testType)) {
      errors.push(`Invalid test type: ${config.testType}`);
    }

    const environments = this.sprintManager.getEnvironments();
    if (!environments[config.environment]) {
      errors.push(`Invalid environment: ${config.environment}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get test command
   */
  getTestCommand(config: {
    sprint: string;
    testType: string;
    environment: string;
    workers: number;
  }): string {
    const pattern = this.sprintManager.buildGrepPattern(config.sprint, config.testType);

    const command =
      `env=${config.environment} npx playwright test ` +
      `tests/specFiles/ga/ ` +
      `--grep "${pattern}" ` +
      `--project chromium ` +
      `--workers ${config.workers}`;

    return command;
  }

  /**
   * Print configuration summary
   */
  printSummary(config: {
    sprint: string;
    testType: string;
    environment: string;
    workers: number;
  }): void {
    const sprintInfo = this.sprintManager.getSprintInfo(config.sprint);
    const testTypes = this.sprintManager.getTestTypes();
    const testType = testTypes[config.testType];

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║            SPRINT TEST CONFIGURATION                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`📊 Sprint Configuration:`);
    console.log(`   Sprint: ${sprintInfo.name}`);
    console.log(`   Tickets: ${sprintInfo.ticketCount}`);
    console.log(`   Ticket List: ${sprintInfo.tickets.join(', ')}`);
    console.log('');
    console.log(`🏷️  Test Configuration:`);
    console.log(`   Type: ${config.testType.toUpperCase()}`);
    console.log(`   Description: ${testType.description}`);
    console.log(`   Tag: ${testType.tag || 'none'}`);
    console.log('');
    console.log(`⚙️  Execution Configuration:`);
    console.log(`   Environment: ${config.environment}`);
    console.log(`   Workers: ${config.workers}`);
    console.log('');
  }

  /**
   * Print list of available sprints
   */
  listSprints(): void {
    const sprints = this.sprintManager.listAllSprints();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║            AVAILABLE SPRINTS                              ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');

    sprints.forEach((s, index) => {
      console.log(`${index + 1}. ${s.name}`);
      console.log(`   Key: ${s.key}`);
      console.log(`   Tickets: ${s.ticketCount}`);
    });

    console.log(`\n17. All Sprints (1-16)`);
    console.log(`   Key: all`);
    console.log(`   Tickets: ${sprints.reduce((sum, s) => sum + s.ticketCount, 0)}`);
    console.log('');
  }

  /**
   * Print list of test types
   */
  listTestTypes(): void {
    const testTypes = this.sprintManager.getTestTypes();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║            AVAILABLE TEST TYPES                           ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');

    Object.entries(testTypes).forEach(([key, type], index) => {
      console.log(`${index + 1}. ${key.toUpperCase()}`);
      console.log(`   Description: ${type.description}`);
      console.log(`   Tag: ${type.tag || 'none'}`);
      console.log(`   Purpose: ${type.purpose}`);
    });

    console.log('');
  }

  /**
   * Print help
   */
  printHelp(): void {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║        SPRINT-WISE PLAYWRIGHT TEST RUNNER                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('USAGE:');
    console.log('  npx ts-node tests/utils/infra/sprint-test-runner.ts [OPTIONS]');
    console.log('');
    console.log('OPTIONS:');
    console.log('  -s, --sprint <number>     Sprint number (1-16) or "all"');
    console.log('  -t, --type <type>         Test type: smoke, regression, sanity, all');
    console.log('  -e, --env <env>           Environment: local, dev, qa, uat, prod');
    console.log('  -w, --workers <number>    Number of parallel workers (default: 2)');
    console.log('  -v, --verbose             Verbose output');
    console.log('  --list-sprints            List available sprints');
    console.log('  --list-types              List available test types');
    console.log('');
    console.log('EXAMPLES:');
    console.log('  # Run Sprint 16 regression tests on dev');
    console.log('  npx ts-node tests/utils/infra/sprint-test-runner.ts \\');
    console.log('    --sprint 16 --type regression --env dev');
    console.log('');
    console.log('  # Run all sprints smoke tests on local');
    console.log('  npx ts-node tests/utils/infra/sprint-test-runner.ts \\');
    console.log('    --sprint all --type smoke --env local');
    console.log('');
    console.log('ENVIRONMENT VARIABLES:');
    console.log('  SPRINT     - Sprint to run (default: sprint-16)');
    console.log('  TEST_TYPE  - Test type (default: regression)');
    console.log('  ENV        - Environment (default: local)');
    console.log('  WORKERS    - Parallel workers (default: 2)');
    console.log('  VERBOSE    - Verbose output (default: false)');
    console.log('');
  }

  /**
   * Export config as JSON
   */
  exportConfig(config: {
    sprint: string;
    testType: string;
    environment: string;
    workers: number;
  }): any {
    const sprintInfo = this.sprintManager.getSprintInfo(config.sprint);
    const testTypes = this.sprintManager.getTestTypes();

    return {
      sprint: {
        key: config.sprint,
        name: sprintInfo.name,
        tickets: sprintInfo.tickets,
        ticketCount: sprintInfo.ticketCount
      },
      testType: {
        type: config.testType,
        ...testTypes[config.testType]
      },
      environment: config.environment,
      workers: config.workers,
      command: this.getTestCommand(config)
    };
  }
}

/**
 * CLI Entry Point
 */
if (require.main === module) {
  const runner = new SprintTestRunner();
  const args = process.argv.slice(2);

  // Handle special commands
  if (args.includes('--help') || args.includes('-h')) {
    runner.printHelp();
    process.exit(0);
  }

  if (args.includes('--list-sprints')) {
    runner.listSprints();
    process.exit(0);
  }

  if (args.includes('--list-types')) {
    runner.listTestTypes();
    process.exit(0);
  }

  // Parse configuration
  const config = runner.parseArgs(args);

  // Validate
  const validation = runner.validate(config);
  if (!validation.valid) {
    console.error('\n❌ Configuration Error:');
    validation.errors.forEach(error => console.error(`   - ${error}`));
    console.error('');
    runner.printHelp();
    process.exit(1);
  }

  // Print summary
  runner.printSummary(config);

  // Print command
  const command = runner.getTestCommand(config);
  console.log(`🚀 Test Command:`);
  console.log(`   ${command}`);
  console.log('');

  // Export config
  const exportedConfig = runner.exportConfig(config);
  const configFile = path.join(process.cwd(), 'test-results', 'sprint-config.json');

  if (!fs.existsSync(path.dirname(configFile))) {
    fs.mkdirSync(path.dirname(configFile), { recursive: true });
  }

  fs.writeFileSync(configFile, JSON.stringify(exportedConfig, null, 2), 'utf-8');
  console.log(`✅ Config exported to: test-results/sprint-config.json`);
  console.log('');
}

export default SprintTestRunner;
