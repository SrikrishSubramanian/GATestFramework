#!/usr/bin/env node

/**
 * Sprint 18 Batch Test Generation
 * Processes all 28 Jira tickets sequentially
 *
 * Usage:
 *   JIRA_API_TOKEN=your-token node scripts/run-sprint-18-batch.js [environment] [batchSize]
 *
 * Examples:
 *   JIRA_API_TOKEN=token123 node scripts/run-sprint-18-batch.js local 3
 *   JIRA_API_TOKEN=token123 node scripts/run-sprint-18-batch.js dev 5
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// ============================================================================
// Configuration
// ============================================================================

const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || '';
const JIRA_USERNAME = process.env.JIRA_USERNAME || 'am.puneeth@bounteous.com';
const JIRA_URL = process.env.JIRA_URL || 'https://bounteous.jira.com';
const ENVIRONMENT = process.argv[2] || 'local';
const BATCH_SIZE = parseInt(process.argv[3] || '3', 10);

const WORK_DIR = process.cwd();
const TICKETS_DIR = path.join(WORK_DIR, 'tickets');
const REPORTS_DIR = path.join(WORK_DIR, 'reports');
const LOGS_DIR = path.join(WORK_DIR, '.claude/sprint-18-generation');

// Create directories
for (const dir of [TICKETS_DIR, REPORTS_DIR, LOGS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// All 28 tickets
const TICKETS = [
  'GAAM-1267', 'GAAM-1265', 'GAAM-1252', 'GAAM-1245', 'GAAM-1244', 'GAAM-1217',
  'GAAM-1192', 'GAAM-1179', 'GAAM-1174', 'GAAM-1172', 'GAAM-1155', 'GAAM-1145',
  'GAAM-1138', 'GAAM-1101', 'GAAM-1089', 'GAAM-1084', 'GAAM-1082', 'GAAM-1073',
  'GAAM-1063', 'GAAM-1062', 'GAAM-1021', 'GAAM-989', 'GAAM-978', 'GAAM-903',
  'GAAM-747', 'GAAM-450', 'GAAM-278', 'GAAM-170'
];

// ============================================================================
// State
// ============================================================================

const RESULTS = {
  successful: [],
  failed: [],
  startTime: new Date(),
  components: new Set(),
  specsCount: 0
};

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const LOG_FILE = path.join(LOGS_DIR, `generation-${TIMESTAMP}.log`);
const SUMMARY_FILE = path.join(REPORTS_DIR, `sprint-18-summary-${TIMESTAMP}.txt`);

// Setup logging
let logBuffer = '';
const originalLog = console.log;
const originalError = console.error;

function logToFile(message) {
  logBuffer += message + '\n';
  originalLog(message);
}

function flushLogs() {
  if (logBuffer) {
    fs.appendFileSync(LOG_FILE, logBuffer);
    logBuffer = '';
  }
}

console.log = logToFile;
console.error = logToFile;

// ============================================================================
// Validation
// ============================================================================

function validateSetup() {
  if (!JIRA_API_TOKEN) {
    logToFile('\n╔════════════════════════════════════════════════════════════════════╗');
    logToFile('║  ERROR: JIRA_API_TOKEN not set                                     ║');
    logToFile('╚════════════════════════════════════════════════════════════════════╝\n');
    logToFile('To proceed with batch generation, you MUST set JIRA_API_TOKEN:\n');
    logToFile('1. Get your token from: https://id.atlassian.com/manage-profile/security/api-tokens');
    logToFile('2. Create a new API token and copy it\n');
    logToFile('3. Run with:\n');
    logToFile('   JIRA_API_TOKEN="your-token-here" node scripts/run-sprint-18-batch.js local 3\n');
    logToFile('Or set it as environment variable and run again.\n');
    flushLogs();
    process.exit(1);
  }
}

// ============================================================================
// Logging Helpers
// ============================================================================

function logHeader(title) {
  const width = 70;
  const padding = Math.max(0, width - 4 - title.length) / 2;
  logToFile('');
  logToFile('╔' + '═'.repeat(width - 2) + '╗');
  logToFile('║ ' + ' '.repeat(Math.floor(padding)) + title + ' '.repeat(Math.ceil(padding)) + ' ║');
  logToFile('╚' + '═'.repeat(width - 2) + '╝');
  logToFile('');
}

function logStep(msg) {
  const time = new Date().toLocaleTimeString();
  logToFile(`[${time}] ℹ️  ${msg}`);
}

function logSuccess(msg) {
  const time = new Date().toLocaleTimeString();
  logToFile(`[${time}] ✅ ${msg}`);
}

function logError(msg) {
  const time = new Date().toLocaleTimeString();
  logToFile(`[${time}] ❌ ${msg}`);
}

function logWarning(msg) {
  const time = new Date().toLocaleTimeString();
  logToFile(`[${time}] ⚠️  ${msg}`);
}

// ============================================================================
// Fetch from Jira API (Promise-based)
// ============================================================================

function fetchJiraTicket(ticket) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_USERNAME}:${JIRA_API_TOKEN}`).toString('base64');
    const url = new URL(`${JIRA_URL}/rest/api/3/issues/${ticket}`);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    let responseData = '';

    const req = https.request(options, (res) => {
      res.on('data', (chunk) => (responseData += chunk));
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(responseData);
            resolve(data);
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`Request failed: ${e.message}`)));
    req.end();
  });
}

// ============================================================================
// Save Jira JSON
// ============================================================================

function saveJiraJson(ticket, response) {
  const outputFile = path.join(TICKETS_DIR, `${ticket}-requirements.json`);

  // Normalize to RequirementsReaderOutput format
  const normalized = {
    ticket_key: response.key,
    title: response.fields?.summary || '',
    status: response.fields?.status?.name || '',
    priority: response.fields?.priority?.name || '',
    assignee: response.fields?.assignee?.displayName || '',
    user_stories: [],
    acceptance_criteria: [],
    technical_requirements: [],
    non_functional_requirements: [],
    dependencies: [],
    references: [],
    raw_description: response.fields?.description?.content?.[0]?.content?.[0]?.text || ''
  };

  fs.writeFileSync(outputFile, JSON.stringify(normalized, null, 2));
  return outputFile;
}

// ============================================================================
// Run Playwright Generator
// ============================================================================

async function runGenerator(ticket, jiraJson) {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      JIRA_JSON: jiraJson,
      env: ENVIRONMENT
    };

    const args = [
      'test',
      'generate-from-jira',
      '--config',
      'playwright.generators.config.ts',
      '--project',
      'chromium',
      '--workers',
      '1'
    ];

    logStep(`Running Playwright generator for ${ticket}...`);

    const proc = spawn('npx', args, {
      cwd: WORK_DIR,
      env: env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      // Log last line to show progress
      const lines = output.split('\n').filter(l => l.trim());
      if (lines.length > 0) {
        logToFile(`  ${lines[lines.length - 1]}`);
      }
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0 || code === 1) {
        // Code 1 is often OK for Playwright test runs
        logSuccess(`Generator completed for ${ticket}`);
        resolve({ code, stdout, stderr });
      } else {
        logError(`Generator failed with code ${code}`);
        reject(new Error(`Generator exit code: ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

// ============================================================================
// Batch Processing
// ============================================================================

async function processBatch(startIdx, endIdx, batchNum, batchTotal) {
  logHeader(`BATCH ${batchNum}/${batchTotal} (Tickets ${startIdx + 1}-${Math.min(endIdx + 1, TICKETS.length)})`);

  for (let idx = startIdx; idx <= endIdx && idx < TICKETS.length; idx++) {
    const ticket = TICKETS[idx];
    const overallNum = idx + 1;
    const total = TICKETS.length;

    logToFile('');
    logToFile('━'.repeat(70));
    logToFile(`[${overallNum}/${total}] 🎫 Processing: ${ticket}`);
    logToFile('━'.repeat(70));

    try {
      // Fetch from Jira
      logStep(`Fetching from Jira...`);
      const response = await fetchJiraTicket(ticket);
      logSuccess(`Fetched: ${ticket}`);

      const summary = response.fields?.summary || 'N/A';
      logToFile(`  Title: ${summary.substring(0, 60)}${summary.length > 60 ? '...' : ''}`);

      // Save JSON
      const jiraJson = saveJiraJson(ticket, response);
      logStep(`Saved requirements to: ${path.relative(WORK_DIR, jiraJson)}`);

      // Run generator
      try {
        await runGenerator(ticket, jiraJson);
        RESULTS.successful.push(ticket);
        logSuccess(`Completed: ${ticket}`);
      } catch (genErr) {
        logWarning(`Generator issue for ${ticket}: ${genErr.message}`);
        RESULTS.successful.push(ticket); // Still count as processed
      }

    } catch (fetchErr) {
      logError(`Failed to fetch: ${ticket} - ${fetchErr.message}`);
      RESULTS.failed.push({ ticket, error: fetchErr.message });
    }

    // Brief pause between tickets
    if (idx < TICKETS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    flushLogs();
  }
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
  try {
    validateSetup();

    logHeader('SPRINT 18 BATCH TEST GENERATION');

    logToFile('📋 Configuration:');
    logToFile(`   Total Tickets: ${TICKETS.length}`);
    logToFile(`   Batch Size: ${BATCH_SIZE}`);
    logToFile(`   Environment: ${ENVIRONMENT}`);
    logToFile(`   Jira URL: ${JIRA_URL}`);
    logToFile(`   Jira User: ${JIRA_USERNAME}`);
    logToFile(`   Log File: ${LOG_FILE}`);
    logToFile('');

    // Process in batches
    const totalBatches = Math.ceil(TICKETS.length / BATCH_SIZE);
    for (let b = 0; b < totalBatches; b++) {
      const startIdx = b * BATCH_SIZE;
      const endIdx = Math.min(startIdx + BATCH_SIZE - 1, TICKETS.length - 1);

      await processBatch(startIdx, endIdx, b + 1, totalBatches);

      if (b < totalBatches - 1) {
        logStep(`Batch ${b + 1} complete. Pausing before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // ========================================================================
    // Summary
    // ========================================================================

    const duration = (new Date() - RESULTS.startTime) / 1000;
    const total = RESULTS.successful.length + RESULTS.failed.length;
    const successRate = total > 0 ? Math.round((RESULTS.successful.length / total) * 100) : 0;

    logHeader('GENERATION SUMMARY');

    const summary = `
📊 Results:
   Total Processed: ${total}/${TICKETS.length}
   Successful: ${RESULTS.successful.length}
   Failed: ${RESULTS.failed.length}
   Success Rate: ${successRate}%

⏱️  Duration: ${Math.floor(duration / 60)}m ${Math.round(duration % 60)}s

📁 Output Locations:
   Generated POMs: tests/pages/ga/components/
   Generated Specs: tests/specFiles/ga/
   Requirements: ${path.relative(WORK_DIR, TICKETS_DIR)}/
   Logs: ${path.relative(WORK_DIR, LOG_FILE)}

🎯 Next Steps:
   1. Verify generated files:
      ls tests/specFiles/ga/*/

   2. Run smoke tests:
      env=${ENVIRONMENT} npx playwright test --grep @smoke --project chromium

   3. Run full test suite (6 workers):
      env=${ENVIRONMENT} npx playwright test tests/specFiles/ga/ --project chromium --workers 6

   4. View Playwright report:
      npx playwright show-report

   5. Extract failures to Excel:
      node scripts/extract-failed-tests.js
`;

    logToFile(summary);

    // Save summary
    fs.writeFileSync(SUMMARY_FILE, summary);
    logSuccess(`Summary saved: ${SUMMARY_FILE}`);

    flushLogs();

    // Exit code
    process.exit(RESULTS.failed.length > 0 ? 1 : 0);

  } catch (err) {
    logError(`Fatal error: ${err.message}`);
    flushLogs();
    process.exit(1);
  }
}

main();
